let currentLang = 'ar';
2	let currentQuiz = null;
3	let currentStepId = 0; 
4	let userResponses = []; 
5	let currentTheme = 'dark';
6	let isQuizActive = false; // Flag to prevent grid re-render during quiz
7	
8	// Initialize
9	document.addEventListener('DOMContentLoaded', () => {
10	    const savedLang = localStorage.getItem('quiz_lang') || 'ar';
11	    const savedTheme = localStorage.getItem('quiz_theme') || 'auto';
12	    
13	    initializeTheme(savedTheme);
14	    setLanguage(savedLang);
15	    
16	    if (localStorage.getItem('quiz_lang')) {
17	        document.getElementById('language-screen').classList.add('opacity-0', 'pointer-events-none');
18	    }
19	    renderSocialLinks();
20	    updateThemeToggleIcon();
21	    renderAccordion(); // New Phase 3 Feature
22	});
23	
24	// ==================== THEME MANAGEMENT ====================
25	
26	function initializeTheme(savedTheme) {
27	    let preferredTheme = savedTheme;
28	    if (preferredTheme === 'auto') {
29	        preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
30	    }
31	    applyTheme(preferredTheme);
32	}
33	
34	function applyTheme(theme) {
35	    currentTheme = theme;
36	    const html = document.documentElement;
37	    if (theme === 'light') {
38	        html.classList.add('light-mode');
39	    } else {
40	        html.classList.remove('light-mode');
41	    }
42	}
43	
44	function toggleTheme() {
45	    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
46	    applyTheme(newTheme);
47	    localStorage.setItem('quiz_theme', newTheme);
48	    updateThemeToggleIcon();
49	    
50	    // ONLY re-render grid if we are on the home screen
51	    if (!isQuizActive) {
52	        renderQuizGrid();
53	    }
54	}
55	
56	function updateThemeToggleIcon() {
57	    const themeToggleBtn = document.getElementById('theme-toggle');
58	    if (!themeToggleBtn) return;
59	    
60	    if (currentTheme === 'dark') {
61	        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
62	        themeToggleBtn.title = 'تبديل للوضع النهاري / Switch to Light Mode';
63	    } else {
64	        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
65	        themeToggleBtn.title = 'تبديل للوضع الليلي / Switch to Dark Mode';
66	    }
67	}
68	
69	// ==================== SOCIAL LINKS ====================
70	
71	function renderSocialLinks() {
72	    const container = document.getElementById('social-links');
73	    if (!container) return;
74	    container.innerHTML = '';
75	    
76	    if (typeof config !== 'undefined' && config.socialLinks) {
77	        const links = [
78	            { id: 'facebook', icon: 'fab fa-facebook-f' },
79	            { id: 'twitter', icon: 'fab fa-twitter' },
80	            { id: 'instagram', icon: 'fab fa-instagram' },
81	            { id: 'youtube', icon: 'fab fa-youtube' },
82	            { id: 'telegram', icon: 'fab fa-telegram-plane' }
83	        ];
84	
85	        links.forEach(link => {
86	            if (config.socialLinks[link.id]) {
87	                const a = document.createElement('a');
88	                a.href = config.socialLinks[link.id];
89	                a.target = "_blank";
90	                a.className = "w-10 h-10 rounded-full flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all transform hover:scale-110 theme-bg-tertiary theme-text-primary";
91	                a.innerHTML = `<i class="${link.icon}"></i>`;
92	                container.appendChild(a);
93	            }
94	        });
95	    }
96	}
97	
98	// ==================== SKELETON LOADERS ====================
99	
100	function showSkeletonLoaders() {
101	    const grid = document.getElementById('quiz-grid');
102	    const skeletonGrid = document.getElementById('skeleton-grid');
103	    
104	    if (grid) grid.classList.add('hidden');
105	    if (skeletonGrid) skeletonGrid.classList.remove('hidden');
106	}
107	
108	function hideSkeletonLoaders() {
109	    const grid = document.getElementById('quiz-grid');
110	    const skeletonGrid = document.getElementById('skeleton-grid');
111	    
112	    if (skeletonGrid) skeletonGrid.classList.add('hidden');
113	    if (grid) grid.classList.remove('hidden');
114	}
115	
116	// ==================== LANGUAGE MANAGEMENT ====================
117	
118	function showLanguageScreen() {
119	    const screen = document.getElementById('language-screen');
120	    if (screen) screen.classList.remove('opacity-0', 'pointer-events-none');
121	}
122	
123	function setLanguage(lang) {
124	    currentLang = lang;
125	    localStorage.setItem('quiz_lang', lang);
126	    
127	    if (typeof quizzesData !== 'undefined') {
128	        const data = quizzesData[lang];
129	        const title = document.getElementById('site-title');
130	        const heroTitle = document.getElementById('hero-title');
131	        const heroSubtitle = document.getElementById('hero-subtitle');
132	        const footerDesc = document.getElementById('footer-desc');
133	        const langBtn = document.getElementById('lang-btn-text');
134	        
135	        if (title) title.innerText = data.title;
136	        if (heroTitle) heroTitle.innerText = data.heroTitle;
137	        if (heroSubtitle) heroSubtitle.innerText = data.heroSubtitle;
138	        if (footerDesc) footerDesc.innerText = data.footerDesc;
139	        if (langBtn) langBtn.innerText = lang === 'ar' ? 'العربية' : 'English';
140	        
141	        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
142	        document.documentElement.lang = lang;
143	
144	        renderQuizGrid();
145	        const screen = document.getElementById('language-screen');
146	        if (screen) screen.classList.add('opacity-0', 'pointer-events-none');
147	    }
148	}
149	
150	// ==================== QUIZ GRID ====================
151	
152	function renderQuizGrid() {
153	    isQuizActive = false; // Reset flag
154	    showSkeletonLoaders();
155	    
156	    setTimeout(() => {
157	        const grid = document.getElementById('quiz-grid');
158	        if (!grid || typeof quizzesData === 'undefined') return;
159	        
160	        const data = quizzesData[currentLang];
161	        grid.innerHTML = '';
162	
163	        data.quizzes.forEach((quiz, index) => {
164	            const card = document.createElement('div');
165	            card.className = `quiz-card group rounded-3xl overflow-hidden cursor-pointer flex flex-col animate-fade-in`;
166	            card.style.animationDelay = `${index * 0.1}s`;
167	            card.innerHTML = `
168	                <div class="relative h-56 overflow-hidden">
169	                    <img src="${quiz.image}" alt="${quiz.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
170	                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
171	                    <div class="absolute top-4 right-4 bg-purple-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl">
172	                        ${quiz.badge}
173	                    </div>
174	                </div>
175	                <div class="p-6 flex-grow flex flex-col">
176	                    <h3 class="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors theme-text-primary">${quiz.title}</h3>
177	                    <p class="theme-text-secondary text-sm mb-6 flex-grow leading-relaxed">${quiz.description}</p>
178	                    <button class="w-full py-3 rounded-xl font-bold transition-all transform active:scale-95 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg shadow-purple-600/20">
179	                        ${currentLang === 'ar' ? 'ابدأ الاختبار 🎭' : 'Start Quiz 🎭'}
180	                    </button>
181	                </div>
182	            `;
183	            card.onclick = () => {
184	                if (typeof config !== 'undefined' && config.features.showWelcomeScreen) {
185	                    showWelcomeScreen(quiz.id);
186	                } else {
187	                    startQuiz(quiz.id);
188	                }
189	            };
190	            grid.appendChild(card);
191	        });
192	
193	        hideSkeletonLoaders();
194	    }, 800);
195	}
196	
197	// ==================== ACCORDION (PHASE 3) ====================
198	
199	function renderAccordion() {
200	    const container = document.getElementById('accordion-container');
201	    if (!container || typeof quizzesData === 'undefined') return;
202	
203	    const results = quizzesData[currentLang]?.quizzes?.[0]?.results || [];
204	    container.innerHTML = results.map((creature, index) => `
205	        <div class="accordion-item glass rounded-xl overflow-hidden transition-all duration-300">
206	            <button class="accordion-header w-full p-6 flex items-center justify-between hover:opacity-80 transition" onclick="toggleAccordion(${index})">
207	                <div class="flex items-center gap-4 text-right">
208	                    <span class="text-3xl">${getCreatureEmoji(creature.id)}</span>
209	                    <div>
210	                        <h3 class="text-xl font-bold theme-text-primary">${creature.name}</h3>
211	                        <p class="text-sm theme-text-muted">${creature.rarity}</p>
212	                    </div>
213	                </div>
214	                <i class="fas fa-chevron-down transition-transform duration-300 accordion-icon theme-text-secondary"></i>
215	            </button>
216	            <div class="accordion-content">
217	                <div class="p-6 theme-bg-tertiary/30 border-t theme-border space-y-4">
218	                    <p class="theme-text-secondary italic">"${creature.description}"</p>
219	                    <p class="theme-text-secondary">${creature.article}</p>
220	                    <div class="mt-4 p-4 theme-bg-primary/50 rounded-lg border theme-border">
221	                        <p class="text-sm"><strong class="text-purple-400">💪 نقاط قوة:</strong> ${creature.secretReport.strengths}</p>
222	                        <p class="text-sm mt-2"><strong class="text-pink-400">⚡ التحديات:</strong> ${creature.secretReport.challenges}</p>
223	                        <p class="text-sm mt-2"><strong class="text-blue-400">✨ الرؤية:</strong> ${creature.secretReport.insight}</p>
224	                    </div>
225	                </div>
226	            </div>
227	        </div>
228	    `).join('');
229	}
230	
231	function toggleAccordion(index) {
232	    const items = document.querySelectorAll('.accordion-item');
233	    items.forEach((item, i) => {
234	        if (i === index) {
235	            item.classList.toggle('active');
236	        } else {
237	            item.classList.remove('active');
238	        }
239	    });
240	}
241	
242	function getCreatureEmoji(id) {
243	    const emojis = {
244	        'dragon': '🐉', 'phoenix': '🔥', 'unicorn': '🦄', 'sphinx': '🗿',
245	        'kraken': '🐙', 'owl_of_athena': '🦉', 'centaur': '🏹', 'cerberus': '🐕',
246	        'faun': '🐐', 'golem': '🪨', 'hydra': '🐍', 'kitsune': '🦊',
247	        'pegasus': '🐴', 'siren': '🧜‍♀️', 'banshee': '👻', 'valkyrie': '⚔️'
248	    };
249	    return emojis[id] || '✨';
250	}
251	
252	// ==================== WELCOME SCREEN ====================
253	
254	function showWelcomeScreen(quizId) {
255	    isQuizActive = true; // Set flag
256	    const data = quizzesData[currentLang];
257	    const quiz = data.quizzes.find(q => q.id === quizId);
258	    
259	    document.getElementById('quiz-grid').classList.add('hidden');
260	    document.getElementById('hero-section').classList.add('hidden');
261	    
262	    const container = document.getElementById('quiz-container');
263	    container.classList.remove('hidden');
264	    
265	    const isAr = currentLang === 'ar';
266	    container.innerHTML = `
267	        <div class="animate-fade-in text-center py-6">
268	            <h3 class="text-3xl font-bold mb-10 theme-text-primary">
269	                <i class="fas fa-lightbulb text-yellow-400 mr-3"></i>
270	                ${isAr ? 'كيف يعمل الاختبار؟' : 'How it works?'}
271	            </h3>
272	            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
273	                <div class="theme-bg-tertiary/20 p-5 rounded-2xl border theme-border">
274	                    <div class="text-3xl mb-3 text-purple-400"><i class="fas fa-question-circle"></i></div>
275	                    <h4 class="font-bold theme-text-primary mb-2">${isAr ? 'الخطوة 1: الأسئلة' : 'Step 1: Questions'}</h4>
276	                    <p class="theme-text-secondary text-xs">${isAr ? 'أجب على الأسئلة بصراحة وتلقائية.' : 'Answer the questions honestly and spontaneously.'}</p>
277	                </div>
278	                <div class="theme-bg-tertiary/20 p-5 rounded-2xl border theme-border">
279	                    <div class="text-3xl mb-3 text-blue-400"><i class="fas fa-brain"></i></div>
280	                    <h4 class="font-bold theme-text-primary mb-2">${isAr ? 'الخطوة 2: التحليل' : 'Step 2: Analysis'}</h4>
281	                    <p class="theme-text-secondary text-xs">${isAr ? 'نظامنا يحلل إجاباتك بخوارزمية متقدمة.' : 'Our system analyzes your answers with an advanced algorithm.'}</p>
282	                </div>
283	                <div class="theme-bg-tertiary/20 p-5 rounded-2xl border theme-border">
284	                    <div class="text-3xl mb-3 text-pink-400"><i class="fas fa-dragon"></i></div>
285	                    <h4 class="font-bold theme-text-primary mb-2">${isAr ? 'الخطوة 3: الكشف' : 'Step 3: Discovery'}</h4>
286	                    <p class="theme-text-secondary text-xs">${isAr ? 'اكتشف كائنك الأسطوري من بين 16 كائن.' : 'Discover your mythical creature among 16 beings.'}</p>
287	                </div>
288	                <div class="theme-bg-tertiary/20 p-5 rounded-2xl border theme-border">
289	                    <div class="text-3xl mb-3 text-green-400"><i class="fas fa-share-alt"></i></div>
290	                    <h4 class="font-bold theme-text-primary mb-2">${isAr ? 'الخطوة 4: المشاركة' : 'Step 4: Sharing'}</h4>
291	                    <p class="theme-text-secondary text-xs">${isAr ? 'حمل نتيجتك كصورة احترافية وشاركها.' : 'Download your result as a professional image and share it.'}</p>
292	                </div>
293	            </div>
294	            <button onclick="startQuiz('${quizId}')" class="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg transform hover:scale-[1.02] active:scale-95 transition-all">
295	                ${isAr ? 'فهمت، ابدأ الآن 🚀' : 'Got it, Start Now 🚀'}
296	            </button>
297	        </div>
298	    `;
299	}
300	
301	// ==================== QUIZ ENGINE ====================
302	
303	function startQuiz(quizId) {
304	    isQuizActive = true;
305	    const data = quizzesData[currentLang];
306	    currentQuiz = data.quizzes.find(q => q.id === quizId);
307	    currentStepId = 0;
308	    userResponses = [];
309	
310	    document.getElementById('quiz-grid').classList.add('hidden');
311	    document.getElementById('hero-section').classList.add('hidden');
312	    const container = document.getElementById('quiz-container');
313	    container.classList.remove('hidden');
314	    
315	    showStep();
316	    window.scrollTo({ top: 0, behavior: 'smooth' });
317	}
318	
319	function showStep() {
320	    const question = currentQuiz.questions[currentStepId];
321	    const container = document.getElementById('quiz-container');
322	    const totalSteps = currentQuiz.questions.length;
323	    const progress = ((currentStepId + 1) / totalSteps) * 100;
324	    
325	    container.classList.add('opacity-0');
326	    
327	    setTimeout(() => {
328	        let content = `
329	            <div class="progress-wrapper">
330	                <div class="flex justify-between items-center mb-4">
331	                    <span class="text-xs font-bold text-purple-400 uppercase tracking-widest">
332	                        ${currentLang === 'ar' ? 'السؤال' : 'Question'} ${currentStepId + 1} / ${totalSteps}
333	                    </span>
334	                    <span class="text-xs theme-text-muted">${Math.round(progress)}%</span>
335	                </div>
336	                <div class="progress-container">
337	                    <div class="progress-bar" style="width: ${progress}%"></div>
338	                </div>
339	                <div class="dragon-marker" style="${currentLang === 'ar' ? 'right' : 'left'}: ${progress}%">🐉</div>
340	            </div>
341	
342	            <div class="mb-10">
343	                <h2 class="text-2xl md:text-3xl font-bold theme-text-primary text-center leading-tight animate-slide-up">${question.text}</h2>
344	            </div>
345	        `;
346	
347	        if (question.type === 'visual') {
348	            content += `
349	                <div class="grid grid-cols-2 gap-4 sm:gap-6">
350	                    ${question.options.map((opt) => `
351	                        <div onclick="handleVisualChoice('${opt.trait}', ${opt.value})" class="group cursor-pointer relative overflow-hidden rounded-2xl border-2 theme-border hover:border-purple-500 transition-all transform hover:scale-[1.03] active:scale-95 shadow-lg">
352	                            <div class="aspect-square overflow-hidden">
353	                                <img src="${opt.image}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
354	                            </div>
355	                            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
356	                            <div class="absolute bottom-0 left-0 right-0 p-3 text-center">
357	                                <span class="text-white font-bold text-sm sm:text-lg">${opt.label}</span>
358	                            </div>
359	                        </div>
360	                    `).join('')}
361	                </div>
362	            `;
363	        } else {
364	            content += `
365	                <div class="space-y-3">
366	                    ${[
367	                        { text: currentLang === 'ar' ? 'أوافق بشدة' : 'Strongly Agree', value: 5, color: 'bg-green-600/20 border-green-500/50 hover:bg-green-600/40' },
368	                        { text: currentLang === 'ar' ? 'أوافق' : 'Agree', value: 4, color: 'bg-blue-600/20 border-blue-500/50 hover:bg-blue-600/40' },
369	                        { text: currentLang === 'ar' ? 'محايد' : 'Neutral', value: 3, color: 'theme-bg-tertiary/40 theme-border hover:theme-bg-tertiary/60' },
370	                        { text: currentLang === 'ar' ? 'لا أوافق' : 'Disagree', value: 2, color: 'bg-orange-600/20 border-orange-500/50 hover:bg-orange-600/40' },
371	                        { text: currentLang === 'ar' ? 'لا أوافق بشدة' : 'Strongly Disagree', value: 1, color: 'bg-red-600/20 border-red-500/50 hover:bg-red-600/40' }
372	                    ].map((opt) => `
373	                        <button onclick="handleLikert(${opt.value})" class="w-full p-4 text-center ${opt.color} border rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 font-bold text-lg theme-text-primary">
374	                            ${opt.text}
375	                        </button>
376	                    `).join('')}
377	                </div>
378	            `;
379	        }
380	
381	        container.innerHTML = content;
382	        container.classList.remove('opacity-0');
383	    }, 300);
384	}
385	
386	function handleLikert(value) {
387	    const trait = currentQuiz.questions[currentStepId].trait;
388	    userResponses.push({ trait, value });
389	    nextStep();
390	}
391	
392	function handleVisualChoice(trait, value) {
393	    userResponses.push({ trait, value });
394	    nextStep();
395	}
396	
397	function nextStep() {
398	    currentStepId++;
399	    if (currentStepId < currentQuiz.questions.length) {
400	        showStep();
401	    } else {
402	        calculateResults();
403	    }
404	}
405	
406	// ==================== RESULTS CALCULATION ====================
407	
408	function calculateResults() {
409	    const container = document.getElementById('quiz-container');
410	    container.innerHTML = `
411	        <div class="text-center py-20">
412	            <div class="inline-block w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-8"></div>
413	            <h3 class="text-2xl font-bold theme-text-primary animate-pulse">
414	                ${currentLang === 'ar' ? 'جاري تحليل قواك الروحية...' : 'Analyzing your spiritual powers...'}
415	            </h3>
416	        </div>
417	    `;
418	
419	    setTimeout(() => {
420	        const traitScores = {};
421	        userResponses.forEach(resp => {
422	            traitScores[resp.trait] = (traitScores[resp.trait] || 0) + resp.value;
423	        });
424	
425	        const radar = {
426	            power: (traitScores.leadership || 0) + (traitScores.intensity || 0),
427	            wisdom: (traitScores.wisdom || 0) + (traitScores.knowledge || 0),
428	            mystery: (traitScores.mystery || 0) + (traitScores.intuition || 0),
429	            purity: (traitScores.purity || 0) + (traitScores.altruism || 0),
430	            leadership: (traitScores.strategy || 0) + (traitScores.potential || 0),
431	            adaptation: (traitScores.adaptation || 0) + (traitScores.energy || 0)
432	        };
433	
434	        const maxTrait = Object.keys(radar).reduce((a, b) => radar[a] > radar[b] ? a : b);
435	        const creature = currentQuiz.results.find(r => r.id === getCreatureByTrait(maxTrait)) || currentQuiz.results[0];
436	        
437	        displayFinalResult(creature, radar);
438	    }, 2500);
439	}
440	
441	function getCreatureByTrait(trait) {
442	    const mapping = {
443	        power: 'dragon',
444	        wisdom: 'owl_of_athena',
445	        mystery: 'sphinx',
446	        purity: 'unicorn',
447	        leadership: 'centaur',
448	        adaptation: 'phoenix'
449	    };
450	    return mapping[trait];
451	}
452	
453	function displayFinalResult(creature, radar) {
454	    const container = document.getElementById('quiz-container');
455	    container.innerHTML = `
456	        <div class="animate-fade-in">
457	            <div class="text-center mb-10">
458	                <span class="px-4 py-1.5 rounded-full bg-purple-600/20 text-purple-400 text-sm font-bold border border-purple-500/30 mb-4 inline-block">
459	                    ${creature.rarity}
460	                </span>
461	                <h2 class="text-5xl md:text-6xl font-black gradient-text-animated mb-6">${creature.name}</h2>
462	                <div class="relative w-full max-w-lg mx-auto aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-purple-500/20 mb-10">
463	                    <img src="${creature.image}" class="w-full h-full object-cover">
464	                </div>
465	                <p class="text-xl theme-text-secondary leading-relaxed mb-10 italic">"${creature.description}"</p>
466	            </div>
467	
468	            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
469	                <div class="glass p-8 rounded-3xl">
470	                    <h4 class="text-xl font-bold mb-6 theme-text-primary flex items-center gap-2">
471	                        <i class="fas fa-chart-pie text-purple-500"></i> ${currentLang === 'ar' ? 'تحليل القوى' : 'Power Analysis'}
472	                    </h4>
473	                    <canvas id="radarChart"></canvas>
474	                </div>
475	                <div class="glass p-8 rounded-3xl">
476	                    <h4 class="text-xl font-bold mb-6 theme-text-primary flex items-center gap-2">
477	                        <i class="fas fa-book-open text-blue-500"></i> ${currentLang === 'ar' ? 'عن الكائن' : 'About the Creature'}
478	                    </h4>
479	                    <p class="theme-text-secondary leading-relaxed">${creature.article}</p>
480	                </div>
481	            </div>
482	
483	            <div class="relative mb-12">
484	                <div id="cpa-locker" class="absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-md theme-bg-secondary/80 rounded-3xl border-2 border-dashed theme-border p-6 text-center">
485	                    <i class="fas fa-lock text-4xl text-purple-500 mb-4"></i>
486	                    <h4 class="text-xl font-bold theme-text-primary mb-2">${currentLang === 'ar' ? 'التقرير السري مغلق' : 'Secret Report Locked'}</h4>
487	                    <p class="theme-text-secondary text-sm mb-6">${currentLang === 'ar' ? 'أكمل أحد العروض البسيطة لفتح التحليل النفسي الكامل.' : 'Complete a simple offer to unlock full analysis.'}</p>
488	                    <button onclick="unlockSecretReport()" class="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all pulse-button">
489	                        ${currentLang === 'ar' ? 'فتح التقرير الآن 🔓' : 'Unlock Now 🔓'}
490	                    </button>
491	                </div>
492	                <div id="secret-content" class="glass p-8 rounded-3xl opacity-20 blur-sm pointer-events-none transition-all duration-1000">
493	                    <h4 class="text-xl font-bold mb-6 theme-text-primary">${currentLang === 'ar' ? 'التقرير النفسي السري' : 'Secret Psychological Report'}</h4>
494	                    <div class="space-y-4">
495	                        <p class="text-sm"><strong class="text-purple-400">💪 ${currentLang === 'ar' ? 'نقاط القوة:' : 'Strengths:'}</strong> ${creature.secretReport.strengths}</p>
496	                        <p class="text-sm"><strong class="text-pink-400">⚡ ${currentLang === 'ar' ? 'التحديات:' : 'Challenges:'}</strong> ${creature.secretReport.challenges}</p>
497	                        <p class="text-sm"><strong class="text-blue-400">✨ ${currentLang === 'ar' ? 'نصيحة البصيرة:' : 'Insight:'}</strong> ${creature.secretReport.insight}</p>
498	                    </div>
499	                </div>
500	            </div>
501	
502	            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
503	                <button onclick="downloadResultAsImage()" class="flex items-center justify-center gap-3 p-5 theme-bg-tertiary hover:theme-bg-secondary theme-text-primary rounded-2xl font-bold text-lg transition-all border theme-border">
504	                    <i class="fas fa-download"></i> ${currentLang === 'ar' ? 'تحميل النتيجة' : 'Download Result'}
505	                </button>
506	                <button onclick="shareResult()" class="flex items-center justify-center gap-3 p-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl shadow-purple-600/20">
507	                    <i class="fas fa-share-alt"></i> ${currentLang === 'ar' ? '🚀 شارك النتيجة' : '🚀 Share Result'}
508	                </button>
509	            </div>
510	
511	            <button onclick="location.reload()" class="theme-text-muted hover:theme-text-primary transition font-bold mb-20">
512	                <i class="fas fa-redo mr-2"></i> ${currentLang === 'ar' ? 'إعادة الاختبار' : 'Retake Quiz'}
513	            </button>
514	        </div>
515	
516	        <div id="share-template" class="fixed -left-[2000px] top-0 w-[1080px] h-[1080px] bg-[#0f172a] p-20 flex flex-col items-center justify-center text-white text-center">
517	            <div class="absolute inset-0 opacity-20">
518	                <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900 via-transparent to-pink-900"></div>
519	            </div>
520	            <div class="relative z-10">
521	                <div class="text-3xl font-bold text-purple-500 mb-10">QuizMagic</div>
522	                <div class="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mb-10 mx-auto"></div>
523	                <div class="text-2xl uppercase tracking-[0.3em] text-slate-400 mb-4" id="share-tagline">كائني الأسطوري الحقيقي</div>
524	                <h1 class="text-8xl font-black mb-12 text-white" id="share-creature-name">${creature.name}</h1>
525	                <div class="w-[500px] h-[500px] rounded-full overflow-hidden border-8 border-purple-500/30 shadow-2xl mb-12 mx-auto">
526	                    <img id="share-creature-img" src="${creature.image}" class="w-full h-full object-cover">
527	                </div>
528	                <div class="text-2xl text-purple-400 font-bold mb-6" id="share-rarity">${creature.rarity}</div>
529	                <p class="text-3xl text-slate-300 max-w-2xl mx-auto leading-relaxed" id="share-description">${creature.description}</p>
530	                <div class="mt-20 text-slate-500 text-xl">www.quizmagic.com</div>
531	            </div>
532	        </div>
533	    `;
534	
535	    renderRadarChart(radar);
536	    prepareShareTemplate(creature);
537	}
538	
539	// ==================== RADAR CHART ====================
540	
541	function renderRadarChart(data) {
542	    const ctx = document.getElementById('radarChart').getContext('2d');
543	    const labels = currentLang === 'ar' 
544	        ? ['القوة', 'الحكمة', 'الغموض', 'النقاء', 'القيادة', 'التكيف']
545	        : ['Power', 'Wisdom', 'Mystery', 'Purity', 'Leadership', 'Adaptation'];
546	
547	    const isLight = document.documentElement.classList.contains('light-mode');
548	    const gridColor = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
549	    const textColor = isLight ? '#0f172a' : '#94a3b8';
550	
551	    new Chart(ctx, {
552	        type: 'radar',
553	        data: {
554	            labels: labels,
555	            datasets: [{
556	                label: currentLang === 'ar' ? 'قواك الروحية' : 'Spiritual Powers',
557	                data: [data.power, data.wisdom, data.mystery, data.purity, data.leadership, data.adaptation],
558	                backgroundColor: 'rgba(168, 85, 247, 0.2)',
559	                borderColor: 'rgba(168, 85, 247, 0.8)',
560	                borderWidth: 3,
561	                pointBackgroundColor: '#a855f7',
562	                pointBorderColor: '#fff',
563	            }]
564	        },
565	        options: {
566	            scales: {
567	                r: {
568	                    angleLines: { color: gridColor },
569	                    grid: { color: gridColor },
570	                    pointLabels: { color: textColor, font: { size: 14, family: 'Cairo' } },
571	                    ticks: { display: false },
572	                    suggestedMin: 0,
573	                    suggestedMax: 100
574	                }
575	            },
576	            plugins: { legend: { display: false } }
577	        }
578	    });
579	}
580	
581	// ==================== SECRET REPORT ====================
582	
583	function unlockSecretReport() {
584	    const locker = document.getElementById('cpa-locker');
585	    const content = document.getElementById('secret-content');
586	    locker.style.opacity = '0';
587	    locker.style.pointerEvents = 'none';
588	    content.style.opacity = '1';
589	    content.style.filter = 'none';
590	}
591	
592	// ==================== SHARE TEMPLATE ====================
593	
594	function prepareShareTemplate(creature) {
595	    const img = document.getElementById('share-creature-img');
596	    if (img) img.src = creature.image;
597	    const name = document.getElementById('share-creature-name');
598	    if (name) name.innerText = creature.name;
599	    const rarity = document.getElementById('share-rarity');
600	    if (rarity) rarity.innerText = creature.rarity;
601	    const tagline = document.getElementById('share-tagline');
602	    if (tagline) tagline.innerText = currentLang === 'ar' ? 'كائني الأسطوري الحقيقي' : 'My True Mythical Essence';
603	    const desc = document.getElementById('share-description');
604	    if (desc) desc.innerText = creature.description.substring(0, 160) + '...';
605	}
606	
607	// ==================== DOWNLOAD & SHARE ====================
608	
609	async function downloadResultAsImage() {
610	    const btn = event.currentTarget;
611	    const originalText = btn.innerHTML;
612	    btn.innerHTML = `<i class="fas fa-spinner animate-spin"></i> ${currentLang === 'ar' ? 'جاري التجهيز...' : 'Preparing...'}`;
613	    btn.disabled = true;
614	
615	    const template = document.getElementById('share-template');
616	    try {
617	        const canvas = await html2canvas(template, {
618	            scale: 2,
619	            useCORS: true,
620	            backgroundColor: '#0f172a',
621	            width: 1080,
622	            height: 1080,
623	            logging: false
624	        });
625	        const link = document.createElement('a');
626	        link.download = `QuizMagic-Result-${Date.now()}.png`;
627	        link.href = canvas.toDataURL('image/png', 1.0);
628	        link.click();
629	    } catch (err) {
630	        console.error('Error:', err);
631	        alert(currentLang === 'ar' ? 'عذراً، حدث خطأ أثناء تحميل الصورة.' : 'Sorry, an error occurred.');
632	    } finally {
633	        btn.innerHTML = originalText;
634	        btn.disabled = false;
635	    }
636	}
637	
638	function shareResult() {
639	    const name = document.querySelector('h2.text-5xl')?.innerText || 'Creature';
640	    const shareData = {
641	        title: 'QuizMagic',
642	        text: currentLang === 'ar' 
643	            ? `لقد اكتشفت أنني ${name}! جرب الاختبار الآن واكتشف كائنك الأسطوري.`
644	            : `I discovered that I am a ${name}! Take the quiz and discover your mythical essence.`,
645	        url: window.location.href
646	    };
647	    if (navigator.share) {
648	        navigator.share(shareData);
649	    } else {
650	        navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
651	        alert(currentLang === 'ar' ? 'تم نسخ الرابط والنتيجة! يمكنك مشاركتها الآن.' : 'Link and result copied!');
652	    }
653	}
654	
655	function changeLanguage() {
656	    const newLang = currentLang === 'ar' ? 'en' : 'ar';
657	    setLanguage(newLang);
658	}
659	
