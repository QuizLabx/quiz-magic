let currentLang = 'ar';
let currentQuiz = null;
let currentStepId = 0; // Index for Likert questions
let userResponses = []; // To store Likert responses
let scoreMap = {};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('quiz_lang') || 'ar';
    setLanguage(savedLang);
    // Do not auto-hide language screen if first time
    if (localStorage.getItem('quiz_lang')) {
        document.getElementById('language-screen').classList.add('opacity-0', 'pointer-events-none');
    }
});

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

function renderQuizGrid() {
    const grid = document.getElementById('quiz-grid');
    const data = quizzesData[currentLang];
    grid.innerHTML = '';

    data.quizzes.forEach(quiz => {
        const card = document.createElement('div');
        card.className = `quiz-card group bg-slate-800/60 rounded-3xl overflow-hidden border border-slate-700/50 cursor-pointer flex flex-col`;
        card.innerHTML = `
            <div class="relative h-56 overflow-hidden">
                <img src="${quiz.image}" alt="${quiz.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                <div class="absolute top-4 right-4 bg-purple-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl">
                    ${quiz.badge}
                </div>
            </div>
            <div class="p-6 flex-grow flex flex-col">
                <h3 class="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors">${quiz.title}</h3>
                <p class="text-slate-400 text-sm mb-6 flex-grow leading-relaxed">${quiz.description}</p>
                <button class="w-full py-3 rounded-xl font-bold transition-all transform active:scale-95 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg shadow-purple-600/20">
                    ${currentLang === 'ar' ? 'ابدأ الاختبار 🎭' : 'Start Quiz 🎭'}
                </button>
            </div>
        `;
        card.onclick = () => startQuiz(quiz.id);
        grid.appendChild(card);
    });
}

function startQuiz(quizId) {
    const data = quizzesData[currentLang];
    currentQuiz = data.quizzes.find(q => q.id === quizId);
    currentStepId = 0;
    userResponses = [];
    scoreMap = {};

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
        container.innerHTML = `
            <div class="mb-8">
                <div class="flex justify-between items-center mb-4">
                    <span class="text-xs font-bold text-purple-400 uppercase tracking-widest">
                        ${currentLang === 'ar' ? 'السؤال' : 'Question'} ${currentStepId + 1} / ${totalSteps}
                    </span>
                    <span class="text-xs text-slate-500">${Math.round(progress)}%</span>
                </div>
                <div class="w-full bg-slate-700/30 h-1.5 rounded-full overflow-hidden">
                    <div class="bg-gradient-to-r from-purple-600 to-pink-500 h-full transition-all duration-500" style="width: ${progress}%"></div>
                </div>
            </div>

            <div class="mb-10">
                <h2 class="text-2xl md:text-3xl font-bold text-slate-100 text-center leading-tight">${question.text}</h2>
            </div>
            
            <div class="space-y-3">
                ${[
                    { text: currentLang === 'ar' ? 'أوافق بشدة' : 'Strongly Agree', value: 5, color: 'bg-green-600/20 border-green-500/50 hover:bg-green-600/40' },
                    { text: currentLang === 'ar' ? 'أوافق' : 'Agree', value: 4, color: 'bg-blue-600/20 border-blue-500/50 hover:bg-blue-600/40' },
                    { text: currentLang === 'ar' ? 'محايد' : 'Neutral', value: 3, color: 'bg-slate-700/40 border-slate-600/50 hover:bg-slate-700/60' },
                    { text: currentLang === 'ar' ? 'لا أوافق' : 'Disagree', value: 2, color: 'bg-orange-600/20 border-orange-500/50 hover:bg-orange-600/40' },
                    { text: currentLang === 'ar' ? 'لا أوافق بشدة' : 'Strongly Disagree', value: 1, color: 'bg-red-600/20 border-red-500/50 hover:bg-red-600/40' }
                ].map((opt) => `
                    <button onclick="handleLikert(${opt.value})" class="w-full p-4 text-center ${opt.color} border rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 font-bold text-lg">
                        ${opt.text}
                    </button>
                `).join('')}
            </div>
        `;
        container.classList.remove('opacity-0');
        container.classList.add('opacity-100');
    }, 200);
}

function handleLikert(value) {
    const question = currentQuiz.questions[currentStepId];
    userResponses.push({ trait: question.trait, value: value });

    if (currentStepId < currentQuiz.questions.length - 1) {
        currentStepId++;
        showStep();
    } else {
        showLoading();
    }
}

function showLoading() {
    const container = document.getElementById('quiz-container');
    container.innerHTML = `
        <div class="py-16 text-center">
            <div class="relative inline-block w-24 h-24 mb-8">
                <div class="absolute inset-0 border-4 border-purple-500/10 rounded-full"></div>
                <div class="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <div class="absolute inset-4 border-4 border-pink-500/20 border-b-transparent rounded-full animate-spin-slow"></div>
            </div>
            <h2 class="text-3xl font-bold mb-4 animate-pulse bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                ${currentLang === 'ar' ? 'جاري تحليل شخصيتك...' : 'Analyzing your psyche...'}
            </h2>
            <p class="text-slate-400 text-lg">${currentLang === 'ar' ? 'نقوم بربط إجاباتك بالقوى الأسطورية القديمة' : 'Mapping your responses to ancient mythical forces'}</p>
        </div>
    `;

    setTimeout(showResult, 3500);
}

function calculateResult() {
    const traitScores = {};
    userResponses.forEach(resp => {
        traitScores[resp.trait] = (traitScores[resp.trait] || 0) + resp.value;
    });

    // Mapping Traits to Creatures
    // leadership -> dragon, protection -> cerberus, analysis -> kraken, wisdom -> owl_of_athena, 
    // ambition -> simurgh, mystery -> sphinx, stability -> golem, uniqueness -> kitsune, 
    // purity -> unicorn, freedom -> pegasus, honor -> valkyrie, nature -> faun, 
    // hope -> phoenix, persuasion -> siren, persistence -> hydra, balance -> centaur
    
    const traitToCreature = {
        leadership: 'dragon',
        protection: 'cerberus',
        analysis: 'kraken',
        knowledge: 'owl_of_athena',
        wisdom: 'owl_of_athena',
        ambition: 'simurgh',
        perfection: 'simurgh',
        mystery: 'sphinx',
        curiosity: 'sphinx',
        stability: 'golem',
        tradition: 'golem',
        social: 'kitsune',
        adaptation: 'kitsune',
        purity: 'unicorn',
        altruism: 'unicorn',
        exploration: 'pegasus',
        energy: 'pegasus',
        honesty: 'valkyrie',
        potential: 'valkyrie',
        nature: 'faun',
        composure: 'faun',
        potential: 'phoenix',
        intensity: 'phoenix',
        elegance: 'siren',
        intuition: 'siren',
        persistence: 'hydra',
        power: 'hydra',
        strategy: 'centaur',
        logic: 'centaur'
    };

    const creatureScores = {};
    for (const trait in traitScores) {
        const creatureId = traitToCreature[trait];
        if (creatureId) {
            creatureScores[creatureId] = (creatureScores[creatureId] || 0) + traitScores[trait];
        }
    }

    let maxScore = -1;
    let winnerId = 'dragon'; // Default

    for (const id in creatureScores) {
        if (creatureScores[id] > maxScore) {
            maxScore = creatureScores[id];
            winnerId = id;
        }
    }

    return currentQuiz.results.find(r => r.id === winnerId) || currentQuiz.results[0];
}

function showResult() {
    const result = calculateResult();
    
    document.getElementById('quiz-container').classList.add('hidden');
    const container = document.getElementById('result-container');
    container.classList.remove('hidden');

    container.innerHTML = `
        <div class="bg-slate-800/80 rounded-[2.5rem] overflow-hidden border border-slate-700/50 shadow-2xl result-glow mb-12">
            <div class="relative h-80 md:h-[30rem]">
                <img src="${result.image}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
                <div class="absolute bottom-10 left-0 right-0 px-8 text-center">
                    <span class="bg-purple-600/90 backdrop-blur-md text-white px-5 py-2 rounded-full text-sm font-bold mb-4 inline-block shadow-lg uppercase tracking-widest border border-white/20">${result.rarity}</span>
                    <h2 class="text-5xl md:text-7xl font-black text-white drop-shadow-2xl mb-2">${result.name}</h2>
                    <p class="text-purple-300 font-bold text-xl">${currentLang === 'ar' ? 'هذا هو كائنك الأسطوري الحقيقي' : 'This is your true mythical essence'}</p>
                </div>
            </div>
            <div class="p-8 md:p-14">
                <div class="mb-12">
                    <div class="inline-block p-3 bg-purple-600/10 rounded-2xl mb-6">
                        <i class="fas fa-fingerprint text-3xl text-purple-500"></i>
                    </div>
                    <h3 class="text-3xl font-bold text-white mb-6">
                        ${currentLang === 'ar' ? 'التحليل النفسي العميق' : 'Deep Psychological Analysis'}
                    </h3>
                    <p class="text-xl text-slate-300 leading-relaxed text-center italic">"${result.description}"</p>
                </div>
                
                <!-- CPA LOCKER SECTION -->
                <div class="relative p-1 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-[2rem] overflow-hidden shadow-2xl">
                    <div class="relative p-10 bg-slate-900/95 rounded-[1.8rem] overflow-hidden">
                        <div class="absolute inset-0 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center z-10">
                            <div class="w-20 h-20 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-6 border-4 border-white/10 shadow-inner">
                                <i class="fas fa-lock text-3xl text-white"></i>
                            </div>
                            <h3 class="text-3xl font-bold mb-4 text-white">${currentLang === 'ar' ? 'التقرير السري المتقدم' : 'Advanced Secret Report'}</h3>
                            <p class="text-slate-300 mb-8 max-w-md mx-auto text-lg leading-relaxed">
                                ${currentLang === 'ar' ? 'لقد كشفنا عن جوانب مخفية في عقلك الباطن. افتح التقرير الكامل لمعرفة نقاط قوتك المطلقة وتحدياتك القادمة.' : 'We have uncovered hidden aspects of your subconscious. Unlock the full report to see your absolute strengths and upcoming challenges.'}
                            </p>
                            <button id="unlock-button" onclick="callCPALocker()" class="pulse-button bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-12 py-5 rounded-full font-black text-xl transition-all transform hover:scale-105 shadow-2xl shadow-purple-600/40 border border-white/20">
                                <i class="fas fa-unlock-alt mr-2"></i> ${currentLang === 'ar' ? 'افتح التقرير الكامل (مجاناً)' : 'Unlock Full Report (Free)'}
                            </button>
                        </div>
                        <div id="secret-report-content-placeholder" class="opacity-5 select-none blur-md text-start space-y-6">
                            <p class="font-bold text-2xl">${currentLang === 'ar' ? 'بيانات تحليل العقل الباطن:' : 'Subconscious Mapping Data:'}</p>
                            <p>${currentLang === 'ar' ? 'بناءً على تقييمك المكون من 30 نقطة، تظهر مساراتك العصبية توافقاً كبيراً مع النماذج الأصلية القديمة. يشير هيمنتك في سمات محددة إلى مصفوفة شخصية نادرة توجد في 2% فقط من السكان.' : 'Based on your 30-point assessment, your neural pathways show a significant alignment with ancient archetypes. Your dominance in specific traits indicates a rare personality matrix found in only 2% of the population.'}</p>
                            <p>${currentLang === 'ar' ? 'الملف النفسي: مرونة عالية، ذكاء تكيفي، وتوقيع عاطفي فريد يتردد صداه مع العالم الأسطوري.' : 'Psychological Profile: High resilience, adaptive intelligence, and a unique emotional signature that resonates with the mythical realm.'}</p>
                        </div>
                        <div id="secret-report-actual-content" class="hidden text-start space-y-6">
                            <!-- Secret report content will be injected here -->
                        </div>
                    </div>
                </div>

                <div class="mt-12">
                    <button onclick="toggleArticle()" class="w-full py-5 bg-slate-700/20 hover:bg-slate-700/40 border border-slate-600/30 rounded-2xl transition-all flex items-center justify-center gap-4 font-bold text-xl group">
                        <i class="fas fa-scroll text-purple-400 group-hover:scale-110 transition-transform"></i> 
                        <span>${currentLang === 'ar' ? 'أساطير وحقائق عن كائنك' : 'Myths & Facts About Your Creature'}</span>
                        <i id="article-icon" class="fas fa-chevron-down text-sm transition-transform"></i>
                    </button>
                    <div id="article-content" class="hidden mt-8 p-8 bg-slate-900/60 rounded-[2rem] border border-slate-700/50 text-slate-300 leading-relaxed text-start text-lg">
                        <div class="prose prose-invert max-w-none">
                            ${result.article}
                        </div>
                    </div>
                </div>
                
                <div class="mt-16 flex flex-col sm:flex-row gap-6 justify-center">
                    <button onclick="location.reload()" class="bg-slate-700/40 hover:bg-slate-700 text-white px-10 py-4 rounded-2xl transition-all border border-slate-600/50 flex items-center justify-center gap-3 font-bold text-lg">
                        <i class="fas fa-undo-alt text-sm"></i> ${currentLang === 'ar' ? 'إعادة الاختبار' : 'Retake Quiz'}
                    </button>
                    <button onclick="shareResult()" class="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-2xl transition-all flex items-center justify-center gap-3 font-bold text-lg shadow-xl shadow-green-600/30">
                        <i class="fab fa-whatsapp text-2xl"></i> ${currentLang === 'ar' ? 'شارك النتيجة' : 'Share Result'}
                    </button>
                </div>
            </div>
        </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleArticle() {
    const content = document.getElementById('article-content');
    const icon = document.getElementById('article-icon');
    content.classList.toggle('hidden');
    icon.classList.toggle('rotate-180');
}

    let isReportUnlocked = false;

    function callCPALocker() {
        if (isReportUnlocked) return; // Prevent multiple unlocks

        const unlockButton = document.getElementById('unlock-button');
        const lockOverlay = unlockButton.closest('.absolute.inset-0');
        
        // 1. إخفاء الزر الحالي وإظهار شريط التقدم الوهمي
        lockOverlay.innerHTML = `
            <div class="w-full max-w-sm mx-auto text-center">
                <div class="mb-4">
                    <i class="fas fa-cog fa-spin text-4xl text-purple-500 mb-3"></i>
                    <h3 id="loading-text" class="text-xl font-bold text-white">
                        ${currentLang === 'ar' ? 'جاري الاتصال بقاعدة البيانات...' : 'Connecting to database...'}
                    </h3>
                </div>
                <div class="w-full bg-slate-800 rounded-full h-4 mb-2 border border-slate-600 overflow-hidden">
                    <div id="fake-progress-bar" class="bg-gradient-to-r from-purple-600 to-pink-600 h-4 rounded-full transition-all duration-300" style="width: 0%"></div>
                </div>
                <p id="progress-percentage" class="text-slate-400 text-sm font-bold">0%</p>
            </div>
        `;

        const progressBar = document.getElementById('fake-progress-bar');
        const progressText = document.getElementById('progress-percentage');
        const loadingText = document.getElementById('loading-text');
        
        let progress = 0;
        
        // 2. محاكاة تقدم الشريط وتغيير النصوص
        const interval = setInterval(() => {
            // زيادة التقدم بشكل عشوائي ليبدو حقيقياً
            progress += Math.floor(Math.random() * 15) + 5; 
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // 3. عند اكتمال الشريط، نظهر قفل المحتوى (CPA Locker)
                setTimeout(() => {
                    // Placeholder for AdBlueMedia CPA Locker
                    // In a real scenario, you'd integrate the CPA locker script here.
                    alert(currentLang === 'ar' ? 'سيتم تفعيل قفل المحتوى هنا لعرض العروض! (محاكاة للفتح)' : 'Content locker will be activated here! (Simulating unlock)');
                    
                    // Simulate CPA locker success after a delay
                    setTimeout(() => {
                        onCpaLockerSuccess();
                    }, 1500);
                }, 500);
            }

            // تحديث عرض الشريط والنسبة
            progressBar.style.width = `${progress}%`;
            progressText.innerText = `${progress}%`;

            // تغيير النص بناءً على نسبة التقدم
            if (progress > 30 && progress < 70) {
                loadingText.innerText = currentLang === 'ar' ? 'جاري فك تشفير التقرير السري...' : 'Decrypting secret report...';
            } else if (progress >= 70) {
                loadingText.innerText = currentLang === 'ar' ? 'جاري تجهيز العروض المتاحة...' : 'Preparing available offers...';
            }

        }, 600); // تحديث كل 600 ملي ثانية
    }

    function onCpaLockerSuccess() {
        isReportUnlocked = true;
        const result = calculateResult();
        const secretReportContent = document.getElementById('secret-report-actual-content');
        const secretReportPlaceholder = document.getElementById('secret-report-content-placeholder');
        const unlockButton = document.getElementById('unlock-button');
        const lockOverlay = unlockButton.closest('.absolute.inset-0'); // Get the overlay div

        if (result && result.secretReport) {
            const strengths = currentLang === 'ar' ? result.secretReport.strengths : result.secretReport.strengths_en;
            const challenges = currentLang === 'ar' ? result.secretReport.challenges : result.secretReport.challenges_en;
            const insight = currentLang === 'ar' ? result.secretReport.insight : result.secretReport.insight_en;

            secretReportContent.innerHTML = `
                <p class="font-bold text-2xl">${currentLang === 'ar' ? 'نقاط القوة المطلقة:' : 'Absolute Strengths:'}</p>
                <p class="text-slate-300 leading-relaxed">${strengths}</p>
                <p class="font-bold text-2xl mt-6">${currentLang === 'ar' ? 'التحديات القادمة:' : 'Upcoming Challenges:'}</p>
                <p class="text-slate-300 leading-relaxed">${challenges}</p>
                <p class="font-bold text-2xl mt-6">${currentLang === 'ar' ? 'بصيرة خفية:' : 'Hidden Insight:'}</p>
                <p class="text-slate-300 leading-relaxed">${insight}</p>
            `;
            secretReportContent.classList.remove('hidden');
            secretReportPlaceholder.classList.add('hidden');
            
            // Hide the lock overlay and update button text
            if (lockOverlay) {
                lockOverlay.classList.add('hidden');
            }
            if (unlockButton) {
                unlockButton.innerHTML = `<i class="fas fa-check-circle mr-2"></i> ${currentLang === 'ar' ? 'تم فتح التقرير!' : 'Report Unlocked!'}`;
                unlockButton.classList.remove('pulse-button', 'bg-gradient-to-r', 'from-purple-600', 'to-pink-600', 'hover:from-purple-500', 'hover:to-pink-500', 'shadow-purple-600/40');
                unlockButton.classList.add('bg-green-600', 'hover:bg-green-700', 'shadow-green-600/40');
                unlockButton.onclick = null; // Disable further clicks
            }
        } else {
            alert(currentLang === 'ar' ? 'عذراً، لا يوجد تقرير سري لهذا الكائن.' : 'Sorry, no secret report available for this creature.');
        }
    }

function shareResult() {
    const result = calculateResult();
    const creatureName = result.name;
    const url = window.location.href;
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm';
    modal.innerHTML = `
        <div class="bg-slate-800 rounded-3xl p-8 max-w-md w-full mx-4 border border-slate-700 shadow-2xl">
            <h3 class="text-2xl font-bold text-white mb-6 text-center">
                ${currentLang === 'ar' ? 'شارك النتيجة' : 'Share Your Result'}
            </h3>
            <p class="text-slate-300 text-center mb-8">
                ${currentLang === 'ar' ? 'أنت كائن أسطوري:' : 'You are a mythical creature:'} <strong class="text-purple-400">${creatureName}</strong>
            </p>
            <div class="space-y-4">
                <button onclick="shareOnWhatsApp('${creatureName}', '${url}')" class="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 text-lg">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </button>
                <button onclick="shareOnFacebook('${url}')" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 text-lg">
                    <i class="fab fa-facebook"></i> Facebook
                </button>
                <button onclick="shareOnTwitter('${creatureName}', '${url}')" class="w-full bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 text-lg">
                    <i class="fab fa-twitter"></i> Twitter
                </button>
                <button onclick="this.closest('.fixed').remove()" class="w-full bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-xl font-bold transition-all">
                    ${currentLang === 'ar' ? 'إغلاق' : 'Close'}
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

function shareOnWhatsApp(creatureName, url) {
    const text = currentLang === 'ar' 
        ? `🐉 اكتشفت كائني الأسطوري الحقيقي! أنا كائن: ${creatureName}\n\nهل تريد معرفة كائنك الأسطوري؟ جرب الاختبار الآن:` 
        : `🐉 I discovered my true mythical creature! I am: ${creatureName}\n\nWant to find out your mythical creature? Take the test now:`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`;
    window.open(whatsappUrl, '_blank');
}

function shareOnFacebook(url) {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
}

function shareOnTwitter(creatureName, url) {
    const text = currentLang === 'ar' 
        ? `🐉 اكتشفت كائني الأسطوري الحقيقي! أنا كائن: ${creatureName}. جرب الاختبار لتعرف كائنك الأسطوري!` 
        : `🐉 I discovered my true mythical creature! I am: ${creatureName}. Take the test to find your mythical creature!`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
}
