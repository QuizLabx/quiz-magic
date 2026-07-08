/**
 * 🎨 QuizMagic Firebase UI
 * واجهة التسجيل/الدخول وعرض معلومات الحساب
 */

// ==================== ACCOUNT MODAL ====================

// فتح مودال الحساب (يحدد المحتوى حسب الحالة)
function showAccountModal() {
    const modal = document.getElementById('account-modal');
    const body = document.getElementById('account-modal-body');
    if (!modal || !body) return;

    if (window.firebaseDB && window.firebaseDB.isLoggedIn()) {
        renderAccountInfo(body);
    } else {
        renderAuthChoice(body);
    }

    const title = document.getElementById('account-modal-title');
    const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');
    if (title) title.textContent = isAr ? 'حسابي' : 'My Account';

    modal.classList.add('show');
    if (typeof trapFocus === 'function') trapFocus(modal);
    setTimeout(() => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
    }, 100);
}

function closeAccountModal() {
    const modal = document.getElementById('account-modal');
    if (!modal) return;
    modal.classList.remove('show');
    if (typeof removeFocusTrap === 'function') removeFocusTrap(modal);
}

// ==================== AUTH CHOICE (تسجيل أو دخول) ====================

function renderAuthChoice(container) {
    const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');
    container.innerHTML = `
        <div class="account-choice">
            <div class="account-choice-intro">
                <div class="account-choice-icon"><i class="fas fa-shield-alt"></i></div>
                <h3>${isAr ? 'احفظ تقدّمك بأمان' : 'Save your progress securely'}</h3>
                <p>${isAr ? 'أنشئ حساباً لحفظ XP والجواهر والإنجازات. لا يمكن سرقتها أو فقدانها.' : 'Create an account to save your XP, gems and achievements. Cannot be stolen or lost.'}</p>
            </div>
            <button onclick="renderRegisterForm()" class="account-choice-btn primary">
                <i class="fas fa-user-plus"></i>
                <span>${isAr ? 'إنشاء حساب جديد' : 'Create new account'}</span>
            </button>
            <button onclick="renderLoginForm()" class="account-choice-btn secondary">
                <i class="fas fa-sign-in-alt"></i>
                <span>${isAr ? 'تسجيل الدخول بـ ID' : 'Login with ID'}</span>
            </button>
        </div>
    `;
}

// ==================== REGISTER FORM ====================

function renderRegisterForm() {
    const body = document.getElementById('account-modal-body');
    if (!body) return;
    const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');

    body.innerHTML = `
        <div class="auth-form">
            <button onclick="renderAuthChoice(document.getElementById('account-modal-body'))" class="auth-back-btn">
                <i class="fas fa-arrow-right"></i> ${isAr ? 'رجوع' : 'Back'}
            </button>
            <div class="auth-info-banner">
                <i class="fas fa-info-circle"></i>
                <span>${isAr ? 'سيتم توليد ID خاص بك من 6 أرقام. احتفظ به وكلمة السر في مكان آمن!' : 'A unique 6-digit ID will be generated. Keep it and your password safe!'}</span>
            </div>
            <div class="auth-field">
                <label>${isAr ? 'كلمة السر' : 'Password'}</label>
                <div class="auth-input-wrapper">
                    <input type="password" id="reg-password" class="auth-input" placeholder="${isAr ? '4 أحرف على الأقل' : 'At least 4 characters'}" autocomplete="new-password">
                    <button type="button" onclick="togglePasswordField('reg-password', this)" class="auth-toggle-pass" aria-label="إظهار/إخفاء"><i class="fas fa-eye"></i></button>
                </div>
            </div>
            <div class="auth-field">
                <label>${isAr ? 'تأكيد كلمة السر' : 'Confirm Password'}</label>
                <input type="password" id="reg-password-confirm" class="auth-input" placeholder="${isAr ? 'أعد كتابة كلمة السر' : 'Repeat password'}" autocomplete="new-password">
            </div>
            <p id="reg-error" class="auth-error hidden"></p>
            <button onclick="handleRegister()" id="reg-submit-btn" class="account-choice-btn primary auth-submit-btn">
                <i class="fas fa-check"></i>
                <span>${isAr ? 'إنشاء الحساب' : 'Create Account'}</span>
            </button>
        </div>
    `;
}

async function handleRegister() {
    const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');
    const pwd = document.getElementById('reg-password').value;
    const pwdConfirm = document.getElementById('reg-password-confirm').value;
    const errorEl = document.getElementById('reg-error');
    const btn = document.getElementById('reg-submit-btn');

    if (!pwd || !pwdConfirm) {
        showAuthError(errorEl, isAr ? '⚠️ الرجاء ملء جميع الحقول' : '⚠️ Please fill all fields');
        return;
    }
    if (pwd !== pwdConfirm) {
        showAuthError(errorEl, isAr ? '⚠️ كلمتا السر غير متطابقتين' : '⚠️ Passwords do not match');
        return;
    }
    if (pwd.length < 4) {
        showAuthError(errorEl, isAr ? '⚠️ كلمة السر قصيرة جداً (4 أحرف على الأقل)' : '⚠️ Password too short (min 4 chars)');
        return;
    }

    // تعطيل الزر أثناء المعالجة
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>' + (isAr ? 'جاري الإنشاء...' : 'Creating...') + '</span>'; }

    const result = await window.firebaseDB.registerUser(pwd);

    if (btn) { btn.disabled = false; }

    if (result.success) {
        renderRegisterSuccess(result.userId);
        updateDrawerIdState();
    } else {
        if (btn) btn.innerHTML = '<i class="fas fa-check"></i><span>' + (isAr ? 'إنشاء الحساب' : 'Create Account') + '</span>';
        const errMap = {
            'password_short': isAr ? 'كلمة السر قصيرة' : 'Password too short',
            'id_generation_failed': isAr ? 'تعذّر توليد ID، حاول مجدداً' : 'Failed to generate ID',
            'server_error': isAr ? 'خطأ في الخادم، حاول لاحقاً' : 'Server error'
        };
        showAuthError(errorEl, errMap[result.error] || (isAr ? 'حدث خطأ' : 'An error occurred'));
    }
}

function renderRegisterSuccess(userId) {
    const body = document.getElementById('account-modal-body');
    if (!body) return;
    const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');

    body.innerHTML = `
        <div class="auth-success">
            <div class="auth-success-icon">🎉</div>
            <h3>${isAr ? 'تم إنشاء حسابك!' : 'Account created!'}</h3>
            <p>${isAr ? 'احفظ هذا الـ ID، ستحتاجه لتسجيل الدخول:' : 'Save this ID, you need it to login:'}</p>
            <div class="auth-user-id-display">
                <span class="auth-id-label">ID</span>
                <span class="auth-id-value">${userId}</span>
                <button onclick="copyIdToClipboard('${userId}')" class="auth-copy-btn" aria-label="نسخ"><i class="fas fa-copy"></i></button>
            </div>
            <button onclick="closeAccountModal()" class="account-choice-btn primary">
                <i class="fas fa-check"></i>
                <span>${isAr ? 'تم، لنبدأ!' : 'Done, let\'s go!'}</span>
            </button>
        </div>
    `;

    // 🔄 تحديث القائمة الجانبية + الملف الشخصي
    updateDrawerIdState();
    if (typeof trackEvent === 'function') trackEvent('account_registered');
}

// ==================== LOGIN FORM ====================

function renderLoginForm() {
    const body = document.getElementById('account-modal-body');
    if (!body) return;
    const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');

    body.innerHTML = `
        <div class="auth-form">
            <button onclick="renderAuthChoice(document.getElementById('account-modal-body'))" class="auth-back-btn">
                <i class="fas fa-arrow-right"></i> ${isAr ? 'رجوع' : 'Back'}
            </button>
            <div class="auth-field">
                <label>${isAr ? 'الـ ID (6 أرقام)' : 'ID (6 digits)'}</label>
                <input type="text" id="login-id" class="auth-input" placeholder="123456" inputmode="numeric" maxlength="6" autocomplete="username">
            </div>
            <div class="auth-field">
                <label>${isAr ? 'كلمة السر' : 'Password'}</label>
                <div class="auth-input-wrapper">
                    <input type="password" id="login-password" class="auth-input" placeholder="${isAr ? 'كلمة السر' : 'Password'}" autocomplete="current-password">
                    <button type="button" onclick="togglePasswordField('login-password', this)" class="auth-toggle-pass" aria-label="إظهار/إخفاء"><i class="fas fa-eye"></i></button>
                </div>
            </div>
            <p id="login-error" class="auth-error hidden"></p>
            <button onclick="handleLogin()" id="login-submit-btn" class="account-choice-btn primary auth-submit-btn">
                <i class="fas fa-sign-in-alt"></i>
                <span>${isAr ? 'تسجيل الدخول' : 'Login'}</span>
            </button>
        </div>
    `;
}

async function handleLogin() {
    const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');
    const id = document.getElementById('login-id').value.trim();
    const pwd = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    const btn = document.getElementById('login-submit-btn');

    if (!id || !pwd) {
        showAuthError(errorEl, isAr ? '⚠️ الرجاء ملء جميع الحقول' : '⚠️ Please fill all fields');
        return;
    }

    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>' + (isAr ? 'جاري الدخول...' : 'Logging in...') + '</span>'; }

    const result = await window.firebaseDB.loginUser(id, pwd);

    if (btn) { btn.disabled = false; }

    if (result.success) {
        // مزامنة البيانات السحابية محلياً
        await applyCloudDataToLocal(result.userData);
        renderAccountInfo(document.getElementById('account-modal-body'));
        updateDrawerIdState();
        if (typeof showProfileNotification === 'function') {
            showProfileNotification(isAr ? '✅ تم تسجيل الدخول!' : '✅ Logged in!', 'success');
        }
        if (typeof trackEvent === 'function') trackEvent('account_login');
    } else {
        if (btn) btn.innerHTML = '<i class="fas fa-sign-in-alt"></i><span>' + (isAr ? 'تسجيل الدخول' : 'Login') + '</span>';
        const errMap = {
            'user_not_found': isAr ? '❌ هذا الـ ID غير موجود' : '❌ This ID does not exist',
            'wrong_password': isAr ? '❌ كلمة السر خاطئة' : '❌ Wrong password',
            'invalid_id_format': isAr ? '❌ الـ ID يجب أن يكون 6 أرقام' : '❌ ID must be 6 digits',
            'missing_fields': isAr ? '⚠️ الرجاء ملء جميع الحقول' : '⚠️ Please fill all fields'
        };
        showAuthError(errorEl, errMap[result.error] || (isAr ? 'حدث خطأ' : 'An error occurred'));
    }
}

// ==================== ACCOUNT INFO (معلومات الحساب بعد الدخول) ====================

async function renderAccountInfo(container) {
    const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');
    const userId = window.firebaseDB.getCurrentUserId();

    container.innerHTML = `
        <div class="account-info-loading">
            <i class="fas fa-spinner fa-spin"></i>
        </div>
    `;

    const data = await window.firebaseDB.fetchUserData(userId);
    if (!data) {
        container.innerHTML = `<p class="auth-error">${isAr ? 'تعذّر تحميل البيانات' : 'Failed to load data'}</p>`;
        return;
    }

    const isAdmin = !!data.isAdmin;
    const xp = data.xp || 0;
    const gems = data.gems || 0;
    const level = data.level || 1;

    let levelName = '';
    let levelIcon = '🌱';
    if (typeof config !== 'undefined' && config.xpSystem && config.xpSystem.levels[level]) {
        levelName = isAr ? config.xpSystem.levels[level].name.ar : config.xpSystem.levels[level].name.en;
        levelIcon = config.xpSystem.levels[level].icon;
    }

    let adminBadge = '';
    if (isAdmin) {
        adminBadge = `<span class="account-admin-badge"><i class="fas fa-crown"></i> ${isAr ? 'أدمن' : 'Admin'}</span>`;
    }

    container.innerHTML = `
        <div class="account-info">
            <div class="account-id-card">
                <div class="account-id-row">
                    <span class="account-id-label">ID</span>
                    <span class="account-id-value">${userId}</span>
                    <button onclick="copyIdToClipboard('${userId}')" class="auth-copy-btn" aria-label="نسخ"><i class="fas fa-copy"></i></button>
                </div>
                ${adminBadge}
            </div>

            <div class="account-stats-grid">
                <div class="account-stat">
                    <div class="account-stat-icon">💎</div>
                    <div class="account-stat-value">${gems}</div>
                    <div class="account-stat-label">${isAr ? 'جوهرة' : 'Gems'}</div>
                </div>
                <div class="account-stat">
                    <div class="account-stat-icon">${levelIcon}</div>
                    <div class="account-stat-value">${level}</div>
                    <div class="account-stat-label">${isAr ? 'المستوى' : 'Level'}</div>
                </div>
                <div class="account-stat">
                    <div class="account-stat-icon">⚡</div>
                    <div class="account-stat-value">${xp}</div>
                    <div class="account-stat-label">XP</div>
                </div>
            </div>

            ${isAdmin ? renderAdminPanel(isAr) : ''}

            <button onclick="handleLogout()" class="account-choice-btn danger auth-submit-btn">
                <i class="fas fa-sign-out-alt"></i>
                <span>${isAr ? 'تسجيل الخروج' : 'Logout'}</span>
            </button>
        </div>
    `;
}

// لوحة الأدمن (شحن جواهر)
function renderAdminPanel(isAr) {
    return `
        <div class="admin-panel">
            <h4 class="admin-panel-title"><i class="fas fa-crown"></i> ${isAr ? 'لوحة الأدمن' : 'Admin Panel'}</h4>
            <div class="auth-field">
                <label>${isAr ? 'ID المستلم' : 'Recipient ID'}</label>
                <input type="text" id="admin-target-id" class="auth-input" placeholder="123456" inputmode="numeric" maxlength="6">
            </div>
            <div class="auth-field">
                <label>${isAr ? 'كمية الجواهر' : 'Gems amount'}</label>
                <input type="number" id="admin-gems-amount" class="auth-input" placeholder="100" min="1">
            </div>
            <p id="admin-result" class="auth-error hidden"></p>
            <button onclick="handleAdminGift()" class="account-choice-btn primary auth-submit-btn">
                <i class="fas fa-gem"></i>
                <span>${isAr ? 'شحن الجواهر' : 'Send Gems'}</span>
            </button>
        </div>
    `;
}

async function handleAdminGift() {
    const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');
    const targetId = document.getElementById('admin-target-id').value.trim();
    const amount = parseInt(document.getElementById('admin-gems-amount').value, 10);
    const resultEl = document.getElementById('admin-result');

    if (!targetId || !amount || amount <= 0) {
        showAuthError(resultEl, isAr ? '⚠️ أدخل ID وكمية صحيحة' : '⚠️ Enter valid ID and amount');
        return;
    }

    const result = await window.firebaseDB.addGemsToUser(targetId.replace(/\D/g, ''), amount);

    if (result.success) {
        showAuthSuccess(resultEl, isAr ? `✅ تم شحن ${amount} جوهرة لـ ${targetId}` : `✅ Sent ${amount} gems to ${targetId}`);
        document.getElementById('admin-target-id').value = '';
        document.getElementById('admin-gems-amount').value = '';
        if (typeof trackEvent === 'function') trackEvent('admin_gift_gems', { target: targetId, amount: amount });
    } else {
        const errMap = {
            'unauthorized': isAr ? '❌ لا تملك صلاحية الأدمن' : '❌ Not authorized',
            'user_not_found': isAr ? '❌ الـ ID غير موجود' : '❌ ID not found',
            'invalid_amount': isAr ? '❌ كمية غير صحيحة' : '❌ Invalid amount'
        };
        showAuthError(resultEl, errMap[result.error] || (isAr ? 'حدث خطأ' : 'Error'));
    }
}

function handleLogout() {
    const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');
    window.firebaseDB.logoutUser();
    renderAuthChoice(document.getElementById('account-modal-body'));
    updateDrawerIdState();
    if (typeof showProfileNotification === 'function') {
        showProfileNotification(isAr ? '👋 تم تسجيل الخروج' : '👋 Logged out', 'success');
    }
}

// ==================== HELPERS ====================

function showAuthError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden', 'success');
    el.classList.add('error');
}

function showAuthSuccess(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden', 'error');
    el.classList.add('success');
}

function togglePasswordField(id, btn) {
    const field = document.getElementById(id);
    if (!field) return;
    const icon = btn.querySelector('i');
    if (field.type === 'password') {
        field.type = 'text';
        if (icon) icon.className = 'fas fa-eye-slash';
    } else {
        field.type = 'password';
        if (icon) icon.className = 'fas fa-eye';
    }
}

function copyIdToClipboard(id) {
    navigator.clipboard.writeText(id).then(() => {
        const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');
        if (typeof showProfileNotification === 'function') {
            showProfileNotification(isAr ? '📋 تم نسخ الـ ID' : '📋 ID copied', 'success');
        }
    }).catch(() => {});
}

// مزامنة البيانات السحابية إلى localStorage عند الدخول
async function applyCloudDataToLocal(cloudData) {
    try {
        if (!cloudData) return;
        // XP و gems و level من السحابة
        if (typeof cloudData.xp === 'number') localStorage.setItem('quiz_xp', String(cloudData.xp));
        if (typeof cloudData.gems === 'number') localStorage.setItem('quiz_gems', String(cloudData.gems));
        if (typeof cloudData.level === 'number') localStorage.setItem('quiz_level', String(cloudData.level));
        // الإحصائيات (إن وُجدت في السحابة)
        if (cloudData.stats) localStorage.setItem('quiz_stats', JSON.stringify(cloudData.stats));
        if (cloudData.achievements) localStorage.setItem('quiz_achievements', JSON.stringify(cloudData.achievements));
        if (cloudData.cards) localStorage.setItem('quiz_cards', JSON.stringify(cloudData.cards));
        // تحديث الواجهة
        if (typeof renderXPBar === 'function') renderXPBar();
        if (typeof updateDrawerContent === 'function') updateDrawerContent();
    } catch (e) {
        console.warn('applyCloudDataToLocal error:', e);
    }
}

// تحديث حالة زر ID في القائمة الجانبية
function updateDrawerIdState() {
    const btn = document.getElementById('drawer-id-btn');
    const text = document.getElementById('drawer-id-text');
    if (!btn || !text) return;
    const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');

    if (window.firebaseDB && window.firebaseDB.isLoggedIn()) {
        const id = window.firebaseDB.getCurrentUserId();
        text.textContent = (isAr ? 'الحساب: ' : 'Account: ') + id;
        btn.classList.add('logged-in');
    } else {
        text.textContent = isAr ? 'حسابي (ID)' : 'My Account (ID)';
        btn.classList.remove('logged-in');
    }
}

// تهيئة عند تحميل DOM
document.addEventListener('DOMContentLoaded', () => {
    updateDrawerIdState();
});
