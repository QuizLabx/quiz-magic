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

// تهيئة Firebase
function initFirebase() {
    if (typeof firebase === 'undefined') {
        console.warn('🔥 Firebase SDK not loaded yet');
        return false;
    }
    if (fbApp) return true; // تم التهيئة مسبقاً

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
    fbAuth = firebase.auth();
    fbDb = firebase.firestore();
    console.log('🔥 Firebase initialized successfully');
    return true;
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

// 📝 تسجيل مستخدم جديد
async function registerUser(password) {
    try {
        if (!initFirebase()) return { success: false, error: 'firebase_not_ready' };

        if (!password || password.length < 4) {
            return { success: false, error: 'password_short' };
        }
        if (password.length > 30) {
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
        const now = new Date().toISOString();

        // حفظ المستخدم في Firestore
        await fbDb.collection('users').doc(userId).set({
            userId: userId,
            passwordHash: hashedPassword,
            salt: salt,
            createdAt: now,
            lastLogin: now,
            xp: 0,
            gems: 0,
            level: 1,
            isAdmin: false,
            stats: {
                totalQuizzes: 0,
                creatures: {},
                shares: 0,
                comparisons: 0,
                retakes: 0,
                secretUnlocks: 0
            },
            achievements: {},
            cards: {}
        });

        // حفظ حالة الدخول
        sessionStorage.setItem('quiz_logged_in_id', userId);

        return { success: true, userId: userId };
    } catch (error) {
        console.error('Register error:', error);
        return { success: false, error: 'server_error', details: error.message };
    }
}

// ==================== LOGIN ====================

// 🔓 تسجيل الدخول بـ ID وكلمة السر
async function loginUser(userId, password) {
    try {
        if (!initFirebase()) return { success: false, error: 'firebase_not_ready' };

        if (!userId || !password) {
            return { success: false, error: 'missing_fields' };
        }

        const cleanId = userId.replace(/\D/g, '');
        if (cleanId.length !== 6) {
            return { success: false, error: 'invalid_id_format' };
        }

        const snap = await fbDb.collection('users').doc(cleanId).get();

        if (!snap.exists) {
            return { success: false, error: 'user_not_found' };
        }

        const userData = snap.data();

        // التحقق من كلمة السر
        const hashedPassword = await hashPassword(password, userData.salt);
        if (hashedPassword !== userData.passwordHash) {
            return { success: false, error: 'wrong_password' };
        }

        // ✅ نجح الدخول
        await fbDb.collection('users').doc(cleanId).update({
            lastLogin: new Date().toISOString()
        });

        sessionStorage.setItem('quiz_logged_in_id', cleanId);

        return { success: true, userId: cleanId, userData: userData };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'server_error', details: error.message };
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

// ➕ إضافة XP
async function addXPToCloud(amount, reason) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initFirebase()) return { success: false, error: 'firebase_not_ready' };

        const userId = getCurrentUserId();
        const ref = fbDb.collection('users').doc(userId);
        const snap = await ref.get();

        if (!snap.exists) return { success: false, error: 'user_not_found' };

        const data = snap.data();
        const currentXP = data.xp || 0;
        const newXP = currentXP + amount;

        let newLevel = 1;
        if (typeof config !== 'undefined' && config.xpSystem) {
            newLevel = calculateLevelFromXP(newXP);
        }

        await ref.update({ xp: newXP, level: newLevel });

        return { success: true, newXP: newXP, newLevel: newLevel };
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

// ➕ إضافة جواهر (للأدمن)
async function addGemsToUser(targetUserId, amount) {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initFirebase()) return { success: false, error: 'firebase_not_ready' };

        // التحقق من صلاحية الأدمن
        const myData = await fetchUserData(getCurrentUserId());
        if (!myData || !myData.isAdmin) {
            return { success: false, error: 'unauthorized' };
        }

        if (amount <= 0) return { success: false, error: 'invalid_amount' };

        const ref = fbDb.collection('users').doc(targetUserId);
        const snap = await ref.get();

        if (!snap.exists) return { success: false, error: 'user_not_found' };

        const data = snap.data();
        const newGems = (data.gems || 0) + amount;
        await ref.update({ gems: newGems });

        return { success: true, newGems: newGems };
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

// 🔄 مزامنة إحصائيات localStorage مع Firestore
async function syncStatsToCloud() {
    try {
        if (!isLoggedIn()) return { success: false, error: 'not_logged_in' };
        if (!initFirebase()) return { success: false, error: 'firebase_not_ready' };

        const userId = getCurrentUserId();
        const ref = fbDb.collection('users').doc(userId);

        const stats = JSON.parse(localStorage.getItem('quiz_stats') || '{}');
        const achievements = JSON.parse(localStorage.getItem('quiz_achievements') || '{}');
        const cards = JSON.parse(localStorage.getItem('quiz_cards') || '{}');

        await ref.update({ stats: stats, achievements: achievements, cards: cards });

        return { success: true };
    } catch (e) {
        console.error('syncStatsToCloud error:', e);
        return { success: false, error: 'server_error' };
    }
}

// تصدير كل الدوال على window للاستخدام العام
window.firebaseDB = {
    initFirebase,
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUserId,
    isLoggedIn,
    fetchUserData,
    subscribeToUserData,
    addXPToCloud,
    addGemsToUser,
    spendGemsCloud,
    fetchUserGems,
    isCurrentUserAdmin,
    syncStatsToCloud
};
