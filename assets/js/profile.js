/**
 * 👤 QuizMagic Profile Manager
 * نظام إدارة الملفات الشخصية (تصدير، استيراد، حذف، عرض الإحصائيات)
 */

// ==================== PROFILE MODAL ====================
function showProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (!modal) return;

    renderProfileStats();
    // 🎮 عرض شريط XP
    if (typeof renderXPBar === 'function') renderXPBar();
    modal.classList.add('show');

    // 🔄 جلب أحدث البيانات من السحابة وتحديث الواجهة
    if (window.firebaseDB && window.firebaseDB.isLoggedIn()) {
        window.firebaseDB.fetchUserData().then(cloudData => {
            if (cloudData) {
                // تحديث الواجهة بالبيانات الجديدة
                renderProfileStats();
                if (typeof renderXPBar === 'function') renderXPBar();
            }
        }).catch(() => {});
    }
    
    // ♿ Focus Trap
    if (typeof trapFocus === 'function') trapFocus(modal);

    // ♿ Accessibility: Focus on close button
    setTimeout(() => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
    }, 100);
}

function closeProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (!modal) return;
    modal.classList.remove('show');

    // ♿ إزالة Focus Trap
    if (typeof removeFocusTrap === 'function') removeFocusTrap(modal);
}

// ==================== RENDER STATISTICS ====================
function renderProfileStats() {
    const statsContainer = document.getElementById('profile-stats-grid');
    const detailsContainer = document.getElementById('profile-details');
    if (!statsContainer || !detailsContainer) return;
    
    const isAr = currentLang === 'ar';
    const stats = getUserStats();
    const achievements = JSON.parse(localStorage.getItem('quiz_achievements') || '{}');
    
    // حساب الإحصائيات
    const totalQuizzes = stats.totalQuizzes || 0;
    const unlockedAchievements = Object.values(achievements).filter(a => a.unlocked).length;
    const totalAchievements = Object.keys(ACHIEVEMENTS).length;
    const fastestTime = stats.fastestQuiz ? formatTime(stats.fastestQuiz) : '--';
    const bestCompatibility = stats.bestCompatibility ? `${stats.bestCompatibility}%` : '--';
    const uniqueCreatures = stats.creatures ? Object.keys(stats.creatures).length : 0;
    
    // أكثر كائن حصولاً عليه
    let mostFrequentCreature = '--';
    if (stats.creatures && Object.keys(stats.creatures).length > 0) {
        const sorted = Object.entries(stats.creatures).sort((a, b) => b[1] - a[1]);
        const topCreatureId = sorted[0][0];
        const creature = findCreatureById(topCreatureId);
        if (creature) {
            mostFrequentCreature = isAr ? creature.name : creature.nameEn || creature.name;
        }
    }
    
    // عرض بطاقات الإحصائيات
    const rawUsername = (typeof getUsername === 'function') ? getUsername() : (localStorage.getItem('quiz_username') || '');
    // 🛡️ Escape username to prevent XSS via innerHTML
    const savedUsername = (typeof escapeHtml === 'function') ? escapeHtml(rawUsername) : rawUsername;
    const totalCards = (typeof getUserCards === 'function') ? Object.keys(getUserCards()).length : 0;

    statsContainer.innerHTML = `
        <div class="profile-stat-card profile-username-card">
            <div class="stat-icon">👤</div>
            <div class="stat-value" style="font-size: 1.1rem; word-break: break-word;">${savedUsername || (isAr ? 'زائر' : 'Guest')}</div>
            <div class="stat-label">${isAr ? 'اسم المستخدم' : 'Username'}</div>
        </div>
        <div class="profile-stat-card">
            <div class="stat-icon">🎭</div>
            <div class="stat-value">${totalQuizzes}</div>
            <div class="stat-label">${isAr ? 'اختبار مكتمل' : 'Quizzes Completed'}</div>
        </div>
        <div class="profile-stat-card">
            <div class="stat-icon">🏆</div>
            <div class="stat-value">${unlockedAchievements}/${totalAchievements}</div>
            <div class="stat-label">${isAr ? 'إنجازات مفتوحة' : 'Achievements Unlocked'}</div>
        </div>
        <div class="profile-stat-card">
            <div class="stat-icon">⚡</div>
            <div class="stat-value">${fastestTime}</div>
            <div class="stat-label">${isAr ? 'أسرع اختبار' : 'Fastest Quiz'}</div>
        </div>
        <div class="profile-stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-value">${bestCompatibility}</div>
            <div class="stat-label">${isAr ? 'أفضل توافق' : 'Best Compatibility'}</div>
        </div>
        <div class="profile-stat-card">
            <div class="stat-icon">🎨</div>
            <div class="stat-value">${uniqueCreatures}</div>
            <div class="stat-label">${isAr ? 'كائنات مختلفة' : 'Unique Creatures'}</div>
        </div>
        <div class="profile-stat-card profile-cards-card" onclick="showCardGalleryModal()" style="cursor:pointer; border: 1px solid var(--c-accent); box-shadow: 0 0 15px rgba(var(--c-accent-rgb), 0.2); transform: scale(1.02);">
            <div class="stat-icon">🃏</div>
            <div class="stat-value" style="color: var(--c-accent); text-shadow: 0 0 10px var(--c-accent);">${totalCards}</div>
            <div class="stat-label">${isAr ? 'عرض المعرض' : 'View Gallery'}</div>
        </div>

        <div class="profile-stat-card">
            <div class="stat-icon">🐉</div>
            <div class="stat-value" style="font-size: 1rem;">${mostFrequentCreature}</div>
            <div class="stat-label">${isAr ? 'أكثر كائن' : 'Most Frequent'}</div>
        </div>
        <div class="profile-stat-card profile-gems-card">
            <div class="stat-icon">💎</div>
            <div class="stat-value">${getGemsCount()}</div>
            <div class="stat-label">${isAr ? 'جوهرة' : 'Gems'}</div>
        </div>
        <div class="profile-stat-card profile-id-card" onclick="showAccountModal()" style="cursor:pointer">
            <div class="stat-icon">🆔</div>
            <div class="stat-value" style="font-size: 1.1rem;">${getProfileIdDisplay(isAr)}</div>
            <div class="stat-label">${isAr ? 'معرّف الحساب' : 'Account ID'}</div>
        </div>
    `;
    
    // عرض تفاصيل إضافية
    const totalShares = stats.shares || 0;
    const totalComparisons = stats.comparisons || 0;
    const totalSecretUnlocks = stats.secretUnlocks || 0;
    const visitDaysCount = stats.visitDays ? stats.visitDays.length : 0;
    
    detailsContainer.innerHTML = `
        <div class="profile-detail-item">
            <span class="detail-icon">🚀</span>
            <span class="detail-text">${isAr ? 'المشاركات:' : 'Shares:'}</span>
            <span class="detail-value">${totalShares}</span>
        </div>
        <div class="profile-detail-item">
            <span class="detail-icon">⚔️</span>
            <span class="detail-text">${isAr ? 'المقارنات مع الأصدقاء:' : 'Friend Comparisons:'}</span>
            <span class="detail-value">${totalComparisons}</span>
        </div>
        <div class="profile-detail-item">
            <span class="detail-icon">🔓</span>
            <span class="detail-text">${isAr ? 'التقارير السرية المفتوحة:' : 'Secret Reports Unlocked:'}</span>
            <span class="detail-value">${totalSecretUnlocks}</span>
        </div>
        <div class="profile-detail-item">
            <span class="detail-icon">📅</span>
            <span class="detail-text">${isAr ? 'أيام الاستخدام:' : 'Days Active:'}</span>
            <span class="detail-value">${visitDaysCount}</span>
        </div>
    `;
}

// ==================== HELPER FUNCTIONS ====================
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function findCreatureById(creatureId) {
    const data = quizzesData[currentLang];
    if (!data || !data.quizzes) return null;
    for (const quiz of data.quizzes) {
        const found = quiz.results.find(r => r.id === creatureId);
        if (found) return found;
    }
    return null;
}

// ==================== EXPORT DATA ====================
function exportUserData() {
    try {
        const isAr = currentLang === 'ar';
        
        // جمع جميع البيانات من localStorage
        const userData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            username: localStorage.getItem('quiz_username') || '',
            quizStats: JSON.parse(localStorage.getItem('quiz_stats') || '{}'),
            achievements: JSON.parse(localStorage.getItem('quiz_achievements') || '{}'),
            cards: JSON.parse(localStorage.getItem('quiz_cards') || '{}'),
            preferences: {
                language: localStorage.getItem('quiz_lang') || 'ar',
                theme: localStorage.getItem('quiz_theme') || 'auto',
                musicEnabled: localStorage.getItem('quiz_music_enabled') !== 'false',
                sfxEnabled: localStorage.getItem('quiz_sfx_enabled') !== 'false'
            }
        };
        
        // تحويل إلى JSON وتنزيله كملف
        const jsonString = JSON.stringify(userData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `QuizMagic-Profile-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // 📊 Analytics tracking
        if (typeof trackEvent === 'function') {
            trackEvent('profile_export', {
                'total_quizzes': userData.quizStats.totalQuizzes || 0,
                'achievements_count': Object.keys(userData.achievements).length
            });
        }
        
        showProfileNotification(
            isAr ? '✅ تم تصدير بياناتك بنجاح!' : '✅ Your data has been exported successfully!',
            'success'
        );
    } catch (error) {
        console.error('🛡️ Export failed:', error);
        const isAr = currentLang === 'ar';
        showProfileNotification(
            isAr ? '❌ فشل تصدير البيانات' : '❌ Export failed',
            'error'
        );
    }
}

// ==================== IMPORT DATA ====================
function importUserData() {
    const isAr = currentLang === 'ar';
    
    // إنشاء input file مخفي
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const text = await file.text();
            const userData = JSON.parse(text);
            
            // التحقق من صحة الملف
            if (!userData.version || !userData.quizStats) {
                throw new Error('Invalid file format');
            }
            
            // 🎨 تأكيد من المستخدم باستخدام المودال المخصص
            const confirmed = await showConfirmDialog({
                title: isAr ? '⚠️ استيراد البيانات' : '⚠️ Import Data',
                message: isAr
                    ? 'سيؤدي هذا إلى استبدال بياناتك الحالية. هل أنت متأكد؟'
                    : 'This will replace your current data. Are you sure?',
                okText: isAr ? 'نعم، استيراد' : 'Yes, Import',
                cancelText: isAr ? 'إلغاء' : 'Cancel',
                okType: 'danger'
            });

            if (!confirmed) return;
            
            // استعادة البيانات
            localStorage.setItem('quiz_stats', JSON.stringify(userData.quizStats));
            localStorage.setItem('quiz_achievements', JSON.stringify(userData.achievements || {}));

            // 👤 Restore username
            if (userData.username) {
                localStorage.setItem('quiz_username', userData.username);
            }
            // 🃏 Restore collectible cards
            if (userData.cards) {
                localStorage.setItem('quiz_cards', JSON.stringify(userData.cards));
            }

            if (userData.preferences) {
                if (userData.preferences.language) {
                    localStorage.setItem('quiz_lang', userData.preferences.language);
                }
                if (userData.preferences.theme) {
                    localStorage.setItem('quiz_theme', userData.preferences.theme);
                }
                if (typeof userData.preferences.musicEnabled === 'boolean') {
                    localStorage.setItem('quiz_music_enabled', userData.preferences.musicEnabled);
                }
                if (typeof userData.preferences.sfxEnabled === 'boolean') {
                    localStorage.setItem('quiz_sfx_enabled', userData.preferences.sfxEnabled);
                }
            }
            
            // 📊 Analytics tracking
            if (typeof trackEvent === 'function') {
                trackEvent('profile_import', {
                    'total_quizzes': userData.quizStats.totalQuizzes || 0
                });
            }
            
            showProfileNotification(
                isAr ? '✅ تم استيراد بياناتك بنجاح! سيتم إعادة تحميل الصفحة.' : '✅ Data imported successfully! Reloading...',
                'success'
            );
            
            // إعادة تحميل الصفحة بعد ثانيتين لتطبيق التغييرات
            setTimeout(() => location.reload(), 2000);
            
        } catch (error) {
            console.error('🛡️ Import failed:', error);
            showProfileNotification(
                isAr ? '❌ ملف غير صالح أو تالف' : '❌ Invalid or corrupted file',
                'error'
            );
        }
    };
    
    input.click();
}

// ==================== DELETE ALL DATA ====================
async function deleteAllData() {
    const isAr = currentLang === 'ar';

    // 🎨 التأكيد الأول باستخدام المودال المخصص
    const confirm1 = await showConfirmDialog({
        title: isAr ? '⚠️ حذف جميع البيانات' : '⚠️ Delete All Data',
        message: isAr
            ? 'سيتم حذف جميع بياناتك نهائياً: الإحصائيات، الإنجازات، والتفضيلات. هل أنت متأكد؟'
            : 'All your data will be permanently deleted: statistics, achievements, and preferences. Are you sure?',
        okText: isAr ? 'متابعة' : 'Continue',
        cancelText: isAr ? 'إلغاء' : 'Cancel',
        okType: 'danger'
    });

    if (!confirm1) return;

    // 🎨 التأكيد الثاني (الكتابة): بديل prompt
    const confirm2 = await showConfirmDialog({
        title: isAr ? '🔴 تأكيد نهائي' : '🔴 Final Confirmation',
        message: isAr
            ? 'هذا الإجراء لا يمكن التراجع عنه! اكتب "DELETE" للتأكيد.'
            : 'This action cannot be undone! Type "DELETE" to confirm.',
        okText: isAr ? 'حذف نهائي' : 'Delete Forever',
        cancelText: isAr ? 'إلغاء' : 'Cancel',
        okType: 'danger',
        inputLabel: isAr ? 'اكتب DELETE هنا:' : 'Type DELETE here:',
        inputExpected: 'DELETE'
    });

    if (!confirm2) {
        showProfileNotification(
            isAr ? '❌ تم إلغاء العملية' : '❌ Operation cancelled',
            'error'
        );
        return;
    }
    
    try {
        // حذف جميع البيانات المتعلقة بـ QuizMagic
        const keysToDelete = [
            'quiz_stats',
            'quiz_achievements',
            'quiz_lang',
            'quiz_theme',
            'quiz_music_enabled',
            'quiz_sfx_enabled',
            'quiz_username',
            'quiz_cards'
        ];
        
        keysToDelete.forEach(key => localStorage.removeItem(key));
        
        // 📊 Analytics tracking
        if (typeof trackEvent === 'function') {
            trackEvent('profile_delete_all');
        }
        
        showProfileNotification(
            isAr ? '🗑️ تم حذف جميع البيانات. سيتم إعادة تحميل الصفحة.' : '🗑️ All data deleted. Reloading...',
            'success'
        );
        
        setTimeout(() => location.reload(), 2000);
        
    } catch (error) {
        console.error('🛡️ Delete failed:', error);
        showProfileNotification(
            isAr ? '❌ فشل حذف البيانات' : '❌ Delete failed',
            'error'
        );
    }
}

// ==================== NOTIFICATIONS ====================
function showProfileNotification(message, type = 'success') {
    // إنشاء عنصر إشعار مؤقت
    const notification = document.createElement('div');
    notification.className = `profile-notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // إظهارها
    setTimeout(() => notification.classList.add('show'), 10);
    
    // إخفاؤها بعد 3 ثوانٍ
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== KEYBOARD SUPPORT ====================
document.addEventListener('keydown', (e) => {
    // إغلاق الملف الشخصي بـ Escape
    if (e.key === 'Escape') {
        const profileModal = document.getElementById('profile-modal');
        if (profileModal && profileModal.classList.contains('show')) {
            closeProfileModal();
        }
    }
});
// ==================== WELCOME SCREEN PREFERENCE ====================
// (تم نقل الإعدادات وإدارة البيانات لمودال الإعدادات الجديد في app.js)
// هذه الدوال تُترك كـ fallback للتوافق مع الصفحات الفرعية (about.html)

function toggleWelcomeScreenPreference() {
    const toggle = document.getElementById('welcome-screen-toggle') || document.getElementById('welcome-screen-toggle-settings');
    if (!toggle) return;

    const isEnabled = toggle.checked;
    localStorage.setItem('quiz_welcome_screen_enabled', isEnabled.toString());

    const isAr = currentLang === 'ar';
    const message = isEnabled
        ? (isAr ? '✅ سيتم إظهار الشاشة الترحيبية عند فتح الموقع' : '✅ Welcome screen will be shown')
        : (isAr ? '🔕 تم إيقاف الشاشة الترحيبية' : '🔕 Welcome screen disabled');

    showProfileNotification(message, 'success');

    if (typeof trackEvent === 'function') {
        trackEvent('welcome_screen_preference_changed', { enabled: isEnabled });
    }
}

function updateWelcomeScreenToggleState() {
    // يعمل مع كلا المودالين (القديم في profile إن وُجد، أو الجديد في settings)
    const toggle = document.getElementById('welcome-screen-toggle') || document.getElementById('welcome-screen-toggle-settings');
    if (!toggle) return;

    const savedPreference = localStorage.getItem('quiz_welcome_screen_enabled');
    const isEnabled = savedPreference === null ? true : savedPreference === 'true';
    toggle.checked = isEnabled;
}

// ==================== GEMS & ID HELPERS ====================

// 💎 عدد الجواهر (من localStorage — تتم مزامنتها مع Firebase)
function getGemsCount() {
    return parseInt(localStorage.getItem('quiz_gems') || '0', 10);
}

// 🆔 عرض الـ ID في الملف الشخصي
function getProfileIdDisplay(isAr) {
    if (window.firebaseDB && window.firebaseDB.isLoggedIn()) {
        return window.firebaseDB.getCurrentUserId();
    }
    return isAr ? 'زائر' : 'Guest';
}


/* ==================== MYTHICAL GALLERY (FAN-OUT EFFECT) ==================== */

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 2.5rem 1.5rem;
    margin-top: 1rem;
    position: relative;
    padding-top: 2rem; /* مساحة للبطاقات عند الانتشار */
}

@media (min-width: 768px) {
    .gallery-grid {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }
}

/* 🎬 تأثير البلور السينمائي على المعرض */
.gallery-grid.gallery-blurred .gallery-item-wrapper:not(.is-active) {
    filter: blur(6px) brightness(0.4) grayscale(0.5);
    transform: scale(0.9);
    pointer-events: none; /* منع الضغط على الكائنات الأخرى */
}

/* 📦 حاوية الكائن */
.gallery-item-wrapper {
    position: relative;
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: pointer;
    z-index: 1;
}

/* رفع الـ z-index للكائن النشط ليكون فوق كل شيء */
.gallery-item-wrapper.is-active {
    z-index: 100;
}

/* 🃏 البطاقة الأم (الغلاف) */
.base-card {
    width: 100%;
    aspect-ratio: 1 / 1.4;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 10px 20px rgba(0,0,0,0.5);
    border: 2px solid transparent;
    background: #0f172a;
    transition: all 0.5s ease;
}

.base-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* عند فتح الانتشار، تصبح البطاقة الأم باهتة وتتراجع للخلف */
.gallery-item-wrapper.is-active .base-card {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
}

/* 🔢 شارة عدد البطاقات */
.cards-count-badge {
    position: absolute;
    top: -10px;
    right: -10px;
    background: linear-gradient(135deg, #ff006e, #ffbe0b);
    color: #fff;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 1.1rem;
    box-shadow: 0 4px 15px rgba(255, 0, 110, 0.6);
    border: 2px solid #0f172a;
    z-index: 10;
}

/* 🎴 حاوية البطاقات المنتشرة */
.fan-cards-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
}

.gallery-item-wrapper.is-active .fan-cards-container {
    pointer-events: auto;
}

/* 🃏 البطاقات المنتشرة (مخفية افتراضياً) */
.fan-card {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
    border: 2px solid transparent;
    box-shadow: 0 10px 20px rgba(0,0,0,0.5);
    opacity: 0;
    transform-origin: bottom center;
    transform: translateY(0) rotate(0deg) scale(0.5);
    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); /* حركة ارتدادية ناعمة */
    cursor: pointer;
}

.fan-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* ✨ السحر: حساب زوايا الانتشار المروحي برمجياً باستخدام CSS Variables */
.gallery-item-wrapper.is-active .fan-card {
    opacity: 1;
    /* حساب الإزاحة بناءً على ترتيب البطاقة وعددها الإجمالي */
    --offset: calc(var(--fan-idx) - (var(--total-fan) - 1) / 2);
    transform: 
        translateY(-40px) 
        translateX(calc(var(--offset) * 65%)) 
        rotate(calc(var(--offset) * 14deg)) 
        scale(1.25);
    box-shadow: 0 25px 50px rgba(0,0,0,0.8);
}

/* تأثير التحويم على بطاقة منتشرة (تبرز للأمام) */
.gallery-item-wrapper.is-active .fan-card:hover {
    transform: 
        translateY(-60px) 
        translateX(calc(var(--offset) * 65%)) 
        rotate(calc(var(--offset) * 14deg)) 
        scale(1.35);
    z-index: 20;
    box-shadow: 0 30px 60px rgba(var(--c-accent-rgb), 0.4);
}

/* ⬇️ أيقونة التحميل عند التحويم */
.download-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: white;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.fan-card:hover .download-overlay {
    opacity: 1;
}

/* 🏷️ شارات الندرة والأسماء */
.gallery-badge {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    padding: 6px 0;
    font-size: 0.85rem;
    font-weight: 900;
    text-transform: uppercase;
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(5px);
}

.gallery-name {
    margin-top: 0.8rem;
    font-weight: 800;
    font-size: 1.1rem;
    text-align: center;
    color: var(--c-text-primary);
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.gallery-item-wrapper.is-active .gallery-name {
    opacity: 0; /* إخفاء الاسم عند الانتشار للتركيز على البطاقات */
}

/* 🎨 ألوان الإطارات حسب الندرة */
.tier-common { border-color: #8D6E63; }
.tier-common .gallery-badge { color: #D7CCC8; }

.tier-silver { border-color: #E0E0E0; box-shadow: 0 0 15px rgba(224,224,224,0.3); }
.tier-silver .gallery-badge { color: #FFFFFF; }

.tier-gold { border-color: #D4AF37; box-shadow: 0 0 20px rgba(212,175,55,0.5); }
.tier-gold .gallery-badge { color: #FFF8DC; text-shadow: 0 0 5px #D4AF37; }

.tier-diamond { border-color: #00FFFF; box-shadow: 0 0 25px rgba(0,255,255,0.6); }
.tier-diamond .gallery-badge { color: #E0FFFF; text-shadow: 0 0 8px #00FFFF; }
