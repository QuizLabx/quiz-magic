/**
 * 🔥 QuizMagic Firebase Integration (نسخة Compat - بدون ES modules)
 * تعمل كدوال عادية على window.firebaseDB
 *
 * تستخدم Firebase Compat SDK ليتوافق مع بنية الموقع الحالية
 */

// ==================== FIREBASE INIT ====================
// (يتم تحميل SDK عبر script tags في index.html قبل هذا الملف)

let fbApp = null;
let fbAuth = null;
let fbDb = null;
let fbFunctions = null;

// تهيئة Firebase
function initFirebase() {
    if (typeof firebase === 'undefined') {
        console.warn('🔥 Firebase SDK not loaded yet');
        return false;
    }
    if (fbApp && fbDb) return true; // تم التهيئة مسبقاً

    try {
        const firebaseConfig = {
            apiKey: "AIzaSyAj_Ii34FnOqxna_pvkS8ipKSOjckIriH0",
            authDomain: "quizmagic-38873.firebaseapp.com",
            projectId: "quizmagic-38873",
            storageBucket: "quizmagic-38873.firebasestorage.app",
            messagingSenderId: "944588707129",
            appId: "1:944588707129:web:8682f9ca9b0099aa5304e8",
            measurementId: "G-MR5K4ZBPMT"
        };

        fbApp = firebase.initializeApp(firebaseConfig);
        // auth
        if (typeof firebase.auth === 'function') {
            fbAuth = firebase.auth();
        }
        // firestore ضروري
        if (typeof firebase.firestore !== 'function') {
            console.error('🔥 Firestore SDK not available');
            return false;
        }
        fbDb = firebase.firestore();
        // functions (للعمليات الآمنة عبر السيرفر)
        if (typeof firebase.app === 'function' && typeof firebase.app().functions === 'function') {
            fbFunctions = firebase.app().functions('us-central1');
        } else if (typeof firebase.functions === 'function') {
            fbFunctions = firebase.functions();
        }
        console.log('🔥 Firebase initialized successfully (Auth + Firestore + Functions)');
        return true;
    } catch (e) {
        console.error('🔥 Firebase init error:', e);
        return false;
    }
}

// ==================== ID GENERATION ====================

// 🎲 توليد ID عشوائي من 6 أرقام
function generateUserId() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// 🔍 التحقق أن الـ ID غير مستخدم في قاعدة البيانات
async function isIdAvailable(id) {
    try {
        if (!initFirebase()) return false;
        const snap = await fbDb.collection('users').doc(id).get();
        return !snap.exists;
    } catch (e) {
        console.error('isIdAvailable error:', e);
        return false;
    }
}

// 🎲 توليد ID فريد متاح
async function generateUniqueUserId() {
    for (let i = 0; i < 10; i++) {
        const id = generateUserId();
        if (await isIdAvailable(id)) return id;
    }
    return null;
}

// ==================== PASSWORD HASHING ====================

// 🔒 تشفير كلمة السر (SHA-256 + salt)
async function hashPassword(password, salt) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 🧂 توليد salt عشوائي
function generateSalt() {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ==================== REGISTRATION ====================

// 📝 تسجيل مستخدم جديد — عبر Cloud Function الآمنة
async function registerUser(password) {
    try {
        if (!initFirebase()) return { success: false, error: 'firebase_not_ready' };
        if (!fbFunctions) return { success: false, error: 'functions_not_ready' };

        if (!password || password.length < 4) {
            return { success: false, error: 'password_short' };
        }
        if (password.length > 100) {
            return { success: false, error: 'password_long' };
        }

        // استدعاء Cloud Function الآمنة
        const registerFn = fbFunctions.httpsCallable('registerAccount');
        const result = await registerFn({ password: password });
        const data = result.data;

        if (data && data.success) {
            // تسجيل الدخول تلقائياً باستخدام custom token
            if (data.customToken && fbAuth) {
                await fbAuth.signInWithCustomToken(data.customToken);
            }
            sessionStorage.setItem('quiz_logged_in_id', data.userId);
            return { success: true, userId: data.userId };
        }
        return { success: false, error: 'registration_failed' };
    } catch (error) {
        console.error('Register error:', error);
        const msg = (error && error.message) || '';
        if (msg.includes('كلمة السر')) return { success: false, error: 'password_short' };
        return { success: false, error: 'server_error', details: msg };
    }
}

// ==================== LOGIN ====================

// 🔓 تسجيل الدخول بـ ID وكلمة السر — عبر Cloud Function الآمنة
async function loginUser(userId, password) {
    try {
        if (!initFirebase()) return { success: false, error: 'firebase_not_ready' };
        if (!fbFunctions) return { success: false, error: 'functions_not_ready' };

        if (!userId || !password) {
            return { success: false, error: 'missing_fields' };
        }

        const cleanId = userId.replace(/\D/g, '');
        if (cleanId.length !== 6) {
            return { success: false, error: 'invalid_id_format' };
        }

        // استدعاء Cloud Function
        const loginFn = fbFunctions.httpsCallable('loginAccount');
        const result = await loginFn({ userId: cleanId, password: password });
        const data = result.data;

        if (data && data.success) {
            // تسجيل الدخول بـ custom token
            if (data.customToken && fbAuth) {
                await fbAuth.signInWithCustomToken(data.customToken);
            }
            sessionStorage.setItem('quiz_logged_in_id', cleanId);
            return { success: true, userId: cleanId, userData: data.userData };
        }
        return { success: false, error: 'login_failed' };
    } catch (error) {
        console.error('Login error:', error);
        const msg = (error && error.message) || '';
        if (msg.includes('غير موجود')) return { success: false, error: 'user_not_found' };
        if (msg.includes('خاطئة') || msg.includes('unauthenticated')) return { success: false, error: 'wrong_password' };
        if (msg.includes('محظور')) return { success: false, error: 'banned', details: msg };
        if (msg.includes('غير صحيح')) return { success: false, error: 'invalid_id_format' };
        return { success: false, error: 'server_error', details: msg };
    }
}

// ==================== SESSION MANAGEMENT ====================

function getCurrentUserId() {
    return sessionStorage.getItem('quiz_logged_in_id') || null;
}

function logoutUser() {
    sessionStorage.removeItem('quiz_logged_in_id');
}

function isLoggedIn() {
    return getCurrentUserId() !== null;
}

// ==================== USER DATA ====================

// 📖 جلب بيانات المستخدم
async function fetchUserData(userId) {
    try {
        if (!initFirebase()) return null;
        const id = userId || getCurrentUserId();
        if (!id) return null;

        const snap = await fbDb.collection('users').doc(id).get();
        return snap.exists ? snap.data() : null;
    } catch (e) {
        console.error('fetchUserData error:', e);
        return null;
    }
}

// 👂 الاستماع للتغييرات في الوقت الحقيقي
let unsubscribeListener = null;
function subscribeToUserData(callback) {
    try {
        if (!initFirebase()) return;
        const id = getCurrentUserId();
        if (!id) return;

        // إلغاء أي مستمع سابق
        if (unsubscribeListener) unsubscribeListener();

        unsubscribeListener = fbDb.collection('users').doc(id).onSnapshot(
            (doc) => {
                if (doc.exists) callback(doc.data());
            },
            (err) => console.error('Listener error:', err)
        );
    } catch (e) {
        console.error('subscribeToUserData error:', e);
    }
}

// ==================== XP SYSTEM ====================

// ➕ إضافة XP — عبر Cloud Function
async function addXPToCloud(amount, reason) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initFirebase() || !fbFunctions) return { success: false, error: 'firebase_not_ready' };

        const fn = fbFunctions.httpsCallable('addUserXP');
        const result = await fn({ amount: amount, reason: reason });
        return result.data || { success: false };
    } catch (e) {
        console.error('addXPToCloud error:', e);
        return { success: false, error: 'server_error' };
    }
}

function calculateLevelFromXP(xp) {
    if (typeof config === 'undefined' || !config.xpSystem || !config.xpSystem.levels) return 1;
    let level = 1;
    for (const [lvl, data] of Object.entries(config.xpSystem.levels)) {
        if (xp >= data.xp) level = parseInt(lvl);
    }
    return level;
}

// ==================== GEMS SYSTEM ====================

// 💎 جلب جواهر مستخدم
async function fetchUserGems(userId) {
    const data = await fetchUserData(userId);
    return data ? (data.gems || 0) : 0;
}

// ➕ إضافة جواهر (للأدمن) — عبر Cloud Function
async function addGemsToUser(targetUserId, amount) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initFirebase() || !fbFunctions) return { success: false, error: 'firebase_not_ready' };

        const fn = fbFunctions.httpsCallable('giftGems');
        const result = await fn({ targetId: targetUserId, amount: amount });
        return result.data || { success: false };
    } catch (e) {
        console.error('addGemsToUser error:', e);
        return { success: false, error: 'server_error' };
    }
}

// ➖ خصم جواهر (عند الشراء)
async function spendGemsCloud(amount, reason) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initFirebase()) return { success: false, error: 'firebase_not_ready' };

        const userId = getCurrentUserId();
        const ref = fbDb.collection('users').doc(userId);
        const snap = await ref.get();

        if (!snap.exists) return { success: false, error: 'user_not_found' };

        const data = snap.data();
        const currentGems = data.gems || 0;

        if (currentGems < amount) {
            return { success: false, error: 'insufficient_gems' };
        }

        const newGems = currentGems - amount;
        await ref.update({ gems: newGems });

        return { success: true, newGems: newGems };
    } catch (e) {
        console.error('spendGemsCloud error:', e);
        return { success: false, error: 'server_error' };
    }
}

// ==================== ADMIN ====================

async function isCurrentUserAdmin() {
    try {
        if (!isLoggedIn()) return false;
        const data = await fetchUserData();
        return !!(data && data.isAdmin);
    } catch (e) {
        return false;
    }
}

// 🔄 مزامنة إحصائيات localStorage مع Firestore — عبر Cloud Function
async function syncStatsToCloud() {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initFirebase() || !fbFunctions) return { success: false, error: 'firebase_not_ready' };

        const stats = JSON.parse(localStorage.getItem('quiz_stats') || '{}');
        const achievements = JSON.parse(localStorage.getItem('quiz_achievements') || '{}');
        const cards = JSON.parse(localStorage.getItem('quiz_cards') || '{}');

        const fn = fbFunctions.httpsCallable('syncGameStats');
        const result = await fn({ stats: stats, achievements: achievements, cards: cards });
        return result.data || { success: false };
    } catch (e) {
        console.error('syncStatsToCloud error:', e);
        return { success: false, error: 'server_error' };
    }
}

// ========================================================================
// 👑 ADMIN SYSTEM (نظام الأدمن المتقدم - 16 صلاحية)
// ========================================================================

// 🛡️ التحقق من صلاحية (للأدمن أو المشرف)
async function hasPermission(permission) {
    try {
        if (!isLoggedIn()) return false;
        const data = await fetchUserData();
        if (!data) return false;

        // الأدمن يملك كل الصلاحيات
        if (data.isAdmin) return true;

        // المشرف: تحقق من صلاحياته المخصصة
        if (data.modPermissions && data.modPermissions[permission] === true) {
            return true;
        }
        return false;
    } catch (e) {
        console.error('hasPermission error:', e);
        return false;
    }
}

// قائمة كل الصلاحيات المتاحة للمشرفين
const MOD_PERMISSIONS = {
    giftGems:    { ar: '💎 شحن جواهر',           en: 'Gift Gems' },
    removeGems:  { ar: '➖ سحب جواهر',            en: 'Remove Gems' },
    editXP:      { ar: '⚡ تعديل XP',             en: 'Edit XP' },
    editLevel:   { ar: '🎮 تعديل المستوى',         en: 'Edit Level' },
    listUsers:   { ar: '📋 قائمة المستخدمين',      en: 'List Users' },
    searchUser:  { ar: '🔍 البحث عن مستخدم',       en: 'Search User' },
    banUser:     { ar: '🚫 حظر مستخدم',           en: 'Ban User' },
    unbanUser:   { ar: '✅ إلغاء الحظر',          en: 'Unban User' },
    deleteUser:  { ar: '🗑️ حذف مستخدم',          en: 'Delete User' },
    resetPassword: { ar: '🔑 إعادة تعيين كلمة سر', en: 'Reset Password' }
};

// ==================== 💎 GEMS MANAGEMENT ====================

// ➖ سحب جواهر من مستخدم — عبر Cloud Function
async function removeGemsFromUser(targetUserId, amount) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initFirebase() || !fbFunctions) return { success: false, error: 'firebase_not_ready' };

        const fn = fbFunctions.httpsCallable('removeGems');
        const result = await fn({ targetId: targetUserId, amount: amount });
        return result.data || { success: false };
    } catch (e) {
        console.error('removeGemsFromUser error:', e);
        return { success: false, error: 'server_error' };
    }
}

// ==================== ⚡ XP & LEVEL ====================

// ⚡ تعديل XP لمستخدم — عبر Cloud Function
async function setUserXP(targetUserId, newXP) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initFirebase() || !fbFunctions) return { success: false, error: 'firebase_not_ready' };

        const fn = fbFunctions.httpsCallable('setUserXP');
        const result = await fn({ targetId: targetUserId, xp: newXP });
        return result.data || { success: false };
    } catch (e) {
        console.error('setUserXP error:', e);
        return { success: false, error: 'server_error' };
    }
}

// 🎮 تعديل مستوى مستخدم مباشرة — عبر Cloud Function
async function setUserLevel(targetUserId, newLevel) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initFirebase() || !fbFunctions) return { success: false, error: 'firebase_not_ready' };

        const fn = fbFunctions.httpsCallable('setUserLevel');
        const result = await fn({ targetId: targetUserId, level: newLevel });
        return result.data || { success: false };
    } catch (e) {
        console.error('setUserLevel error:', e);
        return { success: false, error: 'server_error' };
    }
}

// ==================== 📋 USER MANAGEMENT ====================

// 📋 قائمة كل المستخدمين — عبر Cloud Function
async function getAllUsers() {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initFirebase() || !fbFunctions) return { success: false, error: 'firebase_not_ready' };

        const fn = fbFunctions.httpsCallable('getAllUsers');
        const result = await fn({});
        const data = result.data || {};
        if (data.success && data.users) {
            // ترتيب: الأدمن أولاً، ثم الأكثر XP
            data.users.sort((a, b) => {
                if (a.isAdmin && !b.isAdmin) return -1;
                if (!a.isAdmin && b.isAdmin) return 1;
                return b.xp - a.xp;
            });
        }
        return data;
    } catch (e) {
        console.error('getAllUsers error:', e);
        return { success: false, error: 'server_error' };
    }
}

// 🔍 البحث عن مستخدم بـ ID
async function searchUserById(targetUserId) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initFirebase()) return { success: false, error: 'firebase_not_ready' };

        const allowed = await hasPermission('searchUser');
        if (!allowed) return { success: false, error: 'unauthorized' };

        const data = await fetchUserData(targetUserId);
        if (!data) return { success: false, error: 'user_not_found' };

        return { success: true, userId: targetUserId, userData: data };
    } catch (e) {
        console.error('searchUserById error:', e);
        return { success: false, error: 'server_error' };
    }
}

// ==================== 🚫 BAN SYSTEM ====================

// 🚫 حظر دائم — عبر Cloud Function
async function banUser(targetUserId, reason) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initFirebase() || !fbFunctions) return { success: false, error: 'firebase_not_ready' };

        const fn = fbFunctions.httpsCallable('banUser');
        const result = await fn({ targetId: targetUserId, reason: reason });
        return result.data || { success: false };
    } catch (e) {
        console.error('banUser error:', e);
        return { success: false, error: 'server_error' };
    }
}

// ⏰ حظر مؤقت — عبر Cloud Function
async function tempBanUser(targetUserId, durationMs, reason) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initFirebase() || !fbFunctions) return { success: false, error: 'firebase_not_ready' };

        const fn = fbFunctions.httpsCallable('banUser');
        const result = await fn({ targetId: targetUserId, reason: reason, durationMs: durationMs });
        return result.data || { success: false };
    } catch (e) {
        console.error('tempBanUser error:', e);
        return { success: false, error: 'server_error' };
    }
}

// ✅ إلغاء الحظر — عبر Cloud Function
async function unbanUser(targetUserId) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initFirebase() || !fbFunctions) return { success: false, error: 'firebase_not_ready' };

        const fn = fbFunctions.httpsCallable('unbanUser');
        const result = await fn({ targetId: targetUserId });
        return result.data || { success: false };
    } catch (e) {
        console.error('unbanUser error:', e);
        return { success: false, error: 'server_error' };
    }
}

// 🔍 التحقق إن كان المستخدم محظوراً حالياً (يستخدم عند الدخول)
async function checkBanStatus(targetUserId) {
    try {
        const data = await fetchUserData(targetUserId);
        if (!data || !data.banned) return { banned: false };

        // حظر دائم
        if (data.banType === 'permanent') {
            return { banned: true, type: 'permanent', reason: data.banReason };
        }
        // حظر مؤقت — تحقق إن انتهى
        if (data.banUntil) {
            const until = new Date(data.banUntil).getTime();
            if (Date.now() < until) {
                return { banned: true, type: 'temporary', until: data.banUntil, reason: data.banReason };
            } else {
                // انتهى الحظر — ارفعه تلقائياً
                await fbDb.collection('users').doc(targetUserId).update({
                    banned: false, banType: null, banUntil: null
                });
            }
        }
        return { banned: false };
    } catch (e) {
        console.error('checkBanStatus error:', e);
        return { banned: false };
    }
}

// ==================== 👤 MODERATOR SYSTEM ====================

// 🛡️ تعيين مشرف بصلاحيات مخصصة — عبر Cloud Function
async function setModerator(targetUserId, permissions) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initFirebase() || !fbFunctions) return { success: false, error: 'firebase_not_ready' };

        const fn = fbFunctions.httpsCallable('setModerator');
        const result = await fn({ targetId: targetUserId, permissions: permissions });
        return result.data || { success: false };
    } catch (e) {
        console.error('setModerator error:', e);
        return { success: false, error: 'server_error' };
    }
}

// 👑 تعيين أدمن جديد — عبر Cloud Function
async function setAdmin(targetUserId, makeAdmin) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initFirebase() || !fbFunctions) return { success: false, error: 'firebase_not_ready' };

        const fn = fbFunctions.httpsCallable('setAdmin');
        const result = await fn({ targetId: targetUserId, makeAdmin: makeAdmin });
        return result.data || { success: false };
    } catch (e) {
        console.error('setAdmin error:', e);
        return { success: false, error: 'server_error' };
    }
}

// ==================== 🔑 PASSWORD RESET ====================

// 🔑 إعادة تعيين كلمة سر — عبر Cloud Function
async function resetUserPassword(targetUserId, newPassword) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initFirebase() || !fbFunctions) return { success: false, error: 'firebase_not_ready' };

        const fn = fbFunctions.httpsCallable('resetUserPassword');
        const result = await fn({ targetId: targetUserId, newPassword: newPassword });
        return result.data || { success: false };
    } catch (e) {
        console.error('resetUserPassword error:', e);
        return { success: false, error: 'server_error' };
    }
}

// ==================== 🗑️ DELETE USER ====================

// 🗑️ حذف مستخدم نهائياً — عبر Cloud Function
async function deleteUserPermanent(targetUserId) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initFirebase() || !fbFunctions) return { success: false, error: 'firebase_not_ready' };

        const fn = fbFunctions.httpsCallable('deleteUserPermanent');
        const result = await fn({ targetId: targetUserId });
        return result.data || { success: false };
    } catch (e) {
        console.error('deleteUserPermanent error:', e);
        return { success: false, error: 'server_error' };
    }
}

// ==================== 📊 STATS ====================

// 📊 إحصائيات الموقع — عبر Cloud Function
async function getSiteStats() {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initFirebase() || !fbFunctions) return { success: false, error: 'firebase_not_ready' };

        const fn = fbFunctions.httpsCallable('getSiteStats');
        const result = await fn({});
        return result.data || { success: false };
    } catch (e) {
        console.error('getSiteStats error:', e);
        return { success: false, error: 'server_error' };
    }
}

// تصدير كل الدوال على window للاستخدام العام
window.firebaseDB = {
    // أساسية
    initFirebase, registerUser, loginUser, logoutUser,
    getCurrentUserId, isLoggedIn, fetchUserData, subscribeToUserData,
    addXPToCloud, addGemsToUser, spendGemsCloud, fetchUserGems,
    isCurrentUserAdmin, syncStatsToCloud, checkBanStatus,
    hasPermission, MOD_PERMISSIONS,
    // أدمن
    removeGemsFromUser, setUserXP, setUserLevel,
    getAllUsers, searchUserById,
    banUser, tempBanUser, unbanUser,
    setModerator, setAdmin, resetUserPassword,
    deleteUserPermanent, getSiteStats
};
