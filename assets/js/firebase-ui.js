/**
 * 🎨 QuizMagic Account UI
 * واجهة التسجيل/الدخول وعرض معلومات الحساب + لوحة الأدمن
 * (تعمل مع Supabase عبر window.firebaseDB)
 */

// ==================== ACCOUNT MODAL ====================

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

// ==================== AUTH CHOICE ====================

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
            'insert_failed': isAr ? 'تعذّر حفظ الحساب (تحقق من قاعدة البيانات)' : 'Failed to save account',
            'server_error': isAr ? 'خطأ في الخادم، حاول لاحقاً' : 'Server error'
        };
        showAuthError(errorEl, errMap[result.error] || (isAr ? 'حدث خطأ: ' + (result.details || '') : 'Error: ' + (result.details || '')));
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
            'banned_permanent': isAr ? '🚫 تم حظرك دائماً' : '🚫 You are permanently banned',
            'banned_temporary': isAr ? '⏰ تم حظرك مؤقتاً' : '⏰ You are temporarily banned',
            'missing_fields': isAr ? '⚠️ الرجاء ملء جميع الحقول' : '⚠️ Please fill all fields'
        };
        showAuthError(errorEl, errMap[result.error] || (isAr ? 'حدث خطأ' : 'An error occurred'));
    }
}

// ==================== ACCOUNT INFO ====================

async function renderAccountInfo(container) {
    const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');
    const userId = window.firebaseDB.getCurrentUserId();

    container.innerHTML = `<div class="account-info-loading"><i class="fas fa-spinner fa-spin"></i></div>`;

    const data = await window.firebaseDB.fetchUserData(userId);
    if (!data) {
        container.innerHTML = `<p class="auth-error error">${isAr ? 'تعذّر تحميل البيانات' : 'Failed to load data'}</p>`;
        return;
    }

    const isAdmin = !!data.is_admin;
    const xp = data.xp || 0;
    const gems = data.gems || 0;
    const level = data.level || 1;
    const isMod = data.mod_permissions && Object.keys(data.mod_permissions).length > 0;

    let levelName = '';
    let levelIcon = '🌱';
    if (typeof config !== 'undefined' && config.xpSystem && config.xpSystem.levels[level]) {
        levelName = isAr ? config.xpSystem.levels[level].name.ar : config.xpSystem.levels[level].name.en;
        levelIcon = config.xpSystem.levels[level].icon;
    }

    let roleBadge = '';
    if (isAdmin) {
        roleBadge = `<span class="account-admin-badge"><i class="fas fa-crown"></i> ${isAr ? 'أدمن' : 'Admin'}</span>`;
    } else if (isMod) {
        roleBadge = `<span class="account-admin-badge" style="background:linear-gradient(135deg,#22d3ee,#3b82f6);color:#fff"><i class="fas fa-shield-alt"></i> ${isAr ? 'مشرف' : 'Mod'}</span>`;
    }

    container.innerHTML = `
        <div class="account-info">
            <div class="account-id-card">
                <div class="account-id-row">
                    <span class="account-id-label">ID</span>
                    <span class="account-id-value">${userId}</span>
                    <button onclick="copyIdToClipboard('${userId}')" class="auth-copy-btn" aria-label="نسخ"><i class="fas fa-copy"></i></button>
                </div>
                ${roleBadge}
            </div>

            <div class="account-stats-grid">
                <div class="account-stat"><div class="account-stat-icon">💎</div><div class="account-stat-value">${gems}</div><div class="account-stat-label">${isAr ? 'جوهرة' : 'Gems'}</div></div>
                <div class="account-stat"><div class="account-stat-icon">${levelIcon}</div><div class="account-stat-value">${level}</div><div class="account-stat-label">${isAr ? 'المستوى' : 'Level'}</div></div>
                <div class="account-stat"><div class="account-stat-icon">⚡</div><div class="account-stat-value">${xp}</div><div class="account-stat-label">XP</div></div>
            </div>

            ${(isAdmin || isMod) ? renderAdminPanel(isAr) : ''}

            <button onclick="handleLogout()" class="account-choice-btn danger auth-submit-btn">
                <i class="fas fa-sign-out-alt"></i>
                <span>${isAr ? 'تسجيل الخروج' : 'Logout'}</span>
            </button>
        </div>
    `;
}

// ==================== ADMIN PANEL (تابات) ====================

function renderAdminPanel(isAr) {
    return `
        <div class="admin-panel pro-admin-panel">
            <h4 class="admin-panel-title"><i class="fas fa-crown"></i> ${isAr ? 'لوحة التحكم' : 'Control Panel'}</h4>
            <div class="admin-tabs">
                <button onclick="switchAdminTab('gems', this)" class="admin-tab active" data-tab="gems">💎 <span>${isAr ? 'جواهر' : 'Gems'}</span></button>
                <button onclick="switchAdminTab('xp', this)" class="admin-tab" data-tab="xp">⚡ <span>${isAr ? 'XP/مستوى' : 'XP/Level'}</span></button>
                <button onclick="switchAdminTab('users', this)" class="admin-tab" data-tab="users">📋 <span>${isAr ? 'مستخدمون' : 'Users'}</span></button>
                <button onclick="switchAdminTab('ban', this)" class="admin-tab" data-tab="ban">🚫 <span>${isAr ? 'حظر' : 'Ban'}</span></button>
                <button onclick="switchAdminTab('staff', this)" class="admin-tab" data-tab="staff">👑 <span>${isAr ? 'إدارة' : 'Staff'}</span></button>
                <button onclick="switchAdminTab('stats', this)" class="admin-tab" data-tab="stats">📊 <span>${isAr ? 'إحصائيات' : 'Stats'}</span></button>
            </div>
            <div id="admin-tab-content" class="admin-tab-content">
                <div class="account-info-loading"><i class="fas fa-spinner fa-spin"></i></div>
            </div>
        </div>
    `;
}

function switchAdminTab(tabName, btn) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const content = document.getElementById('admin-tab-content');
    if (!content) return;
    const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');

    const renderers = {
        gems: () => renderAdminGemsTab(isAr),
        xp: () => renderAdminXPTab(isAr),
        users: () => { renderAdminUsersTab(isAr); return null; },
        ban: () => renderAdminBanTab(isAr),
        staff: () => renderAdminStaffTab(isAr),
        stats: () => { renderAdminStatsTab(isAr); return null; }
    };

    const html = renderers[tabName] ? renderers[tabName]() : '';
    if (html !== null) content.innerHTML = html;
}

function renderAdminGemsTab(isAr) {
    return `
        <div class="admin-section">
            <div class="admin-action-grid">
                <div class="admin-action-card">
                    <h5><i class="fas fa-gem" style="color:#22d3ee"></i> ${isAr ? 'شحن جواهر' : 'Gift Gems'}</h5>
                    <input type="text" id="gift-target-id" class="auth-input" placeholder="${isAr ? 'ID المستلم' : 'Recipient ID'}" inputmode="numeric" maxlength="6">
                    <input type="number" id="gift-amount" class="auth-input" placeholder="${isAr ? 'الكمية' : 'Amount'}" min="1">
                    <button onclick="handleAdminAction('giftGems')" class="admin-action-btn primary"><i class="fas fa-paper-plane"></i> ${isAr ? 'إرسال' : 'Send'}</button>
                </div>
                <div class="admin-action-card">
                    <h5><i class="fas fa-minus-circle" style="color:#f87171"></i> ${isAr ? 'سحب جواهر' : 'Remove Gems'}</h5>
                    <input type="text" id="remove-target-id" class="auth-input" placeholder="${isAr ? 'ID المستهدف' : 'Target ID'}" inputmode="numeric" maxlength="6">
                    <input type="number" id="remove-amount" class="auth-input" placeholder="${isAr ? 'الكمية' : 'Amount'}" min="1">
                    <button onclick="handleAdminAction('removeGems')" class="admin-action-btn danger"><i class="fas fa-minus"></i> ${isAr ? 'سحب' : 'Remove'}</button>
                </div>
            </div>
            <div id="admin-gems-result" class="auth-error hidden"></div>
        </div>
    `;
}

function renderAdminXPTab(isAr) {
    return `
        <div class="admin-section">
            <div class="admin-action-grid">
                <div class="admin-action-card">
                    <h5><i class="fas fa-bolt" style="color:#fbbf24"></i> ${isAr ? 'تعيين XP' : 'Set XP'}</h5>
                    <input type="text" id="xp-target-id" class="auth-input" placeholder="${isAr ? 'ID' : 'ID'}" inputmode="numeric" maxlength="6">
                    <input type="number" id="xp-amount" class="auth-input" placeholder="${isAr ? 'XP الجديد' : 'New XP'}" min="0">
                    <button onclick="handleAdminAction('setXP')" class="admin-action-btn primary"><i class="fas fa-check"></i> ${isAr ? 'تطبيق' : 'Apply'}</button>
                </div>
                <div class="admin-action-card">
                    <h5><i class="fas fa-medal" style="color:#a855f7"></i> ${isAr ? 'تعيين مستوى' : 'Set Level'}</h5>
                    <input type="text" id="level-target-id" class="auth-input" placeholder="${isAr ? 'ID' : 'ID'}" inputmode="numeric" maxlength="6">
                    <select id="level-value" class="auth-input">
                        <option value="1">1 - ${isAr ? 'مبتدئ' : 'Novice'} 🌱</option>
                        <option value="2">2 - ${isAr ? 'مستكشف' : 'Explorer'} 🧭</option>
                        <option value="3">3 - ${isAr ? 'محارب' : 'Warrior'} ⚔️</option>
                        <option value="4">4 - ${isAr ? 'بطل' : 'Champion'} 👑</option>
                        <option value="5">5 - ${isAr ? 'أسطورة' : 'Legend'} 🐉</option>
                    </select>
                    <button onclick="handleAdminAction('setLevel')" class="admin-action-btn primary"><i class="fas fa-check"></i> ${isAr ? 'تطبيق' : 'Apply'}</button>
                </div>
            </div>
            <div id="admin-xp-result" class="auth-error hidden"></div>
        </div>
    `;
}

async function renderAdminUsersTab(isAr) {
    const content = document.getElementById('admin-tab-content');
    if (!content) return;
    content.innerHTML = `<div class="account-info-loading"><i class="fas fa-spinner fa-spin"></i></div>`;

    const result = await window.firebaseDB.getAllUsers();
    if (!result.success) {
        content.innerHTML = `<p class="auth-error error">${result.error || (isAr ? '❌ تعذّر التحميل' : '❌ Failed to load')}</p>`;
        return;
    }

    let rows = '';
    result.users.forEach(u => {
        const role = u.is_admin ? '👑' : (u.mod_permissions && Object.keys(u.mod_permissions).length ? '🛡️' : '👤');
        const status = u.banned ? '🚫' : '✅';
        rows += `<tr onclick="showUserDetails('${u.id}')" style="cursor:pointer">
            <td><strong>${u.id}</strong></td><td>${role}</td>
            <td>💎 ${u.gems||0}</td><td>⚡ ${u.xp||0}</td>
            <td>L${u.level||1}</td><td>${status}</td></tr>`;
    });

    content.innerHTML = `
        <div class="admin-users-wrap">
            <div class="admin-search-bar">
                <input type="text" id="users-search" class="auth-input" placeholder="${isAr ? '🔍 بحث بالـ ID...' : '🔍 Search by ID...'}" oninput="filterUsersTable(this.value)">
            </div>
            <p class="admin-count">${isAr ? 'إجمالي المستخدمين' : 'Total users'}: ${result.count}</p>
            <div class="admin-table-wrap">
                <table class="admin-table" id="users-table">
                    <thead><tr><th>ID</th><th>${isAr ? 'النوع' : 'Role'}</th><th>💎</th><th>⚡</th><th>${isAr ? 'مستوى' : 'Lvl'}</th><th>${isAr ? 'حالة' : 'Status'}</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        </div>`;
}

function filterUsersTable(query) {
    const table = document.getElementById('users-table');
    if (!table) return;
    const rows = table.querySelectorAll('tbody tr');
    const q = query.trim().toLowerCase();
    rows.forEach(row => {
        row.style.display = row.cells[0].textContent.toLowerCase().includes(q) ? '' : 'none';
    });
}

async function showUserDetails(userId) {
    const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');
    const result = await window.firebaseDB.searchUserById(userId);
    if (!result.success) return;

    const u = result.userData;
    const myData = await window.firebaseDB.fetchUserData();
    const isAdmin = myData && myData.is_admin;

    let roleBadge = '';
    if (u.is_admin) roleBadge = `<span class="account-admin-badge"><i class="fas fa-crown"></i> ${isAr ? 'أدمن' : 'Admin'}</span>`;
    else if (u.mod_permissions && Object.keys(u.mod_permissions).length) roleBadge = `<span class="account-admin-badge" style="background:linear-gradient(135deg,#22d3ee,#3b82f6);color:#fff"><i class="fas fa-shield-alt"></i> ${isAr ? 'مشرف' : 'Mod'}</span>`;

    const banStatus = u.banned ? `🚫 ${isAr ? 'محظور' : 'Banned'}` : `✅ ${isAr ? 'نشط' : 'Active'}`;

    const body = document.getElementById('account-modal-body');
    body.innerHTML = `
        <div class="account-info">
            <button onclick="renderAccountInfo(document.getElementById('account-modal-body'))" class="auth-back-btn">
                <i class="fas fa-arrow-right"></i> ${isAr ? 'رجوع للوحة' : 'Back to panel'}
            </button>
            <div class="account-id-card">
                <div class="account-id-row"><span class="account-id-label">ID</span><span class="account-id-value">${userId}</span></div>
                ${roleBadge}
            </div>
            <div class="account-stats-grid">
                <div class="account-stat"><div class="account-stat-icon">💎</div><div class="account-stat-value">${u.gems||0}</div><div class="account-stat-label">${isAr?'جوهرة':'Gems'}</div></div>
                <div class="account-stat"><div class="account-stat-icon">⚡</div><div class="account-stat-value">${u.xp||0}</div><div class="account-stat-label">XP</div></div>
                <div class="account-stat"><div class="account-stat-icon">🎮</div><div class="account-stat-value">${u.level||1}</div><div class="account-stat-label">${isAr?'مستوى':'Level'}</div></div>
            </div>
            <p style="text-align:center;font-size:0.85rem;color:var(--text-secondary)">${isAr?'الحالة':'Status'}: <strong>${banStatus}</strong></p>
            ${isAdmin ? `
                <div class="admin-quick-actions">
                    <button onclick="adminQuickGift('${userId}')" class="admin-action-btn primary"><i class="fas fa-gem"></i> ${isAr?'شحن جواهر':'Gift Gems'}</button>
                    <button onclick="adminQuickBan('${userId}')" class="admin-action-btn danger"><i class="fas fa-ban"></i> ${isAr?'حظر':'Ban'}</button>
                    <button onclick="adminResetPassword('${userId}')" class="admin-action-btn"><i class="fas fa-key"></i> ${isAr?'إعادة كلمة سر':'Reset Pwd'}</button>
                    ${u.is_admin ? '' : `<button onclick="adminQuickDelete('${userId}')" class="admin-action-btn danger"><i class="fas fa-trash"></i> ${isAr?'حذف':'Delete'}</button>`}
                </div>` : ''}
        </div>`;
}

function renderAdminBanTab(isAr) {
    return `
        <div class="admin-section">
            <div class="admin-action-grid">
                <div class="admin-action-card">
                    <h5><i class="fas fa-ban" style="color:#ef4444"></i> ${isAr ? 'حظر دائم' : 'Permanent Ban'}</h5>
                    <input type="text" id="ban-target-id" class="auth-input" placeholder="${isAr ? 'ID' : 'ID'}" inputmode="numeric" maxlength="6">
                    <input type="text" id="ban-reason" class="auth-input" placeholder="${isAr ? 'السبب (اختياري)' : 'Reason (optional)'}">
                    <button onclick="handleAdminAction('ban')" class="admin-action-btn danger"><i class="fas fa-ban"></i> ${isAr ? 'حظر' : 'Ban'}</button>
                </div>
                <div class="admin-action-card">
                    <h5><i class="fas fa-clock" style="color:#f59e0b"></i> ${isAr ? 'حظر مؤقت' : 'Temporary Ban'}</h5>
                    <input type="text" id="tempban-target-id" class="auth-input" placeholder="${isAr ? 'ID' : 'ID'}" inputmode="numeric" maxlength="6">
                    <div class="admin-duration-row">
                        <input type="number" id="tempban-duration" class="auth-input" placeholder="${isAr ? 'المدة' : 'Duration'}" min="1" style="flex:1">
                        <select id="tempban-unit" class="auth-input" style="flex:1;max-width:90px">
                            <option value="hours">${isAr ? 'ساعات' : 'Hours'}</option>
                            <option value="days">${isAr ? 'أيام' : 'Days'}</option>
                            <option value="weeks">${isAr ? 'أسابيع' : 'Weeks'}</option>
                        </select>
                    </div>
                    <button onclick="handleAdminAction('tempBan')" class="admin-action-btn danger"><i class="fas fa-hourglass"></i> ${isAr ? 'حظر مؤقت' : 'Temp Ban'}</button>
                </div>
                <div class="admin-action-card">
                    <h5><i class="fas fa-unlock" style="color:#22c55e"></i> ${isAr ? 'إلغاء حظر' : 'Unban'}</h5>
                    <input type="text" id="unban-target-id" class="auth-input" placeholder="${isAr ? 'ID' : 'ID'}" inputmode="numeric" maxlength="6">
                    <button onclick="handleAdminAction('unban')" class="admin-action-btn primary"><i class="fas fa-unlock"></i> ${isAr ? 'إلغاء' : 'Unban'}</button>
                </div>
            </div>
            <div id="admin-ban-result" class="auth-error hidden"></div>
        </div>`;
}

function renderAdminStaffTab(isAr) {
    return `
        <div class="admin-section">
            <div class="admin-action-grid">
                <div class="admin-action-card">
                    <h5><i class="fas fa-user-shield" style="color:#22d3ee"></i> ${isAr ? 'تعيين مشرف' : 'Set Moderator'}</h5>
                    <input type="text" id="mod-target-id" class="auth-input" placeholder="${isAr ? 'ID' : 'ID'}" inputmode="numeric" maxlength="6">
                    <p style="font-size:0.75rem;color:var(--text-muted);margin:0.3rem 0">${isAr ? 'اختر الصلاحيات:' : 'Select permissions:'}</p>
                    <div class="mod-perms-grid" id="mod-perms-grid">${renderModPermsCheckboxes(isAr)}</div>
                    <button onclick="handleAdminAction('setMod')" class="admin-action-btn primary"><i class="fas fa-save"></i> ${isAr ? 'حفظ' : 'Save'}</button>
                </div>
                <div class="admin-action-card">
                    <h5><i class="fas fa-crown" style="color:#fbbf24"></i> ${isAr ? 'تعيين أدمن' : 'Set Admin'}</h5>
                    <input type="text" id="admin-target-id-input" class="auth-input" placeholder="${isAr ? 'ID' : 'ID'}" inputmode="numeric" maxlength="6">
                    <div class="admin-duration-row">
                        <button onclick="handleAdminAction('makeAdmin')" class="admin-action-btn primary" style="flex:1"><i class="fas fa-crown"></i> ${isAr ? 'جعله أدمن' : 'Make'}</button>
                        <button onclick="handleAdminAction('removeAdmin')" class="admin-action-btn danger" style="flex:1"><i class="fas fa-crown"></i> ${isAr ? 'إزالة' : 'Remove'}</button>
                    </div>
                </div>
            </div>
            <div id="admin-staff-result" class="auth-error hidden"></div>
        </div>`;
}

function renderModPermsCheckboxes(isAr) {
    const perms = window.firebaseDB.MOD_PERMISSIONS || {};
    let html = '';
    for (const [key, val] of Object.entries(perms)) {
        html += `<label class="mod-perm-item"><input type="checkbox" class="mod-perm-check" value="${key}"><span>${isAr ? val.ar : val.en}</span></label>`;
    }
    return html;
}

async function renderAdminStatsTab(isAr) {
    const content = document.getElementById('admin-tab-content');
    if (!content) return;
    content.innerHTML = `<div class="account-info-loading"><i class="fas fa-spinner fa-spin"></i></div>`;

    const result = await window.firebaseDB.getSiteStats();
    if (!result.success) {
        content.innerHTML = `<p class="auth-error error">${result.error || (isAr ? '❌ تحتاج صلاحية أدمن' : '❌ Admin only')}</p>`;
        return;
    }
    const s = result.stats || result;
    content.innerHTML = `
        <div class="admin-stats-grid">
            <div class="admin-stat-big"><div class="as-icon">👥</div><div class="as-value">${s.total_users||0}</div><div class="as-label">${isAr?'مستخدم':'Users'}</div></div>
            <div class="admin-stat-big"><div class="as-icon">💎</div><div class="as-value">${s.total_gems||0}</div><div class="as-label">${isAr?'جواهر':'Gems'}</div></div>
            <div class="admin-stat-big"><div class="as-icon">⚡</div><div class="as-value">${s.total_xp||0}</div><div class="as-label">XP</div></div>
            <div class="admin-stat-big"><div class="as-icon">👑</div><div class="as-value">${s.admins_count||0}</div><div class="as-label">${isAr?'أدمن':'Admins'}</div></div>
            <div class="admin-stat-big"><div class="as-icon">🛡️</div><div class="as-value">${s.mods_count||0}</div><div class="as-label">${isAr?'مشرفون':'Mods'}</div></div>
            <div class="admin-stat-big"><div class="as-icon">🚫</div><div class="as-value">${s.banned_count||0}</div><div class="as-label">${isAr?'محظورون':'Banned'}</div></div>
        </div>`;
}

// ===== معالج الإجراءات الموحّد =====
async function handleAdminAction(action) {
    const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');
    const container = getActionResultContainer(action);
    const resultEl = document.getElementById(`admin-${container}-result`) || document.getElementById('admin-gems-result');
    const val = (id) => (document.getElementById(id) || {}).value;

    let result = { success: false, error: 'invalid' };
    let targetId = '';

    switch (action) {
        case 'giftGems':
            targetId = (val('gift-target-id') || '').replace(/\D/g, '');
            result = await window.firebaseDB.addGemsToUser(targetId, parseInt(val('gift-amount'), 10) || 0);
            break;
        case 'removeGems':
            targetId = (val('remove-target-id') || '').replace(/\D/g, '');
            result = await window.firebaseDB.removeGemsFromUser(targetId, parseInt(val('remove-amount'), 10) || 0);
            break;
        case 'setXP':
            targetId = (val('xp-target-id') || '').replace(/\D/g, '');
            result = await window.firebaseDB.setUserXP(targetId, val('xp-amount'));
            break;
        case 'setLevel':
            targetId = (val('level-target-id') || '').replace(/\D/g, '');
            result = await window.firebaseDB.setUserLevel(targetId, val('level-value'));
            break;
        case 'ban':
            targetId = (val('ban-target-id') || '').replace(/\D/g, '');
            result = await window.firebaseDB.banUser(targetId, val('ban-reason'));
            break;
        case 'tempBan': {
            targetId = (val('tempban-target-id') || '').replace(/\D/g, '');
            const dur = parseInt(val('tempban-duration'), 10) || 0;
            const unit = val('tempban-unit');
            let ms = dur * 3600000;
            if (unit === 'days') ms = dur * 86400000;
            if (unit === 'weeks') ms = dur * 604800000;
            result = await window.firebaseDB.tempBanUser(targetId, ms, '');
            break;
        }
        case 'unban':
            targetId = (val('unban-target-id') || '').replace(/\D/g, '');
            result = await window.firebaseDB.unbanUser(targetId);
            break;
        case 'setMod': {
            targetId = (val('mod-target-id') || '').replace(/\D/g, '');
            const checks = document.querySelectorAll('.mod-perm-check:checked');
            const perms = {};
            checks.forEach(c => perms[c.value] = true);
            result = await window.firebaseDB.setModerator(targetId, perms);
            break;
        }
        case 'makeAdmin':
            targetId = (val('admin-target-id-input') || '').replace(/\D/g, '');
            result = await window.firebaseDB.setAdmin(targetId, true);
            break;
        case 'removeAdmin':
            targetId = (val('admin-target-id-input') || '').replace(/\D/g, '');
            result = await window.firebaseDB.setAdmin(targetId, false);
            break;
    }

    if (result && result.success) {
        showAuthSuccess(resultEl, isAr ? `✅ تم بنجاح (${targetId})` : `✅ Done (${targetId})`);
        if (typeof trackEvent === 'function') trackEvent('admin_action', { action, target: targetId });
    } else {
        showAuthError(resultEl, (isAr ? '❌ خطأ: ' : '❌ Error: ') + (result.error || ''));
    }
}

function getActionResultContainer(action) {
    if (['giftGems','removeGems'].includes(action)) return 'gems';
    if (['setXP','setLevel'].includes(action)) return 'xp';
    if (['ban','tempBan','unban'].includes(action)) return 'ban';
    if (['setMod','makeAdmin','removeAdmin'].includes(action)) return 'staff';
    return 'gems';
}

// ===== إجراءات سريعة =====
async function adminQuickGift(userId) {
    const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');
    const amountStr = prompt(isAr ? `كم جوهرة تريد شحنها لـ ${userId}؟` : `How many gems to gift ${userId}?`, '100');
    if (!amountStr) return;
    const result = await window.firebaseDB.addGemsToUser(userId, parseInt(amountStr, 10) || 0);
    alert(result.success ? (isAr ? '✅ تم الشحن' : '✅ Done') : (isAr ? '❌ فشل' : '❌ Failed'));
    showUserDetails(userId);
}

async function adminQuickBan(userId) {
    const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');
    const reason = prompt(isAr ? `سبب حظر ${userId}؟` : `Ban reason for ${userId}?`, '');
    const result = await window.firebaseDB.banUser(userId, reason || '');
    alert(result.success ? (isAr ? '🚫 تم الحظر' : '🚫 Banned') : (isAr ? '❌ فشل' : '❌ Failed'));
    showUserDetails(userId);
}

async function adminResetPassword(userId) {
    const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');
    const newPwd = prompt(isAr ? `كلمة السر الجديدة لـ ${userId}؟` : `New password for ${userId}?`, '');
    if (!newPwd) return;
    const result = await window.firebaseDB.resetUserPassword(userId, newPwd);
    alert(result.success ? (isAr ? '🔑 تم التعيين' : '🔑 Reset done') : (isAr ? '❌ فشل' : '❌ Failed'));
}

async function adminQuickDelete(userId) {
    const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');
    if (!confirm(isAr ? `⚠️ حذف ${userId} نهائياً؟ لا يمكن التراجع!` : `⚠️ Permanently delete ${userId}?`)) return;
    const result = await window.firebaseDB.deleteUserPermanent(userId);
    alert(result.success ? (isAr ? '🗑️ تم الحذف' : '🗑️ Deleted') : (isAr ? '❌ فشل' : '❌ Failed'));
    renderAccountInfo(document.getElementById('account-modal-body'));
}

// ===== HELPERS =====

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

async function applyCloudDataToLocal(cloudData) {
    try {
        if (!cloudData) return;
        // Supabase يستخدم snake_case
        if (typeof cloudData.xp === 'number') localStorage.setItem('quiz_xp', String(cloudData.xp));
        if (typeof cloudData.gems === 'number') localStorage.setItem('quiz_gems', String(cloudData.gems));
        if (typeof cloudData.level === 'number') localStorage.setItem('quiz_level', String(cloudData.level));
        if (cloudData.stats) localStorage.setItem('quiz_stats', JSON.stringify(cloudData.stats));
        if (cloudData.achievements) localStorage.setItem('quiz_achievements', JSON.stringify(cloudData.achievements));
        if (cloudData.cards) localStorage.setItem('quiz_cards', JSON.stringify(cloudData.cards));
        if (typeof renderXPBar === 'function') renderXPBar();
        if (typeof updateDrawerContent === 'function') updateDrawerContent();
    } catch (e) {
        console.warn('applyCloudDataToLocal error:', e);
    }
}

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

document.addEventListener('DOMContentLoaded', () => {
    updateDrawerIdState();
});
