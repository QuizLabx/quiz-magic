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
    renderSocialLinks();
});

function renderSocialLinks() {
    const container = document.getElementById('social-links');
    if (!container) return;
    container.innerHTML = '';
    
    const links = [
        { id: 'facebook', icon: 'fab fa-facebook-f' },
        { id: 'twitter', icon: 'fab fa-twitter' },
        { id: 'instagram', icon: 'fab fa-instagram' },
        { id: 'youtube', icon: 'fab fa-youtube' },
        { id: 'linkedin', icon: 'fab fa-linkedin-in' }
    ];

    links.forEach(link => {
        if (config.socialLinks[link.id]) {
            const a = document.createElement('a');
            a.href = config.socialLinks[link.id];
            a.target = "_blank";
            a.className = "w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all transform hover:scale-110";
            a.innerHTML = `<i class="${link.icon}"></i>`;
            container.appendChild(a);
        }
    });
}

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
        card.onclick = () => {
            if (config.features.showWelcomeScreen) {
                showWelcomeScreen(quiz.id);
            } else {
                startQuiz(quiz.id);
            }
        };
        grid.appendChild(card);
    });
}

function showWelcomeScreen(quizId) {
    const data = quizzesData[currentLang];
    const quiz = data.quizzes.find(q => q.id === quizId);
    
    document.getElementById('quiz-grid').classList.add('hidden');
    document.getElementById('hero-section').classList.add('hidden');
    
    const container = document.getElementById('quiz-container');
    container.classList.remove('hidden');
    
    container.innerHTML = `
        <div class="text-center py-6">
            <div class="w-24 h-24 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <i class="fas fa-magic text-4xl text-purple-500"></i>
            </div>
            <h2 class="text-3xl font-bold mb-6">${currentLang === 'ar' ? 'كيف يعمل الاختبار؟' : 'How it works?'}</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 text-right ${currentLang === 'en' ? 'text-left' : ''}">
                <div class="flex items-start gap-4 p-4 bg-slate-900/40 rounded-2xl border border-slate-700/50">
                    <div class="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</div>
                    <p class="text-sm text-slate-300">${currentLang === 'ar' ? 'أجب بصدق على 15 سؤالاً نفسياً مصمماً بعناية.' : 'Answer 15 carefully designed psychological questions honestly.'}</p>
                </div>
                <div class="flex items-start gap-4 p-4 bg-slate-900/40 rounded-2xl border border-slate-700/50">
                    <div class="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</div>
                    <p class="text-sm text-slate-300">${currentLang === 'ar' ? 'نظام الأوزان الذكي سيحلل نمط تفكيرك وردود أفعالك.' : 'The smart weighting system will analyze your thinking patterns.'}</p>
                </div>
                <div class="flex items-start gap-4 p-4 bg-slate-900/40 rounded-2xl border border-slate-700/50">
                    <div class="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</div>
                    <p class="text-sm text-slate-300">${currentLang === 'ar' ? 'اكتشف كائنك الأسطوري الحقيقي مع تقرير سري مفصل.' : 'Discover your true mythical creature with a detailed secret report.'}</p>
                </div>
                <div class="flex items-start gap-4 p-4 bg-slate-900/40 rounded-2xl border border-slate-700/50">
                    <div class="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold">4</div>
                    <p class="text-sm text-slate-300">${currentLang === 'ar' ? 'حمل نتيجتك كصورة احترافية وشاركها مع أصدقائك.' : 'Download your result as a professional image and share it.'}</p>
                </div>
            </div>
            <button onclick="startQuiz('${quizId}')" class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-full font-bold text-xl hover:scale-105 transition-all shadow-xl shadow-purple-600/20">
                ${currentLang === 'ar' ? 'أنا جاهز، ابدأ! 🚀' : "I'm ready, start! 🚀"}
            </button>
        </div>
    `;
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
    setTimeout(showResult, config.analysisSpeed);
}

function calculateResult() {
    const creatureScores = {};
    
    // Initialize scores
    currentQuiz.results.forEach(r => creatureScores[r.id] = 0);

    // Apply Weighted Scoring System
    userResponses.forEach(resp => {
        const traitWeights = currentQuiz.weights[resp.trait];
        if (traitWeights) {
            for (const creatureId in traitWeights) {
                // Weight * (Value - 3) -> to allow negative weights for disagreeing
                creatureScores[creatureId] += traitWeights[creatureId] * (resp.value - 1);
            }
        }
    });

    let maxScore = -Infinity;
    let winnerId = currentQuiz.results[0].id;

    for (const id in creatureScores) {
        if (creatureScores[id] > maxScore) {
            maxScore = creatureScores[id];
            winnerId = id;
        }
    }

    // Radar Chart Logic
    const traitScores = {};
    userResponses.forEach(r => traitScores[r.id] = (traitScores[r.id] || 0) + r.value);
    
    const radarData = {
        power: Math.random() * 40 + 60,
        wisdom: Math.random() * 40 + 60,
        mystery: Math.random() * 40 + 60,
        purity: Math.random() * 40 + 60,
        leadership: Math.random() * 40 + 60,
        adaptation: Math.random() * 40 + 60
    };

    return {
        creature: currentQuiz.results.find(r => r.id === winnerId),
        radar: radarData
    };
}

function showResult() {
    const { creature, radar } = calculateResult();
    document.getElementById('quiz-container').classList.add('hidden');
    const container = document.getElementById('result-container');
    container.classList.remove('hidden');

    container.innerHTML = `
        <div id="capture-area" class="bg-slate-800/80 rounded-[2.5rem] overflow-hidden border border-slate-700/50 shadow-2xl result-glow mb-12">
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
                        <div id="cpa-locker" class="absolute inset-0 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center z-10">
                            <div class="w-20 h-20 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-6 border-4 border-white/10 shadow-inner">
                                <i class="fas fa-lock text-3xl text-white"></i>
                            </div>
                            <h3 class="text-3xl font-bold mb-4 text-white">${currentLang === 'ar' ? 'التقرير السري المتقدم' : 'Advanced Secret Report'}</h3>
                            <p class="text-slate-400 mb-8">${currentLang === 'ar' ? 'هذا التقرير يحتوي على تفاصيل دقيقة حول نقاط قوتك وضعفك الأسطورية.' : 'This report contains precise details about your mythical strengths and weaknesses.'}</p>
                            <button onclick="unlockSecretReport()" class="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-purple-100 transition-all z-[60] cursor-pointer relative">
                                ${currentLang === 'ar' ? 'فتح التقرير السري' : 'Unlock Secret Report'}
                            </button>
                        </div>
                        <div id="secret-content" class="opacity-10 blur-xl transition-all duration-1000">
                            <h4 class="text-2xl font-bold text-purple-400 mb-4">${currentLang === 'ar' ? 'نمط قوتك:' : 'Power Pattern:'}</h4>
                            <p class="text-slate-300 mb-6">${creature.secretReport}</p>
                            <div class="p-4 bg-purple-900/20 border border-purple-500/30 rounded-xl">
                                <p class="text-purple-300 italic">"${currentLang === 'ar' ? 'البطل الحقيقي يعرف متى يضع سيفه ويظهر الرحمة.' : 'A true hero knows when to put down their sword and show mercy.'}"</p>
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

        <button onclick="location.reload()" class="text-slate-500 hover:text-white transition font-bold mb-20">
            <i class="fas fa-redo mr-2"></i> ${currentLang === 'ar' ? 'إعادة الاختبار' : 'Retake Quiz'}
        </button>
    `;

    renderRadarChart(radar);
    
    // Pre-fill Share Template for instant download
    prepareShareTemplate(creature);
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
                label: currentLang === 'ar' ? 'قواك الروحية' : 'Spiritual Powers',
                data: [data.power, data.wisdom, data.mystery, data.purity, data.leadership, data.adaptation],
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
                    angleLines: { color: 'rgba(255,255,255,0.1)' },
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    pointLabels: { color: '#94a3b8', font: { size: 14, family: 'Cairo' } },
                    ticks: { display: false },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function unlockSecretReport() {
    const locker = document.getElementById('cpa-locker');
    const content = document.getElementById('secret-content');
    locker.style.opacity = '0';
    locker.style.pointerEvents = 'none';
    content.style.opacity = '1';
    content.style.filter = 'none';
}

function prepareShareTemplate(creature) {
    document.getElementById('share-creature-img').src = creature.image;
    document.getElementById('share-creature-name').innerText = creature.name;
    document.getElementById('share-rarity').innerText = creature.rarity;
    document.getElementById('share-tagline').innerText = currentLang === 'ar' ? 'كائني الأسطوري الحقيقي' : 'My True Mythical Essence';
    document.getElementById('share-description').innerText = creature.description.substring(0, 150) + '...';
}

async function downloadResultAsImage() {
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class="fas fa-spinner animate-spin"></i> ${currentLang === 'ar' ? 'جاري التجهيز...' : 'Preparing...'}`;
    btn.disabled = true;

    const template = document.getElementById('share-template');
    
    try {
        const canvas = await html2canvas(template, {
            scale: 2, // High Quality
            useCORS: true, // Allow cross-origin images
            backgroundColor: '#0f172a',
            width: 1080,
            height: 1080
        });

        const link = document.createElement('a');
        link.download = `QuizMagic-Result-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
    } catch (err) {
        console.error('Error generating image:', err);
        alert(currentLang === 'ar' ? 'عذراً، حدث خطأ أثناء تحميل الصورة.' : 'Sorry, an error occurred while downloading the image.');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function shareResult() {
    const shareData = {
        title: 'QuizMagic',
        text: currentLang === 'ar' 
            ? `لقد اكتشفت أنني ${document.querySelector('h2.text-5xl').innerText}! جرب الاختبار الآن واكتشف كائنك الأسطوري.`
            : `I discovered that I am a ${document.querySelector('h2.text-5xl').innerText}! Take the quiz and discover your mythical essence.`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData);
    } else {
        navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert(currentLang === 'ar' ? 'تم نسخ الرابط والنتيجة! يمكنك مشاركتها الآن.' : 'Link and result copied! You can share it now.');
    }
}
