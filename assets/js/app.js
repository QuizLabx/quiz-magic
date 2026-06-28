let currentLang = 'ar';
let currentQuiz = null;
let currentStepId = 0; 
let userResponses = []; 

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

/**
 * نظام الأوزان الذكي المحدث (Balanced Weighted Scoring)
 * تم تعديل الأوزان لتقليل التحيز لكائنات معينة وضمان توزيع أعدل للنتائج
 */
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
            for (const creatureId in weights) {
                creatureScores[creatureId] = (creatureScores[creatureId] || 0) + (traitScores[trait] * weights[creatureId]);
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

    // حساب بيانات الرادار - تم ربطها بقوة بالكائن الفائز لضمان الاتساق البصري
    const baseRadar = {
        power: (traitScores['power'] || 0) + (traitScores['intensity'] || 0) + (traitScores['leadership'] || 0),
        wisdom: (traitScores['wisdom'] || 0) + (traitScores['knowledge'] || 0) + (traitScores['analysis'] || 0),
        mystery: (traitScores['mystery'] || 0) + (traitScores['intuition'] || 0) + (traitScores['curiosity'] || 0),
        purity: (traitScores['purity'] || 0) + (traitScores['altruism'] || 0) + (traitScores['nature'] || 0),
        leadership: (traitScores['leadership'] || 0) + (traitScores['strategy'] || 0) + (traitScores['honesty'] || 0),
        adaptation: (traitScores['adaptation'] || 0) + (traitScores['energy'] || 0) + (traitScores['exploration'] || 0)
    };

    // تعزيز سمات الكائن الفائز في الرادار ليكون الرسم متسقاً مع النتيجة
    const creatureTraitMapping = {
        dragon: ['power', 'leadership'],
        phoenix: ['adaptation', 'purity'],
        unicorn: ['purity'],
        sphinx: ['mystery', 'wisdom'],
        kraken: ['mystery', 'power'],
        owl_of_athena: ['wisdom'],
        centaur: ['wisdom', 'leadership'],
        cerberus: ['power', 'leadership'],
        faun: ['adaptation', 'purity'],
        golem: ['power', 'wisdom'],
        hydra: ['power', 'adaptation'],
        kitsune: ['adaptation', 'mystery'],
        pegasus: ['adaptation', 'purity'],
        simurgh: ['wisdom', 'purity'],
        siren: ['mystery', 'purity'],
        valkyrie: ['leadership', 'power']
    };

    const boostTraits = creatureTraitMapping[winnerId] || [];
    boostTraits.forEach(t => { if(baseRadar[t] !== undefined) baseRadar[t] += 5; });

    for (let key in baseRadar) {
        baseRadar[key] = Math.min(100, Math.max(30, (baseRadar[key] / 18) * 100));
    }

    return {
        creature: currentQuiz.results.find(r => r.id === winnerId) || currentQuiz.results[0],
        radar: baseRadar
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
                        <!-- Lock Overlay -->
                        <div class="absolute inset-0 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center z-[50]" id="lock-overlay">
                            <div class="w-20 h-20 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-6 border-4 border-white/10 shadow-inner">
                                <i class="fas fa-lock text-3xl text-white"></i>
                            </div>
                            <h3 class="text-3xl font-bold mb-4 text-white">${currentLang === 'ar' ? 'التقرير السري المتقدم' : 'Advanced Secret Report'}</h3>
                            <p class="text-slate-300 mb-8 text-lg">${currentLang === 'ar' ? 'اكتشف الحقائق المخفية عن شخصيتك' : 'Discover hidden truths about your personality'}</p>
                            <button onclick="unlockSecretReport()" class="relative z-[60] px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-lg pulse-button cursor-pointer">
                                ${currentLang === 'ar' ? '🔓 فتح التقرير السري' : '🔓 Unlock Secret Report'}
                            </button>
                        </div>
                        <!-- Actual Content -->
                        <div class="relative z-0 opacity-0 transition-opacity duration-700" id="secret-report-actual-content">
                            <h4 class="text-2xl font-bold text-purple-400 mb-6 text-center">${currentLang === 'ar' ? 'نقاط قوتك' : 'Your Strengths'}</h4>
                            <p class="text-slate-200 mb-8 text-lg leading-relaxed text-center">${creature.secretReport.strengths}</p>
                            
                            <h4 class="text-2xl font-bold text-pink-400 mb-6 text-center">${currentLang === 'ar' ? 'التحديات التي تواجهها' : 'Challenges You Face'}</h4>
                            <p class="text-slate-200 mb-8 text-lg leading-relaxed text-center">${creature.secretReport.challenges}</p>
                            
                            <h4 class="text-2xl font-bold text-blue-400 mb-6 text-center">${currentLang === 'ar' ? 'الرؤية الحكيمة' : 'Wise Insight'}</h4>
                            <p class="text-slate-200 text-lg leading-relaxed text-center italic">"${creature.secretReport.insight}"</p>
                        </div>
                    </div>
                </div>

                <div class="mt-12 p-8 bg-slate-800/50 rounded-2xl border border-slate-700/30">
                    <h3 class="text-2xl font-bold text-white mb-6">${currentLang === 'ar' ? 'المقالة الكاملة' : 'Full Article'}</h3>
                    <p class="text-slate-300 leading-relaxed text-lg">${creature.article}</p>
                </div>

                <div class="mt-12 flex gap-4 justify-center flex-wrap">
                    <button onclick="location.reload()" class="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full transition-all transform hover:scale-105 active:scale-95">
                        ${currentLang === 'ar' ? '🔄 اختبار آخر' : '🔄 Another Quiz'}
                    </button>
                    <button onclick="shareResult()" class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all transform hover:scale-105 active:scale-95">
                        ${currentLang === 'ar' ? '📤 شارك النتيجة' : '📤 Share Result'}
                    </button>
                </div>
            </div>
        </div>
    `;

    renderRadarChart(radar);
}

function unlockSecretReport() {
    const lockOverlay = document.getElementById('lock-overlay');
    const secretContent = document.getElementById('secret-report-actual-content');
    
    // أنيميشن الاختفاء
    lockOverlay.style.opacity = '0';
    lockOverlay.style.pointerEvents = 'none';
    
    setTimeout(() => {
        lockOverlay.classList.add('hidden');
        secretContent.classList.remove('opacity-0');
        secretContent.classList.add('opacity-100');
    }, 500);
}

function renderRadarChart(data) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: [
                currentLang === 'ar' ? 'القوة' : 'Power',
                currentLang === 'ar' ? 'الحكمة' : 'Wisdom',
                currentLang === 'ar' ? 'الغموض' : 'Mystery',
                currentLang === 'ar' ? 'النقاء' : 'Purity',
                currentLang === 'ar' ? 'القيادة' : 'Leadership',
                currentLang === 'ar' ? 'التكيف' : 'Adaptation'
            ],
            datasets: [{
                label: currentLang === 'ar' ? 'ملفك الروحي' : 'Your Spiritual Profile',
                data: [data.power, data.wisdom, data.mystery, data.purity, data.leadership, data.adaptation],
                borderColor: 'rgba(168, 85, 247, 0.8)',
                backgroundColor: 'rgba(168, 85, 247, 0.2)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(168, 85, 247, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'rgba(226, 232, 240, 0.8)',
                        font: { size: 12, weight: 'bold' }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        display: false,
                        stepSize: 20
                    },
                    grid: {
                        color: 'rgba(100, 116, 139, 0.2)'
                    },
                    angleLines: {
                        color: 'rgba(100, 116, 139, 0.2)'
                    },
                    pointLabels: {
                        color: 'rgba(226, 232, 240, 0.7)',
                        font: { size: 11 }
                    }
                }
            }
        }
    });
}

function shareResult() {
    const creatureName = document.querySelector('h2').innerText;
    const text = currentLang === 'ar' 
        ? `لقد اكتشفت أنني ${creatureName}! جرب اختبار QuizMagic الآن واكتشف كائنك الأسطوري الحقيقي 🐉`
        : `I discovered I'm a ${creatureName}! Try QuizMagic now and discover your true mythical creature 🐉`;
    
    if (navigator.share) {
        navigator.share({
            title: 'QuizMagic',
            text: text,
            url: window.location.href
        }).catch(() => {
            copyToClipboard(text);
        });
    } else {
        copyToClipboard(text);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert(currentLang === 'ar' ? 'تم نسخ النتيجة! يمكنك مشاركتها الآن.' : 'Result copied! You can share it now.');
    });
}
