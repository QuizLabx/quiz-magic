const quizzesData = {
    ar: {
        title: "QuizMagic | عالم الاختبارات الأسطورية",
        heroTitle: "اكتشف كائنك الأسطوري الحقيقي",
        heroSubtitle: "رحلة في أعماق عقلك الباطن لكشف القوى القديمة التي تسكن روحك",
        footerDesc: "منصة الاختبارات النفسية الأكثر دقة في العالم العربي.",
        quizzes: [
            {
                id: "mythical-creature",
                title: "اختبار الكائن الأسطوري",
                badge: "الأكثر دقة",
                image: "assets/images/dragon.jpg",
                description: "تحليل نفسي متقدم يربط سماتك الشخصية بأساطير الكائنات القديمة.",
                questions: [
                    { id: 1, text: "أشعر بالراحة أكثر عندما أكون وحيداً مع أفكاري.", trait: "mystery", type: "likert" },
                    { id: 2, text: "أميل دائماً لتولي دور القيادة في المجموعات.", trait: "leadership", type: "likert" },
                    { id: 3, text: "أهتم بمساعدة الآخرين حتى لو كان ذلك على حساب راحتي.", trait: "altruism", type: "likert" },
                    { 
                        id: 4, 
                        text: "أي من هذه البوابات تجذبك أكثر للدخول إليها؟", 
                        type: "visual",
                        options: [
                            { label: "بوابة النور", image: "assets/images/quiz/q4_opt1.jpg", trait: "purity", value: 5 },
                            { label: "بوابة الغموض", image: "assets/images/quiz/q4_opt2.jpg", trait: "mystery", value: 5 },
                            { label: "بوابة القوة", image: "assets/images/quiz/q4_opt3.jpg", trait: "power", value: 5 },
                            { label: "بوابة الطبيعة", image: "assets/images/quiz/q4_opt4.jpg", trait: "nature", value: 5 }
                        ]
                    },
                    { id: 5, text: "أفضل التخطيط لكل شيء مسبقاً بدلاً من العفوية.", trait: "strategy", type: "likert" },
                    { id: 6, text: "لدي قدرة كبيرة على التكيف مع التغييرات المفاجئة.", trait: "adaptation", type: "likert" },
                    { id: 7, text: "أبحث دائماً عن المعنى العميق وراء الأشياء.", trait: "knowledge", type: "likert" },
                    { 
                        id: 8, 
                        text: "ما هو العنصر الذي تشعر أنه يمثل طاقتك الداخلية؟", 
                        type: "visual",
                        options: [
                            { label: "النار", image: "assets/images/quiz/q8_opt1.jpg", trait: "intensity", value: 5 },
                            { label: "المياه", image: "assets/images/quiz/q8_opt2.jpg", trait: "composure", value: 5 },
                            { label: "الأرض", image: "assets/images/quiz/q8_opt3.jpg", trait: "stability", value: 5 },
                            { label: "الرياح", image: "assets/images/quiz/q8_opt4.jpg", trait: "exploration", value: 5 }
                        ]
                    },
                    { id: 9, text: "أجد صعوبة في مسامحة الأشخاص الذين أخطأوا في حقي.", trait: "persistence", type: "likert" },
                    { id: 10, text: "أثق بحدسي أكثر من المنطق في اتخاذ القرارات.", trait: "intuition", type: "likert" },
                    { id: 11, text: "أحب أن أكون محاطاً بالجمال والفن في حياتي.", trait: "elegance", type: "likert" },
                    { 
                        id: 12, 
                        text: "أي من هذه المشاهد يمنحك شعوراً أكبر بالسلام؟", 
                        type: "visual",
                        options: [
                            { label: "قمة جبل", image: "assets/images/quiz/q12_opt1.jpg", trait: "ambition", value: 5 },
                            { label: "مكتبة قديمة", image: "assets/images/quiz/q12_opt2.jpg", trait: "wisdom", value: 5 },
                            { label: "حديقة سرية", image: "assets/images/quiz/q12_opt3.jpg", trait: "purity", value: 5 },
                            { label: "شاطئ مهجور", image: "assets/images/quiz/q12_opt4.jpg", trait: "mystery", value: 5 }
                        ]
                    },
                    { id: 13, text: "أستمتع بمناقشة الأفكار الفلسفية والمعقدة.", trait: "analysis", type: "likert" },
                    { id: 14, text: "أنا شخص صبور جداً عند التعامل مع المشاكل الطويلة.", trait: "persistence", type: "likert" },
                    { id: 15, text: "أهتم كثيراً بسمعتي وكيف يطالعني الآخرون.", trait: "potential", type: "likert" },
                    { 
                        id: 16, 
                        text: "أي رمز سحري تختار ليكون تميمة حظك؟", 
                        type: "visual",
                        options: [
                            { label: "العين", image: "assets/images/quiz/q16_opt1.jpg", trait: "knowledge", value: 5 },
                            { label: "الخنجر", image: "assets/images/quiz/q16_opt2.jpg", trait: "protection", value: 5 },
                            { label: "الكأس", image: "assets/images/quiz/q16_opt3.jpg", trait: "altruism", value: 5 },
                            { label: "المفتاح", image: "assets/images/quiz/q16_opt4.jpg", trait: "curiosity", value: 5 }
                        ]
                    },
                    { id: 17, text: "أفضل العمل ضمن فريق بدلاً من العمل منفرداً.", trait: "social", type: "likert" },
                    { id: 18, text: "أنا دائماً صادق مع نفسي حتى لو كان الحلم مؤلماً.", trait: "honesty", type: "likert" },
                    { id: 19, text: "أمتلك طاقة كبيرة تدفعني لتجربة أشياء جديدة دائماً.", trait: "energy", type: "likert" },
                    { 
                        id: 20, 
                        text: "ما هو الحيوان الذي تشعر بارتباط روحي معه؟", 
                        type: "visual",
                        options: [
                            { label: "الذئب", image: "assets/images/quiz/q20_opt1.jpg", trait: "social", value: 5 },
                            { label: "الأفعى", image: "assets/images/quiz/q20_opt2.jpg", trait: "strategy", value: 5 },
                            { label: "النسر", image: "assets/images/quiz/q20_opt3.jpg", trait: "exploration", value: 5 },
                            { label: "الفراشة", image: "assets/images/quiz/q20_opt4.jpg", trait: "adaptation", value: 5 }
                        ]
                    },
                    { id: 21, text: "أنا شخص عاطفي جداً وتؤثر فيّ القصص الإنسانية.", trait: "nature", type: "likert" },
                    { id: 22, text: "أحب التحدي والمنافسة للوصول إلى القمة.", trait: "leadership", type: "likert" },
                    { id: 23, text: "أميل للحفاظ على التقاليد والقيم القديمة.", trait: "tradition", type: "likert" },
                    { 
                        id: 24, 
                        text: "أي جوهرة تشعر أنها تملك طاقة تجذبك؟", 
                        type: "visual",
                        options: [
                            { label: "ياقوت أحمر", image: "assets/images/quiz/q24_opt1.jpg", trait: "intensity", value: 5 },
                            { label: "ماس أزرق", image: "assets/images/quiz/q24_opt2.jpg", trait: "logic", value: 5 },
                            { label: "زمرد أخضر", image: "assets/images/quiz/q24_opt3.jpg", trait: "nature", value: 5 },
                            { label: "جمشت أرجواني", image: "assets/images/quiz/q24_opt4.jpg", trait: "intuition", value: 5 }
                        ]
                    },
                    { id: 25, text: "أستطيع التحكم في أعصابي حتى في أصعب المواقف.", trait: "composure", type: "likert" },
                    { id: 26, text: "أهتم بالتفاصيل الصغيرة التي قد لا يلاحظها الآخرون.", trait: "analysis", type: "likert" },
                    { id: 27, text: "أنا شخص متفائل وأرى الجانب المشرق دائماً.", trait: "potential", type: "likert" },
                    { 
                        id: 28, 
                        text: "أي سماء تفضل أن تتأملها في الليل؟", 
                        type: "visual",
                        options: [
                            { label: "شفق قطبي", image: "assets/images/quiz/q28_opt1.jpg", trait: "potential", value: 5 },
                            { label: "كسوف كلي", image: "assets/images/quiz/q28_opt2.jpg", trait: "mystery", value: 5 },
                            { label: "سديم فضائي", image: "assets/images/quiz/q28_opt3.jpg", trait: "exploration", value: 5 },
                            { label: "برق صامت", image: "assets/images/quiz/q28_opt4.jpg", trait: "energy", value: 5 }
                        ]
                    },
                    { id: 29, text: "أفضل الاستقرار في مكان واحد على كثرة الترحال.", trait: "stability", type: "likert" },
                    { id: 30, text: "أشعر أن لدي رسالة كبيرة يجب أن أؤديها في الحياة.", trait: "ambition", type: "likert" },
                    { id: 31, text: "أحب الغموض ولا أكشف كل أوراقي للآخرين.", trait: "mystery", type: "likert" },
                    { 
                        id: 32, 
                        text: "أي وسيلة نقل أسطورية تختار لرحلتك القادمة؟", 
                        type: "visual",
                        options: [
                            { label: "سفينة طائرة", image: "assets/images/quiz/q32_opt1.jpg", trait: "exploration", value: 5 },
                            { label: "عربة نور", image: "assets/images/quiz/q32_opt2.jpg", trait: "purity", value: 5 },
                            { label: "بساط ريحي", image: "assets/images/quiz/q32_opt3.jpg", trait: "wisdom", value: 5 },
                            { label: "تنين صغير", image: "assets/images/quiz/q32_opt4.jpg", trait: "protection", value: 5 }
                        ]
                    },
                    { id: 33, text: "أنا شخص عملي جداً ولا أضيع وقتي في الأحلام.", trait: "logic", type: "likert" },
                    { id: 34, text: "أبحث دائماً عن المثالية في كل ما أفعل.", trait: "perfection", type: "likert" },
                    { id: 35, text: "أنا مخلص جداً لأصدقائي وعائلتي.", trait: "social", type: "likert" },
                    { 
                        id: 36, 
                        text: "ما هو السلاح الذي ستختاره للدفاع عن مملكتك؟", 
                        type: "visual",
                        options: [
                            { label: "سيف الضوء", image: "assets/images/quiz/q36_opt1.jpg", trait: "honesty", value: 5 },
                            { label: "درع الظل", image: "assets/images/quiz/q36_opt2.jpg", trait: "protection", value: 5 },
                            { label: "قوس النجوم", image: "assets/images/quiz/q36_opt3.jpg", trait: "strategy", value: 5 },
                            { label: "عصا الحكيم", image: "assets/images/quiz/q36_opt4.jpg", trait: "knowledge", value: 5 }
                        ]
                    },
                    { id: 37, text: "أحب أن أكون متميزاً ومختلفاً عن الآخرين.", trait: "potential", type: "likert" },
                    { id: 38, text: "أنا شخص مرن جداً في تفكيري.", trait: "adaptation", type: "likert" },
                    { id: 39, text: "أؤمن أن القوة الحقيقية تأتي من الداخل.", trait: "power", type: "likert" },
                    { 
                        id: 40, 
                        text: "أي نهاية تفضل أن تختم بها قصة حياتك؟", 
                        type: "visual",
                        options: [
                            { label: "عرش ذهبي", image: "assets/images/quiz/q40_opt1.jpg", trait: "leadership", value: 5 },
                            { label: "كوخ هادئ", image: "assets/images/quiz/q40_opt2.jpg", trait: "nature", value: 5 },
                            { label: "رحلة أبدية", image: "assets/images/quiz/q40_opt3.jpg", trait: "curiosity", value: 5 },
                            { label: "اتحاد كوني", image: "assets/images/quiz/q40_opt4.jpg", trait: "mystery", value: 5 }
                        ]
                    }
                ],
                results: [
                    {
                        id: "dragon",
                        name: "التنين العظيم",
                        rarity: "أسطوري",
                        image: "assets/images/dragon.jpg",
                        description: "أنت تجسيد للقوة والقيادة. تمتلك روحاً نارية لا تقهر وطموحاً يتجاوز السحاب.",
                        article: "يُعتبر التنين في جميع الثقافات رمزاً للقوة المطلقة والحكمة القديمة. أصحاب هذه الشخصية هم قادة طبيعيون، يمتلكون رؤية بعيدة المدى وقدرة على مواجهة أصعب التحديات دون خوف.",
                        secretReport: {
                            strengths: "كاريزما طاغية، شجاعة استثنائية، وقدرة على حماية من تحب بكل قوتك.",
                            challenges: "قد تميل أحياناً للسيطرة المفرطة أو الغضب السريع عندما لا تسير الأمور كما خططت.",
                            insight: "قوتك الحقيقية تكمن في كبح جماح نارك واستخدامها للتدفئة بدلاً من الحرق."
                        }
                    },
                    {
                        id: "phoenix",
                        name: "طائر العنقاء",
                        rarity: "نادر جداً",
                        image: "assets/images/phoenix.jpg",
                        description: "أنت رمز للتجدد والأمل. تمتلك قدرة مذهلة على النهوض من الرماد أقوى من ذي قبل.",
                        article: "العنقاء لا تموت أبداً، بل تولد من جديد. أصحاب هذه الشخصية يمتلكون مرونة نفسية مذهلة، وهم قادرون على تحويل الألم إلى وقود للإبداع والنجاح.",
                        secretReport: {
                            strengths: "تفاؤل لا ينضب، قدرة على الشفاء الذاتي، وإلهام الآخرين بقصة نجاحك.",
                            challenges: "قد تستهلك نفسك في العطاء للآخرين حتى تحترق تماماً قبل أن تبدأ دورتك الجديدة.",
                            insight: "تذكر أنك لست مضطراً للاحتراق دائماً لتثبت وجودك؛ النور الهادئ يدوم أطول."
                        }
                    },
                    {
                        id: "unicorn",
                        name: "وحيد القرن النقي",
                        rarity: "نادر",
                        image: "assets/images/unicorn.jpg",
                        description: "أنت تجسيد للنقاء واللطف. تمتلك روحاً بريئة تهدف دائماً لنشر الخير والجمال.",
                        article: "وحيد القرن هو رمز الطهارة والشفاء. أصحاب هذه الشخصية هم بلسم لجروح الآخرين، يمتلكون حدساً نقياً وقدرة على رؤية الجمال في أبسط الأشياء.",
                        secretReport: {
                            strengths: "صدق مطلق، قدرة على التعاطف العميق، ونية صافية تجذب الناس إليك.",
                            challenges: "حساسيتك المفرطة قد تجعلك عرضة للجروح من العالم القاسي من حولك.",
                            insight: "نقاء قلبك هو أقوى درع تملكه، لا تسمح للعالم أن يغير جوهرك."
                        }
                    },
                    {
                        id: "sphinx",
                        name: "أبو الهول الغامض",
                        rarity: "أسطوري",
                        image: "assets/images/sphinx.jpg",
                        description: "أنت حارس الأسرار والحكمة. تمتلك عقلاً تحليلياً يرى ما وراء الستار ويحل أعقد الألغاز.",
                        article: "أبو الهول يمثل التوازن بين القوة الجسدية والذكاء الحاد. أصحاب هذه الشخصية هم مفكرون صامتون، يراقبون العالم بدقة ولا يتحدثون إلا عندما يملكون الحقيقة.",
                        secretReport: {
                            strengths: "ذكاء حاد، قدرة على قراءة البشر، وصبر طويل في انتظار اللحظة المناسبة.",
                            challenges: "ميلك للعزلة والغموض قد يجعل الآخرين يجدون صعوبة في التقرب منك أو فهمك.",
                            insight: "مشاركة جزء من أسرارك قد يفتح لك أبواباً من الصداقة لم تكن تتوقعها."
                        }
                    },
                    {
                        id: "kraken",
                        name: "الكراكن العظيم",
                        rarity: "نادر جداً",
                        image: "assets/images/kraken.jpg",
                        description: "أنت قوة الأعماق الغامضة. تمتلك نفوذاً واسعاً وقدرة على التحكم في الأمور من خلف الكواليس.",
                        article: "الكراكن هو سيد المحيطات المظلمة. أصحاب هذه الشخصية يمتلكون شخصية معقدة وعميقة، يفضلون العمل في صمت وتأثيرهم يظهر فجأة وبقوة هائلة.",
                        secretReport: {
                            strengths: "تخطيط استراتيجي، قوة إرادة جبارة، وقدرة على إدارة الأزمات الكبرى.",
                            challenges: "قد تميل للغموض الزائد الذي قد يتحول إلى رغبة في السيطرة الخفية.",
                            insight: "الأعماق جميلة، لكن لا تنسَ الصعود للسطح أحياناً لتستمتع بنور الشمس."
                        }
                    },
                    {
                        id: "owl_of_athena",
                        name: "بومة أثينا",
                        rarity: "نادر",
                        image: "assets/images/owl_of_athena.jpg",
                        description: "أنت رمز الحكمة والمعرفة. ترى في الظلام ما يعجز الآخرون عن رؤيته في وضح النهار.",
                        article: "بومة أثينا كانت ترافق آلهة الحكمة دائماً. أصحاب هذه الشخصية هم باحثون عن الحقيقة، يقدرون العلم والمنطق ويمتلكون بصيرة نافذة.",
                        secretReport: {
                            strengths: "تركيز عالٍ، قدرة على التعلم السريع، وحكمة تسبق سنك بكثير.",
                            challenges: "ميلك للمنطق الجاف قد يجعلك تهمل الجانب العاطفي في علاقاتك.",
                            insight: "الحكمة الحقيقية هي التي تجمع بين ذكاء العقل ورحمة القلب."
                        }
                    },
                    {
                        id: "centaur",
                        name: "القنطور الحكيم",
                        rarity: "نادر",
                        image: "assets/images/centaur.jpg",
                        description: "أنت رمز للتوازن بين العقل والقوة البدنية. تمتلك حكمة فطرية وروحاً حرة.",
                        article: "القنطور يمثل الجانب البري والحكيم في الطبيعة البشرية. أصحاب هذه الشخصية هم استراتيجيون بالفطرة، يقدرون الحرية والمنطق.",
                        secretReport: {
                            strengths: "تفكير منطقي، قدرة على التحمل، ورؤية فلسفية للحياة.",
                            challenges: "قد تجد صعوبة في الالتزام بالقواعد الصارمة التي تحد من حريتك.",
                            insight: "توازنك هو سر قوتك، لا تترك جانباً يطغى على الآخر."
                        }
                    },
                    {
                        id: "cerberus",
                        name: "سيربيروس الحارس",
                        rarity: "نادر جداً",
                        image: "assets/images/cerberus.jpg",
                        description: "أنت الحامي الوفي والدرع المنيع. تمتلك يقظة دائمة وقدرة على حماية ما هو ثمين.",
                        article: "سيربيروس هو حارس البوابات العظيم. أصحاب هذه الشخصية يمتلكون ولاءً لا يتزعزع وقدرة على رصد الأخطار قبل وقوعها.",
                        secretReport: {
                            strengths: "ولاء مطلق، يقظة عالية، وقدرة على حماية من تحب.",
                            challenges: "قد تكون مفرطاً في الحماية أو تجد صعوبة في الثقة بالغرباء.",
                            insight: "الحماية لا تعني دائماً القسوة؛ أحياناً يكون اللين هو أقوى دفاع."
                        }
                    },
                    {
                        id: "faun",
                        name: "الفون الطبيعي",
                        rarity: "شائع",
                        image: "assets/images/faun.jpg",
                        description: "أنت روح الطبيعة والمرح. تمتلك قدرة على الاستمتاع بالحياة ونشر البهجة من حولك.",
                        article: "الفون يمثل الجانب المبهج والمرتبط بالطبيعة. أصحاب هذه الشخصية هم أشخاص اجتماعيون، يحبون الموسيقى والفن والعيش في اللحظة.",
                        secretReport: {
                            strengths: "روح مرحة، ارتباط عميق بالطبيعة، وقدرة على التكيف الاجتماعي.",
                            challenges: "قد تميل للعفوية الزائدة التي قد تؤدي لإهمال المسؤوليات الجدية.",
                            insight: "المرح ضروري، لكن القليل من الجدية يساعدك على تحقيق أحلامك الكبرى."
                        }
                    },
                    {
                        id: "golem",
                        name: "الجولم الصخري",
                        rarity: "نادر",
                        image: "assets/images/golem.jpg",
                        description: "أنت رمز للاستقرار والصلابة. تمتلك إرادة من حجر وقدرة على تحمل أصعب الظروف.",
                        article: "الجولم هو الكائن المصنوع من الأرض، وهو يمثل الثبات. أصحاب هذه الشخصية هم أشخاص يعتمد عليهم، صبورون وهادئون.",
                        secretReport: {
                            strengths: "صبر أيوب، صلابة نفسية، ووفاء بالوعود مهما كلف الأمر.",
                            challenges: "قد تجد صعوبة في التعبير عن مشاعرك أو التكيف مع التغييرات السريعة.",
                            insight: "حتى الصخر يمكن أن ينبت منه الزهر؛ لا تخشَ إظهار جانبك اللين."
                        }
                    },
                    {
                        id: "hydra",
                        name: "الهيدرا المتجددة",
                        rarity: "أسطوري",
                        image: "assets/images/hydra.jpg",
                        description: "أنت رمز للإصرار والتعددية. كلما واجهت تحدياً، خرجت منه بأفكار وحلول أكثر.",
                        article: "الهيدرا كائن ينمو له رأسان كلما قطع واحد. أصحاب هذه الشخصية هم أشخاص مثابرون جداً، لا يعرفون الاستسلام أبداً.",
                        secretReport: {
                            strengths: "إصرار لا يلين، تعدد المواهب، وقدرة على التعافي السريع من الفشل.",
                            challenges: "قد تشتت نفسك في الكثير من الاتجاهات في وقت واحد.",
                            insight: "تركيز كل رؤوسك على هدف واحد سيجعلك لا تقهر."
                        }
                    },
                    {
                        id: "kitsune",
                        name: "الكيتسوني الماكر",
                        rarity: "نادر جداً",
                        image: "assets/images/kitsune.jpg",
                        description: "أنت رمز للذكاء التكيفي والسحر. تمتلك قدرة على تغيير شكلك وأسلوبك حسب الموقف.",
                        article: "الكيتسوني هو الثعلب الأسطوري الياباني. أصحاب هذه الشخصية هم أذكياء جداً، يمتلكون جاذبية غامضة وقدرة على الإقناع.",
                        secretReport: {
                            strengths: "ذكاء اجتماعي، قدرة على الإقناع، ومرونة عالية في التفكير.",
                            challenges: "قد يجد الآخرون صعوبة في معرفة وجهك الحقيقي أو نواياك الصادقة.",
                            insight: "الذكاء موهبة، استخدمها لبناء الجسور وليس فقط لخداع العابرين."
                        }
                    },
                    {
                        id: "pegasus",
                        name: "بيجاسوس المجنح",
                        rarity: "نادر",
                        image: "assets/images/pegasus.jpg",
                        description: "أنت رمز للحرية والإلهام. تمتلك روحاً تحلق فوق المصاعب وتسعى دائماً للأفق البعيد.",
                        article: "بيجاسوس هو الحصان المجنح الذي يمثل الخيال. أصحاب هذه الشخصية هم حالمون، يمتلكون طاقة إيجابية ورغبة في الاستكشاف.",
                        secretReport: {
                            strengths: "خيال واسع، طاقة إيجابية، ورغبة مستمرة في التطور والحرية.",
                            challenges: "قد تجد صعوبة في التعامل مع الواقع المادي والقيود اليومية.",
                            insight: "جناحاك يحملانك للسماء، لكن حوافرك هي التي تثبتك على الأرض؛ اعتني بكليهما."
                        }
                    },
                    {
                        id: "simurgh",
                        name: "السيمرغ الحكيم",
                        rarity: "أسطوري",
                        image: "assets/images/simurgh.jpg",
                        description: "أنت رمز للكمال والمعرفة الشاملة. تمتلك رؤية شاملة للكون وتفهم ترابط الأشياء.",
                        article: "السيمرغ هو الطائر الأسطوري الفارسي الذي يملك علم كل العصور. أصحاب هذه الشخصية هم حكماء، يسعون للكمال الروحي والمعرفي.",
                        secretReport: {
                            strengths: "معرفة واسعة، هدوء نفسي، وقدرة على تقديم النصيحة الحكيمة.",
                            challenges: "قد تميل للمثالية الزائدة التي قد تجعلك تشعر بخيبة أمل من الواقع.",
                            insight: "الكمال رحلة وليس محطة وصول؛ استمتع بالطريق بكل ما فيه."
                        }
                    },
                    {
                        id: "siren",
                        name: "السيرين الساحرة",
                        rarity: "نادر جداً",
                        image: "assets/images/siren.jpg",
                        description: "أنت رمز للجاذبية والحدس العميق. تمتلك تأثيراً ساحراً على من حولك وقدرة على فهم المشاعر.",
                        article: "السيرين هي كائن البحار الذي يملك صوتاً لا يقاوم. أصحاب هذه الشخصية هم أشخاص جذابون، يمتلكون حدساً قوياً وفهماً عميقاً للنفس البشرية.",
                        secretReport: {
                            strengths: "جاذبية طبيعية، حدس قوي، وفهم عميق للمشاعر.",
                            challenges: "قد تستخدم تأثيرك للسيطرة على الآخرين عاطفياً دون قصد.",
                            insight: "سحرك أمانة، استخدمه لرفع معنويات الآخرين وإرشادهم."
                        }
                    },
                    {
                        id: "valkyrie",
                        name: "الفالكيري المحاربة",
                        rarity: "أسطوري",
                        image: "assets/images/valkyrie.jpg",
                        description: "أنت رمز للشرف والاختيار. تمتلك شجاعة المحاربين وقدرة على اتخاذ القرارات المصيرية.",
                        article: "الفالكيري هن مختارات الأبطال في الأساطير الإسكندنافية. أصحاب هذه الشخصية هم أشخاص شجعان، يقدرون الشرف والعدالة.",
                        secretReport: {
                            strengths: "شجاعة منقطعة النظير، نزاهة، وقدرة على قيادة الآخرين نحو النصر.",
                            challenges: "قد تكون صارماً جداً مع نفسك ومع الآخرين في تطبيق معاييرك.",
                            insight: "البطل الحقيقي يعرف متى يضع سيفه ويظهر الرحمة."
                        }
                    }
                ]
            },
            {
                id: "historical-figure",
                title: "اختبار الشخصية التاريخية",
                badge: "جديد",
                image: "assets/images/dragon.jpg",
                description: "اكتشف أي شخصية تاريخية عظيمة تشاركك نفس الصفات والطموحات.",
                questions: [
                    { id: 1, text: "أنا شخص طموح وأسعى دائماً للتطور والتقدم.", trait: "ambition", type: "likert" },
                    { id: 2, text: "أؤمن بقوة الفكر والعلم في تغيير العالم.", trait: "knowledge", type: "likert" },
                    { id: 3, text: "أنا قائد طبيعي يثق الناس في قراراتي.", trait: "leadership", type: "likert" },
                    { id: 4, text: "أهتم بالعدالة والمساواة بين الناس.", trait: "altruism", type: "likert" },
                    { id: 5, text: "أنا شخص مبدع وأحب الفن والثقافة.", trait: "elegance", type: "likert" },
                    { id: 6, text: "أفضل الاستقلالية والحرية في قراراتي.", trait: "exploration", type: "likert" },
                    { id: 7, text: "أنا شخص صبور وأثابر على أهدافي.", trait: "persistence", type: "likert" },
                    { id: 8, text: "أحب تحدي الأفكار التقليدية والتفكير خارج الصندوق.", trait: "intuition", type: "likert" }
                ],
                results: [
                    {
                        id: "napoleon",
                        name: "نابليون بونابرت",
                        rarity: "أسطوري",
                        image: "assets/images/dragon.jpg",
                        description: "أنت قائد مولود بطموح لا محدود. تمتلك رؤية استراتيجية قوية وقدرة على تنظيم الجيوش والشعوب.",
                        article: "نابليون كان أحد أعظم القادة العسكريين في التاريخ، معروف بطموحه اللامحدود وقدرته على الفتح والتنظيم.",
                        secretReport: {
                            strengths: "طموح استثنائي، استراتيجية عسكرية ذكية، وقيادة قوية.",
                            challenges: "قد تميل للسيطرة المفرطة وعدم الاستماع للآخرين.",
                            insight: "القوة الحقيقية تأتي من الاستماع والتعاون، ليس فقط من الأوامر."
                        }
                    },
                    {
                        id: "einstein",
                        name: "ألبرت أينشتاين",
                        rarity: "نادر جداً",
                        image: "assets/images/dragon.jpg",
                        description: "أنت عبقري فكري يرى العالم بطريقة مختلفة. تمتلك ذكاءً حادًا وفضولاً لا ينتهي.",
                        article: "أينشتاين غيّر فهمنا للفيزياء والكون. كان معروفاً بتفكيره الإبداعي وقدرته على حل المشاكل المعقدة.",
                        secretReport: {
                            strengths: "ذكاء استثنائي، فضول علمي، وقدرة على الابتكار.",
                            challenges: "قد تشعر بالعزلة بسبب تفكيرك المختلف عن الآخرين.",
                            insight: "عبقريتك هي هديتك للعالم، لا تخجل منها."
                        }
                    },
                    {
                        id: "cleopatra",
                        name: "كليوباترا",
                        rarity: "نادر جداً",
                        image: "assets/images/dragon.jpg",
                        description: "أنت شخصية ساحرة وذكية. تمتلكين جمالاً طبيعياً وذكاءً سياسياً حادًا.",
                        article: "كليوباترا كانت آخر ملكة مصرية، معروفة بذكائها السياسي وقدرتها على التأثير على الملوك والقادة.",
                        secretReport: {
                            strengths: "ذكاء سياسي، سحر طبيعي، وقدرة على التأثير.",
                            challenges: "قد تستخدمين تأثيركم بطرق قد لا تكون أخلاقية دائماً.",
                            insight: "القوة الحقيقية تأتي من الشخصية والعقل، لا من المظهر وحده."
                        }
                    },
                    {
                        id: "gandhi",
                        name: "مهاتما غاندي",
                        rarity: "نادر",
                        image: "assets/images/dragon.jpg",
                        description: "أنت شخص مبدئي وسلمي. تؤمن بقوة اللاعنف والحب في تغيير العالم.",
                        article: "غاندي قاد الهند للاستقلال من خلال المقاومة السلمية. كان معروفاً بمبادئه الأخلاقية القوية.",
                        secretReport: {
                            strengths: "مبادئ قوية، سلام داخلي، وقدرة على الإلهام.",
                            challenges: "قد تواجه صعوبة في التعامل مع الناس الذين لا يشاركونك قيمك.",
                            insight: "التغيير الحقيقي يأتي من الداخل قبل الخارج."
                        }
                    }
                ]
            },
            {
                id: "superpower",
                title: "اختبار القوة الخارقة",
                badge: "جديد",
                image: "assets/images/dragon.jpg",
                description: "اكتشف أي قوة خارقة تناسب شخصيتك وقدراتك الحقيقية.",
                questions: [
                    { id: 1, text: "أنا شخص قوي جسدياً وعقلياً.", trait: "power", type: "likert" },
                    { id: 2, text: "أستطيع فهم مشاعر الآخرين بسهولة.", trait: "intuition", type: "likert" },
                    { id: 3, text: "أنا سريع التفكير والاستجابة.", trait: "energy", type: "likert" },
                    { id: 4, text: "أحب التحكم في الأشياء من حولي.", trait: "leadership", type: "likert" },
                    { id: 5, text: "أنا شخص حكيم وأعطي نصائح جيدة.", trait: "wisdom", type: "likert" },
                    { id: 6, text: "أحب الاستكشاف والمغامرة.", trait: "exploration", type: "likert" },
                    { id: 7, text: "أنا شخص محمي وأحب حماية الآخرين.", trait: "protection", type: "likert" },
                    { id: 8, text: "أستطيع التكيف مع أي موقف.", trait: "adaptation", type: "likert" }
                ],
                results: [
                    {
                        id: "telekinesis",
                        name: "قوة تحريك الأشياء بالعقل",
                        rarity: "أسطوري",
                        image: "assets/images/dragon.jpg",
                        description: "أنت تمتلك عقلاً قوياً وقدرة على التحكم في الأشياء من حولك. قوتك تأتي من تركيزك الشديد.",
                        article: "قوة تحريك الأشياء بالعقل تمثل السيطرة والتحكم. أصحاب هذه القوة هم قادة طبيعيون.",
                        secretReport: {
                            strengths: "تركيز عالي، قدرة على التحكم، وسيطرة على الموقف.",
                            challenges: "قد تميل للسيطرة المفرطة على من حولك.",
                            insight: "القوة الحقيقية في السماح للآخرين بالحرية."
                        }
                    },
                    {
                        id: "telepathy",
                        name: "قوة قراءة العقول",
                        rarity: "نادر جداً",
                        image: "assets/images/dragon.jpg",
                        description: "أنت تفهم الناس بعمق. قدرتك على قراءة المشاعر والنوايا تجعلك شخصاً فريداً.",
                        article: "قوة قراءة العقول تمثل الفهم العميق والتعاطف. أصحاب هذه القوة هم مستمعون ممتازون.",
                        secretReport: {
                            strengths: "فهم عميق للناس، تعاطف قوي، وحدس عالي.",
                            challenges: "قد تشعر بالإرهاق من مشاعر الآخرين.",
                            insight: "استخدم فهمك لمساعدة الآخرين، لا للحكم عليهم."
                        }
                    },
                    {
                        id: "speedforce",
                        name: "قوة السرعة الخارقة",
                        rarity: "نادر",
                        image: "assets/images/dragon.jpg",
                        description: "أنت سريع التفكير والحركة. قدرتك على التصرف بسرعة تجعلك فعالاً جداً.",
                        article: "قوة السرعة تمثل الحركة والتغيير. أصحاب هذه القوة هم أشخاص نشيطون.",
                        secretReport: {
                            strengths: "سرعة في التفكير والعمل، كفاءة عالية، وحيوية.",
                            challenges: "قد تتسرع في القرارات المهمة.",
                            insight: "السرعة بدون تفكير قد تؤدي للأخطاء، خذ وقتك."
                        }
                    },
                    {
                        id: "healing",
                        name: "قوة الشفاء",
                        rarity: "نادر",
                        image: "assets/images/dragon.jpg",
                        description: "أنت شخص شافي ومعطاء. قدرتك على تخفيف آلام الآخرين تجعلك مميزاً.",
                        article: "قوة الشفاء تمثل الحب والرحمة. أصحاب هذه القوة هم أشخاص طيبون.",
                        secretReport: {
                            strengths: "رحمة عميقة، قدرة على التعاطف، وحب للآخرين.",
                            challenges: "قد تنسى رعاية نفسك بسبب اهتمامك بالآخرين.",
                            insight: "تذكر أن تعتني بنفسك أولاً لتستطيع مساعدة الآخرين."
                        }
                    }
                ]
            }
        ]
    },
    en: {
        title: "QuizMagic | World of Mythical Quizzes",
        heroTitle: "Discover Your True Mythical Creature",
        heroSubtitle: "A journey into your subconscious to reveal the ancient forces within your soul",
        footerDesc: "The most accurate psychological quiz platform in the world.",
        quizzes: [
            {
                id: "mythical-creature",
                title: "Mythical Creature Test",
                badge: "Most Accurate",
                image: "assets/images/dragon.jpg",
                description: "An advanced psychological analysis linking your traits to ancient creature legends.",
                questions: [
                    { id: 1, text: "I feel most comfortable when I'm alone with my thoughts.", trait: "mystery", type: "likert" },
                    { id: 2, text: "I always tend to take on a leadership role in groups.", trait: "leadership", type: "likert" },
                    { id: 3, text: "I care about helping others even at the expense of my own comfort.", trait: "altruism", type: "likert" },
                    { 
                        id: 4, 
                        text: "Which of these gateways attracts you most to enter?", 
                        type: "visual",
                        options: [
                            { label: "Gate of Light", image: "assets/images/quiz/q4_opt1.jpg", trait: "purity", value: 5 },
                            { label: "Gate of Mystery", image: "assets/images/quiz/q4_opt2.jpg", trait: "mystery", value: 5 },
                            { label: "Gate of Power", image: "assets/images/quiz/q4_opt3.jpg", trait: "power", value: 5 },
                            { label: "Gate of Nature", image: "assets/images/quiz/q4_opt4.jpg", trait: "nature", value: 5 }
                        ]
                    },
                    { id: 5, text: "I prefer to plan everything in advance rather than be spontaneous.", trait: "strategy", type: "likert" },
                    { id: 6, text: "I have a great ability to adapt to sudden changes.", trait: "adaptation", type: "likert" },
                    { id: 7, text: "I always search for deep meaning behind things.", trait: "knowledge", type: "likert" },
                    { 
                        id: 8, 
                        text: "Which element do you feel represents your inner energy?", 
                        type: "visual",
                        options: [
                            { label: "Fire", image: "assets/images/quiz/q8_opt1.jpg", trait: "intensity", value: 5 },
                            { label: "Water", image: "assets/images/quiz/q8_opt2.jpg", trait: "composure", value: 5 },
                            { label: "Earth", image: "assets/images/quiz/q8_opt3.jpg", trait: "stability", value: 5 },
                            { label: "Wind", image: "assets/images/quiz/q8_opt4.jpg", trait: "exploration", value: 5 }
                        ]
                    },
                    { id: 9, text: "I find it difficult to forgive people who have wronged me.", trait: "persistence", type: "likert" },
                    { id: 10, text: "I trust my intuition more than logic when making decisions.", trait: "intuition", type: "likert" },
                    { id: 11, text: "I love being surrounded by beauty and art in my life.", trait: "elegance", type: "likert" },
                    { 
                        id: 12, 
                        text: "Which of these scenes gives you the greatest sense of peace?", 
                        type: "visual",
                        options: [
                            { label: "Mountain Peak", image: "assets/images/quiz/q12_opt1.jpg", trait: "ambition", value: 5 },
                            { label: "Ancient Library", image: "assets/images/quiz/q12_opt2.jpg", trait: "wisdom", value: 5 },
                            { label: "Secret Garden", image: "assets/images/quiz/q12_opt3.jpg", trait: "purity", value: 5 },
                            { label: "Abandoned Beach", image: "assets/images/quiz/q12_opt4.jpg", trait: "mystery", value: 5 }
                        ]
                    },
                    { id: 13, text: "I enjoy discussing philosophical and complex ideas.", trait: "analysis", type: "likert" },
                    { id: 14, text: "I am a very patient person when dealing with long-term problems.", trait: "persistence", type: "likert" },
                    { id: 15, text: "I care greatly about my reputation and how others perceive me.", trait: "potential", type: "likert" },
                    { 
                        id: 16, 
                        text: "Which magical symbol would you choose as your lucky charm?", 
                        type: "visual",
                        options: [
                            { label: "The Eye", image: "assets/images/quiz/q16_opt1.jpg", trait: "knowledge", value: 5 },
                            { label: "The Dagger", image: "assets/images/quiz/q16_opt2.jpg", trait: "protection", value: 5 },
                            { label: "The Chalice", image: "assets/images/quiz/q16_opt3.jpg", trait: "altruism", value: 5 },
                            { label: "The Key", image: "assets/images/quiz/q16_opt4.jpg", trait: "curiosity", value: 5 }
                        ]
                    },
                    { id: 17, text: "I prefer working within a team rather than working alone.", trait: "social", type: "likert" },
                    { id: 18, text: "I am always honest with myself even if the truth is painful.", trait: "honesty", type: "likert" },
                    { id: 19, text: "I possess great energy that drives me to try new things constantly.", trait: "energy", type: "likert" },
                    { 
                        id: 20, 
                        text: "Which animal do you feel a spiritual connection with?", 
                        type: "visual",
                        options: [
                            { label: "Wolf", image: "assets/images/quiz/q20_opt1.jpg", trait: "social", value: 5 },
                            { label: "Snake", image: "assets/images/quiz/q20_opt2.jpg", trait: "strategy", value: 5 },
                            { label: "Eagle", image: "assets/images/quiz/q20_opt3.jpg", trait: "exploration", value: 5 },
                            { label: "Butterfly", image: "assets/images/quiz/q20_opt4.jpg", trait: "adaptation", value: 5 }
                        ]
                    },
                    { id: 21, text: "I am a very emotional person and human stories affect me deeply.", trait: "nature", type: "likert" },
                    { id: 22, text: "I love challenges and competition to reach the top.", trait: "leadership", type: "likert" },
                    { id: 23, text: "I tend to preserve traditions and old values.", trait: "tradition", type: "likert" },
                    { 
                        id: 24, 
                        text: "Which gemstone do you feel possesses energy that attracts you?", 
                        type: "visual",
                        options: [
                            { label: "Red Ruby", image: "assets/images/quiz/q24_opt1.jpg", trait: "intensity", value: 5 },
                            { label: "Blue Diamond", image: "assets/images/quiz/q24_opt2.jpg", trait: "logic", value: 5 },
                            { label: "Green Emerald", image: "assets/images/quiz/q24_opt3.jpg", trait: "nature", value: 5 },
                            { label: "Purple Amethyst", image: "assets/images/quiz/q24_opt4.jpg", trait: "intuition", value: 5 }
                        ]
                    },
                    { id: 25, text: "I can control my nerves even in the most difficult situations.", trait: "composure", type: "likert" },
                    { id: 26, text: "I pay attention to small details that others might miss.", trait: "analysis", type: "likert" },
                    { id: 27, text: "I am an optimistic person and always see the bright side.", trait: "potential", type: "likert" },
                    { 
                        id: 28, 
                        text: "Which sky would you prefer to contemplate at night?", 
                        type: "visual",
                        options: [
                            { label: "Aurora Borealis", image: "assets/images/quiz/q28_opt1.jpg", trait: "potential", value: 5 },
                            { label: "Total Eclipse", image: "assets/images/quiz/q28_opt2.jpg", trait: "mystery", value: 5 },
                            { label: "Cosmic Nebula", image: "assets/images/quiz/q28_opt3.jpg", trait: "exploration", value: 5 },
                            { label: "Silent Lightning", image: "assets/images/quiz/q28_opt4.jpg", trait: "energy", value: 5 }
                        ]
                    },
                    { id: 29, text: "I prefer stability in one place over frequent travel.", trait: "stability", type: "likert" },
                    { id: 30, text: "I feel that I have a great purpose to fulfill in life.", trait: "ambition", type: "likert" },
                    { id: 31, text: "I love mystery and don't reveal all my cards to others.", trait: "mystery", type: "likert" },
                    { 
                        id: 32, 
                        text: "Which mythical transportation would you choose for your next journey?", 
                        type: "visual",
                        options: [
                            { label: "Flying Ship", image: "assets/images/quiz/q32_opt1.jpg", trait: "exploration", value: 5 },
                            { label: "Chariot of Light", image: "assets/images/quiz/q32_opt2.jpg", trait: "purity", value: 5 },
                            { label: "Magic Carpet", image: "assets/images/quiz/q32_opt3.jpg", trait: "wisdom", value: 5 },
                            { label: "Little Dragon", image: "assets/images/quiz/q32_opt4.jpg", trait: "protection", value: 5 }
                        ]
                    },
                    { id: 33, text: "I am a very practical person and don't waste time on dreams.", trait: "logic", type: "likert" },
                    { id: 34, text: "I always search for perfection in everything I do.", trait: "perfection", type: "likert" },
                    { id: 35, text: "I am very loyal to my friends and family.", trait: "social", type: "likert" },
                    { 
                        id: 36, 
                        text: "Which weapon would you choose to defend your kingdom?", 
                        type: "visual",
                        options: [
                            { label: "Sword of Light", image: "assets/images/quiz/q36_opt1.jpg", trait: "honesty", value: 5 },
                            { label: "Shield of Shadows", image: "assets/images/quiz/q36_opt2.jpg", trait: "protection", value: 5 },
                            { label: "Bow of Stars", image: "assets/images/quiz/q36_opt3.jpg", trait: "strategy", value: 5 },
                            { label: "Staff of the Sage", image: "assets/images/quiz/q36_opt4.jpg", trait: "knowledge", value: 5 }
                        ]
                    },
                    { id: 37, text: "I like to be unique and different from others.", trait: "potential", type: "likert" },
                    { id: 38, text: "I am a very flexible person in my thinking.", trait: "adaptation", type: "likert" },
                    { id: 39, text: "I believe that true strength comes from within.", trait: "power", type: "likert" },
                    { 
                        id: 40, 
                        text: "What ending would you prefer to conclude your life story?", 
                        type: "visual",
                        options: [
                            { label: "Golden Throne", image: "assets/images/quiz/q40_opt1.jpg", trait: "leadership", value: 5 },
                            { label: "Quiet Cottage", image: "assets/images/quiz/q40_opt2.jpg", trait: "nature", value: 5 },
                            { label: "Eternal Journey", image: "assets/images/quiz/q40_opt3.jpg", trait: "curiosity", value: 5 },
                            { label: "Cosmic Unity", image: "assets/images/quiz/q40_opt4.jpg", trait: "mystery", value: 5 }
                        ]
                    }
                ],
                results: [
                    {
                        id: "dragon",
                        name: "Great Dragon",
                        rarity: "Mythical",
                        image: "assets/images/dragon.jpg",
                        description: "You are the embodiment of power and leadership. You possess an invincible fiery spirit and ambition that exceeds the clouds.",
                        article: "The dragon is considered in all cultures a symbol of absolute power and ancient wisdom. Owners of this personality are natural leaders, possessing a long-term vision and the ability to face the most difficult challenges without fear.",
                        secretReport: {
                            strengths: "Overwhelming charisma, exceptional courage, and the ability to protect those you love with all your might.",
                            challenges: "You may sometimes tend toward excessive control or quick anger when things don't go as planned.",
                            insight: "Your true strength lies in curbing your fire and using it for warmth rather than burning."
                        }
                    },
                    {
                        id: "phoenix",
                        name: "Phoenix",
                        rarity: "Very Rare",
                        image: "assets/images/phoenix.jpg",
                        description: "You are a symbol of renewal and hope. You have an amazing ability to rise from the ashes stronger than before.",
                        article: "The Phoenix never dies, but is born anew. Owners of this personality possess amazing psychological resilience, and are able to turn pain into fuel for creativity and success.",
                        secretReport: {
                            strengths: "Inexhaustible optimism, ability to self-heal, and inspiring others with your success story.",
                            challenges: "You may consume yourself in giving to others until you burn out completely before your new cycle begins.",
                            insight: "Remember that you don't always have to burn to prove your existence; calm light lasts longer."
                        }
                    },
                    {
                        id: "unicorn",
                        name: "Pure Unicorn",
                        rarity: "Rare",
                        image: "assets/images/unicorn.jpg",
                        description: "You are the embodiment of purity and kindness. You possess an innocent spirit that always aims to spread goodness and beauty.",
                        article: "The unicorn is a symbol of purity and healing. Owners of this personality are a balm for the wounds of others, possessing a pure intuition and the ability to see beauty in the simplest things.",
                        secretReport: {
                            strengths: "Absolute honesty, ability for deep empathy, and a pure intention that attracts people to you.",
                            challenges: "Your extreme sensitivity may make you vulnerable to wounds from the harsh world around you.",
                            insight: "The purity of your heart is the strongest shield you own, do not let the world change your essence."
                        }
                    },
                    {
                        id: "sphinx",
                        name: "Mysterious Sphinx",
                        rarity: "Mythical",
                        image: "assets/images/sphinx.jpg",
                        description: "You are the guardian of secrets and wisdom. You possess an analytical mind that sees behind the curtain and solves the most complex riddles.",
                        article: "The Sphinx represents the balance between physical strength and sharp intelligence. Owners of this personality are silent thinkers, observing the world accurately and only speaking when they possess the truth.",
                        secretReport: {
                            strengths: "Sharp intelligence, ability to read humans, and long patience in waiting for the right moment.",
                            challenges: "Your tendency toward isolation and mystery may make it difficult for others to get close to you or understand you.",
                            insight: "Sharing part of your secrets may open doors of friendship you didn't expect."
                        }
                    },
                    {
                        id: "kraken",
                        name: "Great Kraken",
                        rarity: "Very Rare",
                        image: "assets/images/kraken.jpg",
                        description: "You are the power of the mysterious depths. You possess wide influence and the ability to control things from behind the scenes.",
                        article: "The Kraken is the master of the dark oceans. Owners of this personality possess a complex and deep personality, preferring to work in silence and their impact appears suddenly and with enormous power.",
                        secretReport: {
                            strengths: "Strategic planning, giant willpower, and the ability to manage major crises.",
                            challenges: "You may tend toward excessive mystery which may turn into a desire for hidden control.",
                            insight: "The depths are beautiful, but don't forget to come to the surface sometimes to enjoy the sunlight."
                        }
                    },
                    {
                        id: "owl_of_athena",
                        name: "Owl of Athena",
                        rarity: "Rare",
                        image: "assets/images/owl_of_athena.jpg",
                        description: "You are a symbol of wisdom and knowledge. You see in the dark what others fail to see in broad daylight.",
                        article: "The Owl of Athena always accompanied the goddess of wisdom. Owners of this personality are truth seekers, valuing science and logic and possessing a piercing insight.",
                        secretReport: {
                            strengths: "High focus, ability to learn quickly, and wisdom far beyond your age.",
                            challenges: "Your tendency toward dry logic may make you neglect the emotional side in your relationships.",
                            insight: "True wisdom is that which combines the intelligence of the mind and the mercy of the heart."
                        }
                    },
                    {
                        id: "centaur",
                        name: "Wise Centaur",
                        rarity: "Rare",
                        image: "assets/images/centaur.jpg",
                        description: "You are a symbol of balance between mind and physical strength. You possess innate wisdom and a free spirit.",
                        article: "The Centaur represents the wild and wise side of human nature. Owners of this personality are natural strategists, valuing freedom and logic.",
                        secretReport: {
                            strengths: "Logical thinking, ability to endure, and a philosophical view of life.",
                            challenges: "You may find it difficult to commit to strict rules that limit your freedom.",
                            insight: "Your balance is the secret of your strength, don't let one side overshadow the other."
                        }
                    },
                    {
                        id: "cerberus",
                        name: "Cerberus the Guardian",
                        rarity: "Very Rare",
                        image: "assets/images/cerberus.jpg",
                        description: "You are the loyal protector and impenetrable shield. You possess constant vigilance and the ability to protect what is precious.",
                        article: "Cerberus is the great guardian of the gates. Owners of this personality possess unwavering loyalty and the ability to detect dangers before they occur.",
                        secretReport: {
                            strengths: "Absolute loyalty, high alertness, and the ability to protect those you love.",
                            challenges: "You may be overly protective or find it difficult to trust strangers.",
                            insight: "Protection doesn't always mean harshness; sometimes gentleness is the strongest defense."
                        }
                    },
                    {
                        id: "faun",
                        name: "Natural Faun",
                        rarity: "Common",
                        image: "assets/images/faun.jpg",
                        description: "You are the spirit of nature and joy. You possess the ability to enjoy life and spread happiness around you.",
                        article: "The Faun represents the joyful and nature-connected side. Owners of this personality are social people, loving music, art, and living in the moment.",
                        secretReport: {
                            strengths: "Cheerful spirit, deep connection with nature, and ability to adapt socially.",
                            challenges: "You may tend toward excessive spontaneity which may lead to neglecting serious responsibilities.",
                            insight: "Joy is necessary, but a little seriousness helps you achieve your big dreams."
                        }
                    },
                    {
                        id: "golem",
                        name: "Rocky Golem",
                        rarity: "Rare",
                        image: "assets/images/golem.jpg",
                        description: "You are a symbol of stability and solidity. You possess a will of stone and the ability to endure the most difficult circumstances.",
                        article: "The Golem is the creature made of earth, representing steadfastness. Owners of this personality are dependable people, patient and calm.",
                        secretReport: {
                            strengths: "Patience of Job, psychological strength, and keeping promises no matter the cost.",
                            challenges: "You may find it difficult to express your feelings or adapt to rapid changes.",
                            insight: "Even stone can grow flowers; don't fear showing your gentle side."
                        }
                    },
                    {
                        id: "hydra",
                        name: "Regenerating Hydra",
                        rarity: "Mythical",
                        image: "assets/images/hydra.jpg",
                        description: "You are a symbol of persistence and multiplicity. Every challenge you face, you emerge with more ideas and solutions.",
                        article: "The Hydra is a creature that grows two heads whenever one is cut off. Owners of this personality are very persistent people who never know surrender.",
                        secretReport: {
                            strengths: "Unwavering persistence, multiple talents, and the ability to recover quickly from failure.",
                            challenges: "You may scatter yourself in many directions at once.",
                            insight: "Focusing all your heads on one goal will make you unstoppable."
                        }
                    },
                    {
                        id: "kitsune",
                        name: "Cunning Kitsune",
                        rarity: "Very Rare",
                        image: "assets/images/kitsune.jpg",
                        description: "You are a symbol of adaptive intelligence and magic. You possess the ability to change your form and style according to the situation.",
                        article: "The Kitsune is the legendary Japanese fox. Owners of this personality are very intelligent, possessing mysterious charm and the ability to persuade.",
                        secretReport: {
                            strengths: "Social intelligence, ability to persuade, and high flexibility in thinking.",
                            challenges: "Others may find it difficult to know your true face or genuine intentions.",
                            insight: "Intelligence is a gift, use it to build bridges not just to deceive passersby."
                        }
                    },
                    {
                        id: "pegasus",
                        name: "Winged Pegasus",
                        rarity: "Rare",
                        image: "assets/images/pegasus.jpg",
                        description: "You are a symbol of freedom and inspiration. You possess a spirit that soars above difficulties and always seeks the distant horizon.",
                        article: "Pegasus is the winged horse that represents imagination. Owners of this personality are dreamers, possessing positive energy and a desire for exploration.",
                        secretReport: {
                            strengths: "Vast imagination, positive energy, and constant desire for growth and freedom.",
                            challenges: "You may find it difficult to deal with material reality and daily constraints.",
                            insight: "Your wings carry you to the sky, but your hooves keep you grounded; care for both."
                        }
                    },
                    {
                        id: "simurgh",
                        name: "Wise Simurgh",
                        rarity: "Mythical",
                        image: "assets/images/simurgh.jpg",
                        description: "You are a symbol of perfection and comprehensive knowledge. You possess a complete vision of the universe and understand the interconnection of things.",
                        article: "The Simurgh is the legendary Persian bird that possesses the knowledge of all ages. Owners of this personality are wise, seeking spiritual and intellectual perfection.",
                        secretReport: {
                            strengths: "Vast knowledge, inner peace, and the ability to give wise advice.",
                            challenges: "You may tend toward excessive perfectionism which may make you feel disappointed by reality.",
                            insight: "Perfection is a journey not a destination; enjoy the path with all it contains."
                        }
                    },
                    {
                        id: "siren",
                        name: "Enchanting Siren",
                        rarity: "Very Rare",
                        image: "assets/images/siren.jpg",
                        description: "You are a symbol of attraction and deep intuition. You possess an enchanting effect on those around you and the ability to understand emotions.",
                        article: "The Siren is the sea creature with an irresistible voice. Owners of this personality are attractive people, possessing strong intuition and deep understanding of human nature.",
                        secretReport: {
                            strengths: "Natural attraction, strong intuition, and deep understanding of emotions.",
                            challenges: "You may use your influence to emotionally control others unintentionally.",
                            insight: "Your magic is a trust, use it to uplift others and guide them."
                        }
                    },
                    {
                        id: "valkyrie",
                        name: "Warrior Valkyrie",
                        rarity: "Mythical",
                        image: "assets/images/valkyrie.jpg",
                        description: "You are a symbol of honor and choice. You possess the courage of warriors and the ability to make momentous decisions.",
                        article: "The Valkyries are the chosen of heroes in Norse mythology. Owners of this personality are brave people who value honor and justice.",
                        secretReport: {
                            strengths: "Unparalleled courage, integrity, and the ability to lead others toward victory.",
                            challenges: "You may be too strict with yourself and others in applying your standards.",
                            insight: "The true hero knows when to put down his sword and show mercy."
                        }
                    }
                ]
            }
        ]
    }
};
