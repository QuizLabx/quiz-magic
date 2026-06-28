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
                image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800",
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
                        image: "https://images.unsplash.com/photo-1577493322601-3ae7ee26f8b9?auto=format&fit=crop&q=80&w=800",
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
                        image: "https://images.unsplash.com/photo-1635273051937-603094060871?auto=format&fit=crop&q=80&w=800",
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
                        image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800",
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
                        image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&q=80&w=800",
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
                        image: "https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&q=80&w=800",
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
                        image: "https://images.unsplash.com/photo-1543531331-1f4f62ad354a?auto=format&fit=crop&q=80&w=800",
                        description: "أنت رمز الحكمة والمعرفة. ترى في الظلام ما يعجز الآخرون عن رؤيته في وضح النهار.",
                        article: "بومة أثينا كانت ترافق آلهة الحكمة دائماً. أصحاب هذه الشخصية هم باحثون عن الحقيقة، يقدرون العلم والمنطق ويمتلكون بصيرة نافذة.",
                        secretReport: {
                            strengths: "تركيز عالٍ، قدرة على التعلم السريع، وحكمة تسبق سنك بكثير.",
                            challenges: "ميلك للمنطق الجاف قد يجعلك تهمل الجانب العاطفي في علاقاتك.",
                            insight: "الحكمة الحقيقية هي التي تجمع بين ذكاء العقل ورحمة القلب."
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
        footerDesc: "The most accurate psychological quiz platform in the Arab world.",
        quizzes: [
            {
                id: "mythical-creature",
                title: "Mythical Creature Test",
                badge: "Most Accurate",
                image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800",
                description: "An advanced psychological analysis linking your traits to ancient creature legends.",
                questions: [
                    { id: 1, text: "I feel more comfortable when I am alone with my thoughts.", trait: "mystery", type: "likert" },
                    { id: 2, text: "I always tend to take the leadership role in groups.", trait: "leadership", type: "likert" },
                    { id: 3, text: "I care about helping others even at the expense of my own comfort.", trait: "altruism", type: "likert" },
                    { 
                        id: 4, 
                        text: "Which of these portals attracts you most to enter?", 
                        type: "visual",
                        options: [
                            { label: "Portal of Light", image: "assets/images/quiz/q4_opt1.jpg", trait: "purity", value: 5 },
                            { label: "Portal of Mystery", image: "assets/images/quiz/q4_opt2.jpg", trait: "mystery", value: 5 },
                            { label: "Portal of Power", image: "assets/images/quiz/q4_opt3.jpg", trait: "power", value: 5 },
                            { label: "Portal of Nature", image: "assets/images/quiz/q4_opt4.jpg", trait: "nature", value: 5 }
                        ]
                    },
                    { id: 5, text: "I prefer planning everything in advance rather than spontaneity.", trait: "strategy", type: "likert" },
                    { id: 6, text: "I have a great ability to adapt to sudden changes.", trait: "adaptation", type: "likert" },
                    { id: 7, text: "I always look for the deep meaning behind things.", trait: "knowledge", type: "likert" },
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
                    { id: 10, text: "I trust my intuition more than logic in decision making.", trait: "intuition", type: "likert" },
                    { id: 11, text: "I love being surrounded by beauty and art in my life.", trait: "elegance", type: "likert" },
                    { 
                        id: 12, 
                        text: "Which of these scenes gives you a greater sense of peace?", 
                        type: "visual",
                        options: [
                            { label: "Mountain Peak", image: "assets/images/quiz/q12_opt1.jpg", trait: "ambition", value: 5 },
                            { label: "Old Library", image: "assets/images/quiz/q12_opt2.jpg", trait: "wisdom", value: 5 },
                            { label: "Secret Garden", image: "assets/images/quiz/q12_opt3.jpg", trait: "purity", value: 5 },
                            { label: "Deserted Beach", image: "assets/images/quiz/q12_opt4.jpg", trait: "mystery", value: 5 }
                        ]
                    },
                    { id: 13, text: "I enjoy discussing philosophical and complex ideas.", trait: "analysis", type: "likert" },
                    { id: 14, text: "I am a very patient person when dealing with long-term problems.", trait: "persistence", type: "likert" },
                    { id: 15, text: "I care a lot about my reputation and how others perceive me.", trait: "potential", type: "likert" },
                    { 
                        id: 16, 
                        text: "Which magical symbol do you choose to be your lucky charm?", 
                        type: "visual",
                        options: [
                            { label: "The Eye", image: "assets/images/quiz/q16_opt1.jpg", trait: "knowledge", value: 5 },
                            { label: "The Dagger", image: "assets/images/quiz/q16_opt2.jpg", trait: "protection", value: 5 },
                            { label: "The Chalice", image: "assets/images/quiz/q16_opt3.jpg", trait: "altruism", value: 5 },
                            { label: "The Key", image: "assets/images/quiz/q16_opt4.jpg", trait: "curiosity", value: 5 }
                        ]
                    },
                    { id: 17, text: "I prefer working in a team rather than working alone.", trait: "social", type: "likert" },
                    { id: 18, text: "I am always honest with myself even if the truth is painful.", trait: "honesty", type: "likert" },
                    { id: 19, text: "I have a lot of energy that drives me to try new things always.", trait: "energy", type: "likert" },
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
                    { id: 21, text: "I am a very emotional person and am moved by human stories.", trait: "nature", type: "likert" },
                    { id: 22, text: "I love challenge and competition to reach the top.", trait: "leadership", type: "likert" },
                    { id: 23, text: "I tend to maintain old traditions and values.", trait: "tradition", type: "likert" },
                    { 
                        id: 24, 
                        text: "Which gemstone do you feel has an energy that attracts you?", 
                        type: "visual",
                        options: [
                            { label: "Ruby", image: "assets/images/quiz/q24_opt1.jpg", trait: "intensity", value: 5 },
                            { label: "Blue Diamond", image: "assets/images/quiz/q24_opt2.jpg", trait: "logic", value: 5 },
                            { label: "Emerald", image: "assets/images/quiz/q24_opt3.jpg", trait: "nature", value: 5 },
                            { label: "Amethyst", image: "assets/images/quiz/q24_opt4.jpg", trait: "intuition", value: 5 }
                        ]
                    },
                    { id: 25, text: "I can control my temper even in the most difficult situations.", trait: "composure", type: "likert" },
                    { id: 26, text: "I care about small details that others might not notice.", trait: "analysis", type: "likert" },
                    { id: 27, text: "I am an optimistic person and always see the bright side.", trait: "potential", type: "likert" },
                    { 
                        id: 28, 
                        text: "Which sky do you prefer to contemplate at night?", 
                        type: "visual",
                        options: [
                            { label: "Aurora", image: "assets/images/quiz/q28_opt1.jpg", trait: "potential", value: 5 },
                            { label: "Total Eclipse", image: "assets/images/quiz/q28_opt2.jpg", trait: "mystery", value: 5 },
                            { label: "Nebula", image: "assets/images/quiz/q28_opt3.jpg", trait: "exploration", value: 5 },
                            { label: "Silent Lightning", image: "assets/images/quiz/q28_opt4.jpg", trait: "energy", value: 5 }
                        ]
                    },
                    { id: 29, text: "I prefer staying in one place over frequent traveling.", trait: "stability", type: "likert" },
                    { id: 30, text: "I feel that I have a great mission to fulfill in life.", trait: "ambition", type: "likert" },
                    { id: 31, text: "I love mystery and do not reveal all my cards to others.", trait: "mystery", type: "likert" },
                    { 
                        id: 32, 
                        text: "Which mythical transport do you choose for your next journey?", 
                        type: "visual",
                        options: [
                            { label: "Flying Ship", image: "assets/images/quiz/q32_opt1.jpg", trait: "exploration", value: 5 },
                            { label: "Light Carriage", image: "assets/images/quiz/q32_opt2.jpg", trait: "purity", value: 5 },
                            { label: "Flying Carpet", image: "assets/images/quiz/q32_opt3.jpg", trait: "wisdom", value: 5 },
                            { label: "Baby Dragon", image: "assets/images/quiz/q32_opt4.jpg", trait: "protection", value: 5 }
                        ]
                    },
                    { id: 33, text: "I am a very practical person and do not waste my time on dreams.", trait: "logic", type: "likert" },
                    { id: 34, text: "I always look for perfection in everything I do.", trait: "perfection", type: "likert" },
                    { id: 35, text: "I am very loyal to my friends and family.", trait: "social", type: "likert" },
                    { 
                        id: 36, 
                        text: "What weapon will you choose to defend your kingdom?", 
                        type: "visual",
                        options: [
                            { label: "Light Sword", image: "assets/images/quiz/q36_opt1.jpg", trait: "honesty", value: 5 },
                            { label: "Shadow Shield", image: "assets/images/quiz/q36_opt2.jpg", trait: "protection", value: 5 },
                            { label: "Star Bow", image: "assets/images/quiz/q36_opt3.jpg", trait: "strategy", value: 5 },
                            { label: "Sage Staff", image: "assets/images/quiz/q36_opt4.jpg", trait: "knowledge", value: 5 }
                        ]
                    },
                    { id: 37, text: "I like to be unique and different from others.", trait: "potential", type: "likert" },
                    { id: 38, text: "I am a very flexible person in my thinking.", trait: "adaptation", type: "likert" },
                    { id: 39, text: "I believe that true strength comes from within.", trait: "power", type: "likert" },
                    { 
                        id: 40, 
                        text: "What ending do you prefer to conclude your life story?", 
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
                        image: "https://images.unsplash.com/photo-1577493322601-3ae7ee26f8b9?auto=format&fit=crop&q=80&w=800",
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
                        image: "https://images.unsplash.com/photo-1635273051937-603094060871?auto=format&fit=crop&q=80&w=800",
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
                        image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800",
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
                        image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&q=80&w=800",
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
                        image: "https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&q=80&w=800",
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
                        image: "https://images.unsplash.com/photo-1543531331-1f4f62ad354a?auto=format&fit=crop&q=80&w=800",
                        description: "You are a symbol of wisdom and knowledge. You see in the dark what others fail to see in broad daylight.",
                        article: "The Owl of Athena always accompanied the goddess of wisdom. Owners of this personality are truth seekers, valuing science and logic and possessing a piercing insight.",
                        secretReport: {
                            strengths: "High focus, ability to learn quickly, and wisdom far beyond your age.",
                            challenges: "Your tendency toward dry logic may make you neglect the emotional side in your relationships.",
                            insight: "True wisdom is that which combines the intelligence of the mind and the mercy of the heart."
                        }
                    }
                ]
            }
        ]
    }
};
