let currentLang = 'ar';
let currentQuiz = null;
let currentStepId = 0;
let userResponses = [];
let currentTheme = 'dark';
let isQuizActive = false;
let userStats = {};
let friendComparisonData = null;

// 📊 Google Analytics Helper
function trackEvent(eventName, eventParams = {}) {
    if (typeof gtag === 'function') {
        gtag('event', eventName, eventParams);
        console.log(`📊 Analytics: ${eventName}`, eventParams);
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
    
// 🕐 سجل زيارة اليوم وتحقق من الوقت
    recordVisitDay();
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
    
    // Hide splash screen after loading
    hideSplashScreen();
});

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

function checkAchievements() {
    const stats = getUserStats();
    let newAchievements = [];
    
    for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
        if (!userAchievements[key] && achievement.condition(stats)) {
            userAchievements[key] = {
                unlocked: true,
                unlockedAt: Date.now()
            };
            newAchievements.push(achievement);
        }
    }
    
    if (newAchievements.length > 0) {
        saveAchievements();
        showAchievementToast(newAchievements[0]);
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
        // ✨ الحقول الجديدة للإنجازات الذكية
        fastestQuiz: stats.fastestQuiz || null,
        nightVisits: stats.nightVisits || 0,
        earlyVisits: stats.earlyVisits || 0,
        visitDays: stats.visitDays || [],
        bestCompatibility: stats.bestCompatibility || null
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
    
    renderAchievementsGrid();
    modal.classList.add('show');
}

function closeAchievementsModal() {
    const modal = document.getElementById('achievements-modal');
    if (!modal) return;
    modal.classList.remove('show');
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
        // ✨ الإنجازات الجديدة
        speed_runner: stats.fastestQuiz ? Math.min(100, ((180 - stats.fastestQuiz) / 180) * 100) : 0,
        night_owl: stats.nightVisits >= 1 ? 100 : 0,
        early_bird: stats.earlyVisits >= 1 ? 100 : 0,
        veteran: stats.visitDays ? Math.min(100, (stats.visitDays.length / 7) * 100) : 0,
        perfect_match: stats.bestCompatibility ? Math.min(100, (stats.bestCompatibility / 95) * 100) : 0
};
    
    return Math.round(conditions[key] || 0);
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
    }
}

function getQuizDurationSeconds() {
    if (!quizStartTime) return 0;
    return Math.floor((Date.now() - quizStartTime) / 1000);
}

// ==================== THEME MANAGEMENT ====================
function initializeTheme(savedTheme) {
    let preferredTheme = savedTheme;
    if (preferredTheme === 'auto') {
        preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme(preferredTheme);
}

function applyTheme(theme) {
    currentTheme = theme;
    const html = document.documentElement;
    if (theme === 'light') {
        html.classList.add('light-mode');
    } else {
        html.classList.remove('light-mode');
    }
}

function toggleTheme() {
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
    if (currentTheme === 'dark') {
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggleBtn.title = 'تبديل للوضع النهاري / Switch to Light Mode';
    } else {
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggleBtn.title = 'تبديل للوضع الليلي / Switch to Dark Mode';
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
                a.className = "w-10 h-10 rounded-full flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all transform hover:scale-110 theme-bg-tertiary theme-text-primary";
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

    renderQuizGrid();
    document.getElementById('language-screen').classList.add('opacity-0', 'pointer-events-none');
}

// ==================== QUIZ GRID ====================
function renderQuizGrid() {
    isQuizActive = false;
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
                    <div class="absolute top-4 right-4 bg-purple-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl">
                        ${quiz.badge}
                    </div>
                </div>
                <div class="p-6 flex-grow flex flex-col">
                    <h3 class="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors theme-text-primary">${quiz.title}</h3>
                    <p class="theme-text-secondary text-sm mb-6 flex-grow leading-relaxed">${quiz.description}</p>
                    <button class="w-full py-3 rounded-xl font-bold transition-all transform active:scale-95 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg shadow-purple-600/20">
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
                    <div class="text-3xl mb-3 text-purple-400"><i class="fas fa-dna"></i></div>
                    <h4 class="font-bold theme-text-primary mb-2">${isAr ? 'الهوية الهجينة' : 'Hybrid Identity'}</h4>
                    <p class="theme-text-secondary text-xs">${isAr ? 'نكتشف كائنك المهيمن وروحك المصاحبة.' : 'We discover your dominant creature and companion soul.'}</p>
                </div>
                <div class="theme-bg-tertiary/20 p-5 rounded-2xl border theme-border">
                    <div class="text-3xl mb-3 text-blue-400"><i class="fas fa-chart-pie"></i></div>
                    <h4 class="font-bold theme-text-primary mb-2">${isAr ? 'مخطط القوى' : 'Power Blueprint'}</h4>
                    <p class="theme-text-secondary text-xs">${isAr ? 'تحليل دقيق لـ 6 محاور لشخصيتك.' : 'Accurate analysis of 6 axes of your personality.'}</p>
                </div>
                <div class="theme-bg-tertiary/20 p-5 rounded-2xl border theme-border">
                    <div class="text-3xl mb-3 text-pink-400"><i class="fas fa-book-open"></i></div>
                    <h4 class="font-bold theme-text-primary mb-2">${isAr ? 'سرد قصصي' : 'Narrative Results'}</h4>
                    <p class="theme-text-secondary text-xs">${isAr ? 'نكتب لك قصة تصف يومك ككائن أسطوري.' : 'We write a story describing your day as a mythical being.'}</p>
                </div>
                <div class="theme-bg-tertiary/20 p-5 rounded-2xl border theme-border">
                    <div class="text-3xl mb-3 text-green-400"><i class="fas fa-medal"></i></div>
                    <h4 class="font-bold theme-text-primary mb-2">${isAr ? 'الأوسمة والندرة' : 'Badges & Rarity'}</h4>
                    <p class="theme-text-secondary text-xs">${isAr ? 'احصل على أوسمة نادرة بناءً على تميزك.' : 'Get rare badges based on your uniqueness.'}</p>
                </div>
            </div>
            <button onclick="startQuiz('${quizId}')" class="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg transform hover:scale-[1.02] active:scale-95 transition-all">
                ${isAr ? 'فهمت، ابدأ الآن 🚀' : 'Got it, Start Now 🚀'}
            </button>
        </div>
    `;
}

// ==================== QUIZ ENGINE ====================
function startQuiz(quizId) {
    isQuizActive = true;
    const data = quizzesData[currentLang];
    currentQuiz = data.quizzes.find(q => q.id === quizId);
    currentStepId = 0;
    userResponses = [];
    quizStartTime = Date.now();  // ⚡ ابدأ تتبع الوقت
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
        'language': currentLang
    });

    showStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showStep() {
    const question = currentQuiz.questions[currentStepId];
    const container = document.getElementById('quiz-container');
    const totalSteps = currentQuiz.questions.length;
    const progress = ((currentStepId + 1) / totalSteps) * 100;
    const isRTL = currentLang === 'ar';
    const slideInClass = isRTL ? 'question-slide-in-rtl' : 'question-slide-in-ltr';
    const slideOutClass = isRTL ? 'question-slide-out-rtl' : 'question-slide-out-ltr';
    
    // ⏳ Show skeleton loader first
    const isVisual = question.type === 'visual';
    showQuestionSkeleton(isVisual);
    
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
                    <span class="text-xs font-bold text-purple-400 uppercase tracking-widest">
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
                <h2 class="text-2xl md:text-3xl font-bold theme-text-primary text-center leading-tight question-title-fade-in">${question.text}</h2>
            </div>
    `;

    if (question.type === 'visual') {
        content += `
            <div class="grid grid-cols-2 gap-4 sm:gap-6">
                ${question.options.map((opt) => `
                    <div onclick="handleVisualChoice('${opt.trait}', ${opt.value}, '${opt.axis || ''}')" class="group cursor-pointer relative overflow-hidden rounded-2xl border-2 theme-border hover:border-purple-500 transition-all transform hover:scale-[1.03] active:scale-95 shadow-lg question-option-fade-in">
                        <div class="aspect-square overflow-hidden">
                            <img src="${opt.image}" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                        </div>
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                        <div class="absolute bottom-0 left-0 right-0 p-3 text-center">
                            <span class="text-white font-bold text-sm sm:text-lg">${opt.label}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        content += `
            <div class="space-y-3">
                ${[
                    { text: currentLang === 'ar' ? 'أوافق بشدة' : 'Strongly Agree', value: 5, color: 'bg-green-600/20 border-green-500/50 hover:bg-green-600/40' },
                    { text: currentLang === 'ar' ? 'أوافق' : 'Agree', value: 4, color: 'bg-blue-600/20 border-blue-500/50 hover:bg-blue-600/40' },
                    { text: currentLang === 'ar' ? 'محايد' : 'Neutral', value: 3, color: 'theme-bg-tertiary/40 theme-border hover:theme-bg-tertiary/60' },
                    { text: currentLang === 'ar' ? 'لا أوافق' : 'Disagree', value: 2, color: 'bg-orange-600/20 border-orange-500/50 hover:bg-orange-600/40' },
                    { text: currentLang === 'ar' ? 'لا أوافق بشدة' : 'Strongly Disagree', value: 1, color: 'bg-red-600/20 border-red-500/50 hover:bg-red-600/40' }
                ].map((opt) => `
                    <button onclick="handleLikert(${opt.value}, '${question.axis || ''}')" class="w-full p-4 text-center ${opt.color} border rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 font-bold theme-text-primary question-option-fade-in">
                        ${opt.text}
                    </button>
                `).join('')}
            </div>
        `;
    }
    
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

function handleLikert(value, axis) {
    
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
    const question = currentQuiz.questions[currentStepId];
    userResponses.push({ trait: question.trait, value: value, axis: axis });
    nextStep();
}

function handleVisualChoice(trait, value, axis) {

    // ♿ إضافة تأثير بصري للخيار المحدد
    const clickedOption = event?.target?.closest('[onclick]');
    if (clickedOption) {
        clickedOption.classList.add('option-selected');
        setTimeout(() => clickedOption.classList.remove('option-selected'), 300);
    }

    // 🎵 صوت الضغط
    if (window.audioManager) {
        window.audioManager.play('ui-click');
    }
    userResponses.push({ trait: trait, value: value, axis: axis });
    nextStep();
}
function nextStep() {
    currentStepId++;
    if (currentStepId < currentQuiz.questions.length) {
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
                <div class="absolute inset-0 border-4 border-purple-500/10 rounded-full"></div>
                <div class="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <div class="absolute inset-4 border-4 border-pink-500/20 border-b-transparent rounded-full animate-spin-slow"></div>
            </div>
            <h2 class="text-3xl font-bold mb-4 animate-pulse bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                ${currentLang === 'ar' ? 'جاري تحليل شخصيتك...' : 'Analyzing your psyche...'}
            </h2>
            <p class="theme-text-secondary text-lg">${currentLang === 'ar' ? 'نقوم بربط إجاباتك بالقوى الأسطورية القديمة' : 'Mapping your responses to ancient mythical forces'}</p>
        </div>
    `;
    setTimeout(showResult, delay);
}

// ==================== RESULT CALCULATION (ADVANCED ALGORITHM) ====================
function calculateResult() {
    // 1. حساب نقاط كل محور (Axis)
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

    // 2. تحويل النقاط إلى نسب مئوية (0-100)
    const axisPercentages = {};
    for (const axis in axisScores) {
        const maxPossible = axisCounts[axis] * 5;
        if (maxPossible > 0) {
            // نضمن ألا تقل النسبة عن 15% لكي يظهر الرادار بشكل جيد
            axisPercentages[axis] = Math.max(15, (axisScores[axis] / maxPossible) * 100);
        } else {
            axisPercentages[axis] = 50; // قيمة افتراضية
        }
    }

    // 3. حساب التوافق مع كل كائن بناءً على محاوره (Multi-Axis Matching)
    const results = currentQuiz.results;
    let creatureScores = [];

    results.forEach(creature => {
        let totalCompatibility = 0;
        let axesCount = 0;
        
        // استخدام خاصية axes الجديدة من ملف quizzes.js
        const creatureAxes = creature.axes || [];
        
        if (creatureAxes.length > 0) {
            creatureAxes.forEach(axis => {
                if (axisPercentages[axis] !== undefined) {
                    totalCompatibility += axisPercentages[axis];
                    axesCount++;
                }
            });
        } else {
            totalCompatibility = 50;
            axesCount = 1;
        }

        const avgCompatibility = totalCompatibility / axesCount;
        
        // استخدام خاصية multiplier الجديدة من ملف quizzes.js
        const multiplier = creature.multiplier || 1.0;
        const finalScore = avgCompatibility * multiplier;

        creatureScores.push({
            id: creature.id,
            score: finalScore,
            compatibility: avgCompatibility,
            rarity: creature.rarity,
            creature: creature
        });
    });

    // 4. نظام كسر التعادل الذكي (Tiebreaker)
    const rarityWeights = {
        'أسطوري': 4, 'Legendary': 4,
        'نادر جداً': 3, 'Very Rare': 3,
        'نادر': 2, 'Rare': 2,
        'شائع': 1, 'Common': 1
    };

    creatureScores.sort((a, b) => {
        // الأولوية للأعلى نقاطاً
        if (Math.abs(b.score - a.score) > 0.01) {
            return b.score - a.score; 
        }
        // كسر التعادل 1: الندرة (Rarity)
        const rarityA = rarityWeights[a.rarity] || 0;
        const rarityB = rarityWeights[b.rarity] || 0;
        if (rarityB !== rarityA) {
            return rarityB - rarityA;
        }
        // كسر التعادل 2: عشوائي مدروس
        return Math.random() - 0.5;
    });

    const winner = creatureScores[0];
    const secondary = creatureScores[1];

    // 5. التحقق من الحد الأدنى (Threshold)
    const isBelowThreshold = winner.compatibility < 60;

    return {
        creature: winner.creature,
        secondaryCreature: secondary.creature,
        radar: axisPercentages,
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

function saveUserStats(creatureId) {
    if (!userStats.creatures) {
        userStats.creatures = {};
    }
    userStats.creatures[creatureId] = (userStats.creatures[creatureId] || 0) + 1;
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
                    alert(isAr 
                        ? 'لقد تلقيت تحدي مقارنة! أكمل الاختبار لترى مدى توافقكما.' 
                        : 'You received a comparison challenge! Complete the quiz to see your compatibility.');
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

function showResult() {
    isQuizActive = false;
    
    // 🎯 هذا هو السطر المفقود الذي يحسب النتيجة ويعرف المتغيرات!
    const { creature, secondaryCreature, radar, winnerId } = calculateResult();
    saveUserStats(winnerId);

    // ⚡ تحقق من إنجاز البرق السريع
    const duration = getQuizDurationSeconds();
    if (duration > 0) {
        if (!userStats.fastestQuiz || duration < userStats.fastestQuiz) {
            userStats.fastestQuiz = duration;
            localStorage.setItem('quiz_stats', JSON.stringify(userStats));
        }
    }
    
    applyCreatureTheme(winnerId);
    document.getElementById('quiz-container').classList.add('hidden');
    const container = document.getElementById('result-container');
    container.classList.remove('hidden');

    const percentage = getCreaturePercentage(winnerId);
    const isAr = currentLang === 'ar';

    container.innerHTML = `
        <div class="theme-bg-secondary rounded-[2.5rem] overflow-hidden border theme-border shadow-2xl mb-12 animate-fade-in">
            <div class="relative h-[28rem] md:h-[35rem] overflow-hidden bg-slate-950">
                <img src="${creature.image}" loading="lazy" class="absolute inset-0 w-full h-full object-cover opacity-60 scale-105">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                
                <div class="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
                    <div class="flex justify-center gap-3 mb-8">
                        <span class="bg-purple-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg uppercase tracking-widest border border-white/10">
                            ${creature.rarity}
                        </span>
                        <span class="bg-pink-600/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg uppercase tracking-widest border border-white/10">
                            ${creature.badge || 'Legend'}
                        </span>
                    </div>
                    
                    <div class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-6">
                        <div class="flex flex-col items-center">
                            <span class="text-xs font-black text-purple-500 mb-2 uppercase tracking-tighter">${isAr ? 'المهيمن (70%)' : 'Dominant (70%)'}</span>
                            <h2 class="text-4xl md:text-7xl font-black text-white drop-shadow-2xl">${creature.name}</h2>
                        </div>
                        <span class="text-purple-600 text-4xl md:text-6xl font-light opacity-50 hidden md:block">×</span>
                        <div class="flex flex-col items-center">
                            <span class="text-xs font-black text-pink-500 mb-2 uppercase tracking-tighter">${isAr ? 'المصاحب (30%)' : 'Companion (30%)'}</span>
                            <h2 class="text-2xl md:text-4xl font-black text-slate-400 drop-shadow-2xl">${secondaryCreature.name}</h2>
                        </div>
                    </div>

                    <p class="text-slate-400 font-medium text-sm md:text-lg mb-10 max-w-xl">
                        ${isAr ? 'لقد تم تحليل جوهرك ودمجه مع القوى القديمة' : 'Your essence has been analyzed and merged with ancient forces'}
                    </p>

                    <button onclick="toggleDetails()" class="group flex flex-col items-center gap-3 transition-all duration-500 hover:scale-110">
                        <span class="text-xs font-bold text-purple-400 uppercase tracking-[0.3em] group-hover:text-purple-300">
                            ${isAr ? 'اكتشف أسرار هويتك' : 'Discover Your Identity Secrets'}
                        </span>
                        <div class="w-12 h-12 rounded-full border-2 border-purple-500/30 flex items-center justify-center group-hover:border-purple-500 transition-colors">
                            <i id="expand-icon" class="fas fa-chevron-down text-purple-500 animate-bounce"></i>
                        </div>
                    </button>
                </div>
            </div>
            
            <div id="details-section" class="max-h-0 overflow-hidden transition-all duration-1000 ease-in-out">
                <div class="p-8 md:p-14 border-t theme-border">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
                        <div class="theme-bg-tertiary/20 p-8 rounded-[2.5rem] border theme-border">
                            <div class="mb-6">
                                <img src="${creature.image}" class="w-full h-48 object-cover rounded-2xl mb-4 border-2 border-purple-500">
                                <h4 class="text-2xl font-bold theme-text-primary mb-1">${creature.name}</h4>
                                <span class="text-xs text-purple-400 font-bold uppercase tracking-widest">${isAr ? 'الكيان المهيمن' : 'Dominant Entity'}</span>
                            </div>
                            <p class="theme-text-secondary leading-relaxed text-sm">
                                ${creature.article || creature.description}
                            </p>
                        </div>
                        <div class="theme-bg-tertiary/20 p-8 rounded-[2.5rem] border theme-border">
                            <div class="mb-6">
                                <img src="${secondaryCreature.image}" class="w-full h-48 object-cover rounded-2xl mb-4 border-2 border-pink-500">
                                <h4 class="text-2xl font-bold theme-text-primary mb-1">${secondaryCreature.name}</h4>
                                <span class="text-xs text-pink-400 font-bold uppercase tracking-widest">${isAr ? 'الروح المصاحبة' : 'Companion Soul'}</span>
                            </div>
                            <p class="theme-text-secondary leading-relaxed text-sm">
                                ${secondaryCreature.article || secondaryCreature.description}
                            </p>
                        </div>
                    </div>

                    <div class="mb-20 text-center">
                        <div class="inline-block p-4 bg-purple-600/10 rounded-3xl mb-6">
                            <i class="fas fa-dna text-4xl text-purple-500"></i>
                        </div>
                        <h3 class="text-3xl font-bold theme-text-primary mb-6">
                            ${isAr ? 'التحليل النفسي للهوية الهجينة' : 'Hybrid Identity Psychoanalysis'}
                        </h3>
                        <div class="max-w-3xl mx-auto theme-bg-tertiary/10 p-10 rounded-[3rem] border-2 border-dashed theme-border relative">
                            <div class="absolute -top-4 -left-4 w-12 h-12 theme-bg-secondary flex items-center justify-center rounded-full border theme-border">
                                <i class="fas fa-quote-left text-purple-500"></i>
                            </div>
                            <p class="text-xl theme-text-secondary leading-relaxed italic">
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

                    <div class="relative p-1 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-[2rem] overflow-hidden shadow-2xl">
                        <div class="relative p-10 theme-bg-primary rounded-[1.8rem] overflow-hidden">
                            <div id="cpa-locker" class="absolute inset-0 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center z-10 bg-black/20">
                                <div class="w-20 h-20 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-6 border-4 border-white/10 shadow-inner">
                                    <i class="fas fa-lock text-3xl text-white"></i>
                                </div>
                                <h3 class="text-3xl font-bold mb-4 theme-text-primary">${isAr ? 'التقرير السري المتقدم' : 'Advanced Secret Report'}</h3>
                                <button onclick="unlockSecretReport()" class="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition-all z-[60] cursor-pointer relative shadow-xl">
                                    ${isAr ? 'فتح التقرير السري' : 'Unlock Secret Report'}
                                </button>
                            </div>
                            <div id="secret-content" class="opacity-10 blur-xl transition-all duration-1000">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 class="text-2xl font-bold text-purple-400 mb-4">${isAr ? 'نمط قوتك:' : 'Power Pattern:'}</h4>
                                        <p class="theme-text-secondary mb-6">${creature.secretReport.strengths}</p>
                                    </div>
                                    <div>
                                        <h4 class="text-2xl font-bold text-pink-400 mb-4">${isAr ? 'نصيحة الكائن:' : 'Creature Advice:'}</h4>
                                        <p class="theme-text-secondary mb-6">${creature.advice || creature.secretReport.insight}</p>
                                    </div>
                                </div>
                                <div class="mt-6 p-6 theme-bg-tertiary/20 border theme-border rounded-2xl text-center">
                                    <p class="text-purple-300 italic text-lg">"${creature.secretReport.insight}"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            <button onclick="downloadResultAsImage(this)" class="flex items-center justify-center gap-3 p-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl shadow-blue-600/20">
                <i class="fas fa-image"></i> ${isAr ? '🖼️ تحميل النتيجة كصورة' : '🖼️ Download as Image'}
            </button>
            <button onclick="shareResult()" class="flex items-center justify-center gap-3 p-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl shadow-purple-600/20">
                <i class="fas fa-share-alt"></i> ${isAr ? '🚀 شارك النتيجة' : '🚀 Share Result'}
            </button>
            <button onclick="compareWithFriend()" class="flex items-center justify-center gap-3 p-5 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl shadow-green-600/20">
                <i class="fas fa-users"></i> ${isAr ? '⚔️ قارن مع صديق' : '⚔️ Compare with Friend'}
            </button>
        </div>

        <button onclick="location.reload()" class="theme-text-muted hover:theme-text-primary transition font-bold mb-20">
            <i class="fas fa-redo mr-2"></i> ${isAr ? 'إعادة الاختبار' : 'Retake Quiz'}
        </button>
    `;

    renderRadarChart(radar);
    prepareShareTemplate(creature, secondaryCreature);
    applyCreatureTheme(winnerId);
    setTimeout(() => {
        launchConfetti(winnerId);
    // 🎵 صوت ظهور النتيجة السحري
        if (window.audioManager) {
        window.audioManager.play('magical-reveal');
        }
    }, 300);
    checkAchievements();

    // 📊 تتبع إكمال الاختبار
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

    // 🎯 تحقق من إنجاز الرفيق المثالي
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
                        ? `أنت وصديقك ${friendComparisonData.creatureId} و ${currentUserData.creatureId} تشكلان ثنائياً أسطورياً بنسبة ${compatibilityScore}%!` 
                        : `You and your friend, the ${friendComparisonData.creatureId} and the ${currentUserData.creatureId}, form a mythical duo with ${compatibilityScore}% compatibility!`}
                </p>
            </div>
        `;
        document.getElementById('result-container').insertAdjacentHTML('beforeend', comparisonResultHtml);
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
        
        // تحقق من تحميل Chart.js
        if (typeof Chart === 'undefined') {
            console.warn('⚠️ Chart.js not loaded');
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
    if (section.style.maxHeight && section.style.maxHeight !== '0px') {
        section.style.maxHeight = '0px';
        icon.style.transform = 'rotate(0deg)';
    } else {
        section.style.maxHeight = '5000px';
        icon.style.transform = 'rotate(180deg)';
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
}

// ==================== DOWNLOAD & SHARE ====================
async function downloadResultAsImage(btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class="fas fa-spinner animate-spin"></i> ${currentLang === 'ar' ? 'جاري التجهيز...' : 'Preparing...'}`;
    btn.disabled = true;
    try {
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
    const { creature, secondaryCreature, radar, winnerId } = calculateResult();
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
            alert(currentLang === 'ar' ? 'تم نسخ رابط المقارنة! أرسله لصديقك.' : 'Comparison link copied! Send it to your friend.');
        }).catch(err => {
            console.error('Failed to copy link: ', err);
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
        });
    }
}
