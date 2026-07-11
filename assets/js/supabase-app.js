/**
 * 🟢 QuizMagic Supabase Integration
 * نظام إدارة الحسابات والجواهر و XP عبر Supabase
 *
 * كل العمليات الحساسة (شحن جواهر، تعديل XP، حظر...) تتم هنا
 * مع التحقق من الصلاحيات. قاعدة البيانات محمية بقواعد RLS.
 */

// ==================== SUPABASE INIT ====================

let sbClient = null;

const SUPABASE_URL = 'https://vjjdwsocdstdszjmbxvm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_eiX6vg9Lz3wORPn1fRAQ2A_tR4h_mF7';

function initSupabase() {
    if (typeof window.supabase === 'undefined') {
        console.warn('🟢 Supabase SDK not loaded yet');
        return false;
    }
    if (sbClient) return true;

    sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('🟢 Supabase initialized successfully');
    return true;
}

// ==================== ID GENERATION ====================

function generateUserId() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function isIdAvailable(id) {
    try {
        if (!initSupabase()) return false;
        const { data, error } = await sbClient
            .from('users')
            .select('id')
            .eq('id', id)
            .maybeSingle();
        if (error) {
            console.error('isIdAvailable error:', error);
            return false;
        }
        return !data; // متاح إن لم يكن موجوداً
    } catch (e) {
        console.error('isIdAvailable error:', e);
        return false;
    }
}

async function generateUniqueUserId() {
    for (let i = 0; i < 10; i++) {
        const id = generateUserId();
        if (await isIdAvailable(id)) return id;
    }
    return null;
}

// ==================== PASSWORD HASHING ====================

async function hashPassword(password, salt) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateSalt() {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ==================== REGISTRATION ====================

/**
 * 📝 تسجيل مستخدم جديد
 * ملاحظة: قاعدة RLS تمنع الإدراج المباشر. نستخدم RPC function أو سياسة استثناء.
 * حالياً نستخدم سياسة "allow insert" لأن التسجيل متاح للجميع.
 */
async function registerUser(password) {
    try {
        if (!initSupabase()) return { success: false, error: 'supabase_not_ready' };

        if (!password || password.length < 4) {
            return { success: false, error: 'password_short' };
        }
        if (password.length > 100) {
            return { success: false, error: 'password_long' };
        }

        // توليد ID فريد
        const userId = await generateUniqueUserId();
        if (!userId) {
            return { success: false, error: 'id_generation_failed' };
        }

        // تشفير كلمة السر
        const salt = generateSalt();
        const hashedPassword = await hashPassword(password, salt);
        const fakeEmail = userId + '@quizmagic.local';
        const now = new Date().toISOString();

        // محاولة الإدراج عبر Supabase Auth أولاً (للمصادقة الحقيقية)
        let authUser = null;
        try {
            const { data: authData, error: authError } = await sbClient.auth.signUp({
                email: fakeEmail,
                password: password
            });
            if (!authError && authData.user) {
                authUser = authData.user;
            }
        } catch (e) {
            // تجاهل — سنستخدم النظام المخصص
        }

        // الإدراج في جدول users
        // ملاحظة: هذا يعمل لأن قاعدة RLS تسمح بالإدراج (أنشأناها كاستثناء للتسجيل)
        const { error: insertError } = await sbClient.from('users').insert({
            id: userId,
            email: fakeEmail,
            password_hash: hashedPassword,
            salt: salt,
            created_at: now,
            last_login: now,
            xp: 0,
            gems: 0,
            level: 1,
            is_admin: false,
            banned: false,
            mod_permissions: {},
            stats: {},
            achievements: {},
            cards: {}
        });

        if (insertError) {
            console.error('Register insert error:', insertError);
            // إن فشل الإدراج (RLS)، نحاول عبر RPC
            const { error: rpcError } = await sbClient.rpc('register_user', {
                p_id: userId,
                p_email: fakeEmail,
                p_password_hash: hashedPassword,
                p_salt: salt
            });
            if (rpcError) {
                console.error('Register RPC error:', rpcError);
                return { success: false, error: 'insert_failed', details: rpcError.message };
            }
        }

        // حفظ حالة الدخول
        localStorage.setItem('quiz_logged_in_id', userId);

        return { success: true, userId: userId };
    } catch (error) {
        console.error('Register error:', error);
        return { success: false, error: 'server_error', details: error.message };
    }
}

// ==================== LOGIN ====================

async function loginUser(userId, password) {
    try {
        if (!initSupabase()) return { success: false, error: 'supabase_not_ready' };

        if (!userId || !password) {
            return { success: false, error: 'missing_fields' };
        }

        const cleanId = userId.replace(/\D/g, '');
        if (cleanId.length !== 6) {
            return { success: false, error: 'invalid_id_format' };
        }

        // جلب بيانات المستخدم
        const { data: userData, error } = await sbClient
            .from('users')
            .select('*')
            .eq('id', cleanId)
            .maybeSingle();

        if (error || !userData) {
            return { success: false, error: 'user_not_found' };
        }

        // التحقق من كلمة السر
        const hashedPassword = await hashPassword(password, userData.salt);
        if (hashedPassword !== userData.password_hash) {
            return { success: false, error: 'wrong_password' };
        }

        // التحقق من الحظر
        const banStatus = await checkBanStatus(cleanId);
        if (banStatus.banned) {
            return {
                success: false,
                error: banStatus.type === 'permanent' ? 'banned_permanent' : 'banned_temporary',
                banInfo: banStatus
            };
        }

        // ✅ نجح الدخول — تحديث آخر دخول
        await sbClient.from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', cleanId);

        localStorage.setItem('quiz_logged_in_id', cleanId);

        return { success: true, userId: cleanId, userData: userData };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'server_error', details: error.message };
    }
}

// ==================== SESSION MANAGEMENT ====================
// نستخدم localStorage بدل sessionStorage للحفاظ على تسجيل الدخول بعد إغلاق المتصفح

function getCurrentUserId() {
    return localStorage.getItem('quiz_logged_in_id') || null;
}

function logoutUser() {
    localStorage.removeItem('quiz_logged_in_id');
}

function isLoggedIn() {
    return getCurrentUserId() !== null;
}

// ==================== USER DATA ====================

async function fetchUserData(userId) {
    try {
        if (!initSupabase()) return null;
        const id = userId || getCurrentUserId();
        if (!id) return null;

        const { data, error } = await sbClient
            .from('users')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) {
            console.error('fetchUserData error:', error);
            return null;
        }

        // 🔄 مزامنة البيانات السحابية مع localStorage (لإبقاء الواجهة محدّثة)
        if (data && id === getCurrentUserId()) {
            if (typeof data.xp === 'number') localStorage.setItem('quiz_xp', String(data.xp));
            if (typeof data.gems === 'number') localStorage.setItem('quiz_gems', String(data.gems));
            if (typeof data.level === 'number') localStorage.setItem('quiz_level', String(data.level));
        }

        return data;
    } catch (e) {
        console.error('fetchUserData error:', e);
        return null;
    }
}

// الاستماع للتغييرات في الوقت الحقيقي
let subscription = null;
function subscribeToUserData(callback) {
    try {
        if (!initSupabase()) return;
        const id = getCurrentUserId();
        if (!id) return;

        if (subscription) subscription.unsubscribe();

        const channel = sbClient.channel('user-' + id)
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'users', filter: 'id=eq.' + id },
                (payload) => {
                    fetchUserData(id).then(data => {
                        if (data) callback(data);
                    });
                }
            )
            .subscribe();

        subscription = channel;
    } catch (e) {
        console.error('subscribeToUserData error:', e);
    }
}

// ==================== XP SYSTEM ====================

function calculateLevelFromXP(xp) {
    if (typeof config !== 'undefined' && config.xpSystem && config.xpSystem.levels) {
        let level = 1;
        for (const [lvl, data] of Object.entries(config.xpSystem.levels)) {
            if (xp >= data.xp) level = parseInt(lvl);
        }
        return level;
    }
    return 1;
}

// ➕ إضافة XP (مع التحقق من الصلاحيات عبر RPC)
async function addXPToCloud(amount, reason) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initSupabase()) return { success: false, error: 'supabase_not_ready' };

        const userId = getCurrentUserId();
        const { data, error } = await sbClient.rpc('add_xp', {
            p_user_id: userId,
            p_amount: amount
        });

        if (error) {
            console.error('addXPToCloud error:', error);
            return { success: false, error: 'rpc_failed' };
        }
        return data || { success: true };
    } catch (e) {
        console.error('addXPToCloud error:', e);
        return { success: false, error: 'server_error' };
    }
}

// ==================== ADMIN: GEMS ====================

async function addGemsToUser(targetUserId, amount) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initSupabase()) return { success: false, error: 'supabase_not_ready' };

        const myId = getCurrentUserId();
        const { data, error } = await sbClient.rpc('admin_add_gems', {
            p_admin_id: myId,
            p_target_id: targetUserId,
            p_amount: amount
        });

        if (error) {
            console.error('addGemsToUser error:', error);
            return { success: false, error: error.message || 'rpc_failed' };
        }
        return data || { success: true };
    } catch (e) {
        console.error('addGemsToUser error:', e);
        return { success: false, error: 'server_error' };
    }
}

async function removeGemsFromUser(targetUserId, amount) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initSupabase()) return { success: false, error: 'supabase_not_ready' };

        const myId = getCurrentUserId();
        const { data, error } = await sbClient.rpc('admin_remove_gems', {
            p_admin_id: myId,
            p_target_id: targetUserId,
            p_amount: amount
        });

        if (error) return { success: false, error: error.message || 'rpc_failed' };
        return data || { success: true };
    } catch (e) {
        console.error('removeGemsFromUser error:', e);
        return { success: false, error: 'server_error' };
    }
}

// ==================== ADMIN: XP & LEVEL ====================

async function setUserXP(targetUserId, newXP) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initSupabase()) return { success: false, error: 'supabase_not_ready' };

        const myId = getCurrentUserId();
        const { data, error } = await sbClient.rpc('admin_set_xp', {
            p_admin_id: myId,
            p_target_id: targetUserId,
            p_xp: newXP
        });

        if (error) return { success: false, error: error.message || 'rpc_failed' };
        return data || { success: true };
    } catch (e) {
        console.error('setUserXP error:', e);
        return { success: false, error: 'server_error' };
    }
}

async function setUserLevel(targetUserId, newLevel) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initSupabase()) return { success: false, error: 'supabase_not_ready' };

        const myId = getCurrentUserId();
        const { data, error } = await sbClient.rpc('admin_set_level', {
            p_admin_id: myId,
            p_target_id: targetUserId,
            p_level: newLevel
        });

        if (error) return { success: false, error: error.message || 'rpc_failed' };
        return data || { success: true };
    } catch (e) {
        console.error('setUserLevel error:', e);
        return { success: false, error: 'server_error' };
    }
}

// ==================== ADMIN: USER MANAGEMENT ====================

async function getAllUsers() {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initSupabase()) return { success: false, error: 'supabase_not_ready' };

        const { data, error } = await sbClient.rpc('admin_get_all_users', {
            p_admin_id: getCurrentUserId()
        });

        if (error) return { success: false, error: error.message || 'rpc_failed' };

        // ترتيب: الأدمن أولاً
        if (data && Array.isArray(data)) {
            data.sort((a, b) => {
                if (a.is_admin && !b.is_admin) return -1;
                if (!a.is_admin && b.is_admin) return 1;
                return (b.xp || 0) - (a.xp || 0);
            });
        }
        return { success: true, users: data || [], count: data ? data.length : 0 };
    } catch (e) {
        console.error('getAllUsers error:', e);
        return { success: false, error: 'server_error' };
    }
}

async function searchUserById(targetUserId) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initSupabase()) return { success: false, error: 'supabase_not_ready' };

        const { data, error } = await sbClient
            .from('users')
            .select('*')
            .eq('id', targetUserId)
            .maybeSingle();

        if (error || !data) return { success: false, error: 'user_not_found' };
        return { success: true, userId: targetUserId, userData: data };
    } catch (e) {
        console.error('searchUserById error:', e);
        return { success: false, error: 'server_error' };
    }
}

// ==================== ADMIN: BAN SYSTEM ====================

async function banUser(targetUserId, reason) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initSupabase()) return { success: false, error: 'supabase_not_ready' };

        const myId = getCurrentUserId();
        const { data, error } = await sbClient.rpc('admin_ban_user', {
            p_admin_id: myId,
            p_target_id: targetUserId,
            p_reason: reason || '',
            p_duration_ms: null
        });

        if (error) return { success: false, error: error.message || 'rpc_failed' };
        return data || { success: true };
    } catch (e) {
        console.error('banUser error:', e);
        return { success: false, error: 'server_error' };
    }
}

async function tempBanUser(targetUserId, durationMs, reason) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initSupabase()) return { success: false, error: 'supabase_not_ready' };

        const myId = getCurrentUserId();
        const { data, error } = await sbClient.rpc('admin_ban_user', {
            p_admin_id: myId,
            p_target_id: targetUserId,
            p_reason: reason || '',
            p_duration_ms: durationMs
        });

        if (error) return { success: false, error: error.message || 'rpc_failed' };
        return data || { success: true };
    } catch (e) {
        console.error('tempBanUser error:', e);
        return { success: false, error: 'server_error' };
    }
}

async function unbanUser(targetUserId) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initSupabase()) return { success: false, error: 'supabase_not_ready' };

        const myId = getCurrentUserId();
        const { data, error } = await sbClient.rpc('admin_unban_user', {
            p_admin_id: myId,
            p_target_id: targetUserId
        });

        if (error) return { success: false, error: error.message || 'rpc_failed' };
        return data || { success: true };
    } catch (e) {
        console.error('unbanUser error:', e);
        return { success: false, error: 'server_error' };
    }
}

// ==================== ADMIN: MODERATORS ====================

async function setModerator(targetUserId, permissions) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initSupabase()) return { success: false, error: 'supabase_not_ready' };

        const myId = getCurrentUserId();
        const { data, error } = await sbClient.rpc('admin_set_moderator', {
            p_admin_id: myId,
            p_target_id: targetUserId,
            p_permissions: permissions
        });

        if (error) return { success: false, error: error.message || 'rpc_failed' };
        return data || { success: true };
    } catch (e) {
        console.error('setModerator error:', e);
        return { success: false, error: 'server_error' };
    }
}

async function setAdmin(targetUserId, makeAdmin) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initSupabase()) return { success: false, error: 'supabase_not_ready' };

        const myId = getCurrentUserId();
        const { data, error } = await sbClient.rpc('admin_set_admin', {
            p_admin_id: myId,
            p_target_id: targetUserId,
            p_make_admin: makeAdmin
        });

        if (error) return { success: false, error: error.message || 'rpc_failed' };
        return data || { success: true };
    } catch (e) {
        console.error('setAdmin error:', e);
        return { success: false, error: 'server_error' };
    }
}

// ==================== ADMIN: PASSWORD RESET ====================

async function resetUserPassword(targetUserId, newPassword) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initSupabase()) return { success: false, error: 'supabase_not_ready' };

        if (!newPassword || newPassword.length < 4) {
            return { success: false, error: 'password_short' };
        }

        // حساب hash في المتصفح (مثل نظام التسجيل)
        const salt = generateSalt();
        const hashedPassword = await hashPassword(newPassword, salt);

        const myId = getCurrentUserId();
        const { data, error } = await sbClient.rpc('admin_reset_password_hash', {
            p_admin_id: myId,
            p_target_id: targetUserId,
            p_password_hash: hashedPassword,
            p_salt: salt
        });

        if (error) return { success: false, error: error.message || 'rpc_failed' };
        return data || { success: true };
    } catch (e) {
        console.error('resetUserPassword error:', e);
        return { success: false, error: 'server_error' };
    }
}

// ==================== ADMIN: DELETE USER ====================

async function deleteUserPermanent(targetUserId) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initSupabase()) return { success: false, error: 'supabase_not_ready' };

        const myId = getCurrentUserId();
        const { data, error } = await sbClient.rpc('admin_delete_user', {
            p_admin_id: myId,
            p_target_id: targetUserId
        });

        if (error) return { success: false, error: error.message || 'rpc_failed' };
        return data || { success: true };
    } catch (e) {
        console.error('deleteUserPermanent error:', e);
        return { success: false, error: 'server_error' };
    }
}

// ==================== ADMIN: STATS ====================

async function getSiteStats() {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initSupabase()) return { success: false, error: 'supabase_not_ready' };

        const { data, error } = await sbClient.rpc('admin_get_stats', {
            p_admin_id: getCurrentUserId()
        });

        if (error) return { success: false, error: error.message || 'rpc_failed' };
        return data || { success: false };
    } catch (e) {
        console.error('getSiteStats error:', e);
        return { success: false, error: 'server_error' };
    }
}

// ==================== HELPERS ====================

async function checkBanStatus(targetUserId) {
    try {
        const data = await fetchUserData(targetUserId);
        if (!data || !data.banned) return { banned: false };

        if (data.ban_type === 'permanent') {
            return { banned: true, type: 'permanent', reason: data.ban_reason };
        }
        if (data.ban_until) {
            const until = new Date(data.ban_until).getTime();
            if (Date.now() < until) {
                return { banned: true, type: 'temporary', until: data.ban_until, reason: data.ban_reason };
            }
            // انتهى الحظر — ارفعه
            await sbClient.from('users').update({
                banned: false, ban_type: null, ban_until: null
            }).eq('id', targetUserId);
        }
        return { banned: false };
    } catch (e) {
        console.error('checkBanStatus error:', e);
        return { banned: false };
    }
}

async function isCurrentUserAdmin() {
    try {
        if (!isLoggedIn()) return false;
        const data = await fetchUserData();
        return !!(data && data.is_admin);
    } catch (e) {
        return false;
    }
}

async function hasPermission(permission) {
    try {
        if (!isLoggedIn()) return false;
        const data = await fetchUserData();
        if (!data) return false;
        if (data.is_admin) return true;
        if (data.mod_permissions && data.mod_permissions[permission] === true) return true;
        return false;
    } catch (e) {
        console.error('hasPermission error:', e);
        return false;
    }
}

async function fetchUserGems(userId) {
    const data = await fetchUserData(userId);
    return data ? (data.gems || 0) : 0;
}

// ==================== EVENTS MANAGEMENT (الإنجازات + الموسوعة) ====================

// فتح/إغلاق كل الإنجازات لمستخدم
async function setAllAchievements(targetUserId, unlock) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initSupabase()) return { success: false, error: 'supabase_not_ready' };

        const myId = getCurrentUserId();
        const { data, error } = await sbClient.rpc('admin_set_all_achievements', {
            p_admin_id: myId,
            p_target_id: targetUserId,
            p_unlock: unlock
        });

        if (error) return { success: false, error: error.message || 'rpc_failed' };

        // مزامنة محلية لو كان الهدف هو نفسي
        if (targetUserId === myId && data && data.success) {
            // تحديث الإنجازات محلياً (سيُجلب تلقائياً عند فتح صفحة الإنجازات)
        }
        return data || { success: true };
    } catch (e) {
        console.error('setAllAchievements error:', e);
        return { success: false, error: 'server_error' };
    }
}

// فتح/إغلاق كل الموسوعة لمستخدم
async function setAllPokedex(targetUserId, unlock) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initSupabase()) return { success: false, error: 'supabase_not_ready' };

        const myId = getCurrentUserId();
        const { data, error } = await sbClient.rpc('admin_set_all_pokedex', {
            p_admin_id: myId,
            p_target_id: targetUserId,
            p_unlock: unlock
        });

        if (error) return { success: false, error: error.message || 'rpc_failed' };
        return data || { success: true };
    } catch (e) {
        console.error('setAllPokedex error:', e);
        return { success: false, error: 'server_error' };
    }
}

// ==================== PERSONAL MESSAGES (الرسائل المخصصة) ====================

// إرسال رسالة لمستخدم
async function sendMessageToUser(targetUserId, title, message, icon) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initSupabase()) return { success: false, error: 'supabase_not_ready' };

        const myId = getCurrentUserId();
        const { data, error } = await sbClient.rpc('admin_send_message', {
            p_admin_id: myId,
            p_target_id: targetUserId,
            p_title: title,
            p_message: message,
            p_icon: icon || '💌'
        });

        if (error) return { success: false, error: error.message || 'rpc_failed' };
        return data || { success: true };
    } catch (e) {
        console.error('sendMessageToUser error:', e);
        return { success: false, error: 'server_error' };
    }
}

// جلب رسائل المستخدم الحالي
async function fetchMyMessages() {
    try {
        if (!isLoggedIn()) return [];
        if (!initSupabase()) return [];

        const userId = getCurrentUserId();
        const { data, error } = await sbClient.rpc('get_user_messages', {
            p_user_id: userId
        });

        if (error) {
            console.error('fetchMyMessages error:', error);
            return [];
        }
        return data || [];
    } catch (e) {
        console.error('fetchMyMessages error:', e);
        return [];
    }
}

// حذف رسالة (عند الضغط على x)
async function deleteMessage(messageId) {
    try {
        if (!isLoggedIn()) return false;
        if (!initSupabase()) return false;

        const userId = getCurrentUserId();
        const { data, error } = await sbClient.rpc('delete_user_message', {
            p_user_id: userId,
            p_message_id: messageId
        });

        if (error) {
            console.error('deleteMessage error:', error);
            return false;
        }
        return !!data;
    } catch (e) {
        console.error('deleteMessage error:', e);
        return false;
    }
}

async function syncStatsToCloud() {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initSupabase()) return { success: false, error: 'supabase_not_ready' };

        const userId = getCurrentUserId();
        const stats = JSON.parse(localStorage.getItem('quiz_stats') || '{}');
        const achievements = JSON.parse(localStorage.getItem('quiz_achievements') || '{}');
        const cards = JSON.parse(localStorage.getItem('quiz_cards') || '{}');

        // مزامنة عبر RPC (لأن RLS يمنع التحديث المباشر)
        const { error } = await sbClient.rpc('sync_game_stats', {
            p_user_id: userId,
            p_stats: stats,
            p_achievements: achievements,
            p_cards: cards
        });

        if (error) {
            console.error('syncStatsToCloud error:', error);
            return { success: false, error: 'rpc_failed' };
        }
        return { success: true };
    } catch (e) {
        console.error('syncStatsToCloud error:', e);
        return { success: false, error: 'server_error' };
    }
}

// ==================== ADMIN: MASS REWARD ====================

async function adminMassReward(type, amount) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initSupabase()) return { success: false, error: 'supabase_not_ready' };

        if (!type || (type !== 'gems' && type !== 'xp')) {
            return { success: false, error: 'invalid_type' };
        }
        if (!amount || amount <= 0) {
            return { success: false, error: 'invalid_amount' };
        }

        const myId = getCurrentUserId();
        const { data, error } = await sbClient.rpc('admin_mass_reward', {
            p_admin_id: myId,
            p_type: type,
            p_amount: amount
        });

        if (error) return { success: false, error: error.message || 'rpc_failed' };
        return data || { success: true };
    } catch (e) {
        console.error('adminMassReward error:', e);
        return { success: false, error: 'server_error' };
    }
}

// ==================== ADMIN: FEATURED USER ====================

async function setFeaturedUser(targetUserId, reason) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initSupabase()) return { success: false, error: 'supabase_not_ready' };

        const myId = getCurrentUserId();
        const { data, error } = await sbClient.rpc('admin_set_featured_user', {
            p_admin_id: myId,
            p_target_id: targetUserId,
            p_reason: reason || ''
        });

        if (error) return { success: false, error: error.message || 'rpc_failed' };
        return data || { success: true };
    } catch (e) {
        console.error('setFeaturedUser error:', e);
        return { success: false, error: 'server_error' };
    }
}

async function removeFeaturedUser() {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initSupabase()) return { success: false, error: 'supabase_not_ready' };

        const myId = getCurrentUserId();
        const { data, error } = await sbClient.rpc('admin_remove_featured_user', {
            p_admin_id: myId
        });

        if (error) return { success: false, error: error.message || 'rpc_failed' };
        return data || { success: true };
    } catch (e) {
        console.error('removeFeaturedUser error:', e);
        return { success: false, error: 'server_error' };
    }
}

async function getFeaturedUser() {
    try {
        if (!initSupabase()) return null;

        const { data, error } = await sbClient.rpc('get_featured_user');

        if (error) {
            console.error('getFeaturedUser error:', error);
            return null;
        }
        return data;
    } catch (e) {
        console.error('getFeaturedUser error:', e);
        return null;
    }
}

// ==================== LEADERBOARD ====================

async function getLeaderboard(limit = 10) {
    try {
        if (!initSupabase()) return [];

        const { data, error } = await sbClient.rpc('get_leaderboard', {
            p_limit: limit
        });

        if (error) {
            console.error('getLeaderboard error:', error);
            return [];
        }
        return data || [];
    } catch (e) {
        console.error('getLeaderboard error:', e);
        return [];
    }
}

// قائمة صلاحيات المشرفين (للواجهة)
const MOD_PERMISSIONS = {
    giftGems:      { ar: '💎 شحن جواهر',           en: 'Gift Gems' },
    removeGems:    { ar: '➖ سحب جواهر',            en: 'Remove Gems' },
    editXP:        { ar: '⚡ تعديل XP',             en: 'Edit XP' },
    editLevel:     { ar: '🎮 تعديل المستوى',         en: 'Edit Level' },
    listUsers:     { ar: '📋 قائمة المستخدمين',      en: 'List Users' },
    searchUser:    { ar: '🔍 البحث عن مستخدم',       en: 'Search User' },
    banUser:       { ar: '🚫 حظر مستخدم',           en: 'Ban User' },
    unbanUser:     { ar: '✅ إلغاء الحظر',          en: 'Unban User' },
    deleteUser:    { ar: '🗑️ حذف مستخدم',          en: 'Delete User' },
    resetPassword: { ar: '🔑 إعادة تعيين كلمة سر', en: 'Reset Password' },
    massReward:    { ar: '🎁 مكافأة جماعية',        en: 'Mass Reward' },
    featuredUser:  { ar: '⭐ مستخدم مميز',         en: 'Featured User' }
};

// تصدير على window
window.firebaseDB = {
    initFirebase: initSupabase, // توافق مع الكود القديم
    registerUser, loginUser, logoutUser,
    getCurrentUserId, isLoggedIn, fetchUserData, subscribeToUserData,
    addXPToCloud, addGemsToUser, removeGemsFromUser,
    setUserXP, setUserLevel,
    getAllUsers, searchUserById,
    banUser, tempBanUser, unbanUser,
    setModerator, setAdmin, resetUserPassword,
    deleteUserPermanent, getSiteStats,
    checkBanStatus, hasPermission, MOD_PERMISSIONS,
    fetchUserGems, isCurrentUserAdmin, syncStatsToCloud,
    // أحداث + رسائل
    setAllAchievements, setAllPokedex,
    sendMessageToUser, fetchMyMessages, deleteMessage,
    // ميزات جديدة
    adminMassReward, setFeaturedUser, removeFeaturedUser, getFeaturedUser, getLeaderboard
};

