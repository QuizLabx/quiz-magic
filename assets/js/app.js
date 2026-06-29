let currentLang = 'ar';
let currentQuiz = null;
let currentStepId = 0; 
let userResponses = []; 
let currentTheme = 'dark';

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
    
    // Re-render grid to apply theme to dynamic cards if needed
    renderQuizGrid();
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
                a.className = "w-10 h-10 rounded-full flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all transform hover:scale-110 theme-bg-tertiary theme-text-primary";
                a.innerHTML = `<i class="${link.icon}"></i>`;
                container.appendChild(a);
            }
        });
    }
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
    const grid = document.getElementById('quiz-grid');
    const data = quizzesData[currentLang];
    grid.innerHTML = '';

    data.quizzes.forEach(quiz => {
        const card = document.createElement('div');
        card.className = `quiz-card group rounded-3xl overflow-hidden cursor-pointer flex flex-col animate-fade-in`;
        card.innerHTML = `
            <div class="relative h-56 overflow-hidden">
                <img src="${quiz.image}" alt="${quiz.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
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
}

// ==================== WELCOME SCREEN ====================

function showWelcomeScreen(quizId) {
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
                    <div class="text-3xl mb-3 text-purple-400"><i class="fas fa-question-circle"></i></div>
                    <h4 class="font-bold theme-text-primary mb-2">${isAr ? 'الخطوة 1: الأسئلة' : 'Step 1: Questions'}</h4>
                    <p class="theme-text-secondary text-xs">${isAr ? 'أجب على الأسئلة بصراحة وتلقائية.' : 'Answer the questions honestly and spontaneously.'}</p>
                </div>
                <div class="theme-bg-tertiary/20 p-5 rounded-2xl border theme-border">
                    <div class="text-3xl mb-3 text-blue-400"><i class="fas fa-brain"></i></div>
                    <h4 class="font-bold theme-text-primary mb-2">${isAr ? 'الخطوة 2: التحليل' : 'Step 2: Analysis'}</h4>
                    <p class="theme-text-secondary text-xs">${isAr ? 'نظامنا يحلل إجاباتك بخوارزمية متقدمة.' : 'Our system analyzes your answers with an advanced algorithm.'}</p>
                </div>
                <div class="theme-bg-tertiary/20 p-5 rounded-2xl border theme-border">
                    <div class="text-3xl mb-3 text-pink-400"><i class="fas fa-dragon"></i></div>
                    <h4 class="font-bold theme-text-primary mb-2">${isAr ? 'الخطوة 3: الكشف' : 'Step 3: Discovery'}</h4>
                    <p class="theme-text-secondary text-xs">${isAr ? 'اكتشف كائنك الأسطوري من بين 16 كائن.' : 'Discover your mythical creature among 16 beings.'}</p>
                </div>
                <div class="theme-bg-tertiary/20 p-5 rounded-2xl border theme-border">
                    <div class="text-3xl mb-3 text-green-400"><i class="fas fa-share-alt"></i></div>
                    <h4 class="font-bold theme-text-primary mb-2">${isAr ? 'الخطوة 4: المشاركة' : 'Step 4: Sharing'}</h4>
                    <p class="theme-text-secondary text-xs">${isAr ? 'حمل نتيجتك كصورة احترافية وشاركها.' : 'Download your result as a professional image and share it.'}</p>
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
            <div class="mb-8">
                <div class="flex justify-between items-center mb-4">
                    <span class="text-xs font-bold text-purple-400 uppercase tracking-widest">
                        ${currentLang === 'ar' ? 'السؤال' : 'Question'} ${currentStepId + 1} / ${totalSteps}
                    </span>
                    <span class="text-xs theme-text-muted">${Math.round(progress)}%</span>
                </div>
                <div class="w-full theme-bg-tertiary/30 h-1.5 rounded-full overflow-hidden">
                    <div class="bg-gradient-to-r from-purple-600 to-pink-500 h-full transition-all duration-500 progress-bar-animated" style="width: ${progress}%"></div>
                </div>
            </div>

            <div class="mb-10">
                <h2 class="text-2xl md:text-3xl font-bold theme-text-primary text-center leading-tight animate-slide-up">${question.text}</h2>
            </div>
        `;

        if (question.type === 'visual') {
            content += `
                <div class="grid grid-cols-2 gap-4 sm:gap-6">
                    ${question.options.map((opt) => `
                        <div onclick="handleVisualChoice('${opt.trait}', ${opt.value})" class="group cursor-pointer relative overflow-hidden rounded-2xl border-2 theme-border hover:border-purple-500 transition-all transform hover:scale-[1.03] active:scale-95 shadow-lg">
                            <div class="aspect-square overflow-hidden">
                                <img src="${opt.image}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
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
                        <button onclick="handleLikert(${opt.value})" class="w-full p-4 text-center ${opt.color} border rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 font-bold text-lg theme-text-primary">
                            ${opt.text}
                        </button>
                    `).join('')}
                </div>
            `;
        }

        container.innerHTML = content;
        container.classList.remove('opacity-0');
        container.classList.add('opacity-100');
    }, 200);
}

function handleLikert(value) {
    const question = currentQuiz.questions[currentStepId];
    userResponses.push({ trait: question.trait, value: value });
    nextStep();
}

function handleVisualChoice(trait, value) {
    userResponses.push({ trait: trait, value: value });
    nextStep();
}

function nextStep() {
    if (currentStepId < currentQuiz.questions.length - 1) {
        currentStepId++;
        showStep();
    } else {
        showLoading();
    }
}

// ==================== LOADING SCREEN ====================

function showLoading() {
    const container = document.getElementById('quiz-container');
    const delay = (typeof config !== 'undefined') ? config.analysisSpeed : 3500;
    container.innerHTML = `
        <div class="py-16 text-center animate-fade-in">
            <div class="relative inline-block w-24 h-24 mb-8">
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
    userResponses.forEach(resp => {
        traitScores[resp.trait] = (traitScores[resp.trait] || 0) + resp.value;
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
        persistence: { hydra: 1.5, phoenix: 0.9, valkyrie: 0.8, golem: 0.7 }
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

    let maxScore = -1;
    let winnerId = 'dragon';
    for (const id in creatureScores) {
        if (creatureScores[id] > maxScore) {
            maxScore = creatureScores[id];
            winnerId = id;
        }
    }

    const radarData = {
        power: Math.min(100, Math.max(30, ((traitScores['power'] || 3) + (traitScores['leadership'] || 3)) * 8)),
        wisdom: Math.min(100, Math.max(30, ((traitScores['wisdom'] || 3) + (traitScores['knowledge'] || 3)) * 8)),
        mystery: Math.min(100, Math.max(30, ((traitScores['mystery'] || 3) + (traitScores['intuition'] || 3)) * 8)),
        purity: Math.min(100, Math.max(30, ((traitScores['purity'] || 3) + (traitScores['nature'] || 3)) * 8)),
        leadership: Math.min(100, Math.max(30, ((traitScores['leadership'] || 3) + (traitScores['strategy'] || 3)) * 8)),
        adaptation: Math.min(100, Math.max(30, ((traitScores['adaptation'] || 3) + (traitScores['energy'] || 3)) * 8))
    };

    return {
        creature: currentQuiz.results.find(r => r.id === winnerId) || currentQuiz.results[0],
        radar: radarData
    };
}

// ==================== RESULT DISPLAY ====================

function showResult() {
    const { creature, radar } = calculateResult();
    document.getElementById('quiz-container').classList.add('hidden');
    const container = document.getElementById('result-container');
    container.classList.remove('hidden');

    container.innerHTML = `
        <div class="theme-bg-secondary rounded-[2.5rem] overflow-hidden border theme-border shadow-2xl mb-12 animate-fade-in">
            <div class="relative h-80 md:h-[30rem]">
                <img src="${creature.image}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div class="absolute bottom-10 left-0 right-0 px-8 text-center">
                    <span class="bg-purple-600/90 backdrop-blur-md text-white px-5 py-2 rounded-full text-sm font-bold mb-4 inline-block shadow-lg uppercase tracking-widest border border-white/20">${creature.rarity}</span>
                    <h2 class="text-5xl md:text-7xl font-black text-white drop-shadow-2xl mb-2">${creature.name}</h2>
                    <p class="text-purple-300 font-bold text-xl">${currentLang === 'ar' ? 'هذا هو كائنك الأسطوري الحقيقي' : 'This is your true mythical essence'}</p>
                </div>
            </div>
            
            <div class="p-8 md:p-14">
                <div class="mb-16">
                    <h3 class="text-3xl font-bold theme-text-primary mb-10 text-center">
                        ${currentLang === 'ar' ? 'خارطة القوى الروحية' : 'Spiritual Power Map'}
                    </h3>
                    <div class="max-w-md mx-auto theme-bg-tertiary/20 p-6 rounded-[2rem] border theme-border shadow-inner">
                        <canvas id="radarChart"></canvas>
                    </div>
                </div>

                <div class="mb-12">
                    <div class="inline-block p-3 bg-purple-600/10 rounded-2xl mb-6">
                        <i class="fas fa-fingerprint text-3xl text-purple-500"></i>
                    </div>
                    <h3 class="text-3xl font-bold theme-text-primary mb-6">
                        ${currentLang === 'ar' ? 'التحليل النفسي العميق' : 'Deep Psychological Analysis'}
                    </h3>
                    <p class="text-xl theme-text-secondary leading-relaxed text-center italic">"${creature.description}"</p>
                </div>
                
                <div class="relative p-1 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-[2rem] overflow-hidden shadow-2xl">
                    <div class="relative p-10 theme-bg-primary rounded-[1.8rem] overflow-hidden">
                        <div id="cpa-locker" class="absolute inset-0 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center z-10">
                            <div class="w-20 h-20 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-6 border-4 border-white/10 shadow-inner">
                                <i class="fas fa-lock text-3xl text-white"></i>
                            </div>
                            <h3 class="text-3xl font-bold mb-4 theme-text-primary">${currentLang === 'ar' ? 'التقرير السري المتقدم' : 'Advanced Secret Report'}</h3>
                            <button onclick="unlockSecretReport()" class="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition-all z-[60] cursor-pointer relative">
                                ${currentLang === 'ar' ? 'فتح التقرير السري' : 'Unlock Secret Report'}
                            </button>
                        </div>
                        <div id="secret-content" class="opacity-10 blur-xl transition-all duration-1000">
                            <h4 class="text-2xl font-bold text-purple-400 mb-4">${currentLang === 'ar' ? 'نمط قوتك:' : 'Power Pattern:'}</h4>
                            <p class="theme-text-secondary mb-6">${creature.secretReport.strengths}</p>
                            <h4 class="text-2xl font-bold text-purple-400 mb-4">${currentLang === 'ar' ? 'التحديات:' : 'Challenges:'}</h4>
                            <p class="theme-text-secondary mb-6">${creature.secretReport.challenges}</p>
                            <div class="p-4 theme-bg-tertiary/20 border theme-border rounded-xl">
                                <p class="text-purple-300 italic">"${creature.secretReport.insight}"</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            <button onclick="downloadResultAsImage()" class="flex items-center justify-center gap-3 p-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl shadow-blue-600/20">
                <i class="fas fa-image"></i> ${currentLang === 'ar' ? '🖼️ تحميل النتيجة كصورة' : '🖼️ Download as Image'}
            </button>
            <button onclick="shareResult()" class="flex items-center justify-center gap-3 p-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl shadow-purple-600/20">
                <i class="fas fa-share-alt"></i> ${currentLang === 'ar' ? '🚀 شارك النتيجة' : '🚀 Share Result'}
            </button>
        </div>

        <button onclick="location.reload()" class="theme-text-muted hover:theme-text-primary transition font-bold mb-20">
            <i class="fas fa-redo mr-2"></i> ${currentLang === 'ar' ? 'إعادة الاختبار' : 'Retake Quiz'}
        </button>
    `;

    renderRadarChart(radar);
    prepareShareTemplate(creature);
}

// ==================== RADAR CHART ====================

function renderRadarChart(data) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    const labels = currentLang === 'ar' 
        ? ['القوة', 'الحكمة', 'الغموض', 'النقاء', 'القيادة', 'التكيف']
        : ['Power', 'Wisdom', 'Mystery', 'Purity', 'Leadership', 'Adaptation'];

    const isLight = document.documentElement.classList.contains('light-mode');
    const gridColor = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
    const textColor = isLight ? '#0f172a' : '#94a3b8';

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: currentLang === 'ar' ? 'قواك الروحية' : 'Spiritual Powers',
                data: [data.power, data.wisdom, data.mystery, data.purity, data.leadership, data.adaptation],
                backgroundColor: 'rgba(168, 85, 247, 0.2)',
                borderColor: 'rgba(168, 85, 247, 0.8)',
                borderWidth: 3,
                pointBackgroundColor: '#a855f7',
                pointBorderColor: '#fff',
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: { color: gridColor },
                    grid: { color: gridColor },
                    pointLabels: { color: textColor, font: { size: 14, family: 'Cairo' } },
                    ticks: { display: false },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            },
            plugins: { legend: { display: false } }
        }
    });
}

// ==================== SECRET REPORT ====================

function unlockSecretReport() {
    const locker = document.getElementById('cpa-locker');
    const content = document.getElementById('secret-content');
    locker.style.opacity = '0';
    locker.style.pointerEvents = 'none';
    content.style.opacity = '1';
    content.style.filter = 'none';
}

// ==================== SHARE TEMPLATE ====================

function prepareShareTemplate(creature) {
    const img = document.getElementById('share-creature-img');
    if (img) img.src = creature.image;
    const name = document.getElementById('share-creature-name');
    if (name) name.innerText = creature.name;
    const rarity = document.getElementById('share-rarity');
    if (rarity) rarity.innerText = creature.rarity;
    const tagline = document.getElementById('share-tagline');
    if (tagline) tagline.innerText = currentLang === 'ar' ? 'كائني الأسطوري الحقيقي' : 'My True Mythical Essence';
    const desc = document.getElementById('share-description');
    if (desc) desc.innerText = creature.description.substring(0, 160) + '...';
}

// ==================== DOWNLOAD & SHARE ====================

async function downloadResultAsImage() {
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class="fas fa-spinner animate-spin"></i> ${currentLang === 'ar' ? 'جاري التجهيز...' : 'Preparing...'}`;
    btn.disabled = true;

    const template = document.getElementById('share-template');
    try {
        const canvas = await html2canvas(template, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#0f172a',
            width: 1080,
            height: 1080,
            logging: false
        });
        const link = document.createElement('a');
        link.download = `QuizMagic-Result-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
    } catch (err) {
        console.error('Error:', err);
        alert(currentLang === 'ar' ? 'عذراً، حدث خطأ أثناء تحميل الصورة.' : 'Sorry, an error occurred.');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function shareResult() {
    const name = document.querySelector('h2.text-5xl')?.innerText || 'Creature';
    const shareData = {
        title: 'QuizMagic',
        text: currentLang === 'ar' 
            ? `لقد اكتشفت أنني ${name}! جرب الاختبار الآن واكتشف كائنك الأسطوري.`
            : `I discovered that I am a ${name}! Take the quiz and discover your mythical essence.`,
        url: window.location.href
    };
    if (navigator.share) {
        navigator.share(shareData);
    } else {
        navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert(currentLang === 'ar' ? 'تم نسخ الرابط والنتيجة! يمكنك مشاركتها الآن.' : 'Link and result copied!');
    }
}
