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
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('loading-screen').classList.remove('hidden');
    document.getElementById('loading-screen').classList.add('opacity-100');
    const loadingMessages = currentLang === 'ar' ? [
        'جاري تحليل الأنماط السلوكية...', 
        'جاري مطابقة القوى الأسطورية...', 
        'جاري فك تشفير رموز شخصيتك...', 
        'قوى خفية على وشك الظهور...' 
    ] : [
        'Analyzing behavioral patterns...', 
        'Matching mythical forces...', 
        'Decoding your personality glyphs...', 
        'Hidden powers are about to emerge...' 
    ];
    let messageIndex = 0;
    const loadingTextElement = document.getElementById('loading-text');
    const loadingSubtitleElement = document.getElementById('loading-subtitle');

    const updateLoadingMessage = () => {
        if (loadingTextElement && loadingSubtitleElement) {
            loadingTextElement.innerText = loadingMessages[messageIndex];
            loadingSubtitleElement.innerText = currentLang === 'ar' ? 'يرجى الانتظار...' : 'Please wait...';
            messageIndex = (messageIndex + 1) % loadingMessages.length;
        }
    };

    const loadingInterval = setInterval(updateLoadingMessage, 1000);


    updateLoadingMessage(); // Initial message
    setTimeout(() => {
        clearInterval(loadingInterval);
        document.getElementById('loading-screen').classList.remove('opacity-100');
        document.getElementById('loading-screen').classList.add('hidden');
        showResult();
    }, 3500);
}


function calculateResult() {
    const traitScores = {};
    userResponses.forEach(resp => {
        traitScores[resp.trait] = (traitScores[resp.trait] || 0) + resp.value;
    });

    const traitWeights = {
        leadership: { dragon: 1.0, phoenix: 0.5, valkyrie: 0.7, simurgh: 0.3, centaur: 0.4 },
        protection: { cerberus: 1.0, dragon: 0.4, golem: 0.6, hydra: 0.3 },
        analysis: { kraken: 1.0, sphinx: 0.7, owl_of_athena: 0.6, centaur: 0.5 },
        knowledge: { owl_of_athena: 1.0, sphinx: 0.5, simurgh: 0.8, centaur: 0.6 },
        wisdom: { owl_of_athena: 1.0, simurgh: 0.9, sphinx: 0.6, centaur: 0.7 },
        ambition: { simurgh: 1.0, dragon: 0.7, phoenix: 0.5, valkyrie: 0.6 },
        perfection: { simurgh: 1.0, unicorn: 0.5, owl_of_athena: 0.4 },
        mystery: { sphinx: 1.0, kraken: 0.8, siren: 0.6, kitsune: 0.5 },
        curiosity: { sphinx: 1.0, pegasus: 0.7, kitsune: 0.6, owl_of_athena: 0.4 },
        stability: { golem: 1.0, cerberus: 0.7, faun: 0.3 },
        tradition: { golem: 1.0, centaur: 0.5, owl_of_athena: 0.4 },
        social: { kitsune: 1.0, faun: 0.8, unicorn: 0.4 },
        adaptation: { kitsune: 1.0, phoenix: 0.7, hydra: 0.6, pegasus: 0.5 },
        purity: { unicorn: 1.0, phoenix: 0.6, faun: 0.5 },
        altruism: { unicorn: 1.0, phoenix: 0.7, valkyrie: 0.5 },
        exploration: { pegasus: 1.0, kitsune: 0.6, hydra: 0.5 },
        energy: { pegasus: 1.0, phoenix: 0.8, hydra: 0.7, dragon: 0.6 },
        honesty: { valkyrie: 1.0, unicorn: 0.7, centaur: 0.5 },
        potential: { valkyrie: 1.0, phoenix: 0.8, simurgh: 0.7, pegasus: 0.6 },
        nature: { faun: 1.0, unicorn: 0.6, hydra: 0.4 },
        composure: { faun: 1.0, golem: 0.7, owl_of_athena: 0.5 },
        intensity: { phoenix: 1.0, dragon: 0.8, hydra: 0.7, siren: 0.6 },
        elegance: { siren: 1.0, kitsune: 0.7, unicorn: 0.5 },
        intuition: { siren: 1.0, sphinx: 0.7, owl_of_athena: 0.6 },
        persistence: { hydra: 1.0, golem: 0.8, kraken: 0.7, dragon: 0.6 },
        power: { hydra: 1.0, dragon: 0.9, kraken: 0.8, valkyrie: 0.7 },
        strategy: { centaur: 1.0, kraken: 0.8, sphinx: 0.7, dragon: 0.6 },
        logic: { centaur: 1.0, owl_of_athena: 0.8, sphinx: 0.7, golem: 0.6 }
    };

    const creatureScores = {};
    for (const resp of userResponses) {
        const trait = resp.trait;
        const value = resp.value;
        if (traitWeights[trait]) {
            for (const creatureId in traitWeights[trait]) {
                const weight = traitWeights[trait][creatureId];
                creatureScores[creatureId] = (creatureScores[creatureId] || 0) + (value * weight);
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

    container.classList.add('opacity-0'); // Start with opacity 0 for fade-in

    setTimeout(() => {
        container.innerHTML = `
            <div id="result-content" class="opacity-0 transition-opacity duration-1000">
        
            <div class="bg-slate-800/80 rounded-[2.5rem] overflow-hidden border border-slate-700/50 shadow-2xl result-glow mb-12 animate-fade-in-up">
                <div class="relative h-80 md:h-[30rem]">
                    <img src="${creature.image}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
                    <div class="absolute bottom-10 left-0 right-0 px-8 text-center">
                        <span class="bg-purple-600/90 backdrop-blur-md text-white px-5 py-2 rounded-full text-sm font-bold mb-4 inline-block shadow-lg uppercase tracking-widest border border-white/20 animate-fade-in delay-100">${creature.rarity}</span>
                        <h2 class="text-5xl md:text-7xl font-black text-white drop-shadow-2xl mb-2 animate-fade-in delay-200">${creature.name}</h2>
                        <p class="text-purple-300 font-bold text-xl animate-fade-in delay-300">${currentLang === 'ar' ? 'هذا هو كائنك الأسطوري الحقيقي' : 'This is your true mythical essence'}</p>
                    </div>
                </div>
                
                <div class="p-8 md:p-14">
                    <!-- Radar Chart Section -->
                    <div class="mb-16 animate-fade-in delay-400">
                        <h3 class="text-3xl font-bold text-white mb-10 text-center">
                            ${currentLang === 'ar' ? 'خارطة القوى الروحية' : 'Spiritual Power Map'}
                        </h3>
                        <div class="max-w-md mx-auto bg-slate-900/40 p-6 rounded-[2rem] border border-slate-700/30 shadow-inner">
                            <canvas id="radarChart"></canvas>
                        </div>
                    </div>

                    <div class="mb-12 animate-fade-in delay-500">
                        <div class="inline-block p-3 bg-purple-600/10 rounded-2xl mb-6">
                            <i class="fas fa-fingerprint text-3xl text-purple-500"></i>
                        </div>
                        <h3 class="text-3xl font-bold text-white mb-6">
                            ${currentLang === 'ar' ? 'التحليل النفسي العميق' : 'Deep Psychological Analysis'}
                        </h3>
                        <p class="text-xl text-slate-300 leading-relaxed text-center italic">"${creature.description}"</p>
                    </div>
                    
                    <div class="relative p-1 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-[2rem] overflow-hidden shadow-2xl animate-fade-in delay-600">
                        <div class="relative p-10 bg-slate-900/95 rounded-[1.8rem] overflow-hidden">
                            <div class="absolute inset-0 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center z-10" id="secret-report-overlay">
                                <div class="w-20 h-20 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-6 border-4 border-white/10 shadow-inner">
                                    <i class="fas fa-lock text-3xl text-white"></i>
                                </div>
                                <h3 class="text-3xl font-bold mb-4 text-white">${currentLang === 'ar' ? 'التقرير السري المتقدم' : 'Advanced Secret Report'}</h3>
                                <p class="text-slate-400 text-lg max-w-md mb-8 leading-relaxed">
                                    ${currentLang === 'ar' ? 'لقد كشفنا عن جوانب مخفية في عقلك الباطن. افتح التقرير الكامل لمعرفة نقاط قوتك المطلقة وتحدياتك القادمة.' : 'We have uncovered hidden aspects of your subconscious. Unlock the full report to see your absolute strengths and upcoming challenges.'}
                                </p>
                                <button id="unlock-button" class="pulse-button bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-12 py-5 rounded-full font-black text-xl transition-all transform hover:scale-105 shadow-2xl shadow-purple-600/40 border border-white/20">
                                    <i class="fas fa-unlock-alt mr-2"></i> ${currentLang === 'ar' ? 'افتح التقرير الكامل (مجاناً)' : 'Unlock Full Report (Free)'}
                                </button>
                            </div>
                            <div id="secret-report-actual-content" class="opacity-5 select-none blur-md text-start space-y-6">
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
            <div class="flex justify-center mb-20 animate-fade-in delay-700">
                <button onclick="location.reload()" class="bg-slate-800 hover:bg-slate-700 text-white px-10 py-4 rounded-2xl font-bold transition-all border border-slate-700 shadow-xl">
                    <i class="fas fa-redo-alt mr-2"></i> ${currentLang === 'ar' ? 'إعادة الاختبار' : 'Retake Quiz'}
                </button>
            </div>
        </div>`;
        container.classList.remove('opacity-0');
        container.classList.add('opacity-100');
        renderRadarChart(radar);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Add event listener for unlock button
        document.getElementById('unlock-button').addEventListener('click', () => {
            document.getElementById('secret-report-overlay').classList.add('hidden');
            document.getElementById('secret-report-actual-content').classList.remove('opacity-5', 'blur-md', 'select-none');
            document.getElementById('secret-report-actual-content').classList.add('opacity-100');
        });

        // Add Download Result Card Button
        const downloadButtonHtml = `<button id="download-result-card" class="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition-all border border-blue-700 shadow-xl mt-8">
                                        <i class="fas fa-download mr-2"></i> ${currentLang === 'ar' ? 'تحميل بطاقة النتيجة' : 'Download Result Card'}
                                    </button>`;
        document.querySelector('#result-container > div').insertAdjacentHTML('beforeend', downloadButtonHtml);
        document.getElementById('download-result-card').addEventListener('click', downloadResultCard);

        // Update Meta Tags for social sharing
        updateMetaTags(creature);

        // Make result content visible after it's fully rendered
        document.getElementById('result-content').classList.remove('opacity-0');

    }, 500); // Delay for fade-in effect
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

function downloadResultCard() {
    const resultCard = document.querySelector(".result-glow"); // The main result card element
    if (!resultCard) {
        console.error("Result card element not found for download.");
        return;
    }

    // Temporarily hide elements not meant for the card, like the retake button
    const retakeButton = document.querySelector("#result-container button");
    if (retakeButton) retakeButton.style.display = "none";

    html2canvas(resultCard, {
        scale: 2, // Increase scale for better quality
        useCORS: true, // Enable cross-origin images if any
        backgroundColor: null // Transparent background
    }).then(canvas => {
        // Create a temporary link to download the image
        const link = document.createElement("a");
        link.download = "QuizMagic_Result.png";
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Restore hidden elements
        if (retakeButton) retakeButton.style.display = "";
    }).catch(error => {
        console.error("Error generating result card image:", error);
        alert(currentLang === "ar" ? "حدث خطأ أثناء تحميل البطاقة." : "Error downloading card.");
        if (retakeButton) retakeButton.style.display = "";
    });
}

function updateMetaTags(creature) {
    document.title = `${currentLang === 'ar' ? 'أنا ' : 'I am a '}${creature.name} - QuizMagic`;
    document.querySelector('meta[name="description"]').setAttribute('content', creature.description);
    document.querySelector('meta[property="og:title"]').setAttribute('content', `${currentLang === 'ar' ? 'أنا ' : 'I am a '}${creature.name} - QuizMagic`);
    document.querySelector('meta[property="og:description"]').setAttribute('content', creature.description);
    document.querySelector('meta[property="og:image"]').setAttribute('content', window.location.origin + creature.image);
    document.querySelector('meta[name="twitter:title"]').setAttribute('content', `${currentLang === 'ar' ? 'أنا ' : 'I am a '}${creature.name} - QuizMagic`);
    document.querySelector('meta[name="twitter:description"]').setAttribute('content', creature.description);
    document.querySelector('meta[name="twitter:image"]').setAttribute('content', window.location.origin + creature.image);
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
    const result = calculateResult().creature;
    const actualContent = document.getElementById('secret-report-actual-content');
    const unlockOverlay = document.getElementById('secret-report-overlay');
    
    unlockOverlay.classList.add('lock-overlay-hidden'); // Add animation class

    setTimeout(() => {
        unlockOverlay.style.display = 'none';
        actualContent.classList.remove('opacity-5', 'select-none', 'blur-md');
        actualContent.classList.add('opacity-100', 'secret-content-glow'); // Add glow effect
        
        actualContent.innerHTML = `
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
    }, 500); // Match overlay fade-out duration
}
