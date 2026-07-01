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
narrative: "في لحظة الاحتراق الأخيرة، عندما ظن العالم أنك انتهيت، أشرقت من رمادك روح العنقاء. لستَ مجرد ناجٍ من العواصف، بل أنت العاصفة نفسها التي تتجدد. كل خسارة علّمتك درساً، كل فشل بنى فيك حكمة، وكل دموع سقتها أرض روحك لتزهر من جديد.\n\nأنت لا تعرف معنى الاستسلام، فالكلمة غير موجودة في قاموسك. عندما يسقط الآخرون، أنت تنهض أقوى. عندما يُغلق باب، تفتح نافذة. عندما يظلم العالم، تصبح أنت النور.\n\nلكن تذكر: حتى العنقاء تحتاج للراحة بين دورات التجديد. لا تحرق نفسك باستمرار إثباتاً لقوتك، فالنور الهادئ المستدام أقوى من اللهب العنيف الزائل.",
advice: "تذكر أنك لست مضطراً للاحتراق دائماً لتثبت وجودك؛ النور الهادئ يدوم أطول.",
badge: "الروح المتجددة",
article: "العنقاء (Phoenix) هي واحدة من أكثر الكائنات الأسطورية انتشاراً في ثقافات العالم القديم. ظهرت أولاً في الأساطير المصرية القديمة تحت اسم 'بينو' (Benu)، حيث كانت مرتبطة بعبادة الشمس والبعث بعد الموت. انتقلت الأسطورة لاحقاً إلى الحضارة اليونانية، حيث وصفها هيرودوت بأنها طائر مذهل يعيش في الصحراء العربية لمدة 500 عام قبل أن يحرق نفسه ويعود للحياة من رماده.\n\nفي الثقافة الصينية، تُعرف العنقاء باسم 'فنغ هوانغ' (Fenghuang)، وهي رمز للإمبراطورة والفضائل النبيلة. أما في الثقافة اليابانية، فتُسمى 'هـ-أو' (Hō-ō) وتظهر فقط في أوقات السلام والازدهار.\n\n**التحليل النفسي:**\nأصحاب شخصية العنقاء يمتلكون ما يُسمى في علم النفس 'المرونة النفسية' (Psychological Resilience)، وهي القدرة على التعافي من الصدمات والنمو من خلالها. الدراسات الحديثة في علم النفس الإيجابي تُظهر أن هؤلاء الأشخاص يمتلكون:\n\n• **نمو ما بعد الصدمة** (Post-Traumatic Growth): لا يكتفون بالعودة لنقطة الصفر، بل يتطورون\n• **تحويل الألم إلى وقود**: يستخدمون التجارب الصعبة كحافز للإبداع\n• **التفاؤل الواقعي**: يرون الجانب المشرق دون إنكار الواقع\n• **القدرة على التجديد**: يعرفون متى ينهون مرحلة ويبدأون أخرى\n\nلكن هذه القوة لها ثمن: قد يميلون للاحتراق الذاتي (Burnout) في محاولة مستمرة للتجدد، أو يقعون في فخ 'إدمان الأدرينالين' بالبحث المستمر عن التحديات.",
secretReport: {
strengths: "• **المرونة النفسية الاستثنائية**: قدرتك على التعافي من الصدمات تفوق المتوسط بـ 3 أضعاف\n• **التحويل الإبداعي للألم**: تحول التجارب الصعبة إلى فن، كتابة، أو مشاريع ملهمة\n• **القيادة في الأزمات**: عندما يفقد الآخرون الأمل، تصبح مصدر إلهامهم\n• **التفاؤل الواقعي**: ترى الإمكانيات حيث يرى الآخرون المستحيل",
challenges: "• **متلازمة الاحتراق**: ميلك للتجديد المستمر قد يؤدي لإرهاق جسدي ونفسي\n• **صعوبة الاستقرار**: قد تجد صعوبة في الالتزام بعلاقات أو مشاريع طويلة المدى\n• **توقع التجديد من الآخرين**: قد تحبط عندما لا يتغير الآخرون بسرعة مثلك\n• **إدمان الدراما**: لا شعورياً، قد تجذب نفسك لمواقف صعبة لتشعر بأنك 'حي'",
growthPath: "**مسار التطور الشخصي:**\n1. تعلم 'الراحة الفعالة': التجديد لا يعني الحركة المستمرة\n2. ابنِ أنظمة دعم: لا تحاول النهوض من الرماد وحدك دائماً\n3. مارس 'الاستقرار الديناميكي': يمكن أن تتغير وتنمو دون أن تتخلى عن كل شيء\n4. طور 'الصبر الاستراتيجي': ليس كل شيء يحتاج لتجديد فوري",
relationships: "**في العلاقات:**\n• تحتاج شريكاً يفهم دوراتك الطبيعية في التجديد\n• قد تكون 'المنقذ' في العلاقات، احذر من إنقاذ من لا يريد الإنقاذ\n• أفضل التوافق: مع كائنات مستقرة (الجولم، القنطور) توازن تقلباتك\n• تجنب: العلاقات السامة التي تستنزف طاقتك المتجددة",
career: "**المسار المهني المثالي:**\n• ريادة الأعمال (خاصة في مجالات التجديد والتحول)\n• العلاج النفسي والاستشارات (لأنك تفهم الألم والتعافي)\n• الفنون الإبداعية (كتابة، موسيقى، فنون بصرية)\n• القيادة في المنظمات التي تمر بأزمات\n• تجنب: الوظائف الروتينية المتكررة التي تقتل روح التجديد فيك",
insight: "قوتك الحقيقية ليست في القدرة على النهوض من الرماد فحسب، بل في الحكمة التي تجمعها من كل دورة حياة. أنت لست طائراً يحترق، أنت حكمة تتجسد في كل ولادة جديدة."
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
narrative: "بين رمال الزمن وأسرار الحضارات، تقف روحك صامدة كتمثال أبو الهول. أنت اللغز الذي لا يحل، والعين التي ترى ما لا يراه الآخرون. صمتك حكمة وكلامك حقيقة.\n\nفي عالم يصرخ فيه الجميع ليجذب الانتباه، أنت تفضل المراقبة الصامتة. تزن كل كلمة قبل أن تنطقها، وتحلل كل موقف قبل أن تتفاعل معه. هذه ليست عزلة، بل هي استراتيجية حياة.\n\nلكن تذكر: الحكمة التي لا تُشارك تصبح عبئاً. أحياناً، كسر الصمت وفتح قلبك لشخص واحد يستحق الثقة، أقوى من حل ألف لغز.",
advice: "مشاركة جزء من أسرارك قد يفتح لك أبواباً من الصداقة لم تكن تتوقعها.",
badge: "سيد الألغاز",
article: "أبو الهول (Sphinx) هو واحد من أكثر الكائنات الأسطورية غموضاً في التاريخ، حيث ظهر في الأساطير المصرية واليونانية. في مصر القديمة، كان يُعتبر حارساً للمقابر والمعابد، برأس إنسان وجسد أسد، مما يرمز لاتحاد الحكمة والقوة. في الأساطير اليونانية، كان يطرح ألغازاً على المسافرين؛ ومن فشل في حلها كان مصيره الهلاك.\n\nأشهر لغز لأبو الهول اليوناني كان: 'ما هو الشيء الذي يمشي على أربع في الصباح، وعلى اثنتين في الظهر، وعلى ثلاث في المساء؟' الإجابة: الإنسان (طفلاً، شاباً، ثم عجوزاً).\n\n**التحليل النفسي:**\nأصحاب شخصية أبو الهول يمتلكون ما يُسمى في علم النفس 'الذكاء التحليلي' (Analytical Intelligence)، وهو القدرة على تفكيك المشكلات المعقدة إلى أجزاء صغيرة وحلها. الدراسات تُظهر أن هؤلاء الأشخاص يمتلكون:\n\n• **التفكير النقدي**: لا يقبلون المعلومات دون تحليل عميق\n• **الصبر الاستراتيجي**: ينتظرون اللحظة المناسبة للكشف عن الحقيقة\n• **القدرة على قراءة البشر**: يلاحظون التفاصيل الدقيقة في لغة الجسد والكلام\n• **الحكمة الصامتة**: يتحدثون فقط عندما يملكون شيئاً قيماً ليقولوه\n\nلكن هذه القوة لها ثمن: قد يميلون للعزلة الزائدة، أو يجدون صعوبة في الثقة بالآخرين، أو يقعون في فخ 'التحليل المفرط' (Analysis Paralysis) حيث يفكرون كثيراً ولا يتصرفون.",
secretReport: {
strengths: "• **الذكاء التحليلي الحاد**: قدرتك على تفكيك المشكلات المعقدة تفوق المتوسط بـ 4 أضعاف\n• **القراءة العميقة للبشر**: تلاحظ التفاصيل التي يفوتها 90% من الناس\n• **الصبر الاستراتيجي**: تنتظر اللحظة المناسبة بدلاً من التصرف باندفاع\n• **الحكمة الصامتة**: كلامك قليل لكنه قيم ومؤثر",
challenges: "• **العزلة الزائدة**: ميلك للصمت والغموض قد يجعل الآخرين يجدون صعوبة في التقرب منك\n• **التحليل المفرط**: قد تفكر كثيراً ولا تتصرف، مما يفوت عليك فرصاً مهمة\n• **صعوبة الثقة**: قد تجد صعوبة في فتح قلبك للآخرين حتى لمن يستحقون\n• **التوقعات العالية**: قد تحبط عندما لا يفهم الآخرون تفكيرك العميق",
growthPath: "**مسار التطور الشخصي:**\n1. مارس 'الانفتاح المدروس': شارك أفكارك مع شخص واحد تثق به أسبوعياً\n2. تعلم 'التصرف السريع': ليس كل قرار يحتاج تحليلاً عميقاً\n3. ابنِ 'جسور الثقة': ابدأ بمشاركات صغيرة وزد تدريجياً\n4. تقبل 'عدم الكمال': ليس كل شيء يحتاج لفهم كامل قبل التصرف",
relationships: "**في العلاقات:**\n• تحتاج شريكاً يحترم صمتك ويفهم حاجتك للوحدة أحياناً\n• قد تكون 'المستشار' في العلاقات، احذر من إعطاء النصائح دون طلب\n• أفضل التوافق: مع كائنات اجتماعية (الفون، الكيتسوني) تخرجك من عزلتك\n• تجنب: الأشخاص السطحيين الذين لا يقدرون عمقك الفكري",
career: "**المسار المهني المثالي:**\n• البحث العلمي والأكاديمي (لأنك تحب التحليل العميق)\n• الاستشارات الاستراتيجية (لأنك ترى ما لا يراه الآخرون)\n• الكتابة والتأليف (لأنك تعبر عن أفكارك المعقدة بشكل أفضل كتابة)\n• التحقيق والتحليل الجنائي\n• تجنب: الوظائف التي تتطلب تفاعلاً اجتماعياً مستمراً وسطحياً",
insight: "حكمتك الحقيقية ليست في حل الألغاز فحسب، بل في معرفة متى تشارك الإجابة ومتى تبقيها سراً. أنت لست لغزاً مغلقاً، أنت كتاب ينتظر القارئ المناسب."
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
narrative: "مع أنغام الناي ورقصات الطبيعة، تتمايل روحك بمرح. أنت البهجة في يوم غائم، والعفوية التي تعيد الحياة للأشياء الجامدة من حولك.\n\nفي عالم جاد جداً، أنت التذكير بأن الحياة يجب أن تُعاش لا أن تُحلل. ضحكتك معدية، وروحك المرحة تحول أي Gathering إلى احتفال. لا تحتاج سبباً للفرح، فالفرح هو حالتك الطبيعية.\n\nلكن تذكر: المرح وحده لا يبني مستقبلاً. أحياناً، تحتاج للجلوس بجدية والتخطيط لأحلامك الكبرى. التوازن بين المرح والمسؤولية هو سر نجاحك.",
advice: "المرح ضروري، لكن القليل من الجدية يساعدك على تحقيق أحلامك الكبرى.",
badge: "روح المرح",
article: "الفون (Faun) هو كائن أسطوري من الأساطير الرومانية، يجمع بين ميزات الإنسان والماعز. يُعرف بروح الغابات والحقول، وهو مرتبط بالموسيقى والرقص والفرح. يمثل الفون الجانب الفطري والعفوي من الإنسان، والارتباط الوثيق بالطبيعة، والعيش في اللحظة الحالية بعيداً عن تعقيدات الحضارة.\n\nفي الأساطير اليونانية، يُقابل الفون كائن 'بان' (Pan)، إله الرعاة والقطعان، الذي كان يعزف على الناي ويملأ الغابات بالموسيقى. كان يُعتقد أن صراخه المفاجئ يسبب ذعراً لا سبب له (ومن هنا جاءت كلمة 'panic').\n\n**التحليل النفسي:**\nأصحاب شخصية الفون يمتلكون ما يُسمى في علم النفس 'الانبساط الطبيعي' (Natural Extroversion)، وهو القدرة على الاستمتاع باللحظة الحالية والتواصل التلقائي مع الآخرين. الدراسات تُظهر أن هؤلاء الأشخاص يمتلكون:\n\n• **الذكاء الاجتماعي**: قدرة فطرية على الاندماج في أي مجموعة\n• **الإبداع العفوي**: يفكرون خارج الصندوق بشكل طبيعي\n• **المرونة العاطفية**: يتعافون بسرعة من المشاعر السلبية\n• **الارتباط بالطبيعة**: يجدون السلام وال inspiration في الأماكن الطبيعية\n\nلكن هذه القوة لها ثمن: قد يميلون للتسويف، أو يجدون صعوبة في الالتزام بالمسؤوليات الجادة، أو يقعون في فخ 'الهروب من الواقع' عبر المرح المستمر.",
secretReport: {
strengths: "• **الذكاء الاجتماعي الفطري**: قدرتك على الاندماج مع أي شخص تفوق المتوسط بـ 3 أضعاف\n• **الإبداع العفوي**: تولد أفكاراً مبتكرة بشكل طبيعي دون تخطيط\n• **المرونة العاطفية**: تتعافى من المشاعر السلبية بسرعة مذهلة\n• **الطاقة المعدية**: حضورك يرفع معنويات من حولك تلقائياً",
challenges: "• **التسويف المزمن**: ميلك للمتعة الفورية قد يؤجل مهامك المهمة\n• **صعوبة الالتزام**: قد تجد صعوبة في إكمال مشاريع طويلة المدى\n• **الهروب من الجدية**: أحياناً تستخدم المرح كآلية هروب من المشاكل الحقيقية\n• **السطحية العرضية**: قد تتجنب المحادثات العميقة لأنها 'جادة جداً'",
growthPath: "**مسار التطور الشخصي:**\n1. مارس 'المرح المنضبط': خصص وقتاً للعمل الجاد قبل المتعة\n2. استخدم 'قاعدة الدقيقتين': إذا كانت المهمة تأخذ أقل من دقيقتين، افعلها الآن\n3. ابنِ 'أنظمة المتابعة': استخدم تطبيقات التذكير لمتابعة مهامك\n4. تعلم 'العمق المؤقت': خصص 30 دقيقة يومياً للتفكير الجاد في أهدافك",
relationships: "**في العلاقات:**\n• تحتاج شريكاً يشاركك روحك المرحة لكنه يذكرك بالمسؤوليات أحياناً\n• قد تكون 'مهرج المجموعة'، احذر من أن يأخذك الآخرون على محمل الجد فقط في المرح\n• أفضل التوافق: مع كائنات جادة (الجولم، أبو الهول) توازن عفويتك\n• تجنب: الأشخاص السلبيين الذين يطفئون طاقتك الإيجابية",
career: "**المسار المهني المثالي:**\n• الفنون الترفيهية (موسيقى، مسرح، كوميديا)\n• التسويق والإعلان (لأنك تفهم ما يسعد الناس)\n• العمل مع الأطفال أو في مجالات الترفيه\n• ريادة الأعمال في مجالات الإبداع\n• تجنب: الوظائف المكتبية الروتينية التي تقتل روحك المرحة",
insight: "فرحك الحقيقي ليس في الهروب من الجدية، بل في إيجاد التوازن بين المرح والمسؤولية. أنت لست طفلاً أبدياً، أنت حكيم يعرف كيف يستمتع بالحياة بوعي."
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
id: "siren",
name: "الساحرة البحرية",
rarity: "نادر جداً",
image: "assets/images/siren.jpg",
description: "أنت رمز للجاذبية والحدس. تمتلك صوتاً يسحر العقول وقدرة على قراءة المشاعر.",
narrative: "من أعماق البحار الأسطورية، يصدح صوتك الساحر. أنت الجاذبية التي لا تُقاوم، والحدس الذي يرى ما لا يراه الآخرون.",
advice: "استخدم جاذبيتك لبناء علاقات حقيقية، وليس فقط للإغواء.",
badge: "ساحرة الأعماق",
article: "الساحرة البحرية هي كائن بحري أسطوري بصوت ساحر. أصحاب هذه الشخصية يمتلكون جاذبية طبيعية وحدساً قوياً.",
secretReport: {
strengths: "جاذبية طبيعية، حدس قوي، وقدرة على التأثير في الآخرين.",
challenges: "قد تستخدم سحرك للتلاعب بدلاً من البناء.",
insight: "استخدم جاذبيتك لبناء علاقات حقيقية، وليس فقط للإغواء."
}
},
{
id: "valkyrie",
name: "الفالكيري المحاربة",
rarity: "نادر جداً",
image: "assets/images/valkyrie.jpg",
description: "أنت رمز للشرف والشجاعة. تمتلك روحاً مقاتلة تدافع عن الحق وتختار طريق الأبطال.",
narrative: "في ساحات الشرف، تلمع روحك كالسيف الصقيل. أنت الشجاعة التي لا تهاب، والعدل الذي لا يميل. اختيارك دائماً هو طريق الأبطال مهما كان صعباً.\n\nلستَ من يختار المعركة السهلة، بل تختار المعركة الصحيحة. عندما يصمت الآخرون عن الظلم، أنت تتحدث. عندما ينحني الآخرون للخوف، أنت تقف. شرفك ليس كلمة تقال، بل هو طريقة تعيش بها كل لحظة.\n\nلكن تذكر: الشجاعة الحقيقية ليست في القتال فقط، بل في معرفة متى تقاتل ومتى تسامح. أحياناً، القوة الحقيقية تكمن في خفض السيف لا في رفعه.",
advice: "الشجاعة ليست غياب الخوف، بل هي المضي قدماً رغم وجوده.",
badge: "حارس الشرف",
article: "الفالكيري (Valkyrie) هن محاربات أسطوريات من الأساطير الاسكندنافية، خدامات الإله أودين. كانت مهمتهن اختيار أنصاف المعارك في ساحات القتال واصطحاب أرواح المحاربين الشجعان إلى فالهالا (قاعة الأبطال).\n\nكلمة 'Valkyrie' تعني حرفياً 'مختارات القتلى' (Old Norse: valkyrja). كانت الفالكيري يُصورن كمحاربات جميلات يركبن الخيول ويطرن في السماء، يرتدين الدروع ويحملن الرماح.\n\n**التحليل النفسي:**\nأصحاب شخصية الفالكيري يمتلكون ما يُسمى في علم النفس 'الأخلاق المبدئية' (Principled Morality)، وهو الالتزام القوي بالقيم والمبادئ حتى في أصعب الظروف. الدراسات تُظهر أن هؤلاء الأشخاص يمتلكون:\n\n• **الشجاعة الأخلاقية**: يدافعون عن الحق حتى لو كان ذلك ضد الأغلبية\n• **القيادة بالقدوة**: لا يطلبون من الآخرين ما لا يفعلونه هم أنفسهم\n• **العدالة الفطرية**: يميزون بين الصواب والخطأ بوضوح\n• **الحماية الفطرية**: يدافعون عن الضعفاء والمظلومين\n\nلكن هذه القوة لها ثمن: قد يميلون للصرامة الزائدة مع أنفسهم والآخرين، أو يجدون صعوبة في تقبل 'المنطقة الرمادية' في الحياة، أو يقعون في فخ 'الكمالية الأخلاقية' التي تجعلهم يحكمون على الآخرين بقسوة.",
secretReport: {
strengths: "• **الشجاعة الأخلاقية الاستثنائية**: تدافع عن مبادئك حتى لو وقفت وحدك\n• **القيادة بالقدوة**: لا تطلب من الآخرين ما لا تفعله أنت نفسك\n• **العدالة الفطرية**: تميز بين الصواب والخطأ بوضوح مذهل\n• **الحماية الفطرية**: تدافع عن الضعفاء والمظلومين بغريزة طبيعية",
challenges: "• **الصرامة الزائدة**: قد تكون قاسياً جداً مع نفسك والآخرين في اتباع المبادئ\n• **صعوبة تقبل المنطقة الرمادية**: ترى العالم أبيض أو أسود، مما يجعلك تحبط من تعقيدات الحياة\n• **الكمالية الأخلاقية**: قد تحكم على الآخرين بقسوة عندما لا يعيشون حسب معاييرك\n• **الإرهاق الأخلاقي**: حمل هموم العدالة قد يستنزف طاقتك النفسية",
growthPath: "**مسار التطور الشخصي:**\n1. تعلم 'الرحمة الأخلاقية': المبادئ مهمة، لكن الرحمة أهم أحياناً\n2. تقبل 'المنطقة الرمادية': الحياة ليست أبيض وأسود دائماً\n3. مارس 'التسامح الانتقائي': ليس كل خطأ يستحق العقاب\n4. ابنِ 'أنظمة الدعم': حتى المحاربون يحتاجون لمن يساعدهم أحياناً",
relationships: "**في العلاقات:**\n• تحتاج شريكاً يشاركك مبادئك لكنه يذكرك بالرحمة أحياناً\n• قد تكون 'الحامي' في العلاقات، احذر من الحماية المفرطة التي تخنق الآخرين\n• أفضل التوافق: مع كائنات حكيمة (أبو الهول، السيمرغ) توازن شجاعتك بحكمتهم\n• تجنب: الأشخاص الانتهازيين الذين لا مبادئ لهم",
career: "**المسار المهني المثالي:**\n• القانون والقضاء (لأنك تؤمن بالعدالة)\n• العمل الإنساني وحقوق الإنسان\n• القيادة في المنظمات التي تحتاج لإصلاحات أخلاقية\n• التعليم والتوجيه (لأنك قدوة للآخرين)\n• تجنب: الوظائف التي تتطلب compromises أخلاقية أو التلاعب بالآخرين",
insight: "شجاعتك الحقيقية ليست في القتال فحسب، بل في معرفة متى تقاتل ومتى تسامح. أنت لست محارباً فقط، أنت حارس للقيم في عالم يحتاج للحراس."
}
}
]
}
],
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
{ label: "Flying Ship", image: "assets/images/quiz/q32_opt1.jpg", trait: "exploration", axis: "energy", value: 5 },
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
narrative: "In the moment of final burning, when the world thought you were finished, the spirit of the phoenix rose from your ashes. You are not just a survivor of storms, you are the storm itself that renews. Every loss taught you a lesson, every failure built wisdom within you, and every tear watered the soil of your soul to bloom anew.\n\nYou do not know the meaning of surrender, for the word does not exist in your dictionary. When others fall, you rise stronger. When a door closes, you open a window. When the world darkens, you become the light.\n\nBut remember: even the phoenix needs rest between cycles of renewal. Do not burn yourself constantly to prove your strength, for a calm sustained light is stronger than a violent fleeting flame.",
advice: "Remember that you don't always have to burn to prove your existence; a calm light lasts longer.",
badge: "Renewed Spirit",
article: "The Phoenix is one of the most widespread mythical creatures in ancient world cultures. It first appeared in ancient Egyptian mythology under the name 'Benu', where it was associated with sun worship and resurrection after death. The legend later transferred to Greek civilization, where Herodotus described it as an amazing bird that lives in the Arabian desert for 500 years before burning itself and returning to life from its ashes.\n\nIn Chinese culture, the phoenix is known as 'Fenghuang', a symbol of the empress and noble virtues. In Japanese culture, it is called 'Hō-ō' and appears only in times of peace and prosperity.\n\n**Psychological Analysis:**\nPhoenix personality owners possess what is called in psychology 'Psychological Resilience', the ability to recover from traumas and grow through them. Modern studies in positive psychology show that these people possess:\n\n• **Post-Traumatic Growth**: They do not just return to zero, they evolve\n• **Transforming pain into fuel**: They use difficult experiences as motivation for creativity\n• **Realistic optimism**: They see the bright side without denying reality\n• **Ability to renew**: They know when to end a phase and start another\n\nBut this power has a price: they may tend toward self-burnout in a constant attempt to renew, or fall into the trap of 'adrenaline addiction' by constantly seeking challenges.",
secretReport: {
strengths: "• **Exceptional psychological resilience**: Your ability to recover from traumas exceeds the average by 3 times\n• **Creative transformation of pain**: You transform difficult experiences into art, writing, or inspiring projects\n• **Leadership in crises**: When others lose hope, you become their source of inspiration\n• **Realistic optimism**: You see possibilities where others see the impossible",
challenges: "• **Burnout syndrome**: Your tendency for constant renewal may lead to physical and psychological exhaustion\n• **Difficulty with stability**: You may find it hard to commit to long-term relationships or projects\n• **Expecting renewal from others**: You may become frustrated when others don't change as quickly as you do\n• **Drama addiction**: Unconsciously, you may attract yourself to difficult situations to feel 'alive'",
growthPath: "**Personal development path:**\n1. Learn 'effective rest': renewal does not mean constant movement\n2. Build support systems: do not try to rise from ashes alone always\n3. Practice 'dynamic stability': you can change and grow without giving up everything\n4. Develop 'strategic patience': not everything needs immediate renewal",
relationships: "**In relationships:**\n• You need a partner who understands your natural cycles of renewal\n• You may be 'the rescuer' in relationships, beware of rescuing those who don't want rescue\n• Best compatibility: with stable creatures (Golem, Centaur) that balance your fluctuations\n• Avoid: toxic relationships that drain your renewable energy",
career: "**Ideal career path:**\n• Entrepreneurship (especially in renewal and transformation fields)\n• Psychotherapy and counseling (because you understand pain and recovery)\n• Creative arts (writing, music, visual arts)\n• Leadership in organizations going through crises\n• Avoid: routine repetitive jobs that kill your spirit of renewal",
insight: "Your true power is not just in the ability to rise from ashes, but in the wisdom you gather from each life cycle. You are not a bird that burns, you are wisdom embodied in each new birth."
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
narrative: "Between the sands of time and the secrets of civilizations, your soul stands firm like the Sphinx statue. You are the riddle that cannot be solved, the eye that sees what others do not. Your silence is wisdom and your words are truth.\n\nIn a world where everyone screams to attract attention, you prefer silent observation. You weigh every word before speaking, and analyze every situation before reacting. This is not isolation, but a life strategy.\n\nBut remember: wisdom that is not shared becomes a burden. Sometimes, breaking silence and opening your heart to one trustworthy person is stronger than solving a thousand riddles.",
advice: "Sharing part of your secrets may open doors of friendship you didn't expect.",
badge: "Master of Riddles",
article: "The Sphinx is one of history's most enigmatic mythical creatures, appearing in Egyptian and Greek mythologies. In ancient Egypt, it was seen as a guardian of tombs and temples, with a human head and a lion's body, symbolizing the union of wisdom and strength. In Greek mythology, it posed riddles to travelers; those who failed to solve them met their doom.\n\nThe most famous riddle of the Greek Sphinx was: 'What walks on four legs in the morning, two at noon, and three in the evening?' The answer: man (as a child, youth, then elder).\n\n**Psychological Analysis:**\nSphinx personality owners possess what is called in psychology 'Analytical Intelligence', the ability to break down complex problems into small parts and solve them. Studies show that these people possess:\n\n• **Critical thinking**: They do not accept information without deep analysis\n• **Strategic patience**: They wait for the right moment to reveal truth\n• **Ability to read people**: They notice subtle details in body language and speech\n• **Silent wisdom**: They speak only when they have something valuable to say\n\nBut this power has a price: they may tend toward excessive isolation, or find it difficult to trust others, or fall into the trap of 'Analysis Paralysis' where they think too much and do not act.",
secretReport: {
strengths: "• **Sharp analytical intelligence**: Your ability to break down complex problems exceeds the average by 4 times\n• **Deep reading of people**: You notice details that 90% of people miss\n• **Strategic patience**: You wait for the right moment instead of acting impulsively\n• **Silent wisdom**: Your words are few but valuable and influential",
challenges: "• **Excessive isolation**: Your tendency for silence and mystery may make others find it difficult to get close to you\n• **Over-analysis**: You may think too much and not act, missing important opportunities\n• **Difficulty trusting**: You may find it hard to open your heart to others even to those who deserve it\n• **High expectations**: You may become frustrated when others don't understand your deep thinking",
growthPath: "**Personal development path:**\n1. Practice 'calculated openness': share your thoughts with one trusted person weekly\n2. Learn 'quick action': not every decision needs deep analysis\n3. Build 'bridges of trust': start with small shares and increase gradually\n4. Accept 'imperfection': not everything needs complete understanding before acting",
relationships: "**In relationships:**\n• You need a partner who respects your silence and understands your need for solitude sometimes\n• You may be 'the advisor' in relationships, beware of giving advice without being asked\n• Best compatibility: with social creatures (Faun, Kitsune) that bring you out of isolation\n• Avoid: superficial people who don't value your intellectual depth",
career: "**Ideal career path:**\n• Scientific and academic research (because you love deep analysis)\n• Strategic consulting (because you see what others don't)\n• Writing and authoring (because you express complex thoughts better in writing)\n• Investigation and criminal analysis\n• Avoid: jobs requiring constant superficial social interaction",
insight: "Your true wisdom is not just in solving riddles, but in knowing when to share the answer and when to keep it secret. You are not a closed riddle, you are a book waiting for the right reader."
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
narrative: "With flute melodies and nature dances, your soul sways with fun. You are the joy on a cloudy day, the spontaneity that brings life back to the static things around you.\n\nIn a very serious world, you are the reminder that life should be lived not analyzed. Your laughter is contagious, and your cheerful spirit turns any gathering into a celebration. You don't need a reason for joy, for joy is your natural state.\n\nBut remember: fun alone does not build a future. Sometimes, you need to sit seriously and plan for your big dreams. The balance between fun and responsibility is the secret of your success.",
advice: "Fun is necessary, but a little seriousness helps you achieve your big dreams.",
badge: "Spirit of Fun",
article: "The Faun is a mythical creature from Roman mythology, combining human and goat features. Known as the spirit of forests and fields, he is associated with music, dance, and joy. The Faun represents the innate and spontaneous side of humans, a close connection with nature, and living in the present away from the complexities of civilization.\n\nIn Greek mythology, the Faun corresponds to 'Pan', the god of shepherds and flocks, who played the flute and filled forests with music. It was believed that his sudden scream caused causeless terror (hence the word 'panic').\n\n**Psychological Analysis:**\nFaun personality owners possess what is called in psychology 'Natural Extroversion', the ability to enjoy the present moment and spontaneously connect with others. Studies show that these people possess:\n\n• **Social intelligence**: Natural ability to blend into any group\n• **Spontaneous creativity**: They think outside the box naturally\n• **Emotional flexibility**: They recover quickly from negative emotions\n• **Connection with nature**: They find peace and inspiration in natural places\n\nBut this power has a price: they may tend toward procrastination, or find it difficult to commit to serious responsibilities, or fall into the trap of 'escaping reality' through constant fun.",
secretReport: {
strengths: "• **Natural social intelligence**: Your ability to blend with anyone exceeds the average by 3 times\n• **Spontaneous creativity**: You generate innovative ideas naturally without planning\n• **Emotional flexibility**: You recover from negative emotions at an amazing speed\n• **Contagious energy**: Your presence automatically lifts the morale of those around you",
challenges: "• **Chronic procrastination**: Your tendency for immediate pleasure may delay your important tasks\n• **Difficulty committing**: You may find it hard to complete long-term projects\n• **Escaping seriousness**: Sometimes you use fun as a mechanism to escape real problems\n• **Occasional superficiality**: You may avoid deep conversations because they are 'too serious'",
growthPath: "**Personal development path:**\n1. Practice 'disciplined fun': allocate time for serious work before pleasure\n2. Use the '2-minute rule': if a task takes less than 2 minutes, do it now\n3. Build 'follow-up systems': use reminder apps to track your tasks\n4. Learn 'temporary depth': dedicate 30 minutes daily to serious thinking about your goals",
relationships: "**In relationships:**\n• You need a partner who shares your cheerful spirit but reminds you of responsibilities sometimes\n• You may be 'the group clown', beware of being taken seriously only in fun\n• Best compatibility: with serious creatures (Golem, Sphinx) that balance your spontaneity\n• Avoid: negative people who extinguish your positive energy",
career: "**Ideal career path:**\n• Entertainment arts (music, theater, comedy)\n• Marketing and advertising (because you understand what makes people happy)\n• Working with children or in entertainment fields\n• Entrepreneurship in creative fields\n• Avoid: routine office jobs that kill your cheerful spirit",
insight: "Your true joy is not in escaping seriousness, but in finding balance between fun and responsibility. You are not an eternal child, you are a wise person who knows how to enjoy life consciously."
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
id: "siren",
name: "The Enchanting Siren",
rarity: "Very Rare",
image: "assets/images/siren.jpg",
description: "You are a symbol of allure and intuition. You possess a voice that enchants minds and the ability to read emotions.",
narrative: "From the depths of legendary seas, your enchanting voice resounds. You are the irresistible allure, the intuition that sees what others do not.",
advice: "Use your allure to build genuine relationships, not just to seduce passersby.",
badge: "Enchantress of the Depths",
article: "The Siren is a legendary sea creature with an enchanting voice. Owners of this personality possess natural allure and strong intuition.",
secretReport: {
strengths: "Natural allure, strong intuition, and ability to influence others.",
challenges: "You may use your charm for manipulation rather than building.",
insight: "Use your allure to build genuine relationships, not just to seduce passersby."
}
},
{
id: "valkyrie",
name: "The Valkyrie Warrior",
rarity: "Very Rare",
image: "assets/images/valkyrie.jpg",
description: "You are a symbol of honor and courage. You possess a fighting spirit that defends the right and chooses the path of heroes.",
narrative: "In the arenas of honor, your soul shines like a polished sword. You are the courage that does not fear, the justice that does not lean. Your choice is always the path of heroes no matter how difficult.\n\nYou are not one who chooses the easy battle, but you choose the right battle. When others are silent about injustice, you speak. When others bow to fear, you stand. Your honor is not a word spoken, but a way you live every moment.\n\nBut remember: true courage is not just in fighting, but in knowing when to fight and when to forgive. Sometimes, true strength lies in lowering the sword not raising it.",
advice: "Courage is not the absence of fear, but moving forward despite its presence.",
badge: "Guardian of Honor",
article: "Valkyries are mythical warriors from Norse mythology, servants of the god Odin. Their task was to choose half of the slain in battlefields and bring the souls of brave warriors to Valhalla (Hall of Heroes).\n\nThe word 'Valkyrie' literally means 'choosers of the slain' (Old Norse: valkyrja). Valkyries were depicted as beautiful warriors riding horses and flying in the sky, wearing armor and carrying spears.\n\n**Psychological Analysis:**\nValkyrie personality owners possess what is called in psychology 'Principled Morality', strong commitment to values and principles even in the most difficult conditions. Studies show that these people possess:\n\n• **Moral courage**: They defend the right even if it is against the majority\n• **Leading by example**: They do not ask others what they do not do themselves\n• **Innate justice**: They distinguish between right and wrong clearly\n• **Innate protection**: They defend the weak and oppressed\n\nBut this power has a price: they may tend toward excessive strictness with themselves and others, or find it difficult to accept 'gray areas' in life, or fall into the trap of 'moral perfectionism' that makes them judge others harshly.",
secretReport: {
strengths: "• **Exceptional moral courage**: You defend your principles even if you stand alone\n• **Leading by example**: You do not ask others what you do not do yourself\n• **Innate justice**: You distinguish between right and wrong with amazing clarity\n• **Innate protection**: You defend the weak and oppressed with natural instinct",
challenges: "• **Excessive strictness**: You may be very harsh with yourself and others in following principles\n• **Difficulty accepting gray areas**: You see the world as black or white, making you frustrated with life's complexities\n• **Moral perfectionism**: You may judge others harshly when they don't live by your standards\n• **Moral exhaustion**: Carrying the burdens of justice may drain your psychological energy",
growthPath: "**Personal development path:**\n1. Learn 'moral mercy': principles are important, but mercy is more important sometimes\n2. Accept 'gray areas': life is not always black and white\n3. Practice 'selective forgiveness': not every mistake deserves punishment\n4. Build 'support systems': even warriors need help sometimes",
relationships: "**In relationships:**\n• You need a partner who shares your principles but reminds you of mercy sometimes\n• You may be 'the protector' in relationships, beware of overprotection that stifles others\n• Best compatibility: with wise creatures (Sphinx, Simurgh) that balance your courage with their wisdom\n• Avoid: opportunistic people who have no principles",
career: "**Ideal career path:**\n• Law and judiciary (because you believe in justice)\n• Humanitarian work and human rights\n• Leadership in organizations needing ethical reforms\n• Education and guidance (because you are a role model for others)\n• Avoid: jobs requiring ethical compromises or manipulating others",
insight: "Your true courage is not just in fighting, but in knowing when to fight and when to forgive. You are not just a warrior, you are a guardian of values in a world that needs guardians."
}
}
]
}
]
};
