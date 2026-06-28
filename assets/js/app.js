let currentLang = 'ar';
let currentQuiz = null;
let currentStepId = 0; 
let userResponses = []; 
let scoreMap = {};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('quiz_lang') || 'ar';
    setLanguage(savedLang);
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
        let content = `
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
        `;

        if (question.type === 'visual') {
            content += `
                <div class="grid grid-cols-2 gap-4 sm:gap-6">
                    ${question.options.map((opt) => `
                        <div onclick="handleVisualChoice('${opt.trait}', ${opt.value})" class="group cursor-pointer relative overflow-hidden rounded-2xl border-2 border-slate-700 hover:border-purple-500 transition-all transform hover:scale-[1.03] active:scale-95 shadow-lg">
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
    let winnerId = 'dragon';

    for (const id in creatureScores) {
        if (creatureScores[id] > maxScore) {
            maxScore = creatureScores[id];
            winnerId = id;
        }
    }

    // Calculate Radar Chart Data
    const radarData = {
        power: (traitScores['power'] || 0) + (traitScores['intensity'] || 0) + (traitScores['leadership'] || 0),
        wisdom: (traitScores['wisdom'] || 0) + (traitScores['knowledge'] || 0) + (traitScores['analysis'] || 0),
        mystery: (traitScores['mystery'] || 0) + (traitScores['intuition'] || 0) + (traitScores['curiosity'] || 0),
        purity: (traitScores['purity'] || 0) + (traitScores['altruism'] || 0) + (traitScores['nature'] || 0),
        leadership: (traitScores['leadership'] || 0) + (traitScores['strategy'] || 0) + (traitScores['honesty'] || 0),
        adaptation: (traitScores['adaptation'] || 0) + (traitScores['energy'] || 0) + (traitScores['exploration'] || 0)
    };

    // Normalize to 0-100
    for (let key in radarData) {
        radarData[key] = Math.min(100, Math.max(20, (radarData[key] / 15) * 100));
    }

    return {
        creature: currentQuiz.results.find(r => r.id === winnerId) || currentQuiz.results[0],
        radar: radarData
    };
}

function showResult() {
    const { creature, radar } = calculateResult();
    document.getElementById('quiz-container').classList.add('hidden');
    const container = document.getElementById('result-container');
    container.classList.remove('hidden');

    container.innerHTML = `
        <div class="bg-slate-800/80 rounded-[2.5rem] overflow-hidden border border-slate-700/50 shadow-2xl result-glow mb-12">
            <div class="relative h-80 md:h-[30rem]">
                <img src="${creature.image}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
                <div class="absolute bottom-10 left-0 right-0 px-8 text-center">
                    <span class="bg-purple-600/90 backdrop-blur-md text-white px-5 py-2 rounded-full text-sm font-bold mb-4 inline-block shadow-lg uppercase tracking-widest border border-white/20">${creature.rarity}</span>
                    <h2 class="text-5xl md:text-7xl font-black text-white drop-shadow-2xl mb-2">${creature.name}</h2>
                    <p class="text-purple-300 font-bold text-xl">${currentLang === 'ar' ? 'هذا هو كائنك الأسطوري الحقيقي' : 'This is your true mythical essence'}</p>
                </div>
            </div>
            
            <div class="p-8 md:p-14">
                <!-- Radar Chart Section -->
                <div class="mb-16">
                    <h3 class="text-3xl font-bold text-white mb-10 text-center">
                        ${currentLang === 'ar' ? 'خارطة القوى الروحية' : 'Spiritual Power Map'}
                    </h3>
                    <div class="max-w-md mx-auto bg-slate-900/40 p-6 rounded-[2rem] border border-slate-700/30 shadow-inner">
                        <canvas id="radarChart"></canvas>
                    </div>
                </div>

                <div class="mb-12">
                    <div class="inline-block p-3 bg-purple-600/10 rounded-2xl mb-6">
                        <i class="fas fa-fingerprint text-3xl text-purple-500"></i>
                    </div>
                    <h3 class="text-3xl font-bold text-white mb-6">
                        ${currentLang === 'ar' ? 'التحليل النفسي العميق' : 'Deep Psychological Analysis'}
                    </h3>
                    <p class="text-xl text-slate-300 leading-relaxed text-center italic">"${creature.description}"</p>
                </div>
                
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
                            <p>${currentLang === 'ar' ? 'بناءً على تقييمك المكون من 40 نقطة، تظهر مساراتك العصبية توافقاً كبيراً مع النماذج الأصلية القديمة.' : 'Based on your 40-point assessment, your neural pathways show significant alignment with ancient archetypes.'}</p>
                            <div class="h-4 bg-slate-800 rounded w-3/4"></div>
                            <div class="h-4 bg-slate-800 rounded w-1/2"></div>
                            <div class="h-4 bg-slate-800 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex justify-center mb-20">
            <button onclick="location.reload()" class="bg-slate-800 hover:bg-slate-700 text-white px-10 py-4 rounded-2xl font-bold transition-all border border-slate-700 shadow-xl">
                <i class="fas fa-redo-alt mr-2"></i> ${currentLang === 'ar' ? 'إعادة الاختبار' : 'Retake Quiz'}
            </button>
        </div>
    `;

    renderRadarChart(radar);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderRadarChart(data) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    
    const labels = currentLang === 'ar' 
        ? ['القوة', 'الحكمة', 'الغموض', 'النقاء', 'القيادة', 'التكيف']
        : ['Power', 'Wisdom', 'Mystery', 'Purity', 'Leadership', 'Adaptation'];

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: currentLang === 'ar' ? 'نسبة القوى' : 'Power Levels',
                data: [data.power, data.wisdom, data.mystery, data.purity, data.leadership, data.adaptation],
                backgroundColor: 'rgba(147, 51, 234, 0.2)',
                borderColor: 'rgba(168, 85, 247, 1)',
                borderWidth: 3,
                pointBackgroundColor: 'rgba(236, 72, 153, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(236, 72, 153, 1)',
                pointRadius: 4
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: {
                        color: '#cbd5e1',
                        font: { size: 14, family: 'Cairo' }
                    },
                    ticks: { display: false, stepSize: 20 },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            },
            plugins: {
                legend: { display: false }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });
}

function callCPALocker() {
    // Fake loading for effect
    const btn = document.getElementById('unlock-button');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-spinner animate-spin"></i> ${currentLang === 'ar' ? 'جاري التحميل...' : 'Loading...'}`;
    
    setTimeout(() => {
        alert(currentLang === 'ar' ? 'سيتم تفعيل قفل المحتوى هنا لعرض العروض! (محاكاة للفتح)' : 'CPA Locker will be triggered here! (Simulation)');
        onCpaLockerSuccess();
    }, 2000);
}

function onCpaLockerSuccess() {
    // This will be called when the CPA offer is completed
    const result = calculateResult().creature;
    const placeholder = document.getElementById('secret-report-content-placeholder');
    const unlockOverlay = placeholder.previousElementSibling;
    
    unlockOverlay.style.display = 'none';
    placeholder.classList.remove('opacity-5', 'select-none', 'blur-md');
    placeholder.classList.add('opacity-100');
    
    placeholder.innerHTML = `
        <div class="space-y-8 animate-fade-in">
            <div class="border-l-4 border-purple-500 pl-6 py-2 bg-purple-500/5 rounded-r-xl">
                <h4 class="text-purple-400 font-bold text-xl mb-3">${currentLang === 'ar' ? 'نقاط القوة المطلقة' : 'Absolute Strengths'}</h4>
                <p class="text-slate-200 text-lg leading-relaxed">${result.secretReport.strengths}</p>
            </div>
            
            <div class="border-l-4 border-pink-500 pl-6 py-2 bg-pink-500/5 rounded-r-xl">
                <h4 class="text-pink-400 font-bold text-xl mb-3">${currentLang === 'ar' ? 'التحديات الكبرى' : 'Major Challenges'}</h4>
                <p class="text-slate-200 text-lg leading-relaxed">${result.secretReport.challenges}</p>
            </div>
            
            <div class="bg-gradient-to-r from-slate-800 to-slate-800/50 p-8 rounded-3xl border border-slate-700/50">
                <h4 class="text-white font-bold text-xl mb-4 flex items-center">
                    <i class="fas fa-lightbulb text-yellow-400 mr-3"></i>
                    ${currentLang === 'ar' ? 'نصيحة روحية لك' : 'Spiritual Insight for You'}
                </h4>
                <p class="text-slate-300 text-lg italic leading-relaxed">"${result.secretReport.insight}"</p>
            </div>
        </div>
    `;
}
