let currentLang = 'ar';
let currentQuiz = null;
let currentStepId = 0;
let userResponses = [];
let currentTheme = 'dark';
let isQuizActive = false;
let userStats = {};
let friendComparisonData = null;

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
    
    // Check for comparison URL parameter
    checkComparisonParam();
});

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
                    <img src="${quiz.image}" alt="${quiz.title}" loading="lazy" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
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
    document.getElementById('quiz-grid').classList.add('hidden');
    document.getElementById('hero-section').classList.add('hidden');
    const container = document.getElementById('quiz-container');
    container.classList.remove('hidden');

    showStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showStep() {
    const question = currentQuiz.questions[currentStepId];
    const container = document.getElementById('quiz-container');
    const totalSteps = currentQuiz.questions.length;
    const progress = ((currentStepId + 1) / totalSteps) * 100;
    container.classList.add('opacity-0');

    setTimeout(() => {
        let content = `
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
                <h2 class="text-2xl md:text-3xl font-bold theme-text-primary text-center leading-tight animate-slide-up">${question.text}</h2>
            </div>
        `;

        if (question.type === 'visual') {
            content += `
                <div class="grid grid-cols-2 gap-4 sm:gap-6">
                    ${question.options.map((opt) => `
                        <div onclick="handleVisualChoice('${opt.trait}', ${opt.value}, '${opt.axis || ''}')" class="group cursor-pointer relative overflow-hidden rounded-2xl border-2 theme-border hover:border-purple-500 transition-all transform hover:scale-[1.03] active:scale-95 shadow-lg">
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
                        <button onclick="handleLikert(${opt.value}, '${question.axis || ''}')" class="w-full p-4 text-center ${opt.color} border rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 font-bold theme-text-primary">
                            ${opt.text}
                        </button>
                    `).join('')}
                </div>
            `;
        }

        container.innerHTML = content;
        container.classList.remove('opacity-0');
        updateVisualEvolution(progress);
    }, 300);
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
    const question = currentQuiz.questions[currentStepId];
    userResponses.push({ trait: question.trait, value: value, axis: axis });
    nextStep();
}

function handleVisualChoice(trait, value, axis) {
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

// ==================== RESULT CALCULATION ====================
function calculateResult() {
    const traitScores = {};
    const axisScores = {
        intelligence: 0, energy: 0, empathy: 0, strategy: 0, mystery: 0, willpower: 0
    };
    userResponses.forEach(resp => {
        traitScores[resp.trait] = (traitScores[resp.trait] || 0) + resp.value;
        if (resp.axis && axisScores.hasOwnProperty(resp.axis)) {
            axisScores[resp.axis] += resp.value;
        }
    });

    const weightedTraitToCreature = {
        leadership: { dragon: 1.4, valkyrie: 0.8, simurgh: 0.7, centaur: 0.5 },
        power: { hydra: 1.4, dragon: 1.0, valkyrie: 0.7, cerberus: 0.8 },
        intensity: { phoenix: 1.4, dragon: 0.9, hydra: 0.7, siren: 0.5 },
        knowledge: { owl_of_athena: 1.5, simurgh: 1.1, sphinx: 0.9, centaur: 0.6 },
        wisdom: { owl_of_athena: 1.3, simurgh: 1.4, sphinx: 0.8, kraken: 0.5 },
        analysis: { sphinx: 1.4, kraken: 1.2, owl_of_athena: 0.9, centaur: 0.6 },
        mystery: { sphinx: 1.3, kraken: 1.3, siren: 1.1, kitsune: 0.8 },
        intuition: { siren: 1.5, sphinx: 0.8, kitsune: 0.9, phoenix: 0.6 },
        curiosity: { sphinx: 0.7, pegasus: 1.3, kraken: 0.6, simurgh: 0.8 },
        purity: { unicorn: 1.6, phoenix: 0.8, valkyrie: 0.6, pegasus: 0.7 },
        altruism: { unicorn: 1.4, phoenix: 0.9, faun: 0.9, valkyrie: 0.6 },
        stability: { golem: 1.6, centaur: 0.7, faun: 0.5, kraken: 0.4 },
        tradition: { golem: 1.4, centaur: 1.0, valkyrie: 0.6, simurgh: 0.5 },
        social: { kitsune: 1.2, faun: 1.3, unicorn: 0.8, pegasus: 0.6 },
        adaptation: { kitsune: 1.4, phoenix: 1.0, faun: 1.1, pegasus: 0.7 },
        exploration: { pegasus: 1.5, kraken: 0.7, kitsune: 0.8, simurgh: 0.6 },
        energy: { pegasus: 1.1, phoenix: 1.1, dragon: 0.7, faun: 1.0 },
        honesty: { valkyrie: 1.5, unicorn: 0.9, dragon: 0.6, centaur: 0.6 },
        potential: { valkyrie: 1.0, simurgh: 1.2, phoenix: 1.0, pegasus: 0.9 },
        nature: { faun: 1.5, unicorn: 0.9, golem: 0.7, pegasus: 0.6 },
        composure: { faun: 1.0, golem: 1.3, sphinx: 0.8, siren: 0.7 },
        protection: { cerberus: 1.6, dragon: 0.9, valkyrie: 0.8, golem: 0.6 },
        strategy: { centaur: 1.4, kraken: 1.0, sphinx: 0.8, kitsune: 0.7 },
        logic: { centaur: 1.3, owl_of_athena: 0.9, sphinx: 0.8, golem: 0.6 },
        elegance: { siren: 1.5, unicorn: 0.9, phoenix: 0.7, kitsune: 0.8 },
        perfection: { simurgh: 1.4, phoenix: 0.8, valkyrie: 0.7, centaur: 0.6 },
        persistence: { hydra: 1.5, phoenix: 0.9, valkyrie: 0.8, golem: 0.7 },
        ambition: { dragon: 1.5, valkyrie: 1.2, simurgh: 1.0, phoenix: 0.8 }
    };

    const creatureScores = {};
    for (const trait in traitScores) {
        const weights = weightedTraitToCreature[trait];
        if (weights) {
            for (const cId in weights) {
                creatureScores[cId] = (creatureScores[cId] || 0) + (traitScores[trait] * weights[cId]);
            }
        }
    }

    const sortedCreatures = Object.keys(creatureScores).sort((a, b) => creatureScores[b] - creatureScores[a]);
    const winnerId = sortedCreatures[0] || 'dragon';
    const secondaryId = sortedCreatures[1] || 'phoenix';

    const normalizedAxes = {};
    for (const axis in axisScores) {
        normalizedAxes[axis] = Math.min(100, Math.max(20, (axisScores[axis] / 30) * 100));
    }

    return {
        creature: currentQuiz.results.find(r => r.id === winnerId) || currentQuiz.results[0],
        secondaryCreature: currentQuiz.results.find(r => r.id === secondaryId) || currentQuiz.results[1],
        radar: normalizedAxes,
        winnerId: winnerId
    };
}

// ==================== USER STATISTICS ====================
function loadUserStats() {
    const saved = localStorage.getItem('quiz_stats');
    userStats = saved ? JSON.parse(saved) : {};
}

function saveUserStats(creatureId) {
    userStats[creatureId] = (userStats[creatureId] || 0) + 1;
    localStorage.setItem('quiz_stats', JSON.stringify(userStats));
}

function getCreaturePercentage(creatureId) {
    const total = Object.values(userStats).reduce((a, b) => a + b, 0);
    if (total === 0) return 0;
    return Math.round((userStats[creatureId] || 0) / total * 100);
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
                // Delay alert to ensure language is set
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
    const { creature, secondaryCreature, radar, winnerId } = calculateResult();
    saveUserStats(winnerId);
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

    // Handle comparison if friend data is present
    if (friendComparisonData) {
        const currentUserData = {
            creatureId: winnerId,
            secondaryCreatureId: secondaryCreature.id,
            radarScores: radar
        };
        const compatibilityScore = calculateCompatibility(friendComparisonData, currentUserData);

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
    const ctx = document.getElementById('radarChart').getContext('2d');
    const axesConfig = config.powerAxes[currentLang];
    const labels = Object.values(axesConfig);
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
    const locker = document.getElementById('cpa-locker');
    const content = document.getElementById('secret-content');
    locker.style.opacity = '0';
    locker.style.pointerEvents = 'none';
    content.style.opacity = '1';
    content.style.filter = 'none';
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
    } catch (err) {
        console.error('Download failed:', err);
        alert(currentLang === 'ar' ? 'عذراً، فشل تحميل الصورة.' : 'Sorry, download failed.');
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
    const encodedData = btoa(JSON.stringify(friendData));
    const comparisonUrl = `${window.location.origin}${window.location.pathname}?compare=${encodedData}`;
    const text = currentLang === 'ar'
        ? `تحداني في QuizMagic واكتشف مدى توافق هويتنا الأسطورية! ${comparisonUrl}`
        : `Challenge me on QuizMagic and discover our mythical compatibility! ${comparisonUrl}`;

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