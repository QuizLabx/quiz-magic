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
                    { id: 1, text: "أشعر بالراحة أكثر عندما أكون وحيداً مع أفكاري.", trait: "mystery", axis: "mystery", type: "likert" },
                    { id: 2, text: "أميل دائماً لتولي دور القيادة في المجموعات.", trait: "leadership", axis: "willpower", type: "likert" },
                    { id: 3, text: "أهتم بمساعدة الآخرين حتى لو كان ذلك على حساب راحتي.", trait: "altruism", axis: "empathy", type: "likert" },
                    { 
                        id: 4, 
                        text: "أي من هذه البوابات تجذبك أكثر للدخول إليها؟", 
                        type: "visual",
                        options: [
                            { label: "بوابة النور", image: "assets/images/quiz/q4_opt1.jpg", trait: "purity", axis: "empathy", value: 5 },
                            { label: "بوابة الغموض", image: "assets/images/quiz/q4_opt2.jpg", trait: "mystery", axis: "mystery", value: 5 },
                            { label: "بوابة القوة", image: "assets/images/quiz/q4_opt3.jpg", trait: "power", axis: "willpower", value: 5 },
                            { label: "بوابة الطبيعة", image: "assets/images/quiz/q4_opt4.jpg", trait: "nature", axis: "energy", value: 5 }
                        ]
                    },
                    { id: 5, text: "أفضل التخطيط لكل شيء مسبقاً بدلاً من العفوية.", trait: "strategy", axis: "strategy", type: "likert" },
                    { id: 6, text: "لدي قدرة كبيرة على التكيف مع التغييرات المفاجئة.", trait: "adaptation", axis: "energy", type: "likert" },
                    { id: 7, text: "أبحث دائماً عن المعنى العميق وراء الأشياء.", trait: "knowledge", axis: "intelligence", type: "likert" },
                    { 
                        id: 8, 
                        text: "ما هو العنصر الذي تشعر أنه يمثل طاقتك الداخلية؟", 
                        type: "visual",
                        options: [
                            { label: "النار", image: "assets/images/quiz/q8_opt1.jpg", trait: "intensity", axis: "energy", value: 5 },
                            { label: "المياه", image: "assets/images/quiz/q8_opt2.jpg", trait: "composure", axis: "strategy", value: 5 },
                            { label: "الأرض", image: "assets/images/quiz/q8_opt3.jpg", trait: "stability", axis: "willpower", value: 5 },
                            { label: "الرياح", image: "assets/images/quiz/q8_opt4.jpg", trait: "exploration", axis: "intelligence", value: 5 }
                        ]
                    },
                    { id: 9, text: "أجد صعوبة في مسامحة الأشخاص الذين أخطأوا في حقي.", trait: "persistence", axis: "willpower", type: "likert" },
                    { id: 10, text: "أثق بحدسي أكثر من المنطق في اتخاذ القرارات.", trait: "intuition", axis: "mystery", type: "likert" },
                    { id: 11, text: "أحب أن أكون محاطاً بالجمال والفن في حياتي.", trait: "elegance", axis: "empathy", type: "likert" },
                    { 
                        id: 12, 
                        text: "أي من هذه المشاهد يمنحك شعوراً أكبر بالسلام؟", 
                        type: "visual",
                        options: [
                            { label: "قمة جبل", image: "assets/images/quiz/q12_opt1.jpg", trait: "ambition", axis: "willpower", value: 5 },
                            { label: "مكتبة قديمة", image: "assets/images/quiz/q12_opt2.jpg", trait: "wisdom", axis: "intelligence", value: 5 },
                            { label: "حديقة سرية", image: "assets/images/quiz/q12_opt3.jpg", trait: "purity", axis: "empathy", value: 5 },
                            { label: "شاطئ مهجور", image: "assets/images/quiz/q12_opt4.jpg", trait: "mystery", axis: "mystery", value: 5 }
                        ]
                    },
                    { id: 13, text: "أستمتع بمناقشة الأفكار الفلسفية والمعقدة.", trait: "analysis", axis: "intelligence", type: "likert" },
                    { id: 14, text: "أنا شخص صبور جداً عند التعامل مع المشاكل الطويلة.", trait: "persistence", axis: "strategy", type: "likert" },
                    { id: 15, text: "أهتم كثيراً بسمعتي وكيف يطالعني الآخرون.", trait: "potential", axis: "strategy", type: "likert" },
                    { 
                        id: 16, 
                        text: "أي رمز سحري تختار ليكون تميمة حظك؟", 
                        type: "visual",
                        options: [
                            { label: "العين", image: "assets/images/quiz/q16_opt1.jpg", trait: "knowledge", axis: "intelligence", value: 5 },
                            { label: "الخنجر", image: "assets/images/quiz/q16_opt2.jpg", trait: "protection", axis: "willpower", value: 5 },
                            { label: "الكأس", image: "assets/images/quiz/q16_opt3.jpg", trait: "altruism", axis: "empathy", value: 5 },
                            { label: "المفتاح", image: "assets/images/quiz/q16_opt4.jpg", trait: "curiosity", axis: "mystery", value: 5 }
                        ]
                    },
                    { id: 17, text: "أفضل العمل ضمن فريق بدلاً من العمل منفرداً.", trait: "social", axis: "empathy", type: "likert" },
                    { id: 18, text: "أنا دائماً صادق مع نفسي حتى لو كان الحلم مؤلماً.", trait: "honesty", axis: "willpower", type: "likert" },
                    { id: 19, text: "أمتلك طاقة كبيرة تدفعني لتجربة أشياء جديدة دائماً.", trait: "energy", axis: "energy", type: "likert" },
                    { 
                        id: 20, 
                        text: "ما هو الحيوان الذي تشعر بارتباط روحي معه؟", 
                        type: "visual",
                        options: [
                            { label: "الذئب", image: "assets/images/quiz/q20_opt1.jpg", trait: "social", axis: "empathy", value: 5 },
                            { label: "الأفعى", image: "assets/images/quiz/q20_opt2.jpg", trait: "strategy", axis: "strategy", value: 5 },
                            { label: "النسر", image: "assets/images/quiz/q20_opt3.jpg", trait: "exploration", axis: "energy", value: 5 },
                            { label: "الفراشة", image: "assets/images/quiz/q20_opt4.jpg", trait: "adaptation", axis: "energy", value: 5 }
                        ]
                    },
                    { id: 21, text: "أنا شخص عاطفي جداً وتؤثر فيّ القصص الإنسانية.", trait: "nature", axis: "empathy", type: "likert" },
                    { id: 22, text: "أحب التحدي والمنافسة للوصول إلى القمة.", trait: "leadership", axis: "willpower", type: "likert" },
                    { id: 23, text: "أميل للحفاظ على التقاليد والقيم القديمة.", trait: "tradition", axis: "strategy", type: "likert" },
                    { 
                        id: 24, 
                        text: "أي جوهرة تشعر أنها تملك طاقة تجذبك؟", 
                        type: "visual",
                        options: [
                            { label: "ياقوت أحمر", image: "assets/images/quiz/q24_opt1.jpg", trait: "intensity", axis: "energy", value: 5 },
                            { label: "ماس أزرق", image: "assets/images/quiz/q24_opt2.jpg", trait: "logic", axis: "intelligence", value: 5 },
                            { label: "زمرد أخضر", image: "assets/images/quiz/q24_opt3.jpg", trait: "nature", axis: "empathy", value: 5 },
                            { label: "جمشت أرجواني", image: "assets/images/quiz/q24_opt4.jpg", trait: "intuition", axis: "mystery", value: 5 }
                        ]
                    },
                    { id: 25, text: "أستطيع التحكم في أعصابي حتى في أصعب المواقف.", trait: "composure", axis: "strategy", type: "likert" },
                    { id: 26, text: "أهتم بالتفاصيل الصغيرة التي قد لا يلاحظها الآخرون.", trait: "analysis", axis: "intelligence", type: "likert" },
                    { id: 27, text: "أنا شخص متفائل وأرى الجانب المشرق دائماً.", trait: "potential", axis: "energy", type: "likert" },
                    { 
                        id: 28, 
                        text: "أي سماء تفضل أن تتأملها في الليل؟", 
                        type: "visual",
                        options: [
                            { label: "شفق قطبي", image: "assets/images/quiz/q28_opt1.jpg", trait: "potential", axis: "energy", value: 5 },
                            { label: "كسوف كلي", image: "assets/images/quiz/q28_opt2.jpg", trait: "mystery", axis: "mystery", value: 5 },
                            { label: "سديم فضائي", image: "assets/images/quiz/q28_opt3.jpg", trait: "exploration", axis: "intelligence", value: 5 },
                            { label: "برق صامت", image: "assets/images/quiz/q28_opt4.jpg", trait: "energy", axis: "energy", value: 5 }
                        ]
                    },
                    { id: 29, text: "أفضل الاستقرار في مكان واحد على كثرة الترحال.", trait: "stability", axis: "strategy", type: "likert" },
                    { id: 30, text: "أشعر أن لدي رسالة كبيرة يجب أن أؤديها في الحياة.", trait: "ambition", axis: "willpower", type: "likert" },
                    { id: 31, text: "أحب الغموض ولا أكشف كل أوراقي للآخرين.", trait: "mystery", axis: "mystery", type: "likert" },
                    { 
                        id: 32, 
                        text: "أي وسيلة نقل أسطورية تختار لرحلتك القادمة؟", 
                        type: "visual",
                        options: [
                            { label: "سفينة طائرة", image: "assets/images/quiz/q32_opt1.jpg", trait: "exploration", axis: "energy", value: 5 },
                            { label: "عربة نور", image: "assets/images/quiz/q32_opt2.jpg", trait: "purity", axis: "empathy", value: 5 },
                            { label: "بساط ريحي", image: "assets/images/quiz/q32_opt3.jpg", trait: "wisdom", axis: "intelligence", value: 5 },
                            { label: "تنين صغير", image: "assets/images/quiz/q32_opt4.jpg", trait: "protection", axis: "willpower", value: 5 }
                        ]
                    },
                    { id: 33, text: "أنا شخص عملي جداً ولا أضيع وقتي في الأحلام.", trait: "logic", axis: "strategy", type: "likert" },
                    { id: 34, text: "أبحث دائماً عن المثالية في كل ما أفعل.", trait: "perfection", axis: "strategy", type: "likert" },
                    { id: 35, text: "أنا مخلص جداً لأصدقائي وعائلتي.", trait: "social", axis: "empathy", type: "likert" },
                    { 
                        id: 36, 
                        text: "ما هو السلاح الذي ستختاره للدفاع عن مملكتك؟", 
                        type: "visual",
                        options: [
                            { label: "سيف الضوء", image: "assets/images/quiz/q36_opt1.jpg", trait: "honesty", axis: "willpower", value: 5 },
                            { label: "درع الظل", image: "assets/images/quiz/q36_opt2.jpg", trait: "protection", axis: "strategy", value: 5 },
                            { label: "قوس النجوم", image: "assets/images/quiz/q36_opt3.jpg", trait: "strategy", axis: "intelligence", value: 5 },
                            { label: "عصا الحكيم", image: "assets/images/quiz/q36_opt4.jpg", trait: "knowledge", axis: "intelligence", value: 5 }
                        ]
                    },
                    { id: 37, text: "أحب أن أكون متميزاً ومختلفاً عن الآخرين.", trait: "potential", axis: "energy", type: "likert" },
                    { id: 38, text: "أنا شخص مرن جداً في تفكيري.", trait: "adaptation", axis: "energy", type: "likert" },
                    { id: 39, text: "أؤمن أن القوة الحقيقية تأتي من الداخل.", trait: "power", axis: "willpower", type: "likert" },
                    { 
                        id: 40, 
                        text: "أي نهاية تفضل أن تختم بها قصة حياتك؟", 
                        type: "visual",
                        options: [
                            { label: "عرش ذهبي", image: "assets/images/quiz/q40_opt1.jpg", trait: "leadership", axis: "willpower", value: 5 },
                            { label: "كوخ هادئ", image: "assets/images/quiz/q40_opt2.jpg", trait: "nature", axis: "empathy", value: 5 },
                            { label: "رحلة أبدية", image: "assets/images/quiz/q40_opt3.jpg", trait: "curiosity", axis: "energy", value: 5 },
                            { label: "اتحاد كوني", image: "assets/images/quiz/q40_opt4.jpg", trait: "mystery", axis: "mystery", value: 5 }
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
                        narrative: "في أعماق الجبال القديمة، حيث تلامس القمم السماء، ولدت روحك. أنت اللهب الذي لا ينطفئ، والقائد الذي لا ينحني. يرى العالم فيك هيبة الملوك وشجاعة المحاربين.",
                        advice: "تذكر أن القوة الحقيقية تكمن في كبح جماح نارك واستخدامها للتدفئة بدلاً من الحرق.",
                        badge: "المفكر الأسطوري",
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
                        narrative: "من رماد التجارب القاسية، تشرق روحك من جديد بجناحين من نور. أنت لا تعرف الهزيمة، فكل نهاية بالنسبة لك هي بداية لقصة أعظم وأكثر إشراقاً.",
                        advice: "تذكر أنك لست مضطراً للاحتراق دائماً لتثبت وجودك؛ النور الهادئ يدوم أطول.",
                        badge: "الروح المتجددة",
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
                        narrative: "في غابة مسحورة لم تطأها قدم بشر، تسكن روحك النقية. أنت النور الذي يطرد الظلام بابتسامة، والبلسم الذي يشفي جروح القلوب المتعبة.",
                        advice: "نقاء قلبك هو أقوى درع تملكه، لا تسمح للعالم أن يغير جوهرك.",
                        badge: "حارس النقاء",
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
                        narrative: "بين رمال الزمن وأسرار الحضارات، تقف روحك صامدة. أنت اللغز الذي لا يحل، والعين التي ترى ما لا يراه الآخرون. صمتك حكمة وكلامك حقيقة.",
                        advice: "مشاركة جزء من أسرارك قد يفتح لك أبواباً من الصداقة لم تكن تتوقعها.",
                        badge: "سيد الألغاز",
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
                        narrative: "في المحيطات المظلمة حيث لا يصل النور، تتحرك روحك بعظمة وهدوء. أنت القوة التي لا يستهان بها، والمخطط الذي يدير الدفة من خلف الستار.",
                        advice: "الأعماق جميلة، لكن لا تنسَ الصعود للسطح أحياناً لتستمتع بنور الشمس.",
                        badge: "سيد الأعماق",
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
                        narrative: "في سكون الليل وتحت ضوء النجوم، تحلق روحك باحثة عن الحقيقة. أنت البصيرة النافذة التي تحول الجهل إلى نور، والمنطق الذي لا يخطئ.",
                        advice: "الحكمة الحقيقية هي التي تجمع بين ذكاء العقل ورحمة القلب.",
                        badge: "عين الحقيقة",
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
                        narrative: "بين الغابات والسهول، تجري روحك بحرية لا تعرف القيود. أنت الحكيم الذي يحمل القوس، والمفكر الذي لا يخشى المواجهة. توازنك هو سر عظمتك.",
                        advice: "توازنك هو سر قوتك، لا تترك جانباً يطغى على الآخر.",
                        badge: "المحارب الحكيم",
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
                        narrative: "على بوابات ما هو مقدس، تقف روحك حارساً لا يغفل. ولاؤك هو عهدك، وقوتك هي درع لمن تحب. أنت اليقظة التي لا تعرف التعب.",
                        advice: "الحماية لا تعني دائماً القسوة؛ أحياناً يكون اللين هو أقوى دفاع.",
                        badge: "الدرع المنيع",
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
                        narrative: "مع أنغام الناي ورقصات الطبيعة، تتمايل روحك بمرح. أنت البهجة في يوم غائم، والعفوية التي تعيد الحياة للأشياء الجامدة من حولك.",
                        advice: "المرح ضروري، لكن القليل من الجدية يساعدك على تحقيق أحلامك الكبرى.",
                        badge: "روح المرح",
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
                        narrative: "من طين الأرض وقوة الجبال، صُيغت روحك الصابرة. أنت الجبل الذي لا تهزه الرياح، والسند الذي يعتمد عليه الجميع في أوقات العواصف.",
                        advice: "حتى الصخر يمكن أن ينبت منه الزهر؛ لا تخشَ إظهار جانبك اللين.",
                        badge: "الجبل الصامد",
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
                        narrative: "في مواجهة الصعاب، تتضاعف قوتك. أنت الروح التي لا تستسلم، فكل ضربة تتلقاها تزيدك قوة وذكاءً. أنت المثابرة في أبهى صورها.",
                        advice: "تركيز كل رؤوسك على هدف واحد سيجعلك لا تقهر.",
                        badge: "المثابر الذي لا يقهر",
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
                        narrative: "بألف وجه ووجه، وبذكاء يسبق الريح، تتلاعب روحك بالواقع. أنت السحر والغموض، والقدرة المذهلة على التكيف مع أي عالم تدخل إليه.",
                        advice: "الذكاء موهبة، استخدمها لبناء الجسور وليس فقط لخداع العابرين.",
                        badge: "سيد التكيف",
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
                        narrative: "بجناحين من خيال، تحلق روحك فوق قيود الواقع. أنت الإلهام الذي يزور المبدعين، والحرية التي لا يمكن حبسها في قفص. عالمك هو الأفق.",
                        advice: "جناحاك يحملانك للسماء، لكن حوافرك هي التي تثبتك على الأرض؛ اعتني بكليهما.",
                        badge: "الملهم الطائر",
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
                        narrative: "من قمة جبل 'قاف' الأسطوري، تطل روحك على حكمة العصور. أنت الجامع بين الأضداد، والروح التي وصلت لدرجة من السلام والكمال يطمح إليها الجميع.",
                        advice: "المثالية هدف جميل، لكن تقبل النقص البشري هو قمة الحكمة.",
                        badge: "الحكيم المطلق",
                        article: "السيمرغ هو الطائر الأسطوري الفارسي الذي يملك علم كل العصور. أصحاب هذه الشخصية هم حكماء، يسعون للكمال الروحي والمعرفي.",
                        secretReport: {
                            strengths: "معرفة واسعة، هدوء نفسي، وقدرة على تقديم النصيحة الحكيمة.",
                            challenges: "قد تميل للمثالية الزائدة التي قد تجعلك تشعر بخيبة أمل من الواقع.",
                            insight: "المثالية هدف جميل، لكن تقبل النقص البشري هو قمة الحكمة."
                        }
                    },
                    {
                        id: "valkyrie",
                        name: "الفالكيري المحاربة",
                        rarity: "نادر جداً",
                        image: "assets/images/valkyrie.jpg",
                        description: "أنت رمز للشرف والشجاعة. تمتلك روحاً مقاتلة تدافع عن الحق وتختار طريق الأبطال.",
                        narrative: "في ساحات الشرف، تلمع روحك كالسيف الصقيل. أنت الشجاعة التي لا تهاب، والعدل الذي لا يميل. اختيارك دائماً هو طريق الأبطال مهما كان صعباً.",
                        advice: "الشجاعة ليست غياب الخوف، بل هي المضي قدماً رغم وجوده.",
                        badge: "حارس الشرف",
                        article: "الفالكيري هن محاربات الأساطير اللواتي يخترن الأبطال. أصحاب هذه الشخصية هم أشخاص ذوو مبادئ قوية، يدافعون عن الحق ويمتلكون شجاعة فطرية.",
                        secretReport: {
                            strengths: "مبادئ راسخة، شجاعة في قول الحق، وقدرة على إلهام الآخرين بالبطولة.",
                            challenges: "قد تكون صارماً جداً مع نفسك ومع الآخرين في اتباع القواعد والمبادئ.",
                            insight: "الشجاعة ليست غياب الخوف، بل هي المضي قدماً رغم وجوده."
                        }
                    },
                    {
                        id: "centaur",
                        name: "القنطور الحكيم",
                        rarity: "نادر",
                        image: "assets/images/centaur.jpg",
                        description: "أنت رمز للتوازن بين العقل والقوة البدنية. تمتلك حكمة فطرية وروحاً حرة.",
                        narrative: "بين الغابات والسهول، تجري روحك بحرية لا تعرف القيود. أنت الحكيم الذي يحمل القوس، والمفكر الذي لا يخشى المواجهة. توازنك هو سر عظمتك.",
                        advice: "توازنك هو سر قوتك، لا تترك جانباً يطغى على الآخر.",
                        badge: "المحارب الحكيم",
                        article: "القنطور يمثل الجانب البري والحكيم في الطبيعة البشرية. أصحاب هذه الشخصية هم استراتيجيون بالفطرة، يقدرون الحرية والمنطق.",
                        secretReport: {
                            strengths: "تفكير منطقي، قدرة على التحمل، ورؤية فلسفية للحياة.",
                            challenges: "قد تجد صعوبة في الالتزام بالقواعد الصارمة التي تحد من حريتك.",
                            insight: "توازنك هو سر قوتك، لا تترك جانباً يطغى على الآخر."
                        }
                    }
                ]
            }
        ]
    },
    en: {
        title: "QuizMagic | World of Mythical Quizzes",
        heroTitle: "Discover Your True Mythical Essence",
        heroSubtitle: "A journey into your subconscious to reveal the ancient powers within",
        footerDesc: "The most accurate psychological quiz platform in the world.",
        quizzes: [
            {
                id: "mythical-creature",
                title: "Mythical Creature Quiz",
                badge: "Most Accurate",
                image: "assets/images/dragon.jpg",
                description: "Advanced psychological analysis mapping your traits to ancient legends.",
                questions: [
                    { id: 1, text: "I feel more comfortable being alone with my thoughts.", trait: "mystery", axis: "mystery", type: "likert" },
                    { id: 2, text: "I always tend to take the leadership role in groups.", trait: "leadership", axis: "willpower", type: "likert" },
                    { id: 3, text: "I care about helping others even at the expense of my comfort.", trait: "altruism", axis: "empathy", type: "likert" },
                    { 
                        id: 4, 
                        text: "Which of these portals attracts you most to enter?", 
                        type: "visual",
                        options: [
                            { label: "Portal of Light", image: "assets/images/quiz/q4_opt1.jpg", trait: "purity", axis: "empathy", value: 5 },
                            { label: "Portal of Mystery", image: "assets/images/quiz/q4_opt2.jpg", trait: "mystery", axis: "mystery", value: 5 },
                            { label: "Portal of Power", image: "assets/images/quiz/q4_opt3.jpg", trait: "power", axis: "willpower", value: 5 },
                            { label: "Portal of Nature", image: "assets/images/quiz/q4_opt4.jpg", trait: "nature", axis: "energy", value: 5 }
                        ]
                    },
                    { id: 5, text: "I prefer planning everything in advance rather than spontaneity.", trait: "strategy", axis: "strategy", type: "likert" },
                    { id: 6, text: "I have a great ability to adapt to sudden changes.", trait: "adaptation", axis: "energy", type: "likert" },
                    { id: 7, text: "I always look for the deeper meaning behind things.", trait: "knowledge", axis: "intelligence", type: "likert" },
                    { 
                        id: 8, 
                        text: "What element do you feel represents your inner energy?", 
                        type: "visual",
                        options: [
                            { label: "Fire", image: "assets/images/quiz/q8_opt1.jpg", trait: "intensity", axis: "energy", value: 5 },
                            { label: "Water", image: "assets/images/quiz/q8_opt2.jpg", trait: "composure", axis: "strategy", value: 5 },
                            { label: "Earth", image: "assets/images/quiz/q8_opt3.jpg", trait: "stability", axis: "willpower", value: 5 },
                            { label: "Wind", image: "assets/images/quiz/q8_opt4.jpg", trait: "exploration", axis: "intelligence", value: 5 }
                        ]
                    },
                    { id: 9, text: "I find it difficult to forgive people who have wronged me.", trait: "persistence", axis: "willpower", type: "likert" },
                    { id: 10, text: "I trust my intuition more than logic in making decisions.", trait: "intuition", axis: "mystery", type: "likert" },
                    { id: 11, text: "I love being surrounded by beauty and art in my life.", trait: "elegance", axis: "empathy", type: "likert" },
                    { 
                        id: 12, 
                        text: "Which of these scenes gives you a greater sense of peace?", 
                        type: "visual",
                        options: [
                            { label: "Mountain Peak", image: "assets/images/quiz/q12_opt1.jpg", trait: "ambition", axis: "willpower", value: 5 },
                            { label: "Old Library", image: "assets/images/quiz/q12_opt2.jpg", trait: "wisdom", axis: "intelligence", value: 5 },
                            { label: "Secret Garden", image: "assets/images/quiz/q12_opt3.jpg", trait: "purity", axis: "empathy", value: 5 },
                            { label: "Deserted Beach", image: "assets/images/quiz/q12_opt4.jpg", trait: "mystery", axis: "mystery", value: 5 }
                        ]
                    },
                    { id: 13, text: "I enjoy discussing philosophical and complex ideas.", trait: "analysis", axis: "intelligence", type: "likert" },
                    { id: 14, text: "I am a very patient person when dealing with long-term problems.", trait: "persistence", axis: "strategy", type: "likert" },
                    { id: 15, text: "I care a lot about my reputation and how others view me.", trait: "potential", axis: "strategy", type: "likert" },
                    { 
                        id: 16, 
                        text: "Which magical symbol would you choose as your lucky charm?", 
                        type: "visual",
                        options: [
                            { label: "The Eye", image: "assets/images/quiz/q16_opt1.jpg", trait: "knowledge", axis: "intelligence", value: 5 },
                            { label: "The Dagger", image: "assets/images/quiz/q16_opt2.jpg", trait: "protection", axis: "willpower", value: 5 },
                            { label: "The Cup", image: "assets/images/quiz/q16_opt3.jpg", trait: "altruism", axis: "empathy", value: 5 },
                            { label: "The Key", image: "assets/images/quiz/q16_opt4.jpg", trait: "curiosity", axis: "mystery", value: 5 }
                        ]
                    },
                    { id: 17, text: "I prefer working in a team rather than working alone.", trait: "social", axis: "empathy", type: "likert" },
                    { id: 18, text: "I am always honest with myself even if the dream is painful.", trait: "honesty", axis: "willpower", type: "likert" },
                    { id: 19, text: "I have a lot of energy that pushes me to try new things always.", trait: "energy", axis: "energy", type: "likert" },
                    { 
                        id: 20, 
                        text: "Which animal do you feel a spiritual connection with?", 
                        type: "visual",
                        options: [
                            { label: "Wolf", image: "assets/images/quiz/q20_opt1.jpg", trait: "social", axis: "empathy", value: 5 },
                            { label: "Snake", image: "assets/images/quiz/q20_opt2.jpg", trait: "strategy", axis: "strategy", value: 5 },
                            { label: "Eagle", image: "assets/images/quiz/q20_opt3.jpg", trait: "exploration", axis: "energy", value: 5 },
                            { label: "Butterfly", image: "assets/images/quiz/q20_opt4.jpg", trait: "adaptation", axis: "energy", value: 5 }
                        ]
                    },
                    { id: 21, text: "I am a very emotional person and human stories affect me.", trait: "nature", axis: "empathy", type: "likert" },
                    { id: 22, text: "I love challenge and competition to reach the top.", trait: "leadership", axis: "willpower", type: "likert" },
                    { id: 23, text: "I tend to maintain old traditions and values.", trait: "tradition", axis: "strategy", type: "likert" },
                    { 
                        id: 24, 
                        text: "Which gemstone do you feel has an energy that attracts you?", 
                        type: "visual",
                        options: [
                            { label: "Ruby", image: "assets/images/quiz/q24_opt1.jpg", trait: "intensity", axis: "energy", value: 5 },
                            { label: "Blue Diamond", image: "assets/images/quiz/q24_opt2.jpg", trait: "logic", axis: "intelligence", value: 5 },
                            { label: "Emerald", image: "assets/images/quiz/q24_opt3.jpg", trait: "nature", axis: "empathy", value: 5 },
                            { label: "Amethyst", image: "assets/images/quiz/q24_opt4.jpg", trait: "intuition", axis: "mystery", value: 5 }
                        ]
                    },
                    { id: 25, text: "I can control my temper even in the most difficult situations.", trait: "composure", axis: "strategy", type: "likert" },
                    { id: 26, text: "I care about small details that others might not notice.", trait: "analysis", axis: "intelligence", type: "likert" },
                    { id: 27, text: "I am an optimistic person and always see the bright side.", trait: "potential", axis: "energy", type: "likert" },
                    { 
                        id: 28, 
                        text: "Which sky do you prefer to contemplate at night?", 
                        type: "visual",
                        options: [
                            { label: "Aurora", image: "assets/images/quiz/q28_opt1.jpg", trait: "potential", axis: "energy", value: 5 },
                            { label: "Total Eclipse", image: "assets/images/quiz/q28_opt2.jpg", trait: "mystery", axis: "mystery", value: 5 },
                            { label: "Nebula", image: "assets/images/quiz/q28_opt3.jpg", trait: "exploration", axis: "intelligence", value: 5 },
                            { label: "Silent Lightning", image: "assets/images/quiz/q28_opt4.jpg", trait: "energy", axis: "energy", value: 5 }
                        ]
                    },
                    { id: 29, text: "I prefer staying in one place over frequent traveling.", trait: "stability", axis: "strategy", type: "likert" },
                    { id: 30, text: "I feel that I have a great mission to fulfill in life.", trait: "ambition", axis: "willpower", type: "likert" },
                    { id: 31, text: "I love mystery and don't reveal all my cards to others.", trait: "mystery", axis: "mystery", type: "likert" },
                    { 
                        id: 32, 
                        text: "Which mythical transport would you choose for your next journey?", 
                        type: "visual",
                        options: [
                            { label: "Flying Ship", image: "assets/images/quiz/q32_opt1.jpg", trait: "energy", axis: "energy", value: 5 },
                            { label: "Chariot of Light", image: "assets/images/quiz/q32_opt2.jpg", trait: "purity", axis: "empathy", value: 5 },
                            { label: "Flying Carpet", image: "assets/images/quiz/q32_opt3.jpg", trait: "wisdom", axis: "intelligence", value: 5 },
                            { label: "Small Dragon", image: "assets/images/quiz/q32_opt4.jpg", trait: "protection", axis: "willpower", value: 5 }
                        ]
                    },
                    { id: 33, text: "I am a very practical person and don't waste time on dreams.", trait: "logic", axis: "strategy", type: "likert" },
                    { id: 34, text: "I always look for perfection in everything I do.", trait: "perfection", axis: "strategy", type: "likert" },
                    { id: 35, text: "I am very loyal to my friends and family.", trait: "social", axis: "empathy", type: "likert" },
                    { 
                        id: 36, 
                        text: "What weapon would you choose to defend your kingdom?", 
                        type: "visual",
                        options: [
                            { label: "Sword of Light", image: "assets/images/quiz/q36_opt1.jpg", trait: "honesty", axis: "willpower", value: 5 },
                            { label: "Shield of Shadow", image: "assets/images/quiz/q36_opt2.jpg", trait: "protection", axis: "strategy", value: 5 },
                            { label: "Bow of Stars", image: "assets/images/quiz/q36_opt3.jpg", trait: "strategy", axis: "intelligence", value: 5 },
                            { label: "Sage's Staff", image: "assets/images/quiz/q36_opt4.jpg", trait: "knowledge", axis: "intelligence", value: 5 }
                        ]
                    },
                    { id: 37, text: "I like being unique and different from others.", trait: "potential", axis: "energy", type: "likert" },
                    { id: 38, text: "I am a very flexible person in my thinking.", trait: "adaptation", axis: "energy", type: "likert" },
                    { id: 39, text: "I believe true power comes from within.", trait: "power", axis: "willpower", type: "likert" },
                    { 
                        id: 40, 
                        text: "What ending would you prefer to conclude your life story?", 
                        type: "visual",
                        options: [
                            { label: "Golden Throne", image: "assets/images/quiz/q40_opt1.jpg", trait: "leadership", axis: "willpower", value: 5 },
                            { label: "Quiet Cottage", image: "assets/images/quiz/q40_opt2.jpg", trait: "nature", axis: "empathy", value: 5 },
                            { label: "Eternal Journey", image: "assets/images/quiz/q40_opt3.jpg", trait: "curiosity", axis: "energy", value: 5 },
                            { label: "Cosmic Union", image: "assets/images/quiz/q40_opt4.jpg", trait: "mystery", axis: "mystery", value: 5 }
                        ]
                    }
                ],
                results: [
                    {
                        id: "dragon",
                        name: "The Great Dragon",
                        rarity: "Legendary",
                        image: "assets/images/dragon.jpg",
                        description: "You are the embodiment of power and leadership. You possess an indomitable fiery spirit and ambition that exceeds the clouds.",
                        narrative: "In the depths of ancient mountains, where peaks touch the sky, your soul was born. You are the flame that never goes out, the leader who never bows. The world sees in you the prestige of kings and the courage of warriors.",
                        advice: "Remember that true power lies in restraining your fire and using it for warmth instead of burning.",
                        badge: "Mythical Thinker",
                        article: "The dragon is considered in all cultures a symbol of absolute power and ancient wisdom. Owners of this personality are natural leaders, possessing long-term vision and the ability to face the most difficult challenges without fear.",
                        secretReport: {
                            strengths: "Overwhelming charisma, exceptional courage, and the ability to protect those you love with all your might.",
                            challenges: "You may sometimes tend toward excessive control or quick anger when things don't go as planned.",
                            insight: "Your true power lies in restraining your fire and using it for warmth instead of burning."
                        }
                    },
                    {
                        id: "phoenix",
                        name: "The Phoenix",
                        rarity: "Very Rare",
                        image: "assets/images/phoenix.jpg",
                        description: "You are a symbol of renewal and hope. You have an amazing ability to rise from the ashes stronger than before.",
                        narrative: "From the ashes of harsh experiences, your soul shines anew with wings of light. You know no defeat, for every end to you is a beginning of a greater and brighter story.",
                        advice: "Remember that you don't always have to burn to prove your existence; a calm light lasts longer.",
                        badge: "Renewed Spirit",
                        article: "The phoenix never dies, but is born again. Owners of this personality possess amazing psychological resilience, and are able to transform pain into fuel for creativity and success.",
                        secretReport: {
                            strengths: "Inexhaustible optimism, ability for self-healing, and inspiring others with your success story.",
                            challenges: "You may consume yourself in giving to others until you burn out completely before starting your new cycle.",
                            insight: "Remember that you don't always have to burn to prove your existence; a calm light lasts longer."
                        }
                    },
                    {
                        id: "unicorn",
                        name: "The Pure Unicorn",
                        rarity: "Rare",
                        image: "assets/images/unicorn.jpg",
                        description: "You are the embodiment of purity and kindness. You possess a pure soul that always aims to spread goodness and beauty.",
                        narrative: "In an enchanted forest where no human foot has stepped, your pure soul dwells. You are the light that dispels darkness with a smile, the balm that heals the wounds of tired hearts.",
                        advice: "The purity of your heart is the strongest shield you own, don't let the world change your essence.",
                        badge: "Guardian of Purity",
                        article: "The unicorn is a symbol of purity and healing. Owners of this personality are a balm for others' wounds, possessing pure intuition and the ability to see beauty in the simplest things.",
                        secretReport: {
                            strengths: "Absolute honesty, ability for deep empathy, and a pure intention that attracts people to you.",
                            challenges: "Your excessive sensitivity may make you vulnerable to wounds from the harsh world around you.",
                            insight: "The purity of your heart is the strongest shield you own, don't let the world change your essence."
                        }
                    },
                    {
                        id: "sphinx",
                        name: "The Mysterious Sphinx",
                        rarity: "Legendary",
                        image: "assets/images/sphinx.jpg",
                        description: "You are the guardian of secrets and wisdom. You possess an analytical mind that sees behind the curtain and solves the most complex puzzles.",
                        narrative: "Between the sands of time and the secrets of civilizations, your soul stands firm. You are the riddle that cannot be solved, the eye that sees what others do not. Your silence is wisdom and your words are truth.",
                        advice: "Sharing part of your secrets may open doors of friendship you didn't expect.",
                        badge: "Master of Riddles",
                        article: "The Sphinx is one of history's most enigmatic mythical creatures, appearing in Egyptian and Greek mythologies. In ancient Egypt, it was seen as a guardian of tombs and temples, with a human head and a lion's body, symbolizing the union of wisdom and strength. In Greek mythology, it posed riddles to travelers; those who failed to solve them met their doom. The Sphinx represents the guardian of deep secrets and the ability to see beyond appearances.",
                        secretReport: {
                            strengths: "Sharp intelligence, ability to read people, and long patience in waiting for the right moment.",
                            challenges: "Your tendency toward isolation and mystery may make others find it difficult to get close to you or understand you.",
                            insight: "Sharing part of your secrets may open doors of friendship you didn't expect."
                        }
                    },
                    {
                        id: "kraken",
                        name: "The Great Kraken",
                        rarity: "Very Rare",
                        image: "assets/images/kraken.jpg",
                        description: "You are the power of the mysterious depths. You possess wide influence and the ability to control things from behind the scenes.",
                        narrative: "In the dark oceans where light does not reach, your soul moves with majesty and calm. You are the power not to be underestimated, the planner who manages the helm from behind the curtain.",
                        advice: "The depths are beautiful, but don't forget to come to the surface sometimes to enjoy the sunlight.",
                        badge: "Master of Depths",
                        article: "The Kraken is the master of the dark oceans. Owners of this personality possess a complex and deep personality, preferring to work in silence and their influence appears suddenly and with enormous power.",
                        secretReport: {
                            strengths: "Strategic planning, powerful willpower, and ability to manage major crises.",
                            challenges: "You may tend toward excessive mystery which may turn into a desire for hidden control.",
                            insight: "The depths are beautiful, but don't forget to come to the surface sometimes to enjoy the sunlight."
                        }
                    },
                    {
                        id: "owl_of_athena",
                        name: "The Owl of Athena",
                        rarity: "Rare",
                        image: "assets/images/owl_of_athena.jpg",
                        description: "You are a symbol of wisdom and knowledge. You see in the dark what others fail to see in broad daylight.",
                        narrative: "In the silence of the night and under the starlight, your soul flies seeking the truth. You are the penetrating insight that transforms ignorance into light, the logic that never fails.",
                        advice: "True wisdom is that which combines mind intelligence and heart mercy.",
                        badge: "Eye of Truth",
                        article: "The Owl of Athena always accompanied the goddess of wisdom. Owners of this personality are truth seekers, valuing science and logic and possessing penetrating insight.",
                        secretReport: {
                            strengths: "High focus, ability for rapid learning, and wisdom that far precedes your age.",
                            challenges: "Your tendency toward dry logic may make you neglect the emotional side in your relationships.",
                            insight: "True wisdom is that which combines mind intelligence and heart mercy."
                        }
                    },
                    {
                        id: "centaur",
                        name: "The Wise Centaur",
                        rarity: "Rare",
                        image: "assets/images/centaur.jpg",
                        description: "You are a symbol of balance between mind and physical strength. You possess innate wisdom and a free spirit.",
                        narrative: "Between forests and plains, your soul runs with a freedom that knows no bounds. You are the wise one who carries the bow, the thinker who does not fear confrontation. Your balance is your greatness.",
                        advice: "Your balance is your strength, don't let one side dominate the other.",
                        badge: "Wise Warrior",
                        article: "The Centaur represents the wild and wise side of human nature. Owners of this personality are natural strategists, valuing freedom and logic.",
                        secretReport: {
                            strengths: "Logical thinking, endurance, and a philosophical vision of life.",
                            challenges: "You may find it difficult to commit to strict rules that limit your freedom.",
                            insight: "Your balance is your strength, don't let one side dominate the other."
                        }
                    },
                    {
                        id: "cerberus",
                        name: "Cerberus the Guardian",
                        rarity: "Very Rare",
                        image: "assets/images/cerberus.jpg",
                        description: "You are the loyal protector and the impenetrable shield. You possess constant vigilance and the ability to protect what is precious.",
                        narrative: "On the gates of what is sacred, your soul stands as a guardian who never slumbers. Your loyalty is your covenant, and your strength is a shield for those you love. You are the vigilance that knows no fatigue.",
                        advice: "Protection doesn't always mean harshness; sometimes softness is the strongest defense.",
                        badge: "Impenetrable Shield",
                        article: "Cerberus is the legendary three-headed dog that guards the gates of the Underworld in Greek mythology. His task was to prevent the dead from leaving and the living from entering without permission. Cerberus symbolizes total vigilance, absolute loyalty, and the ability to monitor multiple aspects at once. Psychologically, he represents the protective side of a personality that sets firm boundaries to guard their inner world and loved ones.",
                        secretReport: {
                            strengths: "Absolute loyalty, high vigilance, and ability to protect those you love.",
                            challenges: "You may be overprotective or find it difficult to trust strangers.",
                            insight: "Protection doesn't always mean harshness; sometimes softness is the strongest defense."
                        }
                    },
                    {
                        id: "faun",
                        name: "The Natural Faun",
                        rarity: "Common",
                        image: "assets/images/faun.jpg",
                        description: "You are the spirit of nature and fun. You have the ability to enjoy life and spread joy around you.",
                        narrative: "With flute melodies and nature dances, your soul sways with fun. You are the joy on a cloudy day, the spontaneity that brings life back to the static things around you.",
                        advice: "Fun is necessary, but a little seriousness helps you achieve your big dreams.",
                        badge: "Spirit of Fun",
                        article: "The Faun is a mythical creature from Roman mythology, combining human and goat features. Known as the spirit of forests and fields, he is associated with music, dance, and joy. The Faun represents the innate and spontaneous side of humans, a close connection with nature, and living in the present away from the complexities of civilization. He is a symbol of spiritual freedom and the ability to find happiness in the simplest details of life.",
                        secretReport: {
                            strengths: "Cheerful spirit, deep connection with nature, and social adaptability.",
                            challenges: "You may tend toward excessive spontaneity which may lead to neglecting serious responsibilities.",
                            insight: "Fun is necessary, but a little seriousness helps you achieve your big dreams."
                        }
                    },
                    {
                        id: "golem",
                        name: "The Stone Golem",
                        rarity: "Rare",
                        image: "assets/images/golem.jpg",
                        description: "You are a symbol of stability and solidity. You possess a will of stone and the ability to endure the most difficult conditions.",
                        narrative: "From the earth's clay and the mountains' strength, your patient soul was forged. You are the mountain that the winds do not shake, the support that everyone relies on in times of storms.",
                        advice: "Even stone can grow flowers; don't fear showing your soft side.",
                        badge: "Solid Mountain",
                        article: "The Golem is the being made of earth, representing stability. Owners of this personality are reliable people, patient and calm.",
                        secretReport: {
                            strengths: "Patience of Job, psychological solidity, and keeping promises no matter the cost.",
                            challenges: "You may find it difficult to express your feelings or adapt to rapid changes.",
                            insight: "Even stone can grow flowers; don't fear showing your soft side."
                        }
                    },
                    {
                        id: "hydra",
                        name: "The Renewing Hydra",
                        rarity: "Legendary",
                        image: "assets/images/hydra.jpg",
                        description: "You are a symbol of persistence and plurality. Every time you face a challenge, you come out of it with more ideas and solutions.",
                        narrative: "In the face of hardships, your strength multiplies. You are the soul that does not give up, for every blow you receive increases your strength and intelligence. You are persistence in its finest form.",
                        advice: "Focusing all your heads on one goal will make you invincible.",
                        badge: "Invincible Persister",
                        article: "The Hydra is a being that grows two heads every time one is cut. Owners of this personality are very persistent people, they never know surrender.",
                        secretReport: {
                            strengths: "Unwavering persistence, multiple talents, and ability for rapid recovery from failure.",
                            challenges: "You may scatter yourself in many directions at once.",
                            insight: "Focusing all your heads on one goal will make you invincible."
                        }
                    },
                    {
                        id: "kitsune",
                        name: "The Cunning Kitsune",
                        rarity: "Very Rare",
                        image: "assets/images/kitsune.jpg",
                        description: "You are a symbol of adaptive intelligence and magic. You possess the ability to change your shape and style according to the situation.",
                        narrative: "With a thousand faces, and intelligence that precedes the wind, your soul plays with reality. You are magic and mystery, and the amazing ability to adapt to any world you enter.",
                        advice: "Intelligence is a talent, use it to build bridges and not just to deceive passersby.",
                        badge: "Master of Adaptation",
                        article: "The Kitsune is the legendary Japanese fox. Owners of this personality are very intelligent, possessing a mysterious charisma and persuasive ability.",
                        secretReport: {
                            strengths: "Social intelligence, persuasive ability, and high flexibility in thinking.",
                            challenges: "Others may find it difficult to know your true face or sincere intentions.",
                            insight: "Intelligence is a talent, use it to build bridges and not just to deceive passersby."
                        }
                    },
                    {
                        id: "pegasus",
                        name: "The Winged Pegasus",
                        rarity: "Rare",
                        image: "assets/images/pegasus.jpg",
                        description: "You are a symbol of freedom and inspiration. You possess a soul that flies above difficulties and always seeks the distant horizon.",
                        narrative: "With wings of imagination, your soul flies above the constraints of reality. You are the inspiration that visits creators, the freedom that cannot be caged. Your world is the horizon.",
                        advice: "Your wings carry you to the sky, but your hooves are what ground you; take care of both.",
                        badge: "Flying Inspirer",
                        article: "Pegasus is the winged horse representing imagination. Owners of this personality are dreamers, possessing positive energy and a desire for exploration.",
                        secretReport: {
                            strengths: "Wide imagination, positive energy, and a constant desire for development and freedom.",
                            challenges: "You may find it difficult to deal with physical reality and daily constraints.",
                            insight: "Your wings carry you to the sky, but your hooves are what ground you; take care of both."
                        }
                    },
                    {
                        id: "simurgh",
                        name: "The Wise Simurgh",
                        rarity: "Legendary",
                        image: "assets/images/simurgh.jpg",
                        description: "You are a symbol of perfection and comprehensive knowledge. You possess a comprehensive vision of the universe and understand the interconnectedness of things.",
                        narrative: "From the peak of the legendary 'Qaf' mountain, your soul overlooks the wisdom of the ages. You are the gatherer of opposites, the soul that reached a degree of peace and perfection that everyone aspires to.",
                        advice: "Perfection is a beautiful goal, but accepting human imperfection is the peak of wisdom.",
                        badge: "Absolute Sage",
                        article: "The Simurgh is the Persian legendary bird that possesses the knowledge of all ages. Owners of this personality are sages, seeking spiritual and cognitive perfection.",
                        secretReport: {
                            strengths: "Wide knowledge, psychological calm, and ability to provide wise advice.",
                            challenges: "You may tend toward excessive perfectionism which may make you feel disappointed with reality.",
                            insight: "Perfection is a beautiful goal, but accepting human imperfection is the peak of wisdom."
                        }
                    },
                    {
                        id: "valkyrie",
                        name: "The Valkyrie Warrior",
                        rarity: "Very Rare",
                        image: "assets/images/valkyrie.jpg",
                        description: "You are a symbol of honor and courage. You possess a fighting spirit that defends the right and chooses the path of heroes.",
                        narrative: "In the arenas of honor, your soul shines like a polished sword. You are the courage that does not fear, the justice that does not lean. Your choice is always the path of heroes no matter how difficult.",
                        advice: "Courage is not the absence of fear, but moving forward despite its presence.",
                        badge: "Guardian of Honor",
                        article: "Valkyries are the mythic warriors who choose heroes. Owners of this personality are people with strong principles, defending the right and possessing innate courage.",
                        secretReport: {
                            strengths: "Firm principles, courage in speaking the truth, and ability to inspire others with heroism.",
                            challenges: "You may be very strict with yourself and others in following rules and principles.",
                            insight: "Courage is not the absence of fear, but moving forward despite its presence."
                        }
                    }
                ]
            }
        ]
    }
};
