let currentLang = 'ar';
let currentQuiz = null;
let selectedQuestions = [];  // 🎲 الـ 30 سؤال المختارة عشوائياً
let questionBankLoaded = false; // 📊 تتبع تحميل البنكlet currentStepId = 0;
let userResponses = [];
let currentTheme = 'dark';
let isQuizActive = false;
let userStats = {};
let friendComparisonData = null;
let lastQuizResult = null;
// 📊 Google Analytics Helper
function trackEvent(eventName, eventParams = {}) {
    if (typeof gtag === 'function') {
        gtag('event', eventName, eventParams);
        console.log(`📊 Analytics: ${eventName}`, eventParams);
    }
}

// 🛡️ Helper أمني: تخطي رموز HTML لمنع هجمات XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

// ==================== USERNAME SYSTEM ====================
const USERNAME_KEY = 'quiz_username';
// Note: CARDS_KEY moved to card-system.js

function getUsername() {
    return localStorage.getItem(USERNAME_KEY) || '';
}

function setUsername(name) {
    localStorage.setItem(USERNAME_KEY, name);
}

function isValidUsername(name) {
    return /^[a-zA-Z0-9\u0600-\u06FF\s_-]{3,20}$/.test(name.trim());
}

function showUsernameModal() {
    const modal = document.getElementById('username-modal');
    if (!modal) return;
    const isAr = currentLang === 'ar';
    document.getElementById('username-modal-title').textContent = isAr ? 'مرحباً أيها المسافر!' : 'Welcome, Traveler!';
    document.getElementById('username-modal-message').textContent = isAr ? 'قبل أن تبدأ رحلتك الأسطورية، أخبرنا باسمك ليُنقش على بطاقاتك ونتائجك' : 'Before your legendary journey begins, tell us your name to engrave on your cards';
    document.getElementById('username-input').placeholder = isAr ? 'اكتب اسمك هنا...' : 'Enter your name...';
    document.getElementById('username-save-text').textContent = isAr ? 'حفظ ومتابعة' : 'Save & Continue';
    document.getElementById('username-hint').textContent = isAr ? '3-20 حرف (أحرف، أرقام، مسافات، -، _)' : '3-20 chars (letters, numbers, spaces, -, _)';
    document.getElementById('username-error').classList.add('hidden');
    document.getElementById('username-input').value = '';
    modal.classList.add('show');
    setTimeout(() => document.getElementById('username-input').focus(), 400);
}

function saveUsername() {
    const input = document.getElementById('username-input');
    const name = input.value.trim();
    const isAr = currentLang === 'ar';
    const errorEl = document.getElementById('username-error');

    if (!name) {
        errorEl.textContent = isAr ? '⚠️ الرجاء إدخال اسم' : '⚠️ Please enter a name';
        errorEl.classList.remove('hidden');
        input.focus();
        return;
    }
    if (!isValidUsername(name)) {
        errorEl.textContent = isAr ? '⚠️ اسم غير صالح (3-20 حرف: أحرف، أرقام، مسافات، -، _)' : '⚠️ Invalid name (3-20 chars: letters, numbers, spaces, -, _)';
        errorEl.classList.remove('hidden');
        input.focus();
        return;
    }

    setUsername(escapeHtml(name));
    // 🔓 Unblock quiz interactions after username is saved
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.style.opacity = '';
        mainContent.style.pointerEvents = '';
        mainContent.style.filter = '';
    }
    const modal = document.getElementById('username-modal');
    if (modal) modal.classList.remove('show');

    if (typeof trackEvent === 'function') {
        trackEvent('username_set');
    }
}

// 🎨 بديل احترافي لـ alert//confirm/prompt
// options: { title, message, okText, cancelText, okType ('danger'|'success'|'primary'), inputLabel, inputExpected }
function showConfirmDialog(options) {
    return new Promise((resolve) => {
        const modal = document.getElementById('confirm-dialog');
        if (!modal) {
            // fallback إذا لم يكن المودال موجوداً
            resolve(confirm(options.message));
            return;
        }

        const isAr = currentLang === 'ar';

        // ملء المحتوى
        const titleEl = document.getElementById('confirm-dialog-title');
        const msgEl = document.getElementById('confirm-dialog-message');
        const okBtn = document.getElementById('confirm-dialog-ok-btn');
        const okTextEl = document.getElementById('confirm-dialog-ok-text');
        const cancelTextEl = document.getElementById('confirm-dialog-cancel-text');
        const inputWrapper = document.getElementById('confirm-dialog-input-wrapper');
        const inputEl = document.getElementById('confirm-dialog-input');
        const inputLabelEl = document.getElementById('confirm-dialog-input-label');
        const iconEl = document.getElementById('confirm-dialog-icon');

        if (titleEl) titleEl.textContent = options.title || (isAr ? 'تأكيد' : 'Confirm');
        if (msgEl) msgEl.textContent = options.message || '';
        if (okTextEl) okTextEl.textContent = options.okText || (isAr ? 'تأكيد' : 'OK');
        if (cancelTextEl) cancelTextEl.textContent = options.cancelText || (isAr ? 'إلغاء' : 'Cancel');

        // نوع الزر (لون)
        if (okBtn) {
            okBtn.className = 'flex-1 py-3 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg';
            if (options.okType === 'danger') {
                okBtn.style.backgroundImage = 'linear-gradient(to right, #dc2626, #e11d48)';
            } else if (options.okType === 'success') {
                okBtn.classList.add('btn-success');
            } else {
                okBtn.classList.add('btn-primary');
            }
        }

        // الأيقونة
        if (iconEl) {
            if (options.okType === 'danger') {
                iconEl.className = 'fas fa-exclamation-triangle text-red-400';
            } else if (options.okType === 'success') {
                iconEl.className = 'fas fa-check-circle text-green-400';
            } else if (options.icon) {
                iconEl.className = options.icon;
            } else {
                iconEl.className = 'fas fa-info-circle text-accent';
            }
        }

        // حقل الإدخال (بديل prompt)
        if (options.inputLabel) {
            if (inputWrapper) inputWrapper.classList.remove('hidden');
            if (inputLabelEl) inputLabelEl.textContent = options.inputLabel;
            if (inputEl) {
                inputEl.value = '';
                setTimeout(() => inputEl.focus(), 200);
            }
        } else {
            if (inputWrapper) inputWrapper.classList.add('hidden');
        }

        // 🛡️ تركيب Promise: نجعل الإجاحة متاحة عالمياً لـ dismissConfirmDialog
        window._confirmDialogResolve = resolve;
        window._confirmDialogOptions = options;

        modal.classList.add('show');
        trapFocus(modal);

        // ♿ التركيز على زر التأكيد
        setTimeout(() => {
            const focusTarget = options.inputLabel ? inputEl : okBtn;
            if (focusTarget) focusTarget.focus();
        }, 100);
    });
}

function dismissConfirmDialog(confirmed) {
    const modal = document.getElementById('confirm-dialog');
    if (!modal) return;
    modal.classList.remove('show');
    removeFocusTrap(modal);

    let result = confirmed;
    // إذا كان هناك حقل إدخال متوقع، تحقق من قيمته
    if (confirmed && window._confirmDialogOptions?.inputExpected) {
        const inputEl = document.getElementById('confirm-dialog-input');
        result = inputEl && inputEl.value === window._confirmDialogOptions.inputExpected;
    }

    if (window._confirmDialogResolve) {
        window._confirmDialogResolve(result);
        window._confirmDialogResolve = null;
        window._confirmDialogOptions = null;
    }
}

let quizStartTime = null;  // ⚡ لتتبع وقت بداية الاختبار
let userSessionData = {};  /// 📊 بيانات الجلسة الحالية



// 🛡️ Global Error Handler - يحمي الموقع من الانهيار الكامل
window.addEventListener('error', (event) => {
    console.error('🛡️ Global Error Caught:', event.error);
    // لا نعرض إشعار هنا لأن هذا للأخطاء البرمجية العميقة
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('🛡️ Unhandled Promise Rejection:', event.reason);
    const isAr = currentLang === 'ar';
    showErrorToast(
        isAr ? 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.' : 'An unexpected error occurred. Please try again.',
        isAr
    );
});

// ♿ إغلاق المودالات بضغط Escape
document.addEventListener('keydown', (e) => {
if (e.key === 'Escape') {
closeAchievementsModal();
closePokedexModal();
closeThemeModal();
}
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('quiz_lang') || 'ar';
    const savedTheme = localStorage.getItem('quiz_theme') || 'auto';
    initializeTheme(savedTheme);
    setLanguage(savedLang);

    if (localStorage.getItem('quiz_lang')) {
        document.getElementById('language-screen').classList.add('opacity-0', 'pointer-events-none');
    }
    renderSocialLinks();
    updateThemeToggleIcon();
    loadUserStats();
    // 🎯 التحقق من الزيارة الأولى وإظهار الشاشة الترحيبية
    checkFirstVisit();
        // 🕐 سجل زيارة اليوم وتحقق من الوقت
    recordVisitDay();
    
        // 🔥 حساب وعرض أيام المتتالية (Streaks) بشكل دائم
    const currentStreak = calculateCurrentStreak();
    updateStreakDisplay(currentStreak);
	
    if (isNightOwlTime()) {
        if (!userStats.nightVisits) userStats.nightVisits = 0;
        userStats.nightVisits++;
        localStorage.setItem('quiz_stats', JSON.stringify(userStats));
    }
    if (isEarlyBirdTime()) {
        if (!userStats.earlyVisits) userStats.earlyVisits = 0;
        userStats.earlyVisits++;
        localStorage.setItem('quiz_stats', JSON.stringify(userStats));
    }

    // Check for comparison URL parameter
    checkComparisonParam();

	// 🎲 تحميل بنك الأسئلة الجديد (من questionBank.js)
	loadQuestionBank();

    // Hide splash screen after loading
    hideSplashScreen();

    // 👤 Check username — show modal if not set (block quiz until entered)
    if (!getUsername()) {
        // Block quiz interactions until username is set
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.style.opacity = '0.3';
            mainContent.style.pointerEvents = 'none';
            mainContent.style.filter = 'blur(2px)';
        }
        showUsernameModal();
    }
	// 🛒 تهيئة بيانات المتجر والممتلكات
    if (typeof initStoreData === 'function') {
        setTimeout(initStoreData, 1500); // تأخير بسيط لضمان تحميل Supabase أولاً
    }

});

// ==================== GLOBAL WELCOME SCREEN (NEW) ====================
function checkFirstVisit() {
    // التحقق من أن شاشة الترحيب مفعلة في config
    if (typeof config === 'undefined' || !config.welcomeScreen || !config.welcomeScreen.enabled) {
        return;
    }
    
    // ✨ التحقق من تفضيل المستخدم
    const userPreference = localStorage.getItem('quiz_welcome_screen_enabled');
    const isWelcomeEnabled = userPreference === null ? true : userPreference === 'true';
    
    if (!isWelcomeEnabled) {
        return;
    }
    
    // ✨ التحقق من أن الشاشة لم تُعرض في هذه الجلسة
    const shownThisSession = sessionStorage.getItem('welcome_shown_this_session');
    if (shownThisSession === 'true') {
        return; // لا نعرض الشاشة مرة أخرى في نفس الجلسة
    }
    
    // إظهار الشاشة الترحيبية
    showGlobalWelcomeScreen();
    
    // ✨ حفظ أن الشاشة عُرضت في هذه الجلسة
    sessionStorage.setItem('welcome_shown_this_session', 'true');
}
function showGlobalWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    if (!welcomeScreen) return;
    
    // ملء المحتوى من config
    renderWelcomeScreenContent();
    
    // إظهار الشاشة
    welcomeScreen.classList.remove('hidden');
    
    // 📊 Analytics tracking
    if (typeof trackEvent === 'function') {
        trackEvent('welcome_screen_view', {
            'language': currentLang
        });
    }
}

function hideGlobalWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    if (!welcomeScreen) return;
    
    // إخفاء الشاشة
    welcomeScreen.classList.add('hidden');
    
    // حفظ أن المستخدم زار الموقع
    localStorage.setItem('quiz_has_visited', 'true');
}

function renderWelcomeScreenContent() {
    const isAr = currentLang === 'ar';
    const texts = config.welcomeScreen.texts[isAr ? 'ar' : 'en'];
    
    // ملء العنوان والنص الفرعي
    const subtitle = document.getElementById('welcome-subtitle');
    if (subtitle) subtitle.textContent = texts.subtitle;
    
    // ملء رسالة الترحيب
    const greeting = document.getElementById('welcome-greeting');
    if (greeting) greeting.textContent = texts.welcomeMessage;
    
    const description = document.getElementById('welcome-description');
    if (description) description.textContent = texts.welcomeDescription;
    
    // ملء بطاقات المميزات
    const featuresGrid = document.getElementById('welcome-features-grid');
    if (featuresGrid) {
        featuresGrid.innerHTML = '';
        texts.features.forEach(feature => {
            const card = document.createElement('div');
            card.className = 'welcome-feature-card';
            card.innerHTML = `
                <div class="welcome-feature-icon">${feature.icon}</div>
                <h3 class="welcome-feature-title">${feature.title}</h3>
                <p class="welcome-feature-description">${feature.description}</p>
            `;
            featuresGrid.appendChild(card);
        });
    }
    
    // ملء أزرار الخيارات السريعة
    const themeText = document.getElementById('welcome-theme-text');
    if (themeText) themeText.textContent = texts.quickSettings.theme;
    
    const musicText = document.getElementById('welcome-music-text');
    if (musicText) musicText.textContent = texts.quickSettings.music;
    
    const langText = document.getElementById('welcome-lang-text');
    if (langText) langText.textContent = texts.quickSettings.language;
    
    // ملء زر البدء
    const startText = document.getElementById('welcome-start-text');
    if (startText) startText.textContent = texts.startButton;
    
    const hint = document.getElementById('welcome-hint');
    if (hint) hint.textContent = texts.startHint;
}

function startJourney() {
    // 🎵 صوت بدء الرحلة
    if (window.audioManager) {
        window.audioManager.play('ui-click');
    }
    
    // إخفاء الشاشة الترحيبية
    hideGlobalWelcomeScreen();
    
    // 📊 Analytics tracking
    if (typeof trackEvent === 'function') {
        trackEvent('welcome_screen_start', {
            'language': currentLang
        });
    }
    
    // التمرير لأعلى الصفحة
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showLanguageFromWelcome() {
    // إخفاء الشاشة الترحيبية مؤقتاً (بدون حذف التفضيل)
    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen) {
        welcomeScreen.classList.add('hidden');
    }
    
    // إظهار شاشة اختيار اللغة
    const languageScreen = document.getElementById('language-screen');
    if (languageScreen) {
        languageScreen.classList.remove('opacity-0', 'pointer-events-none');
    }
    
    // حفظ حالة "جاء من الشاشة الترحيبية"
    sessionStorage.setItem('from_welcome_screen', 'true');
}

function toggleWelcomeMusic() {
    if (window.audioManager) {
        const isEnabled = window.audioManager.toggleMusic();
        
        // تحديث أيقونة الزر
        const musicBtn = document.getElementById('welcome-music-btn');
        if (musicBtn) {
            const icon = musicBtn.querySelector('i');
            if (icon) {
                icon.className = isEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
            }
        }
    }
}

// ==================== SPLASH SCREEN (NEW) ====================
function hideSplashScreen() {
    const splash = document.getElementById('splash-screen');
    if (!splash) return;
    setTimeout(() => {
        splash.classList.add('fade-out');
        setTimeout(() => {
            splash.remove();
        }, 800);
    }, 2000);
}

// ==================== CONFETTI SYSTEM (NEW) ====================
function launchConfetti(creatureId) {
    try {
        // احترام إعدادات تقليل الحركة
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        const container = document.getElementById('confetti-container');
        if (!container) return;
        
        const theme = creatureThemes[creatureId] || creatureThemes.dragon;
        const colors = [
            theme.primary,
            theme.secondary,
            '#a855f7',
            '#ec4899',
            '#fbbf24',
            '#ffffff'
        ];
        const shapes = ['square', 'circle', 'triangle'];
        const piecesCount = 80;
        
        for (let i = 0; i < piecesCount; i++) {
            const piece = document.createElement('div');
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            piece.className = `confetti-piece ${shape}`;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const delay = Math.random() * 0.5;
            const duration = 2.5 + Math.random() * 2;
            const size = 6 + Math.random() * 10;
            
            piece.style.left = `${left}%`;
            piece.style.animationDelay = `${delay}s`;
            piece.style.animationDuration = `${duration}s`;
            piece.style.width = `${size}px`;
            piece.style.height = `${size}px`;
            
            if (shape === 'triangle') {
                piece.style.color = color;
            } else {
                piece.style.backgroundColor = color;
            }
            container.appendChild(piece);
        }
        
        setTimeout(() => {
            if (container) container.innerHTML = '';
        }, 5000);
    } catch (error) {
        console.warn('🛡️ Confetti failed (non-critical):', error);
        // الكونفيتي غير حرج - لا نزعج المستخدم بخطأ
    }
}
// ♿ Focus Trap: حبس التركيز داخل المودال لقارئات الشاشة
function trapFocus(element) {
    const focusable = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function handler(e) {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
            if (document.activeElement === first) {
                last.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === last) {
                first.focus();
                e.preventDefault();
            }
        }
    }
    element.addEventListener('keydown', handler);
    // إزالة المستمع عند إغلاق المودال (لتجنب تراكم المستمعين)
    element._focusTrapHandler = handler;
}

function removeFocusTrap(element) {
    if (element._focusTrapHandler) {
        element.removeEventListener('keydown', element._focusTrapHandler);
        delete element._focusTrapHandler;
    }
}

// ==================== ACHIEVEMENTS SYSTEM (NEW) ====================
let userAchievements = {};

const ACHIEVEMENTS = {
    first_quiz: {
        name: { ar: 'المستكشف الأول', en: 'First Explorer' },
        description: { ar: 'أكمل أول اختبار', en: 'Complete your first quiz' },
        icon: '🎭',
        condition: (stats) => stats.totalQuizzes >= 1
    },
    perseverant: {
        name: { ar: 'المثابر', en: 'Perseverant' },
        description: { ar: 'أكمل 5 اختبارات', en: 'Complete 5 quizzes' },
        icon: '⭐',
        condition: (stats) => stats.totalQuizzes >= 5
    },
    rare_creature: {
        name: { ar: 'الكائن النادر', en: 'Rare Creature' },
        description: { ar: 'احصل على كائن أسطوري أو نادر جداً', en: 'Get a Legendary or Very Rare creature' },
        icon: '💎',
        condition: (stats) => {
            const rareRarities = ['أسطوري', 'نادر جداً', 'Legendary', 'Very Rare'];
            return stats.creatures && Object.keys(stats.creatures).some(id => {
                const creature = quizzesData[currentLang].quizzes[0].results.find(r => r.id === id);
                return creature && rareRarities.includes(creature.rarity);
            });
        }
    },
    social: {
        name: { ar: 'الاجتماعي', en: 'Social' },
        description: { ar: 'شارك النتيجة 3 مرات', en: 'Share result 3 times' },
        icon: '🚀',
        condition: (stats) => stats.shares >= 3
    },
    comparer: {
        name: { ar: 'المقارن', en: 'Comparer' },
        description: { ar: 'قارن مع صديق مرة واحدة', en: 'Compare with a friend once' },
        icon: '⚔️',
        condition: (stats) => stats.comparisons >= 1
    },
    collector: {
        name: { ar: 'الجامع', en: 'Collector' },
        description: { ar: 'احصل على 5 كائنات مختلفة', en: 'Get 5 different creatures' },
        icon: '🎨',
        condition: (stats) => stats.creatures && Object.keys(stats.creatures).length >= 5
    },
    loyal: {
        name: { ar: 'المخلص', en: 'Loyal' },
        description: { ar: 'أعد الاختبار 3 مرات', en: 'Retake quiz 3 times' },
        icon: '🔄',
        condition: (stats) => stats.retakes >= 3
    },
    deep_diver: {
    name: { ar: 'المتعمق', en: 'Deep Diver' },
    description: { ar: 'فتح التقرير السري 5 مرات', en: 'Unlock secret report 5 times' },
    icon: '🔓',
    condition: (stats) => stats.secretUnlocks >= 5
    },
    // ✨ الإنجازات الجديدة الذكية
    speed_runner: {
        name: { ar: 'البرق السريع', en: 'Speed Runner' },
        description: { ar: 'أكمل الاختبار في أقل من 3 دقائق', en: 'Complete a quiz in under 3 minutes' },
        icon: '⚡',
        condition: (stats) => stats.fastestQuiz && stats.fastestQuiz <= 180
    },
    night_owl: {
        name: { ar: 'بومة الليل', en: 'Night Owl' },
        description: { ar: 'استخدم الموقع في ساعات الليل المتأخرة', en: 'Use the site during late night hours' },
        icon: '🌙',
        condition: (stats) => stats.nightVisits >= 1
    },
    early_bird: {
        name: { ar: 'طائر الفجر', en: 'Early Bird' },
        description: { ar: 'استخدم الموقع في ساعات الصباح الباكر', en: 'Use the site during early morning hours' },
        icon: '🌅',
        condition: (stats) => stats.earlyVisits >= 1
    },
    veteran: {
        name: { ar: 'المتمرس', en: 'Veteran' },
        description: { ar: 'استخدم الموقع في 7 أيام مختلفة', en: 'Use the site on 7 different days' },
        icon: '🔥',
        condition: (stats) => stats.visitDays && stats.visitDays.length >= 7
	},

	// ⚔️ إنجازات الساحة
	arena_first_win: {
    	name: { ar: 'المحارب الأول', en: 'First Warrior' },
    	description: { ar: 'حقق أول فوز في ساحة المعركة', en: 'Win your first arena battle' },
    	icon: '⚔️',
    	condition: (stats) => stats.arena && stats.arena.wins >= 1
	},
	arena_win_streak_3: {
    	name: { ar: 'المحارب المتقد', en: 'Blazing Warrior' },
    	description: { ar: 'حقق 3 انتصارات متتالية في الساحة', en: 'Win 3 arena battles in a row' },
    	icon: '🔥',
    	condition: (stats) => stats.arena && stats.arena.best_streak >= 3
	},
	arena_wins_10: {
    	name: { ar: 'بطل الساحة', en: 'Arena Champion' },
    	description: { ar: 'حقق 10 انتصارات إجمالية في الساحة', en: 'Win 10 total arena battles' },
    	icon: '🏆',
    	condition: (stats) => stats.arena && stats.arena.wins >= 10
	},
    perfect_match: {
        name: { ar: 'الرفيق المثالي', en: 'Perfect Match' },
        description: { ar: 'احصل على توافق 95% أو أكثر مع صديق', en: 'Get 95%+ compatibility with a friend' },
        icon: '🎯',
        condition: (stats) => stats.bestCompatibility && stats.bestCompatibility >= 95
    }
    };

function loadAchievements() {
    const saved = localStorage.getItem('quiz_achievements');
    userAchievements = saved ? JSON.parse(saved) : {};
}

function saveAchievements() {
    localStorage.setItem('quiz_achievements', JSON.stringify(userAchievements));
}

async function checkAchievements() {
    const stats = getUserStats();
    let newAchievements = [];
    
    for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
        if (!userAchievements[key] && achievement.condition(stats)) {
            
            // 🛡️ النظام الآمن: السيرفر يفتح الإنجاز ويمنح الـ XP
            if (window.firebaseDB && window.firebaseDB.isLoggedIn() && window.sbClient) {
                const userId = window.firebaseDB.getCurrentUserId();
                const xpReward = (typeof config !== 'undefined' && config.xpSystem) ? config.xpSystem.achievementXP : 50;
                
                const { data, error } = await window.sbClient.rpc('server_unlock_achievement', {
                    p_user_id: userId,
                    p_achievement_id: key,
                    p_xp_reward: xpReward
                });
                
                if (!error && data && data.success) {
                    userAchievements = data.achievements;
                    saveAchievements();
                    newAchievements.push(achievement);
                }
            } else {
                // Fallback محلي للزوار
                userAchievements[key] = { unlocked: true, unlockedAt: Date.now() };
                newAchievements.push(achievement);
                saveAchievements();
            }
        }
    }
    
    if (newAchievements.length > 0) {
        showAchievementToast(newAchievements[0]);
        // الـ XP تمت إضافته في السيرفر، نضيفه محلياً فقط للزوار
        if (!window.firebaseDB || !window.firebaseDB.isLoggedIn()) {
            if (typeof config !== 'undefined' && config.xpSystem && config.xpSystem.achievementXP) {
                const totalXP = newAchievements.length * config.xpSystem.achievementXP;
                if (typeof addXP === 'function') addXP(totalXP, 'achievement_unlocked');
            }
        }
    }
}


function getUserStats() {
    const saved = localStorage.getItem('quiz_stats');
    const stats = saved ? JSON.parse(saved) : {};
    let totalQuizzes = 0;
    if (stats.creatures) {
        totalQuizzes = Object.values(stats.creatures).reduce((a, b) => a + b, 0);
    }
    return {
        totalQuizzes: totalQuizzes,
        creatures: stats.creatures || {},
        shares: stats.shares || 0,
        comparisons: stats.comparisons || 0,
        retakes: stats.retakes || 0,
        secretUnlocks: stats.secretUnlocks || 0,
        fastestQuiz: stats.fastestQuiz || null,
        nightVisits: stats.nightVisits || 0,
        earlyVisits: stats.earlyVisits || 0,
        visitDays: stats.visitDays || [],
        bestCompatibility: stats.bestCompatibility || null,
        // ⚔️ إحصائيات الساحة (كانت ناقصة!)
        arena: stats.arena || {}
    };
}
function showAchievementToast(achievement) {
    // 🎵 صوت فتح الإنجاز (جاهز للمستقبل)
    if (window.audioManager) {
        window.audioManager.play('achievement-unlocked');
    }
    
    const toast = document.getElementById('achievement-toast');
    if (!toast) return;
    const isAr = currentLang === 'ar';
    const title = toast.querySelector('.toast-title');
    const message = toast.querySelector('.toast-message');
    const icon = toast.querySelector('.toast-icon');
    title.textContent = isAr ? 'مبروك!' : 'Congratulations!';
    message.textContent = isAr ? `فتحت وسام "${achievement.name.ar}"` : `You unlocked "${achievement.name.en}"`;
    icon.textContent = achievement.icon;
    toast.classList.add('show');

    // 📊 تتبع فتح الإنجاز
    trackEvent('achievement_unlocked', {
        'achievement_id': achievement.name.en.toLowerCase().replace(/\s+/g, '_'),
        'achievement_name': achievement.name[currentLang]
    });

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

function showErrorToast(errorMessage, isAr = currentLang === 'ar') {
    // استخدام toast موجود بشكل مؤقت
    const toast = document.getElementById('achievement-toast');
    if (!toast) return;
    
    const title = toast.querySelector('.toast-title');
    const message = toast.querySelector('.toast-message');
    const icon = toast.querySelector('.toast-icon');
    
    // تغيير الألوان لتعكس خطأ
    toast.style.background = 'linear-gradient(135deg, #dc2626, #ea580c)';
    
    title.textContent = isAr ? 'عذراً!' : 'Oops!';
    message.textContent = errorMessage;
    icon.textContent = '⚠️';
    
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
        // إعادة الألوان الأصلية
        toast.style.background = '';
    }, 5000);
}

function showAchievementsModal() {
    const modal = document.getElementById('achievements-modal');
    if (!modal) return;

    // 🔄 إعادة تحميل الإنجازات من localStorage في الذاكرة
    if (typeof loadAchievements === 'function') loadAchievements();
    renderAchievementsGrid();
    modal.classList.add('show');
    trapFocus(modal);

    // 🔄 جلب أحدث الإنجازات من السحابة (إن كان مسجّل دخول)
    if (window.firebaseDB && window.firebaseDB.isLoggedIn()) {
        window.firebaseDB.fetchUserData().then(cloudData => {
            if (cloudData && cloudData.achievements) {
                localStorage.setItem('quiz_achievements', JSON.stringify(cloudData.achievements));
                if (typeof loadAchievements === 'function') loadAchievements();
                renderAchievementsGrid(); // إعادة العرض بالبيانات الجديدة
            }
        }).catch(() => {});
    }

    // ♿ التركيز على أول عنصر تفاعلي داخل المودال
    setTimeout(() => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
    }, 100);
}

function closeAchievementsModal() {
    const modal = document.getElementById('achievements-modal');
    if (!modal) return;
    modal.classList.remove('show');
    removeFocusTrap(modal);
}

function renderAchievementsGrid() {
    const grid = document.getElementById('achievements-grid');
    if (!grid) return;
    
    const isAr = currentLang === 'ar';
    const stats = getUserStats();
    
    grid.innerHTML = '';
    
    for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
        const isUnlocked = userAchievements[key] && userAchievements[key].unlocked;
        const progress = calculateAchievementProgress(key, stats);
        
        const card = document.createElement('div');
        card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        
        card.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <h3 class="achievement-name">${isAr ? achievement.name.ar : achievement.name.en}</h3>
            <p class="achievement-description">${isAr ? achievement.description.ar : achievement.description.en}</p>
            ${!isUnlocked ? `
                <div class="achievement-progress">
                    <div class="achievement-progress-bar" style="width: ${progress}%"></div>
                </div>
                <p class="achievement-progress-text">${progress}%</p>
            ` : `
                <div class="achievement-badge">${isAr ? 'مفتوح' : 'Unlocked'}</div>
            `}
        `;
        
        grid.appendChild(card);
    }
}

function calculateAchievementProgress(key, stats) {
    const conditions = {
        first_quiz: Math.min(100, (stats.totalQuizzes / 1) * 100),
        perseverant: Math.min(100, (stats.totalQuizzes / 5) * 100),
        rare_creature: stats.creatures && Object.keys(stats.creatures).some(id => {
            const creature = quizzesData[currentLang].quizzes[0].results.find(r => r.id === id);
            return creature && ['أسطوري', 'نادر جداً', 'Legendary', 'Very Rare'].includes(creature.rarity);
        }) ? 100 : 0,
        social: Math.min(100, (stats.shares / 3) * 100),
        comparer: Math.min(100, (stats.comparisons / 1) * 100),
        collector: Math.min(100, (stats.creatures ? Object.keys(stats.creatures).length / 5 : 0) * 100),
        loyal: Math.min(100, (stats.retakes / 3) * 100),
        deep_diver: Math.min(100, (stats.secretUnlocks / 5) * 100),
		// ⚔️ إنجازات الساحة
		arena_first_win: stats.arena ? Math.min(100, (stats.arena.wins / 1) * 100) : 0,
		arena_win_streak_3: stats.arena ? Math.min(100, (stats.arena.best_streak / 3) * 100) : 0,
		arena_wins_10: stats.arena ? Math.min(100, (stats.arena.wins / 10) * 100) : 0,
        // ✨ الإنجازات الجديدة
        speed_runner: stats.fastestQuiz ? Math.min(100, ((180 - stats.fastestQuiz) / 180) * 100) : 0,
        night_owl: stats.nightVisits >= 1 ? 100 : 0,
        early_bird: stats.earlyVisits >= 1 ? 100 : 0,
        veteran: stats.visitDays ? Math.min(100, (stats.visitDays.length / 7) * 100) : 0,
        perfect_match: stats.bestCompatibility ? Math.min(100, (stats.bestCompatibility / 95) * 100) : 0
		
};
    
    return Math.round(conditions[key] || 0);
}


// ==================== STREAKS SYSTEM (NEW) ====================
function calculateCurrentStreak() {
    if (!userStats.visitDays || userStats.visitDays.length === 0) return 0;
    
    // ترتيب الأيام من الأحدث إلى الأقدم
    const sortedDays = [...userStats.visitDays].sort((a, b) => new Date(b) - new Date(a));
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // نتحقق إذا كان آخر يوم هو اليوم أو الأمس (للسماح بالزيارة اليومية)
    const lastVisit = new Date(sortedDays[0]);
    lastVisit.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - lastVisit.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
        return 0; // انقطع التسلسل
    }
    
    // حساب الأيام المتتالية
    for (let i = 0; i < sortedDays.length - 1; i++) {
        const currentDay = new Date(sortedDays[i]);
        const nextDay = new Date(sortedDays[i + 1]);
        currentDay.setHours(0, 0, 0, 0);
        nextDay.setHours(0, 0, 0, 0);
        
        const dayDiff = Math.floor((currentDay.getTime() - nextDay.getTime()) / (1000 * 60 * 60 * 24));
        if (dayDiff === 1) {
            streak++;
        } else {
            break;
        }
    }
    
    // نضيف 1 لأننا حسبنا الفروق، واليوم الأول يُحسب كـ 1
    return streak + 1; 
}

function updateStreakDisplay(streak) {
    const counter = document.getElementById('streak-counter');
    const flame = document.getElementById('streak-flame');
    const number = document.getElementById('streak-number');
    
    if (!counter || !flame || !number) return;
    
    // تحديث الرقم
    number.textContent = streak;
    
    // إزالة جميع الحالات السابقة
    counter.classList.remove('has-streak', 'mega-streak');
    flame.classList.remove('active');
    
    if (streak >= 3) {
        // 🔥 شعلة نشطة جداً (3 أيام فأكثر)
        flame.classList.add('active');
        counter.classList.add('mega-streak');
    } else if (streak >= 2) {
        // 🔥 شعلة نشطة (يومان)
        flame.classList.add('active');
        counter.classList.add('has-streak');
    } else if (streak === 1) {
        // 💤 شعلة منطفئة (يوم واحد)
        flame.classList.remove('active');
        counter.classList.add('has-streak');
    } else {
        // ⚫ لا يوجد streak
        flame.classList.remove('active');
    }
    
    // تحديث الـ Tooltip
    const isAr = currentLang === 'ar';
    const tooltipText = isAr 
        ? `${streak} ${streak === 1 ? 'يوم' : (streak === 2 ? 'يومان' : (streak <= 10 ? 'أيام' : 'يومًا'))} متتالية`
        : `${streak} day${streak !== 1 ? 's' : ''} streak`;
    counter.title = tooltipText;
    
    // 📊 Analytics tracking (فقط إذا كان streak مهم)
    if (streak >= 3 && !sessionStorage.getItem('streak_tracked_today')) {
        trackEvent('streak_achieved', {
            'streak_days': streak
        });
        sessionStorage.setItem('streak_tracked_today', 'true');
    }
}

// ==================== POKÉDEX SYSTEM (NEW) ====================
function showPokedexModal() {
const modal = document.getElementById('pokedex-modal');
if (!modal) return;

// 🎵 صوت فتح الموسوعة
if (window.audioManager) {
window.audioManager.play('ui-click');
}

// 🔄 جلب أحدث بيانات الموسوعة من السحابة (إن كان مسجّل دخول)
if (window.firebaseDB && window.firebaseDB.isLoggedIn()) {
    window.firebaseDB.fetchUserData().then(cloudData => {
        if (cloudData && cloudData.stats) {
            localStorage.setItem('quiz_stats', JSON.stringify(cloudData.stats));
            if (typeof loadUserStats === 'function') loadUserStats();
            showPokedexList(); // إعادة العرض بالبيانات الجديدة
        }
    }).catch(() => {});
}

// إظهار عرض القائمة افتراضياً
showPokedexList();

modal.classList.add('show');
trapFocus(modal);

// ♿ التركيز على زر الإغلاق
setTimeout(() => {
const closeBtn = modal.querySelector('.modal-close');
if (closeBtn) closeBtn.focus();
}, 100);

// 📊 Analytics tracking
trackEvent('pokedex_opened');
}

function closePokedexModal() {
const modal = document.getElementById('pokedex-modal');
if (!modal) return;
modal.classList.remove('show');
removeFocusTrap(modal);
}

function showPokedexList() {
    const grid = document.getElementById('pokedex-grid');
    const backBtn = document.getElementById('pokedex-back-btn');
    const countEl = document.getElementById('pokedex-count');
    const percentEl = document.getElementById('pokedex-percent');
    const fillEl = document.getElementById('pokedex-progress-fill');
    const titleEl = document.getElementById('pokedex-modal-title');
    const progressWrapper = document.querySelector('.pokedex-progress-wrapper');

    if (!grid) return;

    const isAr = currentLang === 'ar';
    // تحديث العنوان
    if (titleEl) titleEl.textContent = isAr ? 'موسوعة المخلوقات' : 'Creatures Guide';

    // ✨ إظهار شريط التقدم مرة أخرى
    if (progressWrapper) progressWrapper.style.display = 'block';
    
    // إظهار الشبكة وإخفاء زر الرجوع
    grid.style.display = 'grid';
    if (backBtn) backBtn.style.display = 'none';

// جلب بيانات المخلوقات
const data = quizzesData[currentLang];
const allCreatures = data.quizzes[0].results;
const discoveredIds = userStats.creatures ? Object.keys(userStats.creatures) : [];

// تحديث شريط التقدم
const discoveredCount = discoveredIds.length;
const totalCount = allCreatures.length;
const percent = totalCount > 0 ? Math.round((discoveredCount / totalCount) * 100) : 0;

if (countEl) {
countEl.textContent = isAr
? `اكتشفت ${discoveredCount} من ${totalCount}`
: `Discovered ${discoveredCount} of ${totalCount}`;
}
if (percentEl) percentEl.textContent = `${percent}%`;
if (fillEl) fillEl.style.width = `${percent}%`;

// بناء بطاقات المخلوقات
grid.innerHTML = '';
allCreatures.forEach(creature => {
const isDiscovered = discoveredIds.includes(creature.id);
const count = isDiscovered ? (userStats.creatures[creature.id] || 0) : 0;

const card = document.createElement('div');
card.className = `pokedex-card ${isDiscovered ? 'discovered' : 'locked'}`;

if (isDiscovered) {
// 🎴 مخلوق مكتشف
const rarityClass = `rarity-${creature.rarity.replace(/\s+/g, '-')}`;
card.innerHTML = `
<div class="pokedex-image-wrapper">
<img src="${creature.image}" alt="${creature.name}" loading="lazy">
</div>
<div class="pokedex-info">
<h4 class="pokedex-name">${creature.name}</h4>
<span class="pokedex-rarity ${rarityClass}">${creature.rarity}</span>
${count > 1 ? `<div class="pokedex-count">×${count}</div>` : ''}
</div>
`;
card.onclick = () => showCreatureDetails(creature.id);
} else {
// 🔒 مخلوق مقفل
card.innerHTML = `
<div class="pokedex-image-wrapper">
<img src="${creature.image}" alt="???" loading="lazy">
<div class="pokedex-lock-overlay">
<i class="fas fa-question"></i>
</div>
</div>
<div class="pokedex-info">
<h4 class="pokedex-name">???</h4>
<span class="pokedex-rarity locked-rarity">${isAr ? 'غير مكتشف' : 'Undiscovered'}</span>
</div>
`;
// لا يوجد onclick للمخلوقات المقفلة
}

grid.appendChild(card);
});
}

function showCreatureDetails(creatureId) {
    const grid = document.getElementById('pokedex-grid');
    const backBtn = document.getElementById('pokedex-back-btn');
    const titleEl = document.getElementById('pokedex-modal-title');
    const progressWrapper = document.querySelector('.pokedex-progress-wrapper');

    if (!grid) return;

    const isAr = currentLang === 'ar';
    const creature = findCreatureById(creatureId);
    if (!creature) return;

    const count = userStats.creatures[creatureId] || 0;
    const rarityClass = `rarity-${creature.rarity.replace(/\s+/g, '-')}`;

    // تحديث العنوان
    if (titleEl) titleEl.textContent = creature.name;

    // ✨ إخفاء شريط التقدم عند عرض التفاصيل
    if (progressWrapper) progressWrapper.style.display = 'none';
    
    // إظهار زر الرجوع
    if (backBtn) backBtn.style.display = 'flex';

// استبدال محتوى الشبكة بتفاصيل المخلوق
grid.innerHTML = `
<div class="pokedex-details-view" style="grid-column: 1 / -1;">
<img src="${creature.image}" alt="${creature.name}" class="pokedex-details-image">
<h2 class="pokedex-details-name">${creature.name}</h2>
<span class="pokedex-rarity ${rarityClass} pokedex-details-rarity">${creature.rarity}</span>
<p class="pokedex-details-description">${creature.description || creature.article || ''}</p>
<div class="pokedex-details-stats">
<div class="pokedex-stat-card">
<div class="pokedex-stat-label">${isAr ? 'عدد مرات الاكتشاف' : 'Times Discovered'}</div>
<div class="pokedex-stat-value">×${count}</div>
</div>
<div class="pokedex-stat-card">
<div class="pokedex-stat-label">${isAr ? 'الشفارة' : 'Badge'}</div>
<div class="pokedex-stat-value" style="font-size: 1rem;">${creature.badge || '—'}</div>
</div>
</div>
</div>
`;

// 🎵 صوت فتح التفاصيل
if (window.audioManager) {
window.audioManager.play('ui-click');
}

// 📊 Analytics tracking
trackEvent('pokedex_creature_viewed', {
'creature_id': creatureId,
'creature_name': creature.name
});
}


// ==================== TIME & DATE HELPERS (NEW) ====================
function getCurrentHour() {
    return new Date().getHours();
}

function isNightOwlTime() {
    const hour = getCurrentHour();
    return hour >= 0 && hour < 5; // بين 12 ليلاً و 5 فجراً
}

function isEarlyBirdTime() {
    const hour = getCurrentHour();
    return hour >= 5 && hour < 8; // بين 5 و 8 صباحاً
}

function recordVisitDay() {
    const today = new Date().toDateString();
    if (!userStats.visitDays) {
        userStats.visitDays = [];
    }
    if (!userStats.visitDays.includes(today)) {
        userStats.visitDays.push(today);
        // نحتفظ بآخر 30 يوم فقط
        if (userStats.visitDays.length > 30) {
            userStats.visitDays.shift();
        }
        localStorage.setItem('quiz_stats', JSON.stringify(userStats));
        
        // ☁️ إخبار السيرفر فوراً بالزيارة الجديدة
        if (window.firebaseDB && window.firebaseDB.isLoggedIn()) {
            window.firebaseDB.syncGameData();
        }
    }
}


function getQuizDurationSeconds() {
    if (!quizStartTime) return 0;
    return Math.floor((Date.now() - quizStartTime) / 1000);
}

// ==================== THEME MANAGEMENT ====================

// 🎨 تعريف كل السمات المتاحة (للمودال وللتبديل السريع)
const THEMES = {
    dark: {
        id: 'dark',
        icon: '🌑',
        name: { ar: 'الداكن', en: 'Dark' },
        desc: { ar: 'السمة الافتراضية', en: 'Default theme' },
        previewClass: 'theme-preview-dark',
        toggleIcon: 'fas fa-moon'
    },
    light: {
        id: 'light',
        icon: '☀️',
        name: { ar: 'الفاتح', en: 'Light' },
        desc: { ar: 'نهاري سماوي', en: 'Soft azure day' },
        previewClass: 'theme-preview-light',
        toggleIcon: 'fas fa-sun'
    },
    cyberpunk: {
        id: 'cyberpunk',
        icon: '🌌',
        name: { ar: 'سايبربونك', en: 'Cyberpunk' },
        desc: { ar: 'نيون ومستقبل', en: 'Neon future' },
        previewClass: 'theme-preview-cyberpunk',
        toggleIcon: 'fas fa-microchip'
    },
    nature: {
        id: 'nature',
        icon: '🌿',
        name: { ar: 'الطبيعة', en: 'Nature' },
        desc: { ar: 'غابة عند الغروب', en: 'Forest at sunset' },
        previewClass: 'theme-preview-nature',
        toggleIcon: 'fas fa-leaf'
    },
    space: {
        id: 'space',
        icon: '🚀',
        name: { ar: 'الفضاء', en: 'Space' },
        desc: { ar: 'نجوم وكواكب', en: 'Stars & planets' },
        previewClass: 'theme-preview-space',
        toggleIcon: 'fas fa-rocket'
    },
    retro: {
        id: 'retro',
        icon: '🕹️',
        name: { ar: 'ريترو 80s', en: 'Retro 80s' },
        desc: { ar: 'Synthwave زاهي', en: 'Vivid synthwave' },
        previewClass: 'theme-preview-retro',
        toggleIcon: 'fas fa-gamepad'
    }
};

// السمات التي تستخدم class على html (غير الداكن الافتراضي)
const THEME_HTML_CLASSES = {
    light: 'light-mode',
    cyberpunk: 'theme-cyberpunk',
    nature: 'theme-nature',
    space: 'theme-space',
    retro: 'theme-retro'
};

function initializeTheme(savedTheme) {
    let preferredTheme = savedTheme;
    if (preferredTheme === 'auto' || !THEMES[preferredTheme]) {
        preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    // 🔒 إن كانت السمة المحفوظة مقفلة الآن (مثلاً بعد حذف البيانات)، ارجع للداكن
    if (typeof isThemeLocked === 'function' && isThemeLocked(preferredTheme)) {
        preferredTheme = 'dark';
        localStorage.setItem('quiz_theme', 'dark');
    }
    applyTheme(preferredTheme);
}

function applyTheme(theme) {
    // التحقق من صحة السمة، والرجوع للداكن عند عدم التعرّف
    if (!THEMES[theme]) theme = 'dark';
    // 🔒 التحقق من قفل السمة (إن لم تكن محفوظة سابقاً = مفتوحة فعلاً)
    if (typeof isThemeLocked === 'function' && isThemeLocked(theme)) {
        const isAr = currentLang === 'ar';
        if (typeof showThemeLockedMessage === 'function') showThemeLockedMessage(theme);
        return; // لا تطبّق السمة المقفلة
    }
    currentTheme = theme;
    const html = document.documentElement;

    // إزالة كل classes السمات أولاً
    Object.values(THEME_HTML_CLASSES).forEach(cls => html.classList.remove(cls));

    // تطبيق class السمة المختارة
    const themeClass = THEME_HTML_CLASSES[theme];
    if (themeClass) {
        html.classList.add(themeClass);
    }

    // 🎨 تحديث خطوط الجسم حسب السمة
    applyThemeTypography(theme);
}

// 🎨 تطبيق الخطوط والـ theme-color المناسبين لكل سمة
function applyThemeTypography(theme) {
    const body = document.body;
    if (!body) return;

    // إزالة classes الخطوط السابقة
    body.classList.remove('font-cyberpunk', 'font-retro', 'font-nature');

    if (theme === 'cyberpunk') {
        body.style.fontFamily = "'Orbitron', 'Cairo', sans-serif";
        body.classList.add('font-cyberpunk');
    } else if (theme === 'retro') {
        // نصوص العناوين فقط بأسلوب البكسل؛ نحتفظ بـ Cairo للنصوص العربية القابلة للقراءة
        body.style.fontFamily = "'Cairo', sans-serif";
        body.classList.add('font-retro');
    } else if (theme === 'nature') {
        // النصوص الأساسية تبقى Cairo للقراءة؛ العناوين تأخذ Amiri عبر CSS (html.theme-nature h1/h2)
        body.style.fontFamily = "'Cairo', sans-serif";
        body.classList.add('font-nature');
    } else {
        body.style.fontFamily = "'Cairo', sans-serif";
    }

    // تحديث <meta name="theme-color"> ليتناسب مع لون السمة (تحسين PWA/الموبايل)
    const themeColors = {
        dark: '#0f172a',
        light: '#f0f9ff',
        cyberpunk: '#0a0a0f',
        nature: '#1a2a1f',
        space: '#020617',
        retro: '#1a0033'
    };
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor && themeColors[theme]) {
        metaThemeColor.setAttribute('content', themeColors[theme]);
    }
}

function toggleTheme() {
    // تبديل سريع بين الداكن والفاتح فقط (السمات الأخرى عبر المودال)
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('quiz_theme', newTheme);
    updateThemeToggleIcon();
    if (!isQuizActive) {
        renderQuizGrid();
    }
}

function updateThemeToggleIcon() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    const themeData = THEMES[currentTheme] || THEMES.dark;
    const isAr = currentLang === 'ar';

    // زر التبديل السريع يبقى يتنقل بين داكن/فاتح
    if (currentTheme === 'dark' || currentTheme === 'light') {
        const iconClass = currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        themeToggleBtn.innerHTML = `<i class="${iconClass}" aria-hidden="true"></i>`;
        themeToggleBtn.title = isAr
            ? (currentTheme === 'dark' ? 'تبديل للوضع النهاري' : 'تبديل للوضع الليلي')
            : (currentTheme === 'dark' ? 'Switch to Light' : 'Switch to Dark');
    } else {
        // عند تفعيل سمة مخصصة، نعرض أيقونتها لإعلام المستخدم بالسمة الحالية
        themeToggleBtn.innerHTML = `<i class="${themeData.toggleIcon}" aria-hidden="true"></i>`;
        themeToggleBtn.title = isAr
            ? `السمة الحالية: ${themeData.name.ar} — اضغط للداكن/الفاتح`
            : `Current: ${themeData.name.en} — click for dark/light`;
    }

    // 🎵 تحديث أيقونة الموسيقى في الشاشة الترحيبية
    const welcomeMusicBtn = document.getElementById('welcome-music-btn');
    if (welcomeMusicBtn && window.audioManager) {
        const icon = welcomeMusicBtn.querySelector('i');
        if (icon) {
            icon.className = window.audioManager.settings.musicEnabled
                ? 'fas fa-volume-up'
                : 'fas fa-volume-mute';
        }
    }
}

// ==================== THEME PICKER MODAL (NEW) ====================
function showThemeModal() {
    const modal = document.getElementById('theme-picker-modal');
    if (!modal) return;

    // تحديث العناوين النصية حسب اللغة
    const isAr = currentLang === 'ar';
    const titleEl = document.getElementById('theme-picker-title');
    const hintEl = document.getElementById('theme-picker-hint');
    if (titleEl) titleEl.textContent = isAr ? 'السمات' : 'Themes';
    if (hintEl) hintEl.textContent = isAr
        ? 'اختر سمتك المفضلة — تُطبَّق فوراً على كامل الموقع'
        : 'Choose your favorite theme — applied instantly site-wide';

    renderThemePickerGrid();

    modal.classList.add('show');
    if (typeof trapFocus === 'function') trapFocus(modal);
    setTimeout(() => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
    }, 100);

    if (typeof trackEvent === 'function') {
        trackEvent('theme_picker_open');
    }
}

function closeThemeModal() {
    const modal = document.getElementById('theme-picker-modal');
    if (!modal) return;
    modal.classList.remove('show');
    if (typeof removeFocusTrap === 'function') removeFocusTrap(modal);
}

function renderThemePickerGrid() {
    const grid = document.getElementById('theme-picker-grid');
    if (!grid) return;

    const isAr = currentLang === 'ar';
    grid.innerHTML = '';

    Object.values(THEMES).forEach(theme => {
        const isActive = currentTheme === theme.id;
        // 🔒 التحقق من القفل
        const locked = (typeof isThemeLocked === 'function') ? isThemeLocked(theme.id) : false;
        const lockText = locked ? ((typeof getThemeLockText === 'function') ? getThemeLockText(theme.id) : '') : '';

        const card = document.createElement('div');
        card.className = `theme-card ${theme.previewClass} ${isActive ? 'active' : ''} ${locked ? 'locked' : ''}`;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', locked ? '-1' : '0');
        card.setAttribute('aria-label', `${isAr ? theme.name.ar : theme.name.en} ${isActive ? (isAr ? '(مفعّلة)' : '(active)') : ''} ${locked ? (isAr ? '(مقفلة)' : '(locked)') : ''}`);
        if (locked) card.setAttribute('aria-disabled', 'true');

        const name = isAr ? theme.name.ar : theme.name.en;
        const desc = isAr ? theme.desc.ar : theme.desc.en;

        card.innerHTML = `
            ${isActive ? `<span class="theme-card-badge"><i class="fas fa-check"></i> ${isAr ? 'الحالية' : 'Active'}</span>` : ''}
            ${locked ? `<span class="theme-card-lock"><i class="fas fa-lock"></i></span>` : ''}
            <div class="theme-card-content ${locked ? 'blurred' : ''}">
                <div class="theme-card-icon">${theme.icon}</div>
                <div class="theme-card-name">${name}</div>
                <div class="theme-card-desc">${locked ? lockText : desc}</div>
            </div>
        `;

        if (locked) {
            // عند الضغط على سمة مقفلة → رسالة القفل
            const showLock = () => showThemeLockedMessage(theme.id);
            card.addEventListener('click', showLock);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showLock();
                }
            });
        } else {
            // التطبيق عند النقر أو الضغط بـ Enter/Space
            const activate = () => selectTheme(theme.id);
            card.addEventListener('click', activate);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    activate();
                }
            });
        }

        grid.appendChild(card);
    });
}

function selectTheme(themeId) {
    if (!THEMES[themeId]) return;

    // 🔒 التحقق من القفل قبل أي شيء
    if (typeof isThemeLocked === 'function' && isThemeLocked(themeId)) {
        if (typeof showThemeLockedMessage === 'function') showThemeLockedMessage(themeId);
        return;
    }

    // 🎵 مؤثر صوتي للنقر
    if (window.audioManager) {
        window.audioManager.play('ui-click');
    }

    applyTheme(themeId);
    localStorage.setItem('quiz_theme', themeId);
    updateThemeToggleIcon();

    // إعادة عرض البطاقات لإظهار شارة "الحالية" على السمة الجديدة
    renderThemePickerGrid();

    // إعادة عرض بطاقات الاختبار لتتماشى مع السمة الجديدة
    if (!isQuizActive) {
        renderQuizGrid();
    }

    if (typeof trackEvent === 'function') {
        trackEvent('theme_changed', { theme: themeId });
    }
}

// 🔒 رسالة السمة المقفلة
function showThemeLockedMessage(themeId) {
    const isAr = currentLang === 'ar';
    const themeName = THEMES[themeId] ? (isAr ? THEMES[themeId].name.ar : THEMES[themeId].name.en) : themeId;
    const lockText = typeof getThemeLockText === 'function' ? getThemeLockText(themeId) : '';
    const message = isAr
        ? `🔒 السمة "${themeName}" مقفلة\nتحتاج: ${lockText}`
        : `🔒 Theme "${themeName}" is locked\nRequires: ${lockText}`;
    if (typeof showProfileNotification === 'function') {
        showProfileNotification(message, 'error');
    }
    if (typeof trackEvent === 'function') {
        trackEvent('theme_locked_attempt', { theme: themeId });
    }
}

// ==================== SOCIAL LINKS ====================
function renderSocialLinks() {
    const container = document.getElementById('social-links');
    if (!container) return;
    container.innerHTML = '';
    if (typeof config !== 'undefined' && config.socialLinks) {
        const links = [
            { id: 'facebook', icon: 'fab fa-facebook-f' },
            { id: 'twitter', icon: 'fab fa-twitter' },
            { id: 'instagram', icon: 'fab fa-instagram' },
            { id: 'youtube', icon: 'fab fa-youtube' },
            { id: 'telegram', icon: 'fab fa-telegram-plane' }
        ];

        links.forEach(link => {
            if (config.socialLinks[link.id]) {
                const a = document.createElement('a');
                a.href = config.socialLinks[link.id];
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                a.className = "w-10 h-10 rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-all transform hover:scale-110 theme-bg-tertiary theme-text-primary";
                a.innerHTML = `<i class="${link.icon}"></i>`;
                container.appendChild(a);
            }
        });
    }
}

// ==================== SKELETON LOADERS ====================

// ⏳ Question Skeleton Loader (NEW)
function showQuestionSkeleton(isVisual = false) {
    const container = document.getElementById('quiz-container');
    if (!container) return;
    
    let skeletonHtml = `
        <div class="question-skeleton">
            <div class="skeleton-progress"></div>
            <div class="skeleton-title"></div>
    `;
    
    if (isVisual) {
        skeletonHtml += `
            <div class="skeleton-visual-grid">
                <div class="skeleton-visual-option"></div>
                <div class="skeleton-visual-option"></div>
                <div class="skeleton-visual-option"></div>
                <div class="skeleton-visual-option"></div>
            </div>
        `;
    } else {
        skeletonHtml += `
            <div class="skeleton-options">
                <div class="skeleton-option"></div>
                <div class="skeleton-option"></div>
                <div class="skeleton-option"></div>
                <div class="skeleton-option"></div>
                <div class="skeleton-option"></div>
            </div>
        `;
    }
    
    skeletonHtml += `</div>`;
    container.innerHTML = skeletonHtml;
}

function showSkeletonLoaders() {
    const grid = document.getElementById('quiz-grid');
    const skeletonGrid = document.getElementById('skeleton-grid');
    grid.classList.add('hidden');
    skeletonGrid.classList.remove('hidden');
}

function hideSkeletonLoaders() {
    const grid = document.getElementById('quiz-grid');
    const skeletonGrid = document.getElementById('skeleton-grid');
    skeletonGrid.classList.add('hidden');
    grid.classList.remove('hidden');
}

// ==================== LANGUAGE MANAGEMENT ====================
function showLanguageScreen() {
    document.getElementById('language-screen').classList.remove('opacity-0', 'pointer-events-none');
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('quiz_lang', lang);
    const data = quizzesData[lang];
    document.getElementById('site-title').innerText = data.title;
    document.getElementById('hero-title').innerText = data.heroTitle;
    document.getElementById('hero-subtitle').innerText = data.heroSubtitle;
    document.getElementById('footer-desc').innerText = data.footerDesc;
    document.getElementById('lang-btn-text').innerText = lang === 'ar' ? 'العربية' : 'English';

    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    // 🌟 --- بداية الأكواد الجديدة لترجمة القائمة الجانبية --- 🌟
    if (document.getElementById('drawer-pokedex-text')) {
        document.getElementById('drawer-pokedex-text').innerText = lang === 'ar' ? 'موسوعة المخلوقات' : 'Creatures Guide';
    }
    if (document.getElementById('drawer-store-text')) {
        document.getElementById('drawer-store-text').innerText = lang === 'ar' ? 'متجر الأساطير' : 'Mythical Store';
    }
    if (document.getElementById('drawer-inventory-text')) {
        document.getElementById('drawer-inventory-text').innerText = lang === 'ar' ? 'الخزنة' : 'My Vault';
    }
    // 🌟 --- نهاية الأكواد الجديدة --- 🌟

    // 🌟 --- ترجمة روابط الفوتر --- 🌟
    if (document.getElementById('footer-about-link')) {
        document.getElementById('footer-about-link').innerText = lang === 'ar' ? 'من نحن' : 'About Us';
    }
    if (document.getElementById('footer-contact-link')) {
        document.getElementById('footer-contact-link').innerText = lang === 'ar' ? 'اتصل بنا' : 'Contact Us';
    }
    if (document.getElementById('footer-privacy-link')) {
        document.getElementById('footer-privacy-link').innerText = lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy';
    }
    if (document.getElementById('footer-terms-link')) {
        document.getElementById('footer-terms-link').innerText = lang === 'ar' ? 'شروط الاستخدام' : 'Terms of Use';
    }
    // 🌟 --- نهاية ترجمة روابط الفوتر --- 🌟

    renderQuizGrid();
    document.getElementById('language-screen').classList.add('opacity-0', 'pointer-events-none');

    // 🔄 إذا جاء من الشاشة الترحيبية، أعد إظهارها
    const fromWelcome = sessionStorage.getItem('from_welcome_screen');
    if (fromWelcome === 'true') {
        sessionStorage.removeItem('from_welcome_screen');
    
        // إعادة ملء الشاشة الترحيبية باللغة الجديدة
        renderWelcomeScreenContent();
    
        // إظهار الشاشة الترحيبية مرة أخرى
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.classList.remove('hidden');
        }
    }

    // 🔄 إعادة ملء الشاشة الترحيبية إذا كانت ظاهرة
    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen && !welcomeScreen.classList.contains('hidden')) {
        renderWelcomeScreenContent();
    }

    // 🔄 تحديث القائمة الجانبية والإعدادات باللغة الجديدة (إن وُجدتا)
    if (typeof updateDrawerContent === 'function') updateDrawerContent();
    if (typeof updateSettingsModalContent === 'function') updateSettingsModalContent();
    if (typeof updateSettingsToggleStates === 'function') updateSettingsToggleStates();
}

// ==================== LAZY LOADING HELPER ====================
function loadScript(src) {
    return new Promise((resolve, reject) => {
        // تحقق من أن السكريبت لم يُحمّل مسبقاً
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// ============================================================
// 📦 دوال بنك الأسئلة الجديد
// ============================================================

async function loadQuestionBank() {
    try {
        // ✅ البنك يُحمّل تلقائياً عبر script tag في index.html
        // نتحقق من توافر الدوال المطلوبة فقط
        if (typeof questionBank !== 'undefined' && 
            typeof selectRandomQuestions === 'function') {
            questionBankLoaded = true;
            console.log('✅ Question bank loaded: 150 questions');
        } else {
            console.warn('⚠️ Question bank not loaded yet');
        }
    } catch (e) {
        console.warn('⚠️ Question bank loading error:', e);
        questionBankLoaded = false;
    }
}


// ==================== QUIZ GRID ====================
function renderQuizGrid() {
    isQuizActive = false;
    document.body.classList.remove('quiz-active'); // إعادة ظهور FAB
    showSkeletonLoaders();

    // 🚀 Lazy Loading للصور - تحمل فقط عند الاقتراب منها
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                }
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px', // ابدأ التحميل قبل 50px من الوصول للصورة
        threshold: 0.01
    });
    const delay = navigator.connection?.effectiveType === '4g' ? 300 : 500;
    setTimeout(() => {
        const grid = document.getElementById('quiz-grid');
        const data = quizzesData[currentLang];
        grid.innerHTML = '';

        data.quizzes.forEach((quiz, index) => {
            const card = document.createElement('div');
            card.className = `quiz-card group rounded-3xl overflow-hidden cursor-pointer flex flex-col animate-fade-in`;
            card.style.animationDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <div class="relative h-56 overflow-hidden">
                    <img data-src="${quiz.image}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E" alt="${quiz.title}" loading="lazy" decoding="async" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-0 transition-opacity duration-500">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div class="absolute top-4 right-4 badge-rarity text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl">
                        ${quiz.badge}
                    </div>
                </div>
                <div class="p-6 flex-grow flex flex-col">
                    <h3 class="text-xl font-bold mb-3 group-hover:text-accent transition-colors theme-text-primary">${quiz.title}</h3>
                    <p class="theme-text-secondary text-sm mb-6 flex-grow leading-relaxed">${quiz.description}</p>
                    <button class="btn-primary w-full py-3 rounded-xl font-bold transition-all transform active:scale-95">
                        ${currentLang === 'ar' ? 'ابدأ الاختبار 🎭' : 'Start Quiz 🎭'}
                    </button>
                </div>
            `;
            card.onclick = () => {
                if (typeof config !== 'undefined' && config.features.showWelcomeScreen) {
                    showWelcomeScreen(quiz.id);
                } else {
                    startQuiz(quiz.id);
                }
            };
            grid.appendChild(card);
            });

            // 🚀 ابدأ مراقبة جميع الصور الجديدة
            const lazyImages = grid.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => {
                imageObserver.observe(img);
                // إضافة تأثير الظهور عند التحميل
                img.addEventListener('load', () => {
                    img.classList.remove('opacity-0');
                    img.classList.add('opacity-100');
                });
            });

            hideSkeletonLoaders();
    }, delay);
}

// ==================== WELCOME SCREEN ====================
function showWelcomeScreen(quizId) {
    isQuizActive = true;
    const data = quizzesData[currentLang];
    const quiz = data.quizzes.find(q => q.id === quizId);
    document.getElementById('quiz-grid').classList.add('hidden');
    document.getElementById('hero-section').classList.add('hidden');

    const container = document.getElementById('quiz-container');
    container.classList.remove('hidden');

    const isAr = currentLang === 'ar';
    container.innerHTML = `
        <div class="animate-fade-in text-center py-6">
            <h3 class="text-3xl font-bold mb-10 theme-text-primary">
                <i class="fas fa-lightbulb text-yellow-400 mr-3"></i>
                ${isAr ? 'كيف يعمل الاختبار؟' : 'How it works?'}
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                <div class="theme-bg-tertiary/20 p-5 rounded-2xl border theme-border">
                    <div class="text-3xl mb-3 text-accent"><i class="fas fa-dna"></i></div>
                    <h4 class="font-bold theme-text-primary mb-2">${isAr ? 'الهوية الهجينة' : 'Hybrid Identity'}</h4>
                    <p class="theme-text-secondary text-xs">${isAr ? 'نكتشف كائنك المهيمن وروحك المصاحبة.' : 'We discover your dominant creature and companion soul.'}</p>
                </div>
                <div class="theme-bg-tertiary/20 p-5 rounded-2xl border theme-border">
                    <div class="text-3xl mb-3 text-accent-secondary"><i class="fas fa-chart-pie"></i></div>
                    <h4 class="font-bold theme-text-primary mb-2">${isAr ? 'مخطط القوى' : 'Power Blueprint'}</h4>
                    <p class="theme-text-secondary text-xs">${isAr ? 'تحليل دقيق لـ 6 محاور لشخصيتك.' : 'Accurate analysis of 6 axes of your personality.'}</p>
                </div>
                <div class="theme-bg-tertiary/20 p-5 rounded-2xl border theme-border">
                    <div class="text-3xl mb-3 text-accent-secondary"><i class="fas fa-book-open"></i></div>
                    <h4 class="font-bold theme-text-primary mb-2">${isAr ? 'سرد قصصي' : 'Narrative Results'}</h4>
                    <p class="theme-text-secondary text-xs">${isAr ? 'نكتب لك قصة تصف يومك ككائن أسطوري.' : 'We write a story describing your day as a mythical being.'}</p>
                </div>
                <div class="theme-bg-tertiary/20 p-5 rounded-2xl border theme-border">
                    <div class="text-3xl mb-3 text-accent"><i class="fas fa-medal"></i></div>
                    <h4 class="font-bold theme-text-primary mb-2">${isAr ? 'الأوسمة والندرة' : 'Badges & Rarity'}</h4>
                    <p class="theme-text-secondary text-xs">${isAr ? 'احصل على أوسمة نادرة بناءً على تميزك.' : 'Get rare badges based on your uniqueness.'}</p>
                </div>
            </div>
            <button onclick="startQuiz('${quizId}')" class="btn-primary w-full py-4 text-white font-bold rounded-2xl shadow-lg transform hover:scale-[1.02] active:scale-95 transition-all">
                ${isAr ? 'فهمت، ابدأ الآن 🚀' : 'Got it, Start Now 🚀'}
            </button>
        </div>
    `;
}

// ==================== QUIZ ENGINE ====================
function startQuiz(quizId) {
    isQuizActive = true;
    document.body.classList.add('quiz-active'); // إخفاء FAB أثناء الاختبار
    
    const data = quizzesData[currentLang];
    currentQuiz = data.quizzes.find(q => q.id === quizId);
    currentStepId = 0;
    userResponses = [];
    quizStartTime = Date.now();  // ⚡ ابدأ تتبع الوقت
    
    // 🎲 اختيار 30 سؤال من بنك الأسئلة الجديد (5 من كل محور)
	if (!questionBankLoaded || typeof selectRandomQuestions !== 'function') {
    	console.error('❌ Question bank failed to load!');
    	showErrorToast(
        	currentLang === 'ar' 
            	? 'تعذر تحميل بنك الأسئلة. يرجى تحديث الصفحة.' 
            	: 'Failed to load question bank. Please refresh the page.',
        	currentLang === 'ar'
    	);
    	return; // إيقاف الاختبار
	}

	selectedQuestions = selectRandomQuestions(5);
	console.log('🎲 Selected 30 random questions from bank');

	// ✅ ضمان وجود axis لكل سؤال (احتياطياً)
	selectedQuestions.forEach(q => {
    	if (!q.axis) q.axis = 'intelligence';
	});
    
    document.getElementById('quiz-grid').classList.add('hidden');
    document.getElementById('hero-section').classList.add('hidden');
    
    const container = document.getElementById('quiz-container');
    container.classList.remove('hidden');
    
    // 🎵 تشغيل صوت بدء الاختبار
    if (window.audioManager) {
        window.audioManager.play('ui-click');
    }
    
    // 📊 تتبع بدء الاختبار
    trackEvent('quiz_start', {
        'quiz_id': quizId,
        'quiz_title': currentQuiz.title,
        'question_source': questionBankLoaded ? 'questionBank_30' : 'old_40',
        'language': currentLang
    });
    
    showStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showStep() {
    const question = selectedQuestions[currentStepId];
    
    // 🛡️ فحص أمان: إذا لم يكن هناك سؤال، انتقل للنتيجة
    if (!question) {
        showLoading();
        return;
    }
    const container = document.getElementById('quiz-container');
    const totalSteps = selectedQuestions.length; // ✅ من الـ 30 المختار
    const progress = ((currentStepId + 1) / totalSteps) * 100;
    const isRTL = currentLang === 'ar';
    const slideInClass = isRTL ? 'question-slide-in-rtl' : 'question-slide-in-ltr';
    const slideOutClass = isRTL ? 'question-slide-out-rtl' : 'question-slide-out-ltr';

    // ⏳ Show skeleton loader first (أسئلة نصية فقط)
    showQuestionSkeleton(false);
    
    // ⏳ Wait a bit for skeleton to render, then show real content
    setTimeout(() => {
        const currentContent = container.querySelector('.quiz-content-wrapper');
        if (currentContent) {
            currentContent.classList.add(slideOutClass);
            setTimeout(() => {
                renderQuestionContent(container, question, totalSteps, progress, slideInClass);
            }, 200);
        } else {
            renderQuestionContent(container, question, totalSteps, progress, slideInClass);
        }
    }, 150); // 150ms لإظهار الـ Skeleton قبل السؤال الحقيقي
}

function renderQuestionContent(container, question, totalSteps, progress, slideInClass) {
    let content = `
        <div class="quiz-content-wrapper ${slideInClass}">
            <div class="progress-wrapper">
                <div class="flex justify-between items-center mb-4">
                    <span class="text-xs font-bold text-accent uppercase tracking-widest">
                        ${currentLang === 'ar' ? 'السؤال' : 'Question'} ${currentStepId + 1} / ${totalSteps}
                    </span>
                    <span class="text-xs theme-text-muted">${Math.round(progress)}%</span>
                </div>
                <div class="progress-container">
                    <div id="dynamic-progress-bar" class="progress-bar transition-all duration-500" style="width: ${progress}%"></div>
                </div>
                <div id="dynamic-marker" class="dragon-marker transition-all duration-500" style="${currentLang === 'ar' ? 'right' : 'left'}: ${progress}%">🐉</div>
            </div>

            <div class="mb-10">
				<h2 class="text-2xl md:text-3xl font-bold theme-text-primary text-center leading-tight question-title-fade-in">${question.text?.[currentLang] || question.text || ''}</h2>
            </div>
    `;

    // ✅ تم حذف الأسئلة البصرية - جميع الأسئلة الآن من بنك Likert
    const questionText = question.text?.[currentLang] || question.text || '...';
    
    content += `
        <div class="space-y-3">
            ${[
                { text: currentLang === 'ar' ? 'أوافق بشدة' : 'Strongly Agree', value: 5, color: 'bg-green-600/20 border-green-500/50 hover:bg-green-600/40' },
                { text: currentLang === 'ar' ? 'أوافق' : 'Agree', value: 4, color: 'bg-blue-600/20 border-blue-500/50 hover:bg-blue-600/40' },
                { text: currentLang === 'ar' ? 'محايد' : 'Neutral', value: 3, color: 'theme-bg-tertiary/40 theme-border hover:theme-bg-tertiary/60' },
                { text: currentLang === 'ar' ? 'لا أوافق' : 'Disagree', value: 2, color: 'bg-orange-600/20 border-orange-500/50 hover:bg-orange-600/40' },
                { text: currentLang === 'ar' ? 'لا أوافق بشدة' : 'Strongly Disagree', value: 1, color: 'bg-red-600/20 border-red-500/50 hover:bg-red-600/40' }
            ].map((opt) => `
                <button onclick="handleLikert(event, ${opt.value}, '${question.axis || 'intelligence'}', ${question.reversed || false})" class="w-full p-4 text-center ${opt.color} border rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 font-bold theme-text-primary question-option-fade-in">
                    ${opt.text}
                </button>
            `).join('')}
        </div>
    `;
    
    content += `</div>`;

    container.innerHTML = content;
    updateVisualEvolution(progress);

    // ♿ Keyboard Navigation (التنقل بلوحة المفاتيح)
    setTimeout(() => {
        const options = container.querySelectorAll('button, [onclick]');
        if (options.length > 0) {
            // إضافة tabindex للخيارات
            options.forEach((opt, index) => {
                opt.setAttribute('tabindex', '0');
                opt.setAttribute('role', 'button');
                opt.setAttribute('aria-label', `الخيار ${index + 1}`);
            });
        
        // التركيز على أول خيار
            options[0].focus();
        }
    }, 100);
}


function updateVisualEvolution(progress) {
    const bar = document.getElementById('dynamic-progress-bar');
    const marker = document.getElementById('dynamic-marker');
    if (!bar || !marker) return;
    if (progress > 25) {
        bar.style.boxShadow = '0 0 15px rgba(168, 85, 247, 0.5)';
        marker.innerHTML = '✨';
    }
    if (progress > 50) {
        bar.style.background = 'linear-gradient(to right, #a855f7, #ec4899)';
        marker.innerHTML = '🔮';
    }
    if (progress > 75) {
        bar.style.boxShadow = '0 0 25px rgba(236, 72, 153, 0.7)';
        marker.innerHTML = '👑';
    }
}

function handleLikert(event, value, axis, reversed = false) {
    // ♿ إضافة تأثير بصري للخيار المحدد
    const clickedBtn = event?.target?.closest('button');
    if (clickedBtn) {
        clickedBtn.classList.add('option-selected');
        setTimeout(() => clickedBtn.classList.remove('option-selected'), 300);
    }
    
    // 🎵 صوت الضغط
    if (window.audioManager) {
        window.audioManager.play('ui-click');
    }
    
    const question = selectedQuestions[currentStepId]; // ✅ من البنك الجديد
    
    // 🔄 معالجة الأسئلة العكسية (reversed)
    const processedResponse = (typeof processResponse === 'function') 
        ? processResponse({ trait: question.trait || question.axis, value: value, axis: axis, reversed: reversed })
        : { trait: question.trait || question.axis, value: reversed ? (6 - value) : value, axis: axis };
    
    userResponses.push(processedResponse);
    nextStep();
}

function nextStep() {
    currentStepId++;
    if (currentStepId < selectedQuestions.length) {
        showStep();
    } else {
        showLoading();
    }
}

function showLoading() {
    const delay = typeof config !== 'undefined' ? config.analysisSpeed : 3000;
    const container = document.getElementById('quiz-container');
    container.innerHTML = `
        <div class="text-center py-20 animate-fade-in">
            <div class="relative w-32 h-32 mx-auto mb-10">
                <div class="absolute inset-0 border-4 rounded-full bg-accent-soft"></div>
                <div class="progress-bar absolute inset-0 border-4 border-t-transparent rounded-full animate-spin" style="background: none;"></div>
                <div class="absolute inset-4 border-4 rounded-full animate-spin-slow bg-accent-soft-strong" style="border-bottom-color: transparent;"></div>
            </div>
            <h2 class="gradient-title text-3xl font-bold mb-4 animate-pulse">
                ${currentLang === 'ar' ? 'جاري تحليل شخصيتك...' : 'Analyzing your psyche...'}
            </h2>
            <p class="theme-text-secondary text-lg">${currentLang === 'ar' ? 'نقوم بربط إجاباتك بالقوى الأسطورية القديمة' : 'Mapping your responses to ancient mythical forces'}</p>
        </div>
    `;
    setTimeout(showResult, delay);
}

// ==================== RETAKE QUIZ ====================
function retakeQuiz() {
    // 🛡️ حفظ البطاقات في السحابة قبل إعادة التحميل
    if (window.firebaseDB && window.firebaseDB.isLoggedIn()) {
        const cards = getUserCards();
        const stats = getUserStats();
        const achievements = JSON.parse(localStorage.getItem('quiz_achievements') || '{}');
        
        window.firebaseDB.syncGameData(stats, achievements, cards).then(() => {
            console.log('✅ Cards synced before retake');
            // زيادة عداد retakes
            if (!userStats.retakes) userStats.retakes = 0;
            userStats.retakes++;
            localStorage.setItem('quiz_stats', JSON.stringify(userStats));
            // إعادة التحميل
            location.reload();
        }).catch(err => {
            console.warn('⚠️ Sync failed before retake:', err);
            // إعادة التحميل حتى لو فشلت المزامنة
            location.reload();
        });
    } else {
        // إذا لم يكن مسجل دخول، فقط زد العداد وأعد التحميل
        if (!userStats.retakes) userStats.retakes = 0;
        userStats.retakes++;
        localStorage.setItem('quiz_stats', JSON.stringify(userStats));
        location.reload();
    }
}

// ==================== RESULT CALCULATION (FINGERPRINT MATCHING ALGORITHM) ====================
// 🧬 خوارزمية البصمة الكاملة (Cosine Similarity)
function calculateResult() {
    // 1. حساب نقاط كل محور (Axis) من إجابات المستخدم
    const axisScores = {
        intelligence: 0, energy: 0, empathy: 0, strategy: 0, mystery: 0, willpower: 0
    };
    const axisCounts = {
        intelligence: 0, energy: 0, empathy: 0, strategy: 0, mystery: 0, willpower: 0
    };

    userResponses.forEach(resp => {
        if (resp.axis && axisScores.hasOwnProperty(resp.axis)) {
            axisScores[resp.axis] += resp.value;
            axisCounts[resp.axis] += 1;
        }
    });

    // 2. تحويل النقاط إلى بصمة المستخدم (0-100 لكل محور)
    const userFingerprint = {};
    for (const axis in axisScores) {
        const maxPossible = axisCounts[axis] * 5;
        if (maxPossible > 0) {
            userFingerprint[axis] = Math.max(10, (axisScores[axis] / maxPossible) * 100);
        } else {
            userFingerprint[axis] = 50;
        }
    }

    // 3. دالة Cosine Similarity الرياضية
    function cosineSimilarity(vecA, vecB) {
        let dotProduct = 0;
        let magA = 0;
        let magB = 0;
        const axes = Object.keys(vecA);
        for (const axis of axes) {
            const a = vecA[axis] || 0;
            const b = vecB[axis] || 0;
            dotProduct += a * b;
            magA += a * a;
            magB += b * b;
        }
        const magnitude = Math.sqrt(magA) * Math.sqrt(magB);
        if (magnitude === 0) return 0;
        return dotProduct / magnitude;
    }

    // 4. حساب التوافق مع كل كائن باستخدام بصمته الكاملة
    const results = currentQuiz.results;
    let creatureScores = [];

    results.forEach(creature => {
        const creatureFingerprint = (typeof CREATURE_FINGERPRINTS !== 'undefined' && CREATURE_FINGERPRINTS[creature.id])
            ? CREATURE_FINGERPRINTS[creature.id]
            : null;

        let similarity;
        if (creatureFingerprint) {
            // ✨ الخوارزمية الجديدة: مطابقة كل المحاور الستة
            similarity = cosineSimilarity(userFingerprint, creatureFingerprint);
        } else {
            // Fallback للخوارزمية القديمة
            const axes = creature.axes || [];
            let total = 0;
            axes.forEach(axis => { total += (userFingerprint[axis] || 50); });
            similarity = axes.length > 0 ? (total / axes.length) / 100 : 0.5;
        }

        creatureScores.push({
            id: creature.id,
            score: similarity,
            compatibility: similarity * 100,
            rarity: creature.rarity,
            creature: creature
        });
    });

    // 5. 🎁 نظام الجدة (Novelty Bonus)
    try {
        const stats = getUserStats();
        const discoveredCreatures = stats.creatures ? Object.keys(stats.creatures) : [];

        creatureScores.forEach(score => {
            if (!discoveredCreatures.includes(score.id)) {
                score.score *= 1.10;
                score.compatibility = score.score * 100;
            }
        });
    } catch (e) {}

    // 6. ⚖️ كسر التعادل الرياضي العادل (ليس بالندرة!)
    creatureScores.sort((a, b) => {
        if (Math.abs(b.score - a.score) > 0.005) {
            return b.score - a.score;
        }
        return Math.random() - 0.5;
    });

    const winner = creatureScores[0];
    const secondary = creatureScores[1];

    const isBelowThreshold = winner.compatibility < 55;

    return {
        creature: winner.creature,
        secondaryCreature: secondary.creature,
        radar: userFingerprint,
        winnerId: winner.id,
        isBelowThreshold: isBelowThreshold,
        allScores: creatureScores
    };
}
// ==================== USER STATISTICS ====================
function loadUserStats() {
    const saved = localStorage.getItem('quiz_stats');
    userStats = saved ? JSON.parse(saved) : {};
}

async function saveUserStats(creatureId, durationSeconds = 0) {
    // 🛡️ النظام الآمن: السيرفر يحدّث الإحصائيات
    if (window.firebaseDB && window.firebaseDB.isLoggedIn() && window.sbClient) {
        try {
            const userId = window.firebaseDB.getCurrentUserId();
            const { data, error } = await window.sbClient.rpc('server_update_quiz_stats', {
                p_user_id: userId,
                p_creature_id: creatureId,
                p_duration_seconds: durationSeconds
            });
            if (!error && data) {
                userStats = data;
                localStorage.setItem('quiz_stats', JSON.stringify(userStats));
                return;
            }
        } catch (err) { console.error("Stats sync error:", err); }
    }

    // Fallback محلي للزوار
    if (!userStats.creatures) userStats.creatures = {};
    userStats.creatures[creatureId] = (userStats.creatures[creatureId] || 0) + 1;
    if (durationSeconds > 0) {
        if (!userStats.fastestQuiz || durationSeconds < userStats.fastestQuiz) {
            userStats.fastestQuiz = durationSeconds;
        }
    }
    localStorage.setItem('quiz_stats', JSON.stringify(userStats));
}


function getCreaturePercentage(creatureId) {
    if (!userStats.creatures) return 0;
    const total = Object.values(userStats.creatures).reduce((a, b) => a + b, 0);
    if (total === 0) return 0;
    return Math.round((userStats.creatures[creatureId] || 0) / total * 100);
}

// ==================== RESULT DISPLAY ====================
const creatureThemes = {
    dragon: { primary: '#dc2626', secondary: '#fbbf24', glow: 'rgba(220, 38, 38, 0.5)' },
    phoenix: { primary: '#ea580c', secondary: '#fbbf24', glow: 'rgba(234, 88, 12, 0.5)' },
    unicorn: { primary: '#ec4899', secondary: '#fce7f3', glow: 'rgba(236, 72, 153, 0.5)' },
    sphinx: { primary: '#8b5cf6', secondary: '#ddd6fe', glow: 'rgba(139, 92, 246, 0.5)' },
    kraken: { primary: '#0369a1', secondary: '#06b6d4', glow: 'rgba(3, 105, 161, 0.5)' },
    owl_of_athena: { primary: '#7c3aed', secondary: '#c4b5fd', glow: 'rgba(124, 58, 237, 0.5)' },
    centaur: { primary: '#059669', secondary: '#86efac', glow: 'rgba(5, 150, 105, 0.5)' },
    cerberus: { primary: '#1f2937', secondary: '#9ca3af', glow: 'rgba(31, 41, 55, 0.5)' },
    faun: { primary: '#84cc16', secondary: '#dcfce7', glow: 'rgba(132, 204, 22, 0.5)' },
    golem: { primary: '#6b7280', secondary: '#d1d5db', glow: 'rgba(107, 114, 128, 0.5)' },
    hydra: { primary: '#7f1d1d', secondary: '#fca5a5', glow: 'rgba(127, 29, 29, 0.5)' },
    kitsune: { primary: '#f97316', secondary: '#fed7aa', glow: 'rgba(249, 115, 22, 0.5)' },
    pegasus: { primary: '#3b82f6', secondary: '#bfdbfe', glow: 'rgba(59, 130, 246, 0.5)' },
    simurgh: { primary: '#d946ef', secondary: '#f0abfc', glow: 'rgba(217, 70, 239, 0.5)' },
    siren: { primary: '#06b6d4', secondary: '#cffafe', glow: 'rgba(6, 182, 212, 0.5)' },
    valkyrie: { primary: '#dc2626', secondary: '#fecaca', glow: 'rgba(220, 38, 38, 0.5)' }
};

function applyCreatureTheme(creatureId) {
    const theme = creatureThemes[creatureId] || creatureThemes.dragon;
    const resultContainer = document.getElementById('result-container');
    resultContainer.style.background = `linear-gradient(135deg, ${theme.glow} 0%, rgba(15, 23, 42, 0.8) 100%)`;
    resultContainer.style.borderRadius = '2.5rem';
    resultContainer.style.padding = '2rem';
    resultContainer.style.boxShadow = `0 0 60px ${theme.glow}`;
}

// ==================== COMPARISON VALIDATION ====================
function validateComparisonData(data) {
    if (!data || typeof data !== 'object') return false;
    if (!data.creatureId || typeof data.creatureId !== 'string') return false;
    if (!data.secondaryCreatureId || typeof data.secondaryCreatureId !== 'string') return false;
    if (!data.radarScores || typeof data.radarScores !== 'object') return false;

    // 🛡️ تحقق أمني: creatureId و secondaryCreatureId يجب أن يكونا كائنات أسطورية معروفة فعلاً
    // لمنع حقن HTML/JavaScript خبيث عبر بارامتر URL
    if (!findCreatureById(data.creatureId)) return false;
    if (!findCreatureById(data.secondaryCreatureId)) return false;

    const validAxes = ['intelligence', 'energy', 'empathy', 'strategy', 'mystery', 'willpower'];
    for (const axis of validAxes) {
        if (typeof data.radarScores[axis] !== 'number') return false;
    }
    return true;
}

function checkComparisonParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const compareParam = urlParams.get('compare');
    if (compareParam) {
        try {
            const decoded = JSON.parse(atob(compareParam));
            if (validateComparisonData(decoded)) {
                friendComparisonData = decoded;
                history.replaceState({}, document.title, window.location.pathname);
                const isAr = currentLang === 'ar';
                setTimeout(() => {
                    showConfirmDialog({
                        title: isAr ? '⚔️ تحدي مقارنة' : '⚔️ Comparison Challenge',
                        message: isAr
                            ? 'لقد تلقيت تحدي مقارنة! أكمل الاختبار لترى مدى توافقكما.'
                            : 'You received a comparison challenge! Complete the quiz to see your compatibility.',
                        okText: isAr ? 'هيا بنا!' : 'Let\'s go!',
                        cancelText: isAr ? 'لاحقاً' : 'Later',
                        okType: 'primary'
                    });
                }, 500);
            } else {
                console.warn('Invalid comparison data structure');
                friendComparisonData = null;
            }
        } catch (e) {
            console.error('Failed to parse comparison data:', e);
            friendComparisonData = null;
        }
    }
}

function calculateCompatibility(user1Data, user2Data) {
    let score = 0;
    if (user1Data.creatureId === user2Data.creatureId) {
        score += 50;
    }
    if (user1Data.secondaryCreatureId === user2Data.secondaryCreatureId) {
        score += 20;
    }

    let radarDiff = 0;
    const axes = Object.keys(user1Data.radarScores);
    for (const axis of axes) {
        if (user2Data.radarScores[axis] !== undefined) {
            radarDiff += Math.abs(user1Data.radarScores[axis] - user2Data.radarScores[axis]);
        }
    }
    score += Math.max(0, 30 - (radarDiff / axes.length));

    return Math.min(100, Math.round(score));
}

async function showResult() {
    isQuizActive = false;
    const { creature, secondaryCreature, radar, winnerId } = calculateResult();

    lastQuizResult = {
        creature: creature,
        secondaryCreature: secondaryCreature,
        radar: radar,
        winnerId: winnerId
    };

    let hasEnergy = true;
    const isAr = currentLang === 'ar';

    // ⚡ 1. التحقق من الطاقة وخصمها من السيرفر
    if (window.firebaseDB && window.firebaseDB.isLoggedIn() && window.sbClient) {
        const userId = window.firebaseDB.getCurrentUserId();
        const { data: energyData } = await window.sbClient.rpc('server_check_and_consume_energy', { p_user_id: userId });
        
        if (energyData && energyData.success) {
            const energyEl = document.getElementById('energy-header-count');
            if (energyEl) energyEl.textContent = `${energyData.remaining_energy}/5`;
        } else {
            hasEnergy = false;
            // 👈 إصلاح العداد الوهمي: إجبار الشاشة على إظهار 0/5
            const energyEl = document.getElementById('energy-header-count');
            if (energyEl) energyEl.textContent = `0/5`; 
            
            if (typeof showProfileNotification === 'function') {
                showProfileNotification(isAr ? '⚡ نفدت طاقتك! تلعب الآن للمتعة (لا توجد مكافآت)' : '⚡ Out of energy! Playing for fun (No rewards)', 'error');
            }
        }

    }

    let finalTier = 'common';

    // 🎁 2. إعطاء المكافآت (بطاقة، XP، إحصائيات) فقط إذا كان يملك طاقة
    if (hasEnergy) {
        // 🛡️ النظام الآمن: السيرفر يقرر البطاقة
        if (window.firebaseDB && window.firebaseDB.isLoggedIn() && window.sbClient) {
            try {
                const userId = window.firebaseDB.getCurrentUserId();
                const { data, error } = await window.sbClient.rpc('roll_or_upgrade_card', {
                    p_user_id: userId,
                    p_creature_id: winnerId
                });

                if (!error && data) {
                    finalTier = data.tier;
                    saveUserCards(data.full_cards_object);
                    if (typeof userCardInventory !== 'undefined') userCardInventory = data.card_inventory;
                } else {
                    finalTier = getOrAssignCardTier(winnerId);
                }
            } catch (err) {
                finalTier = getOrAssignCardTier(winnerId);
            }
        } else {
            const cards = getUserCards();
            if (cards[winnerId]) {
                finalTier = tryUpgradeCard(winnerId);
            } else {
                finalTier = getOrAssignCardTier(winnerId);
            }
        }

        const duration = getQuizDurationSeconds();
        await saveUserStats(winnerId, duration);
        if (typeof awardQuizXP === 'function') await awardQuizXP(winnerId, duration);
        await checkAchievements();
    }

    lastQuizResult.cardTier = finalTier;


    // 🔒 تأكيد حفظ البطاقة بشكل صحيح
    const verificationCards = getUserCards();
    console.log('🔍 Card verification after quiz complete:', verificationCards, 'Winner:', winnerId, 'Tier:', lastQuizResult.cardTier);

    const duration = getQuizDurationSeconds();
    await saveUserStats(winnerId, duration); // 👈 هنا يتم حفظ الإحصائيات والوقت بأمان في السيرفر

	if (typeof awardQuizXP === 'function') await awardQuizXP(winnerId, duration);

    applyCreatureTheme(winnerId);
    document.getElementById('quiz-container').classList.add('hidden');
    const container = document.getElementById('result-container');
    container.classList.remove('hidden');

    const percentage = getCreaturePercentage(winnerId);
    container.innerHTML = `
        <div class="theme-bg-secondary rounded-[2.5rem] overflow-hidden border theme-border shadow-2xl mb-12 animate-fade-in">
            <div class="relative h-[28rem] md:h-[35rem] overflow-hidden bg-slate-950">
                <img src="${creature.image}" loading="lazy" class="absolute inset-0 w-full h-full object-cover opacity-60 scale-105">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                
                <div class="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
                    <div class="flex justify-center gap-3 mb-8">
                        <span class="badge-rarity text-white px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg uppercase tracking-widest border border-white/10">
                            ${creature.rarity}
                        </span>
                        <span class="badge-creature text-white px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg uppercase tracking-widest border border-white/10">
                            ${creature.badge || 'Legend'}
                        </span>
                    </div>

                    <div class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-6">
                        <div class="flex flex-col items-center">
                            <span class="text-xs font-black text-accent-strong mb-2 uppercase tracking-tighter">${isAr ? 'المهيمن (70%)' : 'Dominant (70%)'}</span>
                            <h2 class="text-4xl md:text-7xl font-black text-white drop-shadow-2xl">${creature.name}</h2>
                        </div>
                        <span class="text-accent-strong opacity-50 text-4xl md:text-6xl font-light hidden md:block">×</span>
                        <div class="flex flex-col items-center">
                            <span class="text-xs font-black text-accent-secondary mb-2 uppercase tracking-tighter">${isAr ? 'المصاحب (30%)' : 'Companion (30%)'}</span>
                            <h2 class="text-2xl md:text-4xl font-black text-slate-400 drop-shadow-2xl">${secondaryCreature.name}</h2>
                        </div>
                    </div>

                    <p class="text-slate-400 font-medium text-sm md:text-lg mb-10 max-w-xl">
                        ${isAr ? 'لقد تم تحليل جوهرك ودمجه مع القوى القديمة' : 'Your essence has been analyzed and merged with ancient forces'}
                    </p>

                    <button onclick="toggleDetails()" class="group flex flex-col items-center gap-3 transition-all duration-500 hover:scale-110" aria-expanded="false" aria-controls="details-section">
                        <span class="text-xs font-bold text-accent uppercase tracking-[0.3em] group-hover:text-accent-strong">
                            ${isAr ? 'اكتشف أسرار هويتك' : 'Discover Your Identity Secrets'}
                        </span>
                        <div class="w-12 h-12 rounded-full border-2 border-accent-soft flex items-center justify-center group-hover:border-accent transition-colors">
                            <i id="expand-icon" class="fas fa-chevron-down text-accent-strong animate-bounce"></i>
                        </div>
                    </button>
                </div>
            </div>
            
            <div id="details-section" class="max-h-0 overflow-hidden transition-all duration-700 ease-in-out">
                <div class="p-4 sm:p-6 md:p-10 border-t theme-border">
                    <div class="grid grid-cols-1 gap-6 md:gap-10 mb-12 md:mb-20">
                        <div class="theme-bg-tertiary/20 p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border theme-border">
                            <div class="mb-4 md:mb-6">
                                <img src="${creature.image}" class="w-full h-40 md:h-48 object-cover rounded-xl md:rounded-2xl mb-3 md:mb-4 border-2 border-accent">
                                <h4 class="text-xl md:text-2xl font-bold theme-text-primary mb-1">${creature.name}</h4>
                                <span class="text-[10px] md:text-xs text-accent font-bold uppercase tracking-widest">${isAr ? 'الكيان المهيمن' : 'Dominant Entity'}</span>
                            </div>
                            <p class="theme-text-secondary leading-relaxed md:leading-loose text-xs sm:text-sm text-justify">
                                ${creature.article || creature.description}
                            </p>
                        </div>

                        <div class="theme-bg-tertiary/20 p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border theme-border">
                            <div class="mb-4 md:mb-6">
                                <img src="${secondaryCreature.image}" class="w-full h-40 md:h-48 object-cover rounded-xl md:rounded-2xl mb-3 md:mb-4 border-2 border-accent-secondary">
                                <h4 class="text-xl md:text-2xl font-bold theme-text-primary mb-1">${secondaryCreature.name}</h4>
                                <span class="text-[10px] md:text-xs text-accent-secondary font-bold uppercase tracking-widest">${isAr ? 'الروح المصاحبة' : 'Companion Soul'}</span>
                            </div>
                            <p class="theme-text-secondary leading-relaxed md:leading-loose text-xs sm:text-sm text-justify">
                                ${secondaryCreature.article || secondaryCreature.description}
                            </p>
                        </div>
                    </div>
        
                    <div class="mb-12 md:mb-20 text-center">
                        <div class="inline-block p-3 md:p-4 bg-accent-soft rounded-2xl md:rounded-3xl mb-4 md:mb-6">
                            <i class="fas fa-dna text-3xl md:text-4xl text-accent-strong"></i>
                        </div>
                        <h3 class="text-2xl md:text-3xl font-bold theme-text-primary mb-4 md:mb-6 px-2">
                            ${isAr ? 'التحليل النفسي للهوية الهجينة' : 'Hybrid Identity Psychoanalysis'}
                        </h3>
                        <div class="theme-bg-tertiary/10 p-5 sm:p-6 md:p-10 rounded-2xl md:rounded-[3rem] border-2 border-dashed theme-border relative">
                            <div class="absolute -top-3 -left-3 w-8 h-8 md:w-12 md:h-12 theme-bg-secondary flex items-center justify-center rounded-full border theme-border">
                                <i class="fas fa-quote-left text-sm md:text-base text-accent-strong"></i>
                            </div>
                            <p class="text-sm sm:text-base md:text-xl theme-text-secondary leading-relaxed md:leading-loose italic text-justify px-1">
                                "${creature.narrative || creature.description} ${isAr ? 'بينما تكمن في أعماقك روح' : 'While deep within lies the spirit of'} ${secondaryCreature.name} ${isAr ? 'التي تمنحك' : 'which grants you'} ${secondaryCreature.description.split('.')[0].toLowerCase()}."
                            </p>
                        </div>
                    </div>

                    <div class="mb-20">
                        <h3 class="text-3xl font-bold theme-text-primary mb-10 text-center">
                            ${isAr ? 'مخطط القوى (Power Blueprint)' : 'Power Blueprint'}
                        </h3>
                        <div class="max-w-md mx-auto theme-bg-tertiary/20 p-6 rounded-[2rem] border theme-border shadow-inner">
                            <canvas id="radarChart"></canvas>
                        </div>
                    </div>

                    <div class="relative p-1 secret-frame rounded-[2rem] overflow-hidden shadow-2xl">
                        <div class="relative p-10 theme-bg-primary rounded-[1.8rem] overflow-hidden">
                            <div id="cpa-locker" class="absolute inset-0 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center z-10 bg-black/20">
                                <div class="w-20 h-20 lock-icon-circle rounded-full flex items-center justify-center mb-6 border-4 border-white/10 shadow-inner">
                                    <i class="fas fa-lock text-3xl text-white"></i>
                                </div>
                                <h3 class="text-xl md:text-3xl font-bold mb-3 md:mb-4 theme-text-primary px-2">${isAr ? 'التقرير السري المتقدم' : 'Advanced Secret Report'}</h3>
                                <button onclick="unlockSecretReport()" class="btn-primary-solid px-8 py-3 rounded-full font-bold transition-all z-[60] cursor-pointer relative shadow-xl">
                                    ${isAr ? 'فتح التقرير السري' : 'Unlock Secret Report'}
                                </button>
                            </div>
                            <div id="secret-content" class="opacity-10 blur-xl transition-all duration-1000">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                                    <div class="mb-4 md:mb-0">
                                        <h4 class="text-lg md:text-2xl font-bold text-accent mb-3 md:mb-4">${isAr ? 'نمط قوتك:' : 'Power Pattern:'}</h4>
                                        <p class="theme-text-secondary text-xs sm:text-sm mb-4 md:mb-6 leading-relaxed text-justify">${creature.secretReport.strengths}</p>
                                    </div>
                                    <div>
                                        <h4 class="text-lg md:text-2xl font-bold text-accent-secondary mb-3 md:mb-4">${isAr ? 'نصيحة الكائن:' : 'Creature Advice:'}</h4>
                                        <p class="theme-text-secondary text-xs sm:text-sm mb-4 md:mb-6 leading-relaxed text-justify">${creature.advice || creature.secretReport.insight}</p>
                                    </div>
                                </div>
                                <div class="mt-4 md:mt-6 p-4 md:p-6 theme-bg-tertiary/20 border theme-border rounded-xl md:rounded-2xl text-center">
                                    <p class="text-accent italic text-sm md:text-lg leading-relaxed">"${creature.secretReport.insight}"</p>
                                </div>
                                ${creature.secretReport.recommendations ? `
                                <div class="recommendations-section">
                                    <div class="recommendations-title">
                                        <i class="fas fa-sparkles"></i>
                                        <span>${isAr ? 'توصيات مخصصة لشخصيتك' : 'Personalized Recommendations'}</span>
                                    </div>
                                    <div class="recommendations-grid">
                                        <div class="rec-category-card rec-books">
                                            <div class="rec-category-header">
                                                <span class="rec-icon"><i class="fas fa-book"></i></span>
                                                <h5>${isAr ? 'كتب' : 'Books'}</h5>
                                            </div>
                                            ${creature.secretReport.recommendations.books.map(item => `
                                            <div class="rec-item">
                                                <div class="rec-item-title"><span class="rec-bullet">▸</span><span>${escapeHtml(item.title)}</span></div>
                                                <div class="rec-item-reason">${escapeHtml(item.reason)}</div>
                                            </div>`).join('')}
                                        </div>
                                        <div class="rec-category-card rec-movies">
                                            <div class="rec-category-header">
                                                <span class="rec-icon"><i class="fas fa-film"></i></span>
                                                <h5>${isAr ? 'أفلام' : 'Movies'}</h5>
                                            </div>
                                            ${creature.secretReport.recommendations.movies.map(item => `
                                            <div class="rec-item">
                                                <div class="rec-item-title"><span class="rec-bullet">▸</span><span>${escapeHtml(item.title)}</span></div>
                                                <div class="rec-item-reason">${escapeHtml(item.reason)}</div>
                                            </div>`).join('')}
                                        </div>
                                        <div class="rec-category-card rec-music">
                                            <div class="rec-category-header">
                                                <span class="rec-icon"><i class="fas fa-music"></i></span>
                                                <h5>${isAr ? 'موسيقى' : 'Music'}</h5>
                                            </div>
                                            ${creature.secretReport.recommendations.music.map(item => `
                                            <div class="rec-item">
                                                <div class="rec-item-title"><span class="rec-bullet">▸</span><span>${escapeHtml(item.title)}</span></div>
                                                <div class="rec-item-reason">${escapeHtml(item.reason)}</div>
                                            </div>`).join('')}
                                        </div>
                                    </div>
                                </div>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            <button onclick="downloadResultAsImage(this)" class="btn-secondary flex items-center justify-center gap-3 p-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-105">
                <i class="fas fa-image" aria-hidden="true"></i> ${isAr ? '🖼️ تحميل النتيجة كصورة' : '🖼️ Download as Image'}
            </button>
            <button onclick="shareResult()" class="btn-primary flex items-center justify-center gap-3 p-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-105">
                <i class="fas fa-share-alt" aria-hidden="true"></i> ${isAr ? '🚀 شارك النتيجة' : '🚀 Share Result'}
            </button>
            <button onclick="compareWithFriend()" class="btn-success flex items-center justify-center gap-3 p-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-105">
                <i class="fas fa-users" aria-hidden="true"></i> ${isAr ? '⚔️ قارن مع صديق' : '⚔️ Compare with Friend'}
            </button>
        </div>

        <!-- 🃏 3D CARD SECTION (NEW) -->
        <div class="legendary-card-section">
            <h3 class="text-3xl font-bold theme-text-primary mb-8 text-center">
                ${isAr ? 'بطاقتك الأسطورية' : 'Your Legendary Card'}
            </h3>
            
            <div class="card-3d-wrapper" id="card-3d-wrapper" onclick="flipCard()">
                <div class="card-3d-inner" id="card-3d-inner">
                    <!-- الوجه الأمامي (سيتم رسم البطاقة هنا) -->
                    <div class="card-face card-front" id="card-front-face">
                        <div class="flex items-center justify-center h-full w-full bg-slate-800">
                            <i class="fas fa-spinner fa-spin text-4xl text-accent"></i>
                        </div>
                        <div class="card-glare"></div>
                    </div>
                    
                    <!-- الوجه الخلفي -->
					<div class="card-face card-back" id="card-back-face">
                        <i class="fas fa-magic text-5xl text-accent mb-4"></i>
                        <h4 class="text-xl font-black text-white tracking-widest">QuizMagic</h4>
                        <p class="text-xs text-slate-400 mt-2">${isAr ? 'إصدار محدود' : 'Limited Edition'}</p>
                        <div class="mt-6 px-4 py-1 border border-accent/30 rounded-full text-[10px] text-accent uppercase tracking-widest">
                            ${lastQuizResult.cardTier}
                        </div>
                    </div>
                </div>
            </div>
            
            <p class="text-sm theme-text-muted mt-4 mb-6 italic">
                ${isAr ? 'اضغط على البطاقة لقلبها، أو حرك الماوس فوقها' : 'Click to flip, or hover to inspect'}
            </p>

            <button onclick="openCinematicPreview()" class="btn-primary-solid flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all transform hover:scale-105 mx-auto mb-6 shadow-lg">
                <i class="fas fa-search-plus"></i> ${isAr ? 'معاينة سينمائية (للهواتف)' : 'Cinematic Preview'}
            </button>


            <button id="card-download-btn" onclick="downloadCollectibleCard(this, lastQuizResult.creature, lastQuizResult.cardTier)" class="btn-card card-download-btn flex items-center justify-center gap-3 p-5 rounded-2xl font-black text-lg transition-all transform hover:scale-105 mx-auto">
                <i class="fas fa-download" aria-hidden="true"></i> ${isAr ? 'حفظ البطاقة في جهازك' : 'Save Card to Device'}
            </button>
        </div>

        <button onclick="retakeQuiz()" class="theme-text-muted hover:theme-text-primary transition font-bold mb-20 mx-auto block">
            <i class="fas fa-redo mr-2"></i> ${isAr ? 'إعادة الاختبار' : 'Retake Quiz'}
        </button>
    `;

    renderRadarChart(radar);
    prepareShareTemplate(creature, secondaryCreature);
    applyCreatureTheme(winnerId);

    // 🃏 تطبيق غلاف البطاقة (Sleeve) المجهز من الخزانة
    const backFace = document.getElementById('card-back-face');
    if (backFace && typeof equippedItems !== 'undefined' && equippedItems.sleeve !== 'default') {
        const sleeveItem = STORE_ITEMS.sleeves.find(s => s.id === equippedItems.sleeve);
        if (sleeveItem) {
            // مسح المحتوى الافتراضي لكي يظهر تصميمك بالكامل
            backFace.innerHTML = ''; 
            // وضع تصميمك كخلفية لظهر البطاقة
            backFace.style.backgroundImage = `url('${sleeveItem.image}')`;
            backFace.style.backgroundSize = 'cover';
            backFace.style.backgroundPosition = 'center';
            backFace.style.border = 'none'; // إزالة الإطار الافتراضي
        }
    }

    // 🃏 تهيئة تأثير الـ 3D ورسم البطاقة للمعاينة
    setTimeout(async () => {
        initCard3DEffect();
        try {
            const canvas = await renderCollectibleCardCanvas(lastQuizResult.creature, lastQuizResult.cardTier);
            const frontFace = document.getElementById('card-front-face');
            if (frontFace) {
                // تجهيز البطاقة للظهور الناعم (Fade-in)
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                canvas.style.objectFit = 'cover';
                canvas.style.opacity = '0'; // تبدأ شفافة
                canvas.style.transition = 'opacity 0.8s ease-in-out'; // انتقال ناعم لمدة 0.8 ثانية
                
                frontFace.innerHTML = ''; // مسح أيقونة التحميل
                frontFace.appendChild(canvas);
                
                // إعادة إضافة اللمعان فوق الـ Canvas
                const glare = document.createElement('div');
                glare.className = 'card-glare';
                frontFace.appendChild(glare);

                // تفعيل الظهور الناعم بعد إضافتها للـ DOM
                requestAnimationFrame(() => {
                    canvas.style.opacity = '1';
                });
            }
        } catch (e) {
            console.error("Failed to render preview card:", e);
        }
    }, 100);


    setTimeout(() => {
        launchConfetti(winnerId);
        if (window.audioManager) {
            window.audioManager.play('magical-reveal');
        }
    }, 300);
    await checkAchievements();

    trackEvent('quiz_complete', {
        'creature_id': winnerId,
        'creature_name': creature.name,
        'secondary_creature_id': secondaryCreature.id,
        'creature_rarity': creature.rarity,
        'language': currentLang
    });

    if (friendComparisonData) {
        const currentUserData = {
            creatureId: winnerId,
            secondaryCreatureId: secondaryCreature.id,
            radarScores: radar
        };
        const compatibilityScore = calculateCompatibility(friendComparisonData, currentUserData);

        if (compatibilityScore >= 95) {
            if (!userStats.bestCompatibility || compatibilityScore > userStats.bestCompatibility) {
                userStats.bestCompatibility = compatibilityScore;
                localStorage.setItem('quiz_stats', JSON.stringify(userStats));
            }
        }

        const comparisonResultHtml = `
            <div class="mt-12 p-8 theme-bg-tertiary/20 rounded-[2.5rem] border theme-border text-center animate-fade-in">
                <h3 class="text-3xl font-bold theme-text-primary mb-4">
                    ${isAr ? '⚔️ نتيجة المقارنة الأسطورية ⚔️' : '⚔️ Mythical Comparison Result ⚔️'}
                </h3>
                <p class="text-xl theme-text-secondary mb-6">
                    ${isAr ? 'مدى توافقك مع صديقك هو:' : 'Your compatibility with your friend is:'}
                </p>
                <div class="text-6xl font-black bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent mb-6">
                    ${compatibilityScore}%
                </div>
                <p class="theme-text-secondary text-lg">
                    ${isAr
                        ? `أنت وصديقك ${escapeHtml(friendComparisonData.creatureId)} و ${escapeHtml(currentUserData.creatureId)} تشكلان ثنائياً أسطورياً بنسبة ${compatibilityScore}%!`
                        : `You and your friend, the ${escapeHtml(friendComparisonData.creatureId)} and the ${escapeHtml(currentUserData.creatureId)}, form a mythical duo with ${compatibilityScore}% compatibility!`}
                </p>
            </div>
        `;
        document.getElementById('result-container').insertAdjacentHTML('beforeend', comparisonResultHtml);
    }
}

// ==================== 3D CARD HELPER FUNCTIONS ====================

function initCard3DEffect() {
    const wrapper = document.getElementById('card-3d-wrapper');
    const inner = document.getElementById('card-3d-inner');
    if (!wrapper || !inner) return;

    let ticking = false; // متغير للتحكم في سرعة التحديث (Throttling)

    wrapper.addEventListener('mousemove', (e) => {
        if (inner.classList.contains('is-flipped')) return;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                const rect = wrapper.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -15;
                const rotateY = ((x - centerX) / centerX) * 15;

                inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                
                const glares = wrapper.querySelectorAll('.card-glare');
                glares.forEach(glare => {
                    // لمعان أقوى يتناسب مع الزجاج النقي
                    glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 60%)`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    });

    wrapper.addEventListener('mouseleave', () => {
        if (!inner.classList.contains('is-flipped')) {
            inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
        }
        const glares = wrapper.querySelectorAll('.card-glare');
        glares.forEach(glare => {
            glare.style.background = 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)';
        });
    });
}

function flipCard() {
    const inner = document.getElementById('card-3d-inner');
    if (!inner) return;
    
    inner.classList.toggle('is-flipped');
    
    // إعادة تعيين الميل عند القلب
    if (inner.classList.contains('is-flipped')) {
        inner.style.transform = 'rotateY(180deg)';
    } else {
        inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
    
    // تشغيل صوت خفيف
    if (window.audioManager) {
        window.audioManager.play('ui-click');
    }
}

// ==================== RADAR CHART ====================
function renderRadarChart(data) {
    try {
        const canvas = document.getElementById('radarChart');
        if (!canvas) {
            console.warn('⚠️ Radar Chart canvas not found');
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.warn('⚠️ Could not get canvas context');
            return;
        }

        // 🚀 Lazy Loading: تحميل Chart.js عند الحاجة فقط
        if (typeof Chart === 'undefined') {
            loadScript('https://cdn.jsdelivr.net/npm/chart.js').then(() => {
                renderRadarChart(data);
            }).catch(err => {
                console.error('🛡️ Failed to load Chart.js:', err);
                const chartContainer = document.getElementById('radarChart')?.parentElement;
                if (chartContainer) {
                    chartContainer.innerHTML = `
                        <p class="text-center theme-text-secondary italic py-8">
                            ${currentLang === 'ar' ? 'تعذر عرض مخطط القوى حالياً' : 'Unable to display power chart at this time'}
                        </p>
                    `;
                }
            });
            return;
        }
        
        const axesConfig = config?.powerAxes?.[currentLang] || {};
        const labels = Object.values(axesConfig);
        
        if (labels.length === 0) {
            console.warn('⚠️ No axes configuration found');
            return;
        }
        
        const dataValues = Object.keys(axesConfig).map(key => data[key] || 50);
        const isLight = document.documentElement.classList.contains('light-mode');
        const gridColor = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
        const textColor = isLight ? '#0f172a' : '#94a3b8';
        
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: currentLang === 'ar' ? 'تحليل القوى' : 'Power Analysis',
                    data: dataValues,
                    backgroundColor: 'rgba(168, 85, 247, 0.2)',
                    borderColor: 'rgba(168, 85, 247, 0.8)',
                    borderWidth: 3,
                    pointBackgroundColor: '#a855f7',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#a855f7'
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: { color: gridColor },
                        grid: { color: gridColor },
                        pointLabels: { color: textColor, font: { size: 12, family: 'Cairo', weight: 'bold' } },
                        ticks: { display: false },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                },
                plugins: { legend: { display: false } },
                animation: { duration: 2000, easing: 'easeOutQuart' }
            }
        });
    } catch (error) {
        console.error('🛡️ Error in renderRadarChart:', error);
        // إخفاء حاوية الرادار بشكل لطيف إذا فشل الرسم
        const chartContainer = document.getElementById('radarChart')?.parentElement;
        if (chartContainer) {
            chartContainer.innerHTML = `
                <p class="text-center theme-text-secondary italic py-8">
                    ${currentLang === 'ar' ? 'تعذر عرض مخطط القوى حالياً' : 'Unable to display power chart at this time'}
                </p>
            `;
        }
    }
}
// ==================== SECRET REPORT ====================
function toggleDetails() {
    const section = document.getElementById('details-section');
    const icon = document.getElementById('expand-icon');
    const btn = document.querySelector('[aria-controls="details-section"]');

    if (section.style.maxHeight && section.style.maxHeight !== '0px') {
        // 📕 إغلاق القسم
        section.style.maxHeight = '0px';
        icon.style.transform = 'rotate(0deg)';
        if (btn) btn.setAttribute('aria-expanded', 'false');
    } else {
        // 📖 فتح القسم - حساب الارتفاع الفعلي للمحتوى ديناميكياً
        section.style.maxHeight = section.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';

        // ✨ إضافة فئة لتأخير الأنيميشن حتى يكتمل الحساب
        section.classList.add('details-open');

        if (btn) btn.setAttribute('aria-expanded', 'true');

        setTimeout(() => {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }
}

function unlockSecretReport() {
    // 🎵 صوت فتح التقرير السري
    if (window.audioManager) {
        window.audioManager.play('unlock-secret');
    }
    
    const locker = document.getElementById('cpa-locker');
    const content = document.getElementById('secret-content');
    locker.style.opacity = '0';
    locker.style.pointerEvents = 'none';
    content.style.opacity = '1';
    content.style.filter = 'none';
    if (!userStats.secretUnlocks) {
        userStats.secretUnlocks = 0;
    }
    userStats.secretUnlocks++;
    localStorage.setItem('quiz_stats', JSON.stringify(userStats));
    checkAchievements();
    // 📊 تتبع فتح التقرير السري
    trackEvent('secret_report_unlocked', {
        'creature_id': userStats.lastCreatureId || 'unknown'
    });
}

// ==================== SHARE TEMPLATE ====================
function prepareShareTemplate(creature, secondary) {
    const isAr = currentLang === 'ar';
    const domImg = document.getElementById('share-creature-img-dominant');
    const secImg = document.getElementById('share-creature-img-secondary');
    if (domImg) domImg.src = creature.image;
    if (secImg) secImg.src = secondary.image;

    const domName = document.getElementById('share-creature-name-dominant');
    if (domName) domName.innerText = creature.name;

    const secName = document.getElementById('share-creature-name-secondary');
    if (secName) secName.innerText = secondary.name;

    const rarity = document.getElementById('share-rarity');
    if (rarity) rarity.innerText = creature.rarity;

    const badge = document.getElementById('share-badge');
    if (badge) badge.innerText = isAr ? 'هوية هجينة' : 'Hybrid Identity';

    const tagline = document.getElementById('share-tagline');
    if (tagline) tagline.innerText = isAr ? 'هويتي الأسطورية الهجينة' : 'My True Hybrid Essence';

    const desc = document.getElementById('share-description');
    if (desc) desc.innerText = (creature.narrative || creature.description).substring(0, 160) + '...';

    // 👤 Inject username into share template
    const usernameEl = document.getElementById('share-username');
    if (usernameEl) usernameEl.innerText = getUsername();
    const usernameLabel = document.getElementById('share-username-label');
    if (usernameLabel) usernameLabel.innerText = isAr ? 'المستكشف' : 'Explorer';
}

// ==================== DOWNLOAD & SHARE ====================
async function downloadResultAsImage(btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class="fas fa-spinner animate-spin"></i> ${currentLang === 'ar' ? 'جاري التجهيز...' : 'Preparing...'}`;
    btn.disabled = true;
    try {
        // 🚀 Lazy Loading: تحميل html2canvas عند الحاجة فقط
        if (typeof html2canvas === 'undefined') {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
        }
        const template = document.getElementById('share-template');
        const canvas = await html2canvas(template, {
            useCORS: true,
            scale: 2,
            backgroundColor: '#0f172a'
        });
        
        const link = document.createElement('a');
        link.download = `QuizMagic-Result-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        // 📊 تتبع تحميل الصورة
        trackEvent('result_download', {
            'format': 'png',
            'creature_id': userStats.lastCreatureId || 'unknown'
        });


    } catch (err) {
        console.error('🛡️ Download failed:', err);
        const isAr = currentLang === 'ar';
        showErrorToast(
            isAr 
                ? 'تعذر تجهيز الصورة. يمكنك مشاركة النتيجة بالرابط بدلاً من ذلك.' 
                : 'Could not prepare image. You can share the result via link instead.',
            isAr
        );
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function shareResult() {
    const text = currentLang === 'ar'
        ? `اكتشفت كائني الأسطوري الهجين على QuizMagic! جربه الآن: `
        : `I discovered my hybrid mythical identity on QuizMagic! Try it now: `;
    const url = window.location.href;
    
    if (!userStats.shares) {
        userStats.shares = 0;
    }
    userStats.shares++;
    localStorage.setItem('quiz_stats', JSON.stringify(userStats));
    checkAchievements();
    
    // 📊 تتبع المشاركة
    trackEvent('result_share', {
        'method': navigator.share ? 'native_share' : 'twitter',
        'creature_id': userStats.lastCreatureId || 'unknown'
    });

    if (navigator.share) {
        navigator.share({ title: 'QuizMagic', text: text, url: url });
    } else {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text + url)}`);
    }
}

function compareWithFriend() {
    // 🛡️ التحقق من وجود نتيجة محفوظة مسبقاً
    if (!lastQuizResult || !lastQuizResult.winnerId) {
        const isAr = currentLang === 'ar';
        showErrorToast(
            isAr ? 'يرجى إكمال الاختبار أولاً للحصول على نتيجة.' : 'Please complete the quiz first to get a result.',
            isAr
        );
        return;
    }

    // 🎯 استخدام النتيجة المحفوظة بدلاً من إعادة الحساب
    const { creature, secondaryCreature, radar, winnerId } = lastQuizResult;

    const friendData = {
        creatureId: winnerId,
        secondaryCreatureId: secondaryCreature.id,
        radarScores: radar
    };
    let encodedData;
    try {
        // استخدام encodeURIComponent + btoa لدعم أفضل (احتياطي)
        encodedData = btoa(unescape(encodeURIComponent(JSON.stringify(friendData))));
    } catch (e) {
        console.warn('🛡️ Encoding failed, using fallback:', e);
        // Fallback: JSON مشفر بشكل آمن بدون أحرف خاصة
        const safeData = {
            creatureId: friendData.creatureId,
            secondaryCreatureId: friendData.secondaryCreatureId,
            radarScores: friendData.radarScores
        };
        encodedData = btoa(JSON.stringify(safeData));
    }
    const comparisonUrl = `${window.location.origin}${window.location.pathname}?compare=${encodedData}`;
    const text = currentLang === 'ar'
        ? `تحداني في QuizMagic واكتشف مدى توافق هويتنا الأسطورية! ${comparisonUrl}`
        : `Challenge me on QuizMagic and discover our mythical compatibility! ${comparisonUrl}`;

    if (!userStats.comparisons) {
        userStats.comparisons = 0;
    }
    userStats.comparisons++;
    localStorage.setItem('quiz_stats', JSON.stringify(userStats));
    checkAchievements();

    // 📊 تتبع المقارنة
    trackEvent('friend_comparison', {
        'method': navigator.share ? 'native_share' : 'clipboard',
        'creature_id': winnerId
    });

    if (navigator.share) {
        navigator.share({ title: 'QuizMagic Challenge', text: text, url: comparisonUrl });
    } else {
        navigator.clipboard.writeText(comparisonUrl).then(() => {
            const isAr = currentLang === 'ar';
            // 🎨 استخدام toast داخلي بدل alert
            if (typeof showProfileNotification === 'function') {
                showProfileNotification(
                    isAr ? '✅ تم نسخ رابط المقارنة! أرسله لصديقك.' : '✅ Comparison link copied! Send it to your friend.',
                    'success'
                );
            }
        }).catch(err => {
            console.error('Failed to copy link: ', err);
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
        });
    }
}

// Note: Card system moved to card-system.js
// The card system code below is kept for reference but the active version is in card-system.js

// ========================================================================
// 📋 MENU DRAWER SYSTEM (القائمة الجانبية الجديدة)
// ========================================================================

// فتح القائمة الجانبية
function openMenuDrawer() {
    const drawer = document.getElementById('menu-drawer');
    const overlay = document.getElementById('menu-drawer-overlay');
    const btn = document.querySelector('.menu-drawer-btn');
    if (!drawer || !overlay) return;

    // تحديث المحتوى قبل الفتح (اللغة + اسم المستخدم)
    updateDrawerContent();
    // 📢 بناء بطاقات الإشعارات قبل الفتح
    renderAnnouncements();
    // 💌 بناء الرسائل المخصصة
    renderPersonalMessages();

    drawer.classList.add('open');
    overlay.classList.add('open');
    if (btn) {
        btn.setAttribute('aria-expanded', 'true');
        btn.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
    }

    // حبس التركيز داخل القائمة
    if (typeof trapFocus === 'function') trapFocus(drawer);

    // 🎵 مؤثر صوتي
    if (window.audioManager) window.audioManager.play('ui-click');

    // منع التمرير في الخلفية
    document.body.style.overflow = 'hidden';

    // ♿ التركيز على زر الإغلاق
    setTimeout(() => {
        const closeBtn = drawer.querySelector('.drawer-close-btn');
        if (closeBtn) closeBtn.focus();
    }, 300);
}

// إغلاق القائمة الجانبية
function closeMenuDrawer() {
    const drawer = document.getElementById('menu-drawer');
    const overlay = document.getElementById('menu-drawer-overlay');
    const btn = document.querySelector('.menu-drawer-btn');
    if (!drawer || !overlay) return;

    drawer.classList.remove('open');
    overlay.classList.remove('open');
    if (btn) {
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
    }

    if (typeof removeFocusTrap === 'function') removeFocusTrap(drawer);

    // إعادة التمرير
    document.body.style.overflow = '';
}

// تحديث محتوى القائمة (اللغة + اسم المستخدم)
function updateDrawerContent() {
    const isAr = currentLang === 'ar';

    // اسم المستخدم
    const usernameEl = document.getElementById('drawer-username');
    const subtitleEl = document.getElementById('drawer-user-subtitle');
    const rawName = (typeof getUsername === 'function') ? getUsername() : (localStorage.getItem('quiz_username') || '');
    if (usernameEl) {
        usernameEl.textContent = rawName || (isAr ? 'زائر' : 'Guest');
    }
    if (subtitleEl) {
        // 🎮 عرض المستوى بدل النص العادي
        const xp = (typeof getXP === 'function') ? getXP() : 0;
        const level = (typeof calculateLevel === 'function') ? calculateLevel(xp) : 1;
        const levelData = (typeof getLevelData === 'function') ? getLevelData(level) : null;
        if (levelData) {
            subtitleEl.textContent = (isAr ? 'المستوى' : 'Level') + ' ' + level + ' · ' + (isAr ? levelData.name.ar : levelData.name.en) + ' ' + levelData.icon;
        } else {
            subtitleEl.textContent = isAr ? 'اضغط لعرض ملفك' : 'Tap to view profile';
        }
    }

    // النصوص حسب اللغة
    const subtitle = document.getElementById('drawer-brand-subtitle');
    if (subtitle) subtitle.textContent = isAr ? 'عالم الأساطير' : 'Mythical World';

    const achievementsText = document.getElementById('drawer-achievements-text');
    if (achievementsText) achievementsText.textContent = isAr ? 'إنجازاتي' : 'Achievements';

    const pokedexText = document.getElementById('drawer-pokedex-text');
    if (pokedexText) pokedexText.textContent = isAr ? 'موسوعة المخلوقات' : 'Creatures Guide';

    // 🌟 إضافة ترجمة المتجر والخزنة 🌟
    const storeText = document.getElementById('drawer-store-text');
    if (storeText) storeText.textContent = isAr ? 'متجر الأساطير' : 'Mythical Store';

    const inventoryText = document.getElementById('drawer-inventory-text');
    if (inventoryText) inventoryText.textContent = isAr ? 'الخزنة' : 'My Vault';

    const themesText = document.getElementById('drawer-themes-text');
    if (themesText) themesText.textContent = isAr ? 'السمات' : 'Themes';

    const settingsText = document.getElementById('drawer-settings-text');
    if (settingsText) settingsText.textContent = isAr ? 'الإعدادات' : 'Settings';

    const footerText = document.getElementById('drawer-footer-text');
    if (footerText) footerText.textContent = '© 2026 QuizMagic';
}

// ========================================================================
// ⚙️ SETTINGS MODAL SYSTEM (مودال الإعدادات الجديد)
// ========================================================================

function showSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (!modal) return;

    // تحديث النصوص حسب اللغة
    updateSettingsModalContent();
    // تحديث الحالات (toggle + اللغة + حجم الخط)
    updateSettingsToggleStates();

    modal.classList.add('show');
    if (typeof trapFocus === 'function') trapFocus(modal);

    // ♿ التركيز على زر الإغلاق
    setTimeout(() => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
    }, 100);

    if (typeof trackEvent === 'function') trackEvent('settings_opened');
}

function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (!modal) return;
    modal.classList.remove('show');
    if (typeof removeFocusTrap === 'function') removeFocusTrap(modal);
}

// تحديث نصوص مودال الإعدادات حسب اللغة
function updateSettingsModalContent() {
    const isAr = currentLang === 'ar';
    const map = {
        'settings-modal-title': isAr ? 'الإعدادات' : 'Settings',
        'settings-prefs-title': isAr ? 'التفضيلات' : 'Preferences',
        'settings-music-label': isAr ? 'الموسيقى الخلفية' : 'Background Music',
        'settings-music-desc': isAr ? 'تشغيل أو إيقاف الموسيقى' : 'Play or mute background music',
        'settings-sfx-label': isAr ? 'المؤثرات الصوتية' : 'Sound Effects',
        'settings-sfx-desc': isAr ? 'أصوات النقر والتفاعلات' : 'Click and interaction sounds',
        'settings-welcome-label': isAr ? 'إظهار الشاشة الترحيبية' : 'Show Welcome Screen',
        'settings-welcome-desc': isAr ? 'تظهر عند فتح الموقع لأول مرة' : 'Shown when opening the site',
        'settings-lang-label': isAr ? 'اللغة' : 'Language',
        'settings-lang-desc': isAr ? 'اختر لغة الموقع' : 'Choose site language',
        'settings-fontsize-label': isAr ? 'حجم الخط' : 'Font Size',
        'settings-fontsize-desc': isAr ? 'حجم النصوص في الموقع' : 'Text size across the site',
        'settings-data-title': isAr ? 'إدارة البيانات' : 'Data Management',
        'settings-export-text': isAr ? 'تصدير البيانات كملف JSON' : 'Export data as JSON',
        'settings-import-text': isAr ? 'استيراد بيانات من ملف' : 'Import data from file',
        'settings-delete-text': isAr ? 'حذف جميع البيانات' : 'Delete all data'
    };
    for (const [id, val] of Object.entries(map)) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    // تحديث نصوص أزرار اللغة نفسها
    const arBtn = document.getElementById('settings-lang-ar');
    const enBtn = document.getElementById('settings-lang-en');
    if (arBtn) arBtn.textContent = 'العربية';
    if (enBtn) enBtn.textContent = 'English';

    // تحديث نصوص أزرار حجم الخط
    const fsSmall = document.getElementById('fontsize-small');
    const fsMed = document.getElementById('fontsize-medium');
    const fsLarge = document.getElementById('fontsize-large');
    if (fsSmall) fsSmall.textContent = isAr ? 'صغير' : 'Small';
    if (fsMed) fsMed.textContent = isAr ? 'متوسط' : 'Medium';
    if (fsLarge) fsLarge.textContent = isAr ? 'كبير' : 'Large';
}

// تحديث حالات المفاتيح في مودال الإعدادات
function updateSettingsToggleStates() {
    const isAr = currentLang === 'ar';

    // 🎵 الموسيقى الخلفية
    const musicToggle = document.getElementById('settings-music-toggle');
    if (musicToggle && window.audioManager) {
        musicToggle.checked = window.audioManager.settings.musicEnabled;
    }

    // 🔔 المؤثرات الصوتية
    const sfxToggle = document.getElementById('settings-sfx-toggle');
    if (sfxToggle && window.audioManager) {
        sfxToggle.checked = window.audioManager.settings.sfxEnabled;
    }

    // 🎬 الشاشة الترحيبية
    const welcomeToggle = document.getElementById('welcome-screen-toggle-settings');
    if (welcomeToggle) {
        const saved = localStorage.getItem('quiz_welcome_screen_enabled');
        welcomeToggle.checked = saved === null ? true : saved === 'true';
    }

    // 🌐 اللغة: تحديد الزر النشط
    const arBtn = document.getElementById('settings-lang-ar');
    const enBtn = document.getElementById('settings-lang-en');
    if (arBtn && enBtn) {
        arBtn.classList.toggle('active', currentLang === 'ar');
        enBtn.classList.toggle('active', currentLang === 'en');
    }

    // 🔤 حجم الخط: تحديد الزر النشط
    const savedFont = localStorage.getItem('quiz_fontsize') || 'medium';
    ['small', 'medium', 'large'].forEach(size => {
        const btn = document.getElementById('fontsize-' + size);
        if (btn) btn.classList.toggle('active', savedFont === size);
    });
}

// تبديل الشاشة الترحيبية (من مودال الإعدادات)
function toggleWelcomeScreenPreferenceSettings() {
    const toggle = document.getElementById('welcome-screen-toggle-settings');
    if (!toggle) return;
    const isEnabled = toggle.checked;
    localStorage.setItem('quiz_welcome_screen_enabled', isEnabled.toString());

    const isAr = currentLang === 'ar';
    const message = isEnabled
        ? (isAr ? '✅ سيتم إظهار الشاشة الترحيبية عند فتح الموقع' : '✅ Welcome screen will be shown')
        : (isAr ? '🔕 تم إيقاف الشاشة الترحيبية' : '🔕 Welcome screen disabled');
    if (typeof showProfileNotification === 'function') showProfileNotification(message, 'success');

    if (typeof trackEvent === 'function') {
        trackEvent('welcome_screen_preference_changed', { enabled: isEnabled });
    }
}

// 🎵 تبديل الموسيقى الخلفية (من مودال الإعدادات)
function toggleMusicFromSettings() {
    const toggle = document.getElementById('settings-music-toggle');
    if (!toggle || !window.audioManager) return;
    const isEnabled = toggle.checked;

    // مزامنة حالة audioManager مع التوجل
    window.audioManager.settings.musicEnabled = isEnabled;
    localStorage.setItem('quiz_music_enabled', isEnabled.toString());

    if (isEnabled) {
        window.audioManager.play('background').catch(() => {});
    } else {
        window.audioManager.stop('background');
    }
    // تحديث أيقونة زر الهيدر
    window.audioManager.updateUI();

    const isAr = currentLang === 'ar';
    if (typeof showProfileNotification === 'function') {
        showProfileNotification(
            isEnabled ? (isAr ? '🎵 تم تشغيل الموسيقى' : '🎵 Music enabled') : (isAr ? '🔇 تم إيقاف الموسيقى' : '🔇 Music muted'),
            'success'
        );
    }
}

// 🔔 تبديل المؤثرات الصوتية (من مودال الإعدادات)
function toggleSfxFromSettings() {
    const toggle = document.getElementById('settings-sfx-toggle');
    if (!toggle || !window.audioManager) return;
    const isEnabled = toggle.checked;

    window.audioManager.settings.sfxEnabled = isEnabled;
    localStorage.setItem('quiz_sfx_enabled', isEnabled.toString());

    // تشغيل مؤثر تجريبي عند التفعيل
    if (isEnabled) window.audioManager.play('ui-click');
    // تحديث أيقونة زر الهيدر
    window.audioManager.updateUI();

    const isAr = currentLang === 'ar';
    if (typeof showProfileNotification === 'function') {
        showProfileNotification(
            isEnabled ? (isAr ? '🔔 تم تفعيل المؤثرات الصوتية' : '🔔 Sound effects enabled') : (isAr ? '🔕 تم إيقاف المؤثرات الصوتية' : '🔕 Sound effects muted'),
            'success'
        );
    }
}

// تغيير اللغة من مودال الإعدادات
function setLanguageFromSettings(lang) {
    setLanguage(lang);
    // إعادة تحديث نصوص المودال بعد تغيير اللغة
    updateSettingsModalContent();
    updateSettingsToggleStates();
    // تحديث القائمة الجانبية أيضاً
    updateDrawerContent();

    const isAr = currentLang === 'ar';
    if (typeof showProfileNotification === 'function') {
        showProfileNotification(isAr ? '🌐 تم تغيير اللغة' : '🌐 Language changed', 'success');
    }
}

// 🔤 تطبيق حجم الخط
function setFontSize(size) {
    const sizes = ['small', 'medium', 'large'];
    if (!sizes.includes(size)) return;

    localStorage.setItem('quiz_fontsize', size);
    document.documentElement.setAttribute('data-fontsize', size);

    // تحديث الأزرار النشطة
    sizes.forEach(s => {
        const btn = document.getElementById('fontsize-' + s);
        if (btn) btn.classList.toggle('active', s === size);
    });

    const isAr = currentLang === 'ar';
    const labels = {
        small: isAr ? 'صغير' : 'Small',
        medium: isAr ? 'متوسط' : 'Medium',
        large: isAr ? 'كبير' : 'Large'
    };
    if (typeof showProfileNotification === 'function') {
        showProfileNotification((isAr ? '🔤 حجم الخط: ' : '🔤 Font size: ') + labels[size], 'success');
    }

    if (typeof trackEvent === 'function') {
        trackEvent('font_size_changed', { size: size });
    }
}

// تطبيق حجم الخط المحفوظ عند تحميل الصفحة
function applySavedFontSize() {
    const saved = localStorage.getItem('quiz_fontsize') || 'medium';
    document.documentElement.setAttribute('data-fontsize', saved);
}

// إغلاق القائمة بـ Escape (يضاف للمستمع العام الموجود)
function initMenuDrawerKeyboard() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const drawer = document.getElementById('menu-drawer');
            if (drawer && drawer.classList.contains('open')) {
                closeMenuDrawer();
            }
            const settingsModal = document.getElementById('settings-modal');
            if (settingsModal && settingsModal.classList.contains('show')) {
                closeSettingsModal();
            }
        }
    });
}

// تهيئة النظام عند تحميل DOM
document.addEventListener('DOMContentLoaded', () => {
    applySavedFontSize();
    initMenuDrawerKeyboard();
    // 📢 جلب الإشعارات عند فتح الموقع
    fetchAnnouncements();
    // 💎 تحديث عداد الجواهر في الهيدر
    updateGemsHeader();
    // 📱 تهيئة زر FAB (إغلاق عند النقر خارجه)
    initFabOutsideClick();
});

// ========================================================================
// 📱 FLOATING ACTION BUTTON (FAB) - زر الأزرار العائم
// ========================================================================

function toggleFab() {
    const actions = document.getElementById('fab-actions');
    const main = document.getElementById('fab-main');
    if (!actions || !main) return;

    const isOpen = actions.classList.contains('open');
    if (isOpen) {
        actions.classList.remove('open');
        main.classList.remove('active');
        main.setAttribute('aria-expanded', 'false');
        main.querySelector('i').className = 'fas fa-sliders-h';
    } else {
        actions.classList.add('open');
        main.classList.add('active');
        main.setAttribute('aria-expanded', 'true');
        main.querySelector('i').className = 'fas fa-times';
    }
}

function initFabOutsideClick() {
    document.addEventListener('click', (e) => {
        const fab = document.querySelector('.fab-container');
        const actions = document.getElementById('fab-actions');
        if (!fab || !actions) return;
        if (!fab.contains(e.target) && actions.classList.contains('open')) {
            actions.classList.remove('open');
            const main = document.getElementById('fab-main');
            if (main) {
                main.classList.remove('active');
                main.setAttribute('aria-expanded', 'false');
                main.querySelector('i').className = 'fas fa-sliders-h';
            }
        }
    });
}

// ========================================================================
// 💎 GEMS HEADER DISPLAY (عداد الجواهر في الهيدر)
// ========================================================================

function updateGemsHeader() {
    const countEl = document.getElementById('gems-header-count');
    if (!countEl) return;
    const gems = parseInt(localStorage.getItem('quiz_gems') || '0', 10);
    countEl.textContent = gems;
}

// تحديث عداد الجواهر كل 3 ثوانٍ إن كان مسجّل دخول
setInterval(() => {
    if (window.firebaseDB && window.firebaseDB.isLoggedIn()) {
        window.firebaseDB.fetchUserGems().then(gems => {
            const current = parseInt(localStorage.getItem('quiz_gems') || '0', 10);
            if (gems !== current) {
                localStorage.setItem('quiz_gems', String(gems));
                updateGemsHeader();
            }
        }).catch(() => {});
    }
}, 3000);

// ========================================================================
// 📢 ANNOUNCEMENTS SYSTEM (نظام الإشعارات / المستجدّات)
// ========================================================================

let announcementsData = [];

// 🌐 جلب announcements.json (مع fallback لتجاوز الكاش)
async function fetchAnnouncements() {
    try {
        const url = 'announcements.json?t=' + Date.now();
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) {
            console.warn('📢 تعذر جلب ملف الإشعارات:', res.status);
            return;
        }
        const data = await res.json();
        if (data && Array.isArray(data.announcements)) {
            announcementsData = data.announcements;
            updateNotificationDot();
        }
    } catch (err) {
        console.warn('📢 تعذر تحميل الإشعارات (قد يكون الملف محلياً):', err.message);
    }
}

// 🔴 إظهار/إخفاء النقطة الحمراء حسب وجود إشعارات غير مقروءة أو رسائل مخصصة
async function updateNotificationDot() {
    const dot = document.getElementById('menu-notification-dot');
    if (!dot) return;

    const unread = getUnreadAnnouncements();
    let hasMessages = false;

    // فحص الرسائل المخصصة (إن كان مسجّل دخول)
    if (window.firebaseDB && window.firebaseDB.isLoggedIn()) {
        try {
            const messages = await window.firebaseDB.fetchMyMessages();
            hasMessages = messages && messages.length > 0;
        } catch (e) { /* تجاهل */ }
    }

    dot.classList.toggle('hidden', unread.length === 0 && !hasMessages);
}

// 📋 الإشعارات غير المقروءة (لم يُDismissها المستخدم بعد)
function getUnreadAnnouncements() {
    const dismissed = getDismissedAnnouncements();
    return announcementsData.filter(a => a && a.id && !dismissed.includes(a.id));
}

// 💾 قائمة الإشعارات المُDismissة (المخزّنة في localStorage)
function getDismissedAnnouncements() {
    try {
        return JSON.parse(localStorage.getItem('quiz_dismissed_announcements') || '[]');
    } catch (e) {
        return [];
    }
}

function saveDismissedAnnouncements(ids) {
    localStorage.setItem('quiz_dismissed_announcements', JSON.stringify(ids));
}

// 🎨 بناء بطاقات الإشعارات داخل القائمة الجانبية
function renderAnnouncements() {
    const container = document.getElementById('announcements-container');
    if (!container) return;

    const unread = getUnreadAnnouncements();

    if (unread.length === 0) {
        container.innerHTML = '';
        return;
    }

    const isAr = currentLang === 'ar';
    container.innerHTML = '';

    unread.forEach(item => {
        const card = document.createElement('div');
        card.className = 'announcement-card';
        card.setAttribute('data-announcement-id', item.id);

        // تنسيق التاريخ
        let dateStr = '';
        if (item.date) {
            try {
                const d = new Date(item.date);
                if (!isNaN(d)) {
                    dateStr = isAr
                        ? d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })
                        : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                } else {
                    dateStr = item.date;
                }
            } catch (e) {
                dateStr = item.date;
            }
        }

        // الرابط الاختياري
        let linkHtml = '';
        if (item.link && item.link.trim()) {
            const linkText = isAr ? 'المزيد من التفاصيل' : 'Learn more';
            linkHtml = `<a href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer" class="announcement-link">
                <i class="fas fa-arrow-left" aria-hidden="true"></i> ${linkText}
            </a>`;
        }

        card.innerHTML = `
            <button class="announcement-close" onclick="dismissAnnouncement('${escapeHtml(item.id)}')" aria-label="${isAr ? 'إزالة الإشعار' : 'Dismiss'}">
                <i class="fas fa-times" aria-hidden="true"></i>
            </button>
            <div class="announcement-header">
                <span class="announcement-icon">${escapeHtml(item.icon || '📢')}</span>
                <div class="announcement-title-wrap">
                    <h4 class="announcement-title">${escapeHtml(item.title || '')}</h4>
                    ${dateStr ? `<span class="announcement-date">${dateStr}</span>` : ''}
                </div>
            </div>
            <p class="announcement-message">${escapeHtml(item.message || '')}</p>
            ${linkHtml}
        `;
        container.appendChild(card);
    });
}

// ✕ إزالة/إغلاق إشعار (تسجيله كمقروء)
function dismissAnnouncement(id) {
    if (!id) return;
    const dismissed = getDismissedAnnouncements();
    if (!dismissed.includes(id)) {
        dismissed.push(id);
        saveDismissedAnnouncements(dismissed);
    }
    // إزالة البطاقة بصرياً مع أنيميشن
    const card = document.querySelector(`.announcement-card[data-announcement-id="${id}"]`);
    if (card) {
        card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        card.style.opacity = '0';
        card.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            card.remove();
            // إذا لم تبقَ إشعارات، نظّف الحاوية
            const container = document.getElementById('announcements-container');
            if (container && container.children.length === 0) container.innerHTML = '';
        }, 250);
    }
    // تحديث النقطة الحمراء
    updateNotificationDot();

    if (typeof trackEvent === 'function') {
        trackEvent('announcement_dismissed', { id: id });
    }
}

// ========================================================================
// 🎮 XP & LEVELS SYSTEM (نظام النقاط والمستويات)
// ========================================================================

const XP_KEY = 'quiz_xp';
const LEVEL_KEY = 'quiz_level';

// 💾 حفظ واسترجاع XP
function getXP() {
    return parseInt(localStorage.getItem(XP_KEY) || '0', 10);
}
function saveXP(xp) {
    localStorage.setItem(XP_KEY, String(xp));
}
function getLevel() {
    return parseInt(localStorage.getItem(LEVEL_KEY) || '1', 10);
}
function saveLevel(level) {
    localStorage.setItem(LEVEL_KEY, String(level));
}

// 📊 تحديد المستوى الحالي بناءً على XP
function calculateLevel(xp) {
    if (typeof config === 'undefined' || !config.xpSystem || !config.xpSystem.levels) return 1;
    const levels = config.xpSystem.levels;
    let currentLevel = 1;
    for (const [lvl, data] of Object.entries(levels)) {
        if (xp >= data.xp) currentLevel = parseInt(lvl);
    }
    return currentLevel;
}

// 🔍 معرفة بيانات المستوى (الاسم، الأيقونة...)
function getLevelData(level) {
    if (typeof config === 'undefined' || !config.xpSystem || !config.xpSystem.levels) return null;
    return config.xpSystem.levels[level] || null;
}

// 📈 حساب XP المطلوب للمستوى التالي
function getXPProgress(xp) {
    if (typeof config === 'undefined' || !config.xpSystem || !config.xpSystem.levels) return { current: 0, needed: 0, percent: 0, currentXP: 0, nextXP: 0 };
    const levels = config.xpSystem.levels;
    const lvlKeys = Object.keys(levels).map(Number).sort((a, b) => a - b);
    const currentLevel = calculateLevel(xp);
    const currentLvlIdx = lvlKeys.indexOf(currentLevel);

    if (currentLvlIdx >= lvlKeys.length - 1) {
        // المستخدم في أعلى مستوى
        const maxXP = levels[lvlKeys[lvlKeys.length - 1]].xp;
        return { current: currentLevel, needed: 0, percent: 100, currentXP: xp, nextXP: maxXP, isMax: true };
    }

    const nextLevel = lvlKeys[currentLvlIdx + 1];
    const currentXP = levels[lvlKeys[currentLvlIdx]].xp;
    const nextXP = levels[nextLevel].xp;
    const range = nextXP - currentXP;
    const progress = range > 0 ? ((xp - currentXP) / range) * 100 : 0;

    return { current: currentLevel, needed: nextLevel, percent: Math.min(100, Math.max(0, progress)), currentXP: xp, nextXP: nextXP, isMax: false };
}

// 🎯 إضافة XP (مع فحص الترقية)
function addXP(amount, reason) {
    if (typeof config === 'undefined' || !config.xpSystem || !config.xpSystem.enabled) return 0;
    const oldXP = getXP();
    const oldLevel = calculateLevel(oldXP);
    const newXP = oldXP + amount;
    const newLevel = calculateLevel(newXP);

    saveXP(newXP);

    let levelUp = false;
    if (newLevel > oldLevel) {
        saveLevel(newLevel);
        levelUp = true;
        // إظهار إشعار الترقية
        setTimeout(() => showLevelUpNotification(oldLevel, newLevel), 600);
    }

    // تحديث شريط XP في الملف الشخصي إن كان مفتوحاً
    if (typeof renderXPBar === 'function') renderXPBar();

    // ☁️ مزامنة XP مع Firebase (إن كان مسجّل دخول)
    if (window.firebaseDB && window.firebaseDB.isLoggedIn()) {
        window.firebaseDB.addXPToCloud(amount, reason).catch(e => console.warn('XP cloud sync failed:', e));
    }

    if (typeof trackEvent === 'function') {
        trackEvent('xp_gained', { amount: amount, reason: reason, total_xp: newXP });
    }

    return newXP;
}

// 🎉 إشعار ترقية المستوى
function showLevelUpNotification(oldLevel, newLevel) {
    const isAr = currentLang === 'ar';
    const oldData = getLevelData(oldLevel);
    const newData = getLevelData(newLevel);

    const toast = document.getElementById('achievement-toast');
    if (!toast) return;

    const title = toast.querySelector('.toast-title');
    const message = toast.querySelector('.toast-message');
    const icon = toast.querySelector('.toast-icon');

    title.textContent = isAr ? '🎉 ترقية!' : '🎉 Level Up!';
    icon.textContent = newData ? newData.icon : '⬆️';
    message.textContent = isAr
        ? `ارتقيت من "${oldData ? oldData.name.ar : ''}" إلى "${newData ? newData.name.ar : ''}"!`
        : `Leveled up from "${oldData ? oldData.name.en : ''}" to "${newData ? newData.name.en : ''}"!`;

    toast.style.background = 'linear-gradient(135deg, #7c3aed, #a855f7)';
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
        toast.style.background = '';
    }, 5000);
}

// 🎮 حساب XP عند إكمال اختبار (تُستدعى من showResult)
async function awardQuizXP(creatureId, durationSeconds) {
    if (typeof config === 'undefined' || !config.xpSystem || !config.xpSystem.enabled) return;
    const isAr = currentLang === 'ar';
    const creature = findCreatureById(creatureId);
    const rarity = creature ? creature.rarity : 'Common';

    // 🛡️ النظام الآمن: السيرفر هو من يحسب النقاط
    if (window.firebaseDB && window.firebaseDB.isLoggedIn() && window.sbClient) {
        try {
            const userId = window.firebaseDB.getCurrentUserId();
            const { data, error } = await window.sbClient.rpc('server_award_quiz_xp', {
                p_user_id: userId,
                p_creature_id: creatureId,
                p_duration_seconds: durationSeconds || 0,
                p_rarity: rarity
            });

            if (!error && data) {
                // تحديث المتصفح بالبيانات الموثوقة القادمة من السيرفر
                saveXP(data.total_xp);
                if (data.new_level > data.old_level) {
                    saveLevel(data.new_level);
                    setTimeout(() => showLevelUpNotification(data.old_level, data.new_level), 600);
                }
                if (typeof renderXPBar === 'function') renderXPBar();

                if (typeof showProfileNotification === 'function') {
                    showProfileNotification(
                        (isAr ? '🎮 +' : '🎮 +') + data.gained_xp + ' XP (تم الحفظ بأمان 🛡️)',
                        'success'
                    );
                }
                return; // إنهاء الدالة بنجاح
            } else {
                console.error("Supabase XP Error:", error);
            }
        } catch (err) {
            console.error("Failed to award XP from server:", err);
        }
    }

    // ⚠️ Fallback: النظام المحلي القديم (يعمل فقط للزوار غير المسجلين)
    let totalXP = 0;
    let details = [];
    if (creature) {
        const rarityXP = config.xpSystem.rarityXP[creature.rarity] || 30;
        totalXP += rarityXP;
        details.push(`${isAr ? 'ندرة' : 'Rarity'}: +${rarityXP}`);
    }
    if (durationSeconds && durationSeconds < config.xpSystem.bonuses.speedThreshold) {
        totalXP += config.xpSystem.bonuses.speedBonus;
        details.push(`${isAr ? 'سرعة' : 'Speed'}: +${config.xpSystem.bonuses.speedBonus}`);
    }
    const stats = getUserStats();
    const creatureCount = stats.creatures && stats.creatures[creatureId] ? stats.creatures[creatureId] : 0;
    if (creatureCount <= 1) {
        totalXP += config.xpSystem.bonuses.newCreatureBonus;
        details.push(`${isAr ? 'كائن جديد!' : 'New creature!'}: +${config.xpSystem.bonuses.newCreatureBonus}`);
    } else {
        totalXP += config.xpSystem.bonuses.retakeBonus;
        details.push(`${isAr ? 'إعادة' : 'Retake'}: +${config.xpSystem.bonuses.retakeBonus}`);
    }
    addXP(totalXP, 'quiz_complete');
    if (typeof showProfileNotification === 'function') {
        showProfileNotification((isAr ? '🎮 +' : '🎮 +') + totalXP + ' XP (' + details.join(', ') + ')', 'success');
    }
}
// 🔒 التحقق مما إذا كانت السمة مقفلة
function isThemeLocked(themeId) {
    if (typeof config === 'undefined' || !config.xpSystem || !config.xpSystem.themeLocks) return false;
    const lock = config.xpSystem.themeLocks[themeId];
    if (!lock) return false; // مفتوحة

    if (lock.level) {
        const currentLevel = calculateLevel(getXP());
        if (currentLevel < lock.level) return true;
    }

    if (lock.achievements) {
        const achievements = JSON.parse(localStorage.getItem('quiz_achievements') || '{}');
        const unlockedCount = Object.values(achievements).filter(a => a.unlocked).length;
        if (unlockedCount < lock.achievements) return true;
    }

    return false;
}

// 📝 نص القفل (ما يحتاجه المستخدم لفتح السمة)
function getThemeLockText(themeId) {
    if (typeof config === 'undefined' || !config.xpSystem || !config.xpSystem.themeLocks) return '';
    const lock = config.xpSystem.themeLocks[themeId];
    if (!lock) return '';
    const isAr = currentLang === 'ar';
    return lock.requirement ? lock.requirement[isAr ? 'ar' : 'en'] : '';
}

// 📊 بناء شريط XP (يُعرض في الملف الشخصي)
function renderXPBar() {
    const container = document.getElementById('xp-bar-container');
    if (!container) return;
    const isAr = currentLang === 'ar';

    const xp = getXP();
    const level = calculateLevel(xp);
    const levelData = getLevelData(level);
    const progress = getXPProgress(xp);

    const levelName = levelData ? (isAr ? levelData.name.ar : levelData.name.en) : '';
    const levelIcon = levelData ? levelData.icon : '';

    let progressHtml = '';
    if (progress.isMax) {
        // أعلى مستوى
        progressHtml = `
            <div class="xp-progress-text xp-max">
                <span>${isAr ? '🌟 وصلت أعلى مستوى!' : '🌟 Max level reached!'}</span>
                <span>${xp} XP</span>
            </div>
            <div class="xp-progress-bar-wrapper">
                <div class="xp-progress-bar" style="width: 100%"></div>
            </div>
        `;
    } else {
        progressHtml = `
            <div class="xp-progress-text">
                <span>${xp} / ${progress.nextXP} XP</span>
                <span>${Math.round(progress.percent)}%</span>
            </div>
            <div class="xp-progress-bar-wrapper">
                <div class="xp-progress-bar" style="width: ${progress.percent}%"></div>
            </div>
            <p class="xp-next-hint">${isAr ? `يتبقى ${progress.nextXP - xp} XP للمستوى التالي` : `${progress.nextXP - xp} XP to next level`}</p>
        `;
    }

    container.innerHTML = `
        <div class="xp-card">
            <div class="xp-level-badge">
                <span class="xp-level-icon">${levelIcon}</span>
                <span class="xp-level-number">${isAr ? 'المستوى' : 'Level'} ${level}</span>
            </div>
            <div class="xp-level-info">
                <h3 class="xp-level-name">${levelName}</h3>
                ${progressHtml}
            </div>
        </div>
    `;
}

// ========================================================================
// 💌 PERSONAL MESSAGES (الرسائل المخصصة في الـ Drawer)
// ========================================================================

// 🎨 بناء بطاقات الرسائل المخصصة في القائمة الجانبية
async function renderPersonalMessages() {
    const container = document.getElementById('announcements-container');
    if (!container) return;
    if (!window.firebaseDB || !window.firebaseDB.isLoggedIn()) return;

    try {
        const messages = await window.firebaseDB.fetchMyMessages();
        if (!messages || messages.length === 0) return;

        const isAr = currentLang === 'ar';
        messages.forEach(item => {
            const card = document.createElement('div');
            card.className = 'announcement-card personal-message';
            card.setAttribute('data-message-id', item.id);

            // تنسيق التاريخ
            let dateStr = '';
            if (item.created_at) {
                try {
                    const d = new Date(item.created_at);
                    dateStr = isAr
                        ? d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })
                        : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                } catch (e) { dateStr = ''; }
            }

            card.innerHTML = `
                <button class="announcement-close" onclick="dismissPersonalMessage('${item.id}')" aria-label="${isAr ? 'إزالة الرسالة' : 'Dismiss'}">
                    <i class="fas fa-times" aria-hidden="true"></i>
                </button>
                <div class="announcement-header">
                    <span class="announcement-icon">${escapeHtml(item.icon || '💌')}</span>
                    <div class="announcement-title-wrap">
                        <h4 class="announcement-title">${escapeHtml(item.title || '')}</h4>
                        ${dateStr ? `<span class="announcement-date">${dateStr}</span>` : ''}
                    </div>
                </div>
                <p class="announcement-message">${escapeHtml(item.message || '')}</p>
            `;
            container.appendChild(card);
        });
    } catch (e) {
        console.warn('renderPersonalMessages error:', e);
    }
}

// ✕ حذف رسالة مخصصة (عند الضغط على x)
async function dismissPersonalMessage(messageId) {
    if (!messageId) return;
    const card = document.querySelector(`.announcement-card[data-message-id="${messageId}"]`);
    if (card) {
        card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        card.style.opacity = '0';
        card.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            card.remove();
            const container = document.getElementById('announcements-container');
            if (container && container.children.length === 0) container.innerHTML = '';
        }, 250);
    }
    // حذف من السحابة
    if (window.firebaseDB && window.firebaseDB.deleteMessage) {
        await window.firebaseDB.deleteMessage(messageId);
    }
    updateNotificationDot();
}

// ==================== GAME MENU LOGIC ====================

// 1. دالة بدء الاستدعاء (إخفاء القائمة الرئيسية وإظهار الاختبارات)
function startSummoning() {
    // إخفاء القائمة الرئيسية
    document.getElementById('game-main-menu').classList.add('hidden-game');
    
    // إظهار الهيدر والمحتوى القديم
    document.body.classList.remove('in-game-menu');
    
    // التمرير إلى شبكة الاختبارات
    document.getElementById('quiz-grid').scrollIntoView({ behavior: 'smooth' });
}

// 1.5. دالة العودة إلى القائمة الرئيسية للعبة
function returnToMainMenu() {
    
    
    // إظهار القائمة الرئيسية
    document.getElementById('game-main-menu').classList.remove('hidden-game');
    
    // إخفاء الهيدر والمحتوى القديم
    document.body.classList.add('in-game-menu');
    
    // تحديث بيانات اللاعب (لضمان تطابق الجواهر والطاقة إذا تغيرت)
    if (typeof updateGameMenuStats === 'function') updateGameMenuStats();
}


// 2. دالة فتح ساحة المعركة
function showArenaTeaser() {
    
    // إخفاء القائمة الرئيسية
    document.getElementById('game-main-menu').classList.add('hidden-game');
    
    // إظهار ساحة المعركة
    document.getElementById('arena-screen').classList.remove('hidden-game');
}

// دالة الانسحاب من الساحة والعودة للقائمة
function closeArena() {
    
    // إخفاء ساحة المعركة
    document.getElementById('arena-screen').classList.add('hidden-game');
    
    // إظهار القائمة الرئيسية
    document.getElementById('game-main-menu').classList.remove('hidden-game');
}

// 3. تحديث بيانات اللاعب في القائمة الرئيسية (تُستدعى عند تسجيل الدخول)
function updateGameMenuStats() {
    // جلب البيانات من localStorage أو المتغيرات العامة
    const username = localStorage.getItem('quiz_username') || 'زائر';
    const gems = localStorage.getItem('quiz_gems') || '0';
    const energy = localStorage.getItem('quiz_energy') || '5';
    const level = localStorage.getItem('quiz_level') || '1';
    
    if(document.getElementById('game-username')) document.getElementById('game-username').innerText = username;
    if(document.getElementById('game-gems-count')) document.getElementById('game-gems-count').innerText = gems;
    if(document.getElementById('game-energy-count')) document.getElementById('game-energy-count').innerText = energy + '/5';
    if(document.getElementById('game-level')) document.getElementById('game-level').innerText = 'المستوى ' + level;
}

// تشغيل الواجهة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('in-game-menu');
    updateGameMenuStats();
});


// ==================== CINEMATIC PREVIEW (TOUCH 3D MATH) ====================

function openCinematicPreview() {
    const modal = document.getElementById('cinematic-card-modal');
    const frontDest = document.getElementById('cinematic-card-front');
    const backDest = document.getElementById('cinematic-card-back');
    
    const originalFront = document.getElementById('card-front-face');
    const originalBack = document.getElementById('card-back-face');
    
    if (!modal || !originalFront || !originalBack) return;

    // 1. نسخ وجه البطاقة (تحويل الكانفاس إلى صورة لكي لا يختفي الرسم)
    frontDest.innerHTML = ''; 
    const originalCanvas = originalFront.querySelector('canvas');
    if (originalCanvas) {
        const img = document.createElement('img');
        img.src = originalCanvas.toDataURL('image/png');
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = 'inherit';
        frontDest.appendChild(img);
        
        // إعادة إضافة طبقة اللمعان
        const glare = document.createElement('div');
        glare.className = 'card-glare';
        frontDest.appendChild(glare);
    } else {
        frontDest.innerHTML = originalFront.innerHTML; // احتياطي
    }
    
    // 2. نسخ ظهر البطاقة (سواء كان الافتراضي أو الغلاف المخصص الذي اشتراه)
    backDest.innerHTML = originalBack.innerHTML;
    backDest.style.cssText = originalBack.style.cssText; 

    // 3. إظهار النافذة السينمائية
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('show'), 10);
    
    // 4. تفعيل خوارزمية اللمس
    initCinematicTouch();
    
    // منع تمرير الشاشة في الخلفية
    document.body.style.overflow = 'hidden';
    
    if (window.audioManager) window.audioManager.play('ui-click');
}


function closeCinematicPreview() {
    const modal = document.getElementById('cinematic-card-modal');
    if (!modal) return;
    
    modal.classList.remove('show');
    setTimeout(() => {
        modal.classList.add('hidden');
        // إعادة تعيين الدوران
        const inner = document.getElementById('cinematic-card-inner');
        if (inner) {
            inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
            inner.classList.remove('is-flipped');
        }
    }, 500);
    
    document.body.style.overflow = '';
}

function flipCinematicCard() {
    const inner = document.getElementById('cinematic-card-inner');
    if (!inner) return;
    
    inner.classList.toggle('is-flipped');
    
    if (inner.classList.contains('is-flipped')) {
        inner.style.transform = 'rotateY(180deg)';
    } else {
        inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
    
    if (window.audioManager) window.audioManager.play('ui-click');
}

function initCinematicTouch() {
    const wrapper = document.getElementById('cinematic-card-wrapper');
    const inner = document.getElementById('cinematic-card-inner');
    if (!wrapper || !inner) return;

    let isInteracting = false;

    const handleMove = (e) => {
        // لا نحرك البطاقة وهي مقلوبة (نتركها ثابتة ليرى الغلاف بوضوح)
        if (inner.classList.contains('is-flipped')) return; 
        
        // منع الشاشة من التمرير أثناء تحريك البطاقة
        if (e.cancelable) e.preventDefault();

        wrapper.classList.add('interacting');
        isInteracting = true;

        // جلب إحداثيات الإصبع (أو الماوس)
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const rect = wrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // حساب المسافة من المنتصف (نسبة مئوية من -1 إلى 1)
        const percentX = (clientX - centerX) / (rect.width / 2);
        const percentY = (clientY - centerY) / (rect.height / 2);

        // أقصى زاوية ميلان (25 درجة)
        const maxTilt = 25;
        const rotateX = percentY * -maxTilt;
        const rotateY = percentX * maxTilt;

        // تطبيق الدوران 3D
        inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        // تحديث اللمعان (Glare) ليتحرك مع الإصبع
        const glares = wrapper.querySelectorAll('.card-glare');
        glares.forEach(glare => {
            const glareX = ((percentX + 1) / 2) * 100;
            const glareY = ((percentY + 1) / 2) * 100;
            glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 60%)`;
            glare.style.opacity = '1';
        });
    };

    const handleEnd = () => {
        if (!isInteracting) return;
        isInteracting = false;
        wrapper.classList.remove('interacting');
        
        // إعادة البطاقة لوضعها الطبيعي بمرونة
        if (!inner.classList.contains('is-flipped')) {
            inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
        }
        
        const glares = wrapper.querySelectorAll('.card-glare');
        glares.forEach(glare => glare.style.opacity = '0');
    };

    // أحداث اللمس (للهواتف)
    wrapper.addEventListener('touchmove', handleMove, { passive: false });
    wrapper.addEventListener('touchend', handleEnd);
    wrapper.addEventListener('touchcancel', handleEnd);

    // أحداث الماوس (للتجربة على الكمبيوتر)
    wrapper.addEventListener('mousemove', handleMove);
    wrapper.addEventListener('mouseleave', handleEnd);
}
