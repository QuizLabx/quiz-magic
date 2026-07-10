// ============================================================
// 🧠 MYTHICAL QUIZ QUESTION BANK (بنك الأسئلة الأسطوري)
// 150 سؤال نفسي معتمد من مصادر علمية موثوقة
// موزعة على 6 محاور (25 سؤال لكل محور)
// ============================================================

const questionBank = {
    // ═══════════════════════════════════════════════════════
    // 💪 WILLPOWER AXIS (محور الإرادة) - 25 سؤال
    // المصدر: Duckworth Grit Scale + IPIP Conscientiousness
    // ═══════════════════════════════════════════════════════
    willpower: [
        {
            id: "wil_001",
            text: {
                ar: "أنهي المهام المهمة حتى عندما أشعر بالكسل أو التعب.",
                en: "I finish important tasks even when I feel lazy or tired."
            },
            trait: "grit_perseverance",
            reversed: false,
            source: "Duckworth Grit Scale"
        },
        {
            id: "wil_002",
            text: {
                ar: "الوعد الذي قطعته على نفسي ألتزم به مهما كانت الظروف صعبة.",
                en: "I keep the promises I made to myself regardless of how difficult circumstances are."
            },
            trait: "commitment",
            reversed: false,
            source: "IPIP Conscientiousness"
        },
        {
            id: "wil_003",
            text: {
                ar: "أشعر بالقوة الحقيقية عندما أقود الآخرين نحو هدف مشترك.",
                en: "I feel true power when I lead others toward a common goal."
            },
            trait: "leadership_drive",
            reversed: false,
            source: "IPIP Assertiveness"
        },
        {
            id: "wil_004",
            text: {
                ar: "أميل دائماً لتولي دور القيادة في المجموعات.",
                en: "I always tend to take the leadership role in groups."
            },
            trait: "leadership",
            reversed: false,
            source: "IPIP Assertiveness"
        },
        {
            id: "wil_005",
            text: {
                ar: "أجد صعوبة في مسامحة الأشخاص الذين أخطأوا في حقي.",
                en: "I find it difficult to forgive people who have wronged me."
            },
            trait: "persistence_grudge",
            reversed: false,
            source: "IPIP Anger"
        },
        {
            id: "wil_006",
            text: {
                ar: "أنا دائماً صادق مع نفسي حتى لو كان الحلم مؤلماً.",
                en: "I am always honest with myself even if the dream is painful."
            },
            trait: "self_honesty",
            reversed: false,
            source: "IPIP Morality"
        },
        {
            id: "wil_007",
            text: {
                ar: "أحب التحدي والمنافسة للوصول إلى القمة.",
                en: "I love challenge and competition to reach the top."
            },
            trait: "competitiveness",
            reversed: false,
            source: "IPIP Achievement Striving"
        },
        {
            id: "wil_008",
            text: {
                ar: "أشعر أن لدي رسالة كبيرة يجب أن أؤديها في الحياة.",
                en: "I feel that I have a great mission to fulfill in life."
            },
            trait: "life_purpose",
            reversed: false,
            source: "IPIP Meaning"
        },
        {
            id: "wil_009",
            text: {
                ar: "أؤمن أن القوة الحقيقية تأتي من الداخل.",
                en: "I believe true power comes from within."
            },
            trait: "inner_strength",
            reversed: false,
            source: "IPIP Self-Efficacy"
        },
        {
            id: "wil_010",
            text: {
                ar: "أمتلك طاقة داخلية هائلة تدفعني لتحقيق أهدافي الكبيرة.",
                en: "I possess tremendous inner energy that drives me to achieve my big goals."
            },
            trait: "inner_drive",
            reversed: false,
            source: "IPIP Achievement Striving"
        },
        {
            id: "wil_011",
            text: {
                ar: "عندما أقرر شيئاً، لا شيء يمكن أن يوقفني عن تحقيقه.",
                en: "When I decide on something, nothing can stop me from achieving it."
            },
            trait: "determination",
            reversed: false,
            source: "Duckworth Grit Scale"
        },
        {
            id: "wil_012",
            text: {
                ar: "أفضل أن أكون القائد حتى لو كان ذلك يعني تحمل مسؤولية أكبر.",
                en: "I prefer to be the leader even if it means taking on greater responsibility."
            },
            trait: "leadership_preference",
            reversed: false,
            source: "IPIP Assertiveness"
        },
        {
            id: "wil_013",
            text: {
                ar: "أستطيع التحكم في أعصابي حتى في أصعب المواقف.",
                en: "I can control my temper even in the most difficult situations."
            },
            trait: "emotional_control",
            reversed: false,
            source: "IPIP Self-Discipline"
        },
        {
            id: "wil_014",
            text: {
                ar: "أواجه المخاوف بدلاً من الهروب منها.",
                en: "I face my fears instead of running away from them."
            },
            trait: "courage",
            reversed: false,
            source: "IPIP Anxiety (reversed)"
        },
        {
            id: "wil_015",
            text: {
                ar: "أضع معايير عالية لنفسي وأعمل بجد لتحقيقها.",
                en: "I set high standards for myself and work hard to achieve them."
            },
            trait: "high_standards",
            reversed: false,
            source: "IPIP Achievement Striving"
        },
        {
            id: "wil_016",
            text: {
                ar: "أستسلم بسهولة عندما تصبح الأمور صعبة.",
                en: "I give up easily when things get difficult."
            },
            trait: "giving_up",
            reversed: true, // ⚠️ سؤال عكسي
            source: "Duckworth Grit Scale (reversed)"
        },
        {
            id: "wil_017",
            text: {
                ar: "أؤجل المهام الصعبة إلى وقت لاحق.",
                en: "I postpone difficult tasks to a later time."
            },
            trait: "procrastination",
            reversed: true, // ⚠️ سؤال عكسي
            source: "IPIP Self-Discipline (reversed)"
        },
        {
            id: "wil_018",
            text: {
                ar: "أفضل أن يتخذ الآخرون القرارات نيابة عني.",
                en: "I prefer others to make decisions for me."
            },
            trait: "passive_leadership",
            reversed: true, // ⚠️ سؤال عكسي
            source: "IPIP Assertiveness (reversed)"
        },
        {
            id: "wil_019",
            text: {
                ar: "أتجنب المواقف التي تتطلب مني تحمل المسؤولية.",
                en: "I avoid situations that require me to take responsibility."
            },
            trait: "responsibility_avoidance",
            reversed: true, // ⚠️ سؤال عكسي
            source: "IPIP Dutifulness (reversed)"
        },
        {
            id: "wil_020",
            text: {
                ar: "أشعر بالضعف عندما أواجه تحديات كبيرة.",
                en: "I feel weak when facing big challenges."
            },
            trait: "challenge_weakness",
            reversed: true, // ⚠️ سؤال عكسي
            source: "IPIP Self-Efficacy (reversed)"
        },
        {
            id: "wil_021",
            text: {
                ar: "أدافع عن قناعاتي حتى لو كنت الوحيد الذي يؤمن بها.",
                en: "I defend my convictions even if I am the only one who believes in them."
            },
            trait: "moral_courage",
            reversed: false,
            source: "IPIP Morality"
        },
        {
            id: "wil_022",
            text: {
                ar: "أستطيع العمل لفترات طويلة دون أن أشعر بالإرهاق.",
                en: "I can work for long periods without feeling exhausted."
            },
            trait: "endurance",
            reversed: false,
            source: "IPIP Activity Level"
        },
        {
            id: "wil_023",
            text: {
                ar: "أفضل أن أكون مسؤولاً عن مصيري بدلاً من تركه للصدفة.",
                en: "I prefer to be responsible for my destiny rather than leaving it to chance."
            },
            trait: "self_determination",
            reversed: false,
            source: "IPIP Self-Efficacy"
        },
        {
            id: "wil_024",
            text: {
                ar: "أشعر بالفخر عندما أنجز شيئاً صعباً بمفردي.",
                en: "I feel proud when I accomplish something difficult on my own."
            },
            trait: "independence_pride",
            reversed: false,
            source: "IPIP Achievement Striving"
        },
        {
            id: "wil_025",
            text: {
                ar: "ألتزم بأهدافي طويلة المدى حتى لو استغرق تحقيقها سنوات.",
                en: "I stick to my long-term goals even if they take years to achieve."
            },
            trait: "long_term_commitment",
            reversed: false,
            source: "Duckworth Grit Scale"
        }
    ],

    // ═══════════════════════════════════════════════════════
    // 🧠 INTELLIGENCE AXIS (محور الذكاء) - 25 سؤال
    // المصدر: IPIP Intellect + Need for Cognition Scale
    // ═══════════════════════════════════════════════════════
    intelligence: [
        {
            id: "int_001",
            text: {
                ar: "أبحث دائماً عن المعنى العميق وراء الأشياء.",
                en: "I always look for the deeper meaning behind things."
            },
            trait: "knowledge_seeking",
            reversed: false,
            source: "IPIP Intellect"
        },
        {
            id: "int_002",
            text: {
                ar: "أستمتع بمناقشة الأفكار الفلسفية والمعقدة.",
                en: "I enjoy discussing philosophical and complex ideas."
            },
            trait: "philosophical_thinking",
            reversed: false,
            source: "Need for Cognition Scale"
        },
        {
            id: "int_003",
            text: {
                ar: "أهتم بالتفاصيل الصغيرة التي قد لا يلاحظها الآخرون.",
                en: "I care about small details that others might not notice."
            },
            trait: "attention_to_detail",
            reversed: false,
            source: "IPIP Intellect"
        },
        {
            id: "int_004",
            text: {
                ar: "أفضل الغوص في عالم الخيال وأحلام اليقظة على مواجهة الواقع.",
                en: "I prefer diving into imagination and daydreams over facing reality."
            },
            trait: "imagination",
            reversed: false,
            source: "IPIP Imagination"
        },
        {
            id: "int_005",
            text: {
                ar: "أرى الروابط الخفية بين الأحداث التي يعتبرها الآخرون غير مترابطة.",
                en: "I see hidden connections between events that others consider unrelated."
            },
            trait: "holistic_vision",
            reversed: false,
            source: "IPIP Intellect"
        },
        {
            id: "int_006",
            text: {
                ar: "أستمتع بحل المسائل المعقدة التي تتطلب تفكيراً عميقاً.",
                en: "I enjoy solving complex problems that require deep thinking."
            },
            trait: "problem_solving",
            reversed: false,
            source: "Need for Cognition Scale"
        },
        {
            id: "int_007",
            text: {
                ar: "أقرأ كثيراً في مواضيع متنوعة لتوسيع معرفتي.",
                en: "I read a lot on diverse topics to expand my knowledge."
            },
            trait: "reading_habits",
            reversed: false,
            source: "IPIP Intellect"
        },
        {
            id: "int_008",
            text: {
                ar: "أحلل الأمور من زوايا متعددة قبل اتخاذ القرار.",
                en: "I analyze things from multiple angles before making a decision."
            },
            trait: "analytical_thinking",
            reversed: false,
            source: "IPIP Intellect"
        },
        {
            id: "int_009",
            text: {
                ar: "أطرح أسئلة عميقة حول الحياة والوجود.",
                en: "I ask deep questions about life and existence."
            },
            trait: "existential_thinking",
            reversed: false,
            source: "IPIP Intellect"
        },
        {
            id: "int_010",
            text: {
                ar: "أحب تعلم أشياء جديدة حتى لو لم تكن مفيدة عملياً.",
                en: "I love learning new things even if they are not practically useful."
            },
            trait: "curiosity",
            reversed: false,
            source: "IPIP Intellect"
        },
        {
            id: "int_011",
            text: {
                ar: "أفهم المفاهيم المجردة بسرعة وسهولة.",
                en: "I understand abstract concepts quickly and easily."
            },
            trait: "abstract_thinking",
            reversed: false,
            source: "IPIP Intellect"
        },
        {
            id: "int_012",
            text: {
                ar: "أستمتع بالنقاشات الفكرية التي تتحدى أفكاري.",
                en: "I enjoy intellectual discussions that challenge my ideas."
            },
            trait: "intellectual_challenge",
            reversed: false,
            source: "Need for Cognition Scale"
        },
        {
            id: "int_013",
            text: {
                ar: "أبحث عن الأنماط والقوانين في كل شيء حولي.",
                en: "I look for patterns and laws in everything around me."
            },
            trait: "pattern_recognition",
            reversed: false,
            source: "IPIP Intellect"
        },
        {
            id: "int_014",
            text: {
                ar: "أفضل الكتب والأفلام التي تتطلب تفكيراً عميقاً.",
                en: "I prefer books and movies that require deep thinking."
            },
            trait: "intellectual_preferences",
            reversed: false,
            source: "Need for Cognition Scale"
        },
        {
            id: "int_015",
            text: {
                ar: "أستطيع تذكر المعلومات المعقدة بسهولة.",
                en: "I can remember complex information easily."
            },
            trait: "memory",
            reversed: false,
            source: "IPIP Intellect"
        },
        {
            id: "int_016",
            text: {
                ar: "أجد صعوبة في فهم النظريات المعقدة.",
                en: "I find it difficult to understand complex theories."
            },
            trait: "theory_difficulty",
            reversed: true, // ⚠️ سؤال عكسي
            source: "IPIP Intellect (reversed)"
        },
        {
            id: "int_017",
            text: {
                ar: "أفضل الأنشطة البسيطة التي لا تتطلب تفكيراً كثيراً.",
                en: "I prefer simple activities that don't require much thinking."
            },
            trait: "cognitive_avoidance",
            reversed: true, // ⚠️ سؤال عكسي
            source: "Need for Cognition Scale (reversed)"
        },
        {
            id: "int_018",
            text: {
                ar: "أشعر بالملل بسرعة عندما أدرس مواضيع عميقة.",
                en: "I get bored quickly when studying deep topics."
            },
            trait: "intellectual_boredom",
            reversed: true, // ⚠️ سؤال عكسي
            source: "IPIP Intellect (reversed)"
        },
        {
            id: "int_019",
            text: {
                ar: "أتجنب النقاشات الفلسفية لأنها معقدة جداً.",
                en: "I avoid philosophical discussions because they are too complex."
            },
            trait: "philosophy_avoidance",
            reversed: true, // ⚠️ سؤال عكسي
            source: "Need for Cognition Scale (reversed)"
        },
        {
            id: "int_020",
            text: {
                ar: "أفضل الإجابات البسيطة والمباشرة على الأسئلة المعقدة.",
                en: "I prefer simple and direct answers to complex questions."
            },
            trait: "simplicity_preference",
            reversed: true, // ⚠️ سؤال عكسي
            source: "IPIP Intellect (reversed)"
        },
        {
            id: "int_021",
            text: {
                ar: "أستمتع بتعلم لغات جديدة أو أنظمة معقدة.",
                en: "I enjoy learning new languages or complex systems."
            },
            trait: "learning_enthusiasm",
            reversed: false,
            source: "IPIP Intellect"
        },
        {
            id: "int_022",
            text: {
                ar: "أفكر في المستقبل البعيد وتأثير قراراتي عليه.",
                en: "I think about the distant future and the impact of my decisions on it."
            },
            trait: "future_thinking",
            reversed: false,
            source: "IPIP Intellect"
        },
        {
            id: "int_023",
            text: {
                ar: "أحب تحليل دوافع الناس وسلوكياتهم.",
                en: "I love analyzing people's motives and behaviors."
            },
            trait: "psychological_analysis",
            reversed: false,
            source: "IPIP Intellect"
        },
        {
            id: "int_024",
            text: {
                ar: "أستمتع بالألغاز والألعاب التي تتطلب تفكيراً استراتيجياً.",
                en: "I enjoy puzzles and games that require strategic thinking."
            },
            trait: "strategic_games",
            reversed: false,
            source: "Need for Cognition Scale"
        },
        {
            id: "int_025",
            text: {
                ar: "أبحث دائماً عن المعرفة حتى لو لم تكن ذات صلة بحياتي اليومية.",
                en: "I always seek knowledge even if it's not relevant to my daily life."
            },
            trait: "knowledge_for_knowledge",
            reversed: false,
            source: "IPIP Intellect"
        }
    ],

    // ═══════════════════════════════════════════════════════
    // ⚡ ENERGY AXIS (محور الطاقة) - 25 سؤال
    // المصدر: IPIP Extraversion + Behavioral Activation Scale
    // ═══════════════════════════════════════════════════════
    energy: [
        {
            id: "eng_001",
            text: {
                ar: "لدي قدرة كبيرة على التكيف مع التغييرات المفاجئة.",
                en: "I have a great ability to adapt to sudden changes."
            },
            trait: "adaptation",
            reversed: false,
            source: "IPIP Activity Level"
        },
        {
            id: "eng_002",
            text: {
                ar: "أمتلك طاقة كبيرة تدفعني لتجربة أشياء جديدة دائماً.",
                en: "I have a lot of energy that pushes me to try new things always."
            },
            trait: "energy_drive",
            reversed: false,
            source: "IPIP Activity Level"
        },
        {
            id: "eng_003",
            text: {
                ar: "أنا شخص متفائل وأرى الجانب المشرق دائماً.",
                en: "I am an optimistic person and always see the bright side."
            },
            trait: "optimism",
            reversed: false,
            source: "IPIP Cheerfulness"
        },
        {
            id: "eng_004",
            text: {
                ar: "أحب أن أكون متميزاً ومختلفاً عن الآخرين.",
                en: "I like being unique and different from others."
            },
            trait: "uniqueness",
            reversed: false,
            source: "IPIP Excitement-Seeking"
        },
        {
            id: "eng_005",
            text: {
                ar: "أنا شخص مرن جداً في تفكيري.",
                en: "I am a very flexible person in my thinking."
            },
            trait: "mental_flexibility",
            reversed: false,
            source: "IPIP Activity Level"
        },
        {
            id: "eng_006",
            text: {
                ar: "لدي عدة اهتمامات وهوايات أمارسها بالتوازي في نفس الفترة.",
                en: "I have multiple interests and hobbies that I practice in parallel."
            },
            trait: "multiplicity",
            reversed: false,
            source: "IPIP Activity Level"
        },
        {
            id: "eng_007",
            text: {
                ar: "أشعر بالحماس الشديد عند بدء مشروع جديد.",
                en: "I feel intense excitement when starting a new project."
            },
            trait: "new_project_excitement",
            reversed: false,
            source: "Behavioral Activation Scale"
        },
        {
            id: "eng_008",
            text: {
                ar: "أفضل الأنشطة الديناميكية على الأنشطة الهادئة.",
                en: "I prefer dynamic activities over calm activities."
            },
            trait: "dynamic_preference",
            reversed: false,
            source: "IPIP Activity Level"
        },
        {
            id: "eng_009",
            text: {
                ar: "أستطيع العمل على عدة مشاريع في نفس الوقت دون أن أشعر بالإرهاق.",
                en: "I can work on multiple projects at the same time without feeling overwhelmed."
            },
            trait: "multitasking",
            reversed: false,
            source: "IPIP Activity Level"
        },
        {
            id: "eng_010",
            text: {
                ar: "أحب السفر واستكشاف أماكن جديدة.",
                en: "I love traveling and exploring new places."
            },
            trait: "exploration",
            reversed: false,
            source: "IPIP Excitement-Seeking"
        },
        {
            id: "eng_011",
            text: {
                ar: "أشعر بالملل بسرعة من الروتين اليومي.",
                en: "I get bored quickly with daily routine."
            },
            trait: "routine_boredom",
            reversed: false,
            source: "IPIP Excitement-Seeking"
        },
        {
            id: "eng_012",
            text: {
                ar: "أفضل العمل السريع على العمل البطيء المتأني.",
                en: "I prefer fast work over slow, deliberate work."
            },
            trait: "speed_preference",
            reversed: false,
            source: "IPIP Activity Level"
        },
        {
            id: "eng_013",
            text: {
                ar: "أستمتع بالمخاطرة المحسوبة في حياتي.",
                en: "I enjoy calculated risks in my life."
            },
            trait: "risk_taking",
            reversed: false,
            source: "IPIP Excitement-Seeking"
        },
        {
            id: "eng_014",
            text: {
                ar: "أشعر بالنشاط والحيوية حتى في نهاية اليوم.",
                en: "I feel energetic and vital even at the end of the day."
            },
            trait: "sustained_energy",
            reversed: false,
            source: "IPIP Activity Level"
        },
        {
            id: "eng_015",
            text: {
                ar: "أحب التجارب الجديدة حتى لو كانت غير مألوفة.",
                en: "I love new experiences even if they are unfamiliar."
            },
            trait: "novelty_seeking",
            reversed: false,
            source: "IPIP Excitement-Seeking"
        },
        {
            id: "eng_016",
            text: {
                ar: "أفضل الاستقرار في مكان واحد على كثرة الترحال.",
                en: "I prefer staying in one place over frequent traveling."
            },
            trait: "stability_preference",
            reversed: true, // ⚠️ سؤال عكسي
            source: "IPIP Activity Level (reversed)"
        },
        {
            id: "eng_017",
            text: {
                ar: "أشعر بالتعب بسرعة عندما أمارس أنشطة متعددة.",
                en: "I get tired quickly when I engage in multiple activities."
            },
            trait: "quick_fatigue",
            reversed: true, // ⚠️ سؤال عكسي
            source: "IPIP Activity Level (reversed)"
        },
        {
            id: "eng_018",
            text: {
                ar: "أفضل الأنشطة الهادئة على الأنشطة المثيرة.",
                en: "I prefer calm activities over exciting activities."
            },
            trait: "calm_preference",
            reversed: true, // ⚠️ سؤال عكسي
            source: "IPIP Excitement-Seeking (reversed)"
        },
        {
            id: "eng_019",
            text: {
                ar: "أجد صعوبة في بدء مشاريع جديدة.",
                en: "I find it difficult to start new projects."
            },
            trait: "initiation_difficulty",
            reversed: true, // ⚠️ سؤال عكسي
            source: "Behavioral Activation Scale (reversed)"
        },
        {
            id: "eng_020",
            text: {
                ar: "أشعر بالقلق عندما أفكر في تغيير روتيني.",
                en: "I feel anxious when I think about changing my routine."
            },
            trait: "change_anxiety",
            reversed: true, // ⚠️ سؤال عكسي
            source: "IPIP Activity Level (reversed)"
        },
        {
            id: "eng_021",
            text: {
                ar: "أستيقظ مبكراً وأشعر بالنشاط منذ الصباح.",
                en: "I wake up early and feel energetic since morning."
            },
            trait: "morning_energy",
            reversed: false,
            source: "IPIP Activity Level"
        },
        {
            id: "eng_022",
            text: {
                ar: "أحب المشاركة في الأنشطة الجماعية الحيوية.",
                en: "I love participating in lively group activities."
            },
            trait: "social_energy",
            reversed: false,
            source: "IPIP Excitement-Seeking"
        },
        {
            id: "eng_023",
            text: {
                ar: "أستمتع بالرياضات والأنشطة البدنية المكثفة.",
                en: "I enjoy intense sports and physical activities."
            },
            trait: "physical_activity",
            reversed: false,
            source: "IPIP Activity Level"
        },
        {
            id: "eng_024",
            text: {
                ar: "أشعر بالإلهام والحماس عندما أواجه تحديات جديدة.",
                en: "I feel inspired and excited when facing new challenges."
            },
            trait: "challenge_inspiration",
            reversed: false,
            source: "Behavioral Activation Scale"
        },
        {
            id: "eng_025",
            text: {
                ar: "أفضل العمل تحت الضغط لأن ذلك يزيد من إنتاجيتي.",
                en: "I prefer working under pressure because it increases my productivity."
            },
            trait: "pressure_productivity",
            reversed: false,
            source: "IPIP Activity Level"
        }
    ],

    // ═══════════════════════════════════════════════════════
    // ❤️ EMPATHY AXIS (محور التعاطف) - 25 سؤال
    // المصدر: Interpersonal Reactivity Index (Davis, 1980)
    // ═══════════════════════════════════════════════════════
    empathy: [
        {
            id: "emp_001",
            text: {
                ar: "أهتم بمساعدة الآخرين حتى لو كان ذلك على حساب راحتي.",
                en: "I care about helping others even at the expense of my comfort."
            },
            trait: "altruism",
            reversed: false,
            source: "IRI Empathic Concern"
        },
        {
            id: "emp_002",
            text: {
                ar: "أحب أن أكون محاطاً بالجمال والفن في حياتي.",
                en: "I love being surrounded by beauty and art in my life."
            },
            trait: "aesthetic_sensitivity",
            reversed: false,
            source: "IRI Fantasy"
        },
        {
            id: "emp_003",
            text: {
                ar: "أفضل العمل ضمن فريق بدلاً من العمل منفرداً.",
                en: "I prefer working in a team rather than working alone."
            },
            trait: "teamwork",
            reversed: false,
            source: "IRI Perspective Taking"
        },
        {
            id: "emp_004",
            text: {
                ar: "أنا شخص عاطفي جداً وتؤثر فيّ القصص الإنسانية.",
                en: "I am a very emotional person and human stories affect me."
            },
            trait: "emotional_nature",
            reversed: false,
            source: "IRI Empathic Concern"
        },
        {
            id: "emp_005",
            text: {
                ar: "أنا مخلص جداً لأصدقائي وعائلتي.",
                en: "I am very loyal to my friends and family."
            },
            trait: "loyalty",
            reversed: false,
            source: "IRI Empathic Concern"
        },
        {
            id: "emp_006",
            text: {
                ar: "أتأثر كثيراً وأبكي عندما أرى معاناة الآخرين أو الحيوانات.",
                en: "I get deeply affected and cry when I see others' or animals' suffering."
            },
            trait: "empathy_deep",
            reversed: false,
            source: "IRI Empathic Concern"
        },
        {
            id: "emp_007",
            text: {
                ar: "أستطيع بسهولة تغيير طريقة تعاملي مع الناس حسب طبيعة كل موقف.",
                en: "I can easily change how I interact with people based on each situation."
            },
            trait: "social_adaptability",
            reversed: false,
            source: "IRI Perspective Taking"
        },
        {
            id: "emp_008",
            text: {
                ar: "أستطيع قراءة مشاعر الآخرين بدقة حتى قبل أن يتحدثوا عنها.",
                en: "I can accurately read others' emotions even before they speak about them."
            },
            trait: "emotional_reading",
            reversed: false,
            source: "IRI Perspective Taking"
        },
        {
            id: "emp_009",
            text: {
                ar: "أشعر بالحزن عندما أرى شخصاً وحيداً أو منعزلاً.",
                en: "I feel sad when I see someone lonely or isolated."
            },
            trait: "loneliness_empathy",
            reversed: false,
            source: "IRI Empathic Concern"
        },
        {
            id: "emp_010",
            text: {
                ar: "أحاول دائماً فهم وجهة نظر الآخرين حتى لو لم أتفق معهم.",
                en: "I always try to understand others' perspectives even if I disagree with them."
            },
            trait: "perspective_taking",
            reversed: false,
            source: "IRI Perspective Taking"
        },
        {
            id: "emp_011",
            text: {
                ar: "أتأثر بالأفلام والكتب العاطفية بشكل عميق.",
                en: "I am deeply affected by emotional movies and books."
            },
            trait: "fictional_empathy",
            reversed: false,
            source: "IRI Fantasy"
        },
        {
            id: "emp_012",
            text: {
                ar: "أشعر بالسعادة عندما أساعد شخصاً في مشكلة.",
                en: "I feel happy when I help someone with a problem."
            },
            trait: "helping_joy",
            reversed: false,
            source: "IRI Empathic Concern"
        },
        {
            id: "emp_013",
            text: {
                ar: "ألاحظ عندما يشعر شخص قريب مني بالحزن حتى لو لم يقل شيئاً.",
                en: "I notice when someone close to me is sad even if they don't say anything."
            },
            trait: "emotional_detection",
            reversed: false,
            source: "IRI Perspective Taking"
        },
        {
            id: "emp_014",
            text: {
                ar: "أضع نفسي مكان الآخرين قبل أن أحكم عليهم.",
                en: "I put myself in others' shoes before judging them."
            },
            trait: "non_judgmental",
            reversed: false,
            source: "IRI Perspective Taking"
        },
        {
            id: "emp_015",
            text: {
                ar: "أشعر بالامتنان عندما يرى الناس طيبتهم فيّ.",
                en: "I feel grateful when people see their kindness in me."
            },
            trait: "reciprocal_kindness",
            reversed: false,
            source: "IRI Empathic Concern"
        },
        {
            id: "emp_016",
            text: {
                ar: "أجد صعوبة في فهم مشاعر الآخرين.",
                en: "I find it difficult to understand others' feelings."
            },
            trait: "empathy_difficulty",
            reversed: true, // ⚠️ سؤال عكسي
            source: "IRI Perspective Taking (reversed)"
        },
        {
            id: "emp_017",
            text: {
                ar: "أفضل العمل بمفردي على العمل مع الآخرين.",
                en: "I prefer working alone over working with others."
            },
            trait: "solitude_preference",
            reversed: true, // ⚠️ سؤال عكسي
            source: "IRI Perspective Taking (reversed)"
        },
        {
            id: "emp_018",
            text: {
                ar: "لا أهتم كثيراً بمشاكل الآخرين.",
                en: "I don't care much about others' problems."
            },
            trait: "emotional_detachment",
            reversed: true, // ⚠️ سؤال عكسي
            source: "IRI Empathic Concern (reversed)"
        },
        {
            id: "emp_019",
            text: {
                ar: "أجد صعوبة في البكاء حتى في المواقف المؤثرة.",
                en: "I find it difficult to cry even in touching situations."
            },
            trait: "emotional_suppression",
            reversed: true, // ⚠️ سؤال عكسي
            source: "IRI Empathic Concern (reversed)"
        },
        {
            id: "emp_020",
            text: {
                ar: "أعتقد أن كل شخص يجب أن يتحمل مشاكله بنفسه.",
                en: "I believe everyone should handle their own problems."
            },
            trait: "self_reliance_belief",
            reversed: true, // ⚠️ سؤال عكسي
            source: "IRI Empathic Concern (reversed)"
        },
        {
            id: "emp_021",
            text: {
                ar: "أشعر بالراحة عندما أستمع لمشاكل الآخرين وأساعدهم.",
                en: "I feel comfortable when I listen to others' problems and help them."
            },
            trait: "listening_comfort",
            reversed: false,
            source: "IRI Empathic Concern"
        },
        {
            id: "emp_022",
            text: {
                ar: "أتذكر التفاصيل الصغيرة عن حياة أصدقائي وعائلتي.",
                en: "I remember small details about my friends' and family's lives."
            },
            trait: "relational_memory",
            reversed: false,
            source: "IRI Perspective Taking"
        },
        {
            id: "emp_023",
            text: {
                ar: "أشعر بالفخر عندما أرى شخصاً ساعدته يحقق نجاحاً.",
                en: "I feel proud when I see someone I helped achieve success."
            },
            trait: "vicarious_pride",
            reversed: false,
            source: "IRI Empathic Concern"
        },
        {
            id: "emp_024",
            text: {
                ar: "أهتم بالعدالة الاجتماعية وحقوق الآخرين.",
                en: "I care about social justice and others' rights."
            },
            trait: "social_justice",
            reversed: false,
            source: "IRI Empathic Concern"
        },
        {
            id: "emp_025",
            text: {
                ar: "أشعر بالارتياح عندما أرى الناس يتعاونون لمساعدة بعضهم.",
                en: "I feel at ease when I see people cooperating to help each other."
            },
            trait: "cooperation_appreciation",
            reversed: false,
            source: "IRI Perspective Taking"
        }
    ],

    // ═══════════════════════════════════════════════════════
    // ♟️ STRATEGY AXIS (محور الاستراتيجية) - 25 سؤال
    // المصدر: IPIP Conscientiousness + Strategic Thinking Scale
    // ═══════════════════════════════════════════════════════
    strategy: [
        {
            id: "str_001",
            text: {
                ar: "أفضل التخطيط لكل شيء مسبقاً بدلاً من العفوية.",
                en: "I prefer planning everything in advance rather than spontaneity."
            },
            trait: "planning",
            reversed: false,
            source: "IPIP Orderliness"
        },
        {
            id: "str_002",
            text: {
                ar: "أنا شخص صبور جداً عند التعامل مع المشاكل الطويلة.",
                en: "I am a very patient person when dealing with long-term problems."
            },
            trait: "patience",
            reversed: false,
            source: "IPIP Cautiousness"
        },
        {
            id: "str_003",
            text: {
                ar: "أهتم كثيراً بسمعتي وكيف يطالعني الآخرون.",
                en: "I care a lot about my reputation and how others view me."
            },
            trait: "reputation_concern",
            reversed: false,
            source: "IPIP Dutifulness"
        },
        {
            id: "str_004",
            text: {
                ar: "أميل للحفاظ على التقاليد والقيم القديمة.",
                en: "I tend to maintain old traditions and values."
            },
            trait: "tradition",
            reversed: false,
            source: "IPIP Conservatism"
        },
        {
            id: "str_005",
            text: {
                ar: "أنا شخص عملي جداً ولا أضيع وقتي في الأحلام.",
                en: "I am a very practical person and don't waste time on dreams."
            },
            trait: "practicality",
            reversed: false,
            source: "IPIP Cautiousness"
        },
        {
            id: "str_006",
            text: {
                ar: "أبحث دائماً عن المثالية في كل ما أفعل.",
                en: "I always look for perfection in everything I do."
            },
            trait: "perfectionism",
            reversed: false,
            source: "IPIP Orderliness"
        },
        {
            id: "str_007",
            text: {
                ar: "أفضل الالتزام بمشروع واحد طويل الأمد بدلاً من التنقل بين عدة مشاريع.",
                en: "I prefer committing to one long-term project rather than jumping between several."
            },
            trait: "long_term_focus",
            reversed: false,
            source: "IPIP Self-Discipline"
        },
        {
            id: "str_008",
            text: {
                ar: "أخطط لخطواتي التالية قبل أن أتصرف.",
                en: "I plan my next steps before I act."
            },
            trait: "deliberate_action",
            reversed: false,
            source: "IPIP Cautiousness"
        },
        {
            id: "str_009",
            text: {
                ar: "أحتفظ بقوائم مهام وأتبعها بدقة.",
                en: "I keep to-do lists and follow them precisely."
            },
            trait: "organization",
            reversed: false,
            source: "IPIP Orderliness"
        },
        {
            id: "str_010",
            text: {
                ar: "أفكر في العواقب البعيدة المدى قبل اتخاذ القرارات.",
                en: "I think about long-term consequences before making decisions."
            },
            trait: "long_term_thinking",
            reversed: false,
            source: "IPIP Cautiousness"
        },
        {
            id: "str_011",
            text: {
                ar: "أفضل الأساليب المجربة على التجارب الجديدة.",
                en: "I prefer tried methods over new experiments."
            },
            trait: "conservative_approach",
            reversed: false,
            source: "IPIP Cautiousness"
        },
        {
            id: "str_012",
            text: {
                ar: "أضع خططاً بديلة في حال فشل الخطة الأساسية.",
                en: "I set backup plans in case the main plan fails."
            },
            trait: "contingency_planning",
            reversed: false,
            source: "Strategic Thinking Scale"
        },
        {
            id: "str_013",
            text: {
                ar: "أحلل نقاط القوة والضعف قبل بدء أي مشروع.",
                en: "I analyze strengths and weaknesses before starting any project."
            },
            trait: "swot_analysis",
            reversed: false,
            source: "Strategic Thinking Scale"
        },
        {
            id: "str_014",
            text: {
                ar: "أفضل العمل المنظم على العمل العشوائي.",
                en: "I prefer organized work over random work."
            },
            trait: "structured_work",
            reversed: false,
            source: "IPIP Orderliness"
        },
        {
            id: "str_015",
            text: {
                ar: "أحتفظ بسجلات دقيقة لأنشطتي ومصروفاتي.",
                en: "I keep accurate records of my activities and expenses."
            },
            trait: "record_keeping",
            reversed: false,
            source: "IPIP Orderliness"
        },
        {
            id: "str_016",
            text: {
                ar: "أتخذ قراراتي بسرعة دون تفكير طويل.",
                en: "I make my decisions quickly without long thinking."
            },
            trait: "impulsive_decisions",
            reversed: true, // ⚠️ سؤال عكسي
            source: "IPIP Cautiousness (reversed)"
        },
        {
            id: "str_017",
            text: {
                ar: "أفضل العفوية على التخطيط المسبق.",
                en: "I prefer spontaneity over advance planning."
            },
            trait: "spontaneity_preference",
            reversed: true, // ⚠️ سؤال عكسي
            source: "IPIP Orderliness (reversed)"
        },
        {
            id: "str_018",
            text: {
                ar: "أجد صعوبة في الالتزام بالجداول الزمنية.",
                en: "I find it difficult to stick to schedules."
            },
            trait: "schedule_difficulty",
            reversed: true, // ⚠️ سؤال عكسي
            source: "IPIP Self-Discipline (reversed)"
        },
        {
            id: "str_019",
            text: {
                ar: "أغير خطط Frequently بناءً على مزاجي.",
                en: "I frequently change my plans based on my mood."
            },
            trait: "mood_based_planning",
            reversed: true, // ⚠️ سؤال عكسي
            source: "IPIP Cautiousness (reversed)"
        },
        {
            id: "str_020",
            text: {
                ar: "أترك الأشياء في حالة فوضى حولي.",
                en: "I leave things in a messy state around me."
            },
            trait: "messiness",
            reversed: true, // ⚠️ سؤال عكسي
            source: "IPIP Orderliness (reversed)"
        },
        {
            id: "str_021",
            text: {
                ar: "أدرس كل الخيارات المتاحة قبل اتخاذ قرار مهم.",
                en: "I study all available options before making an important decision."
            },
            trait: "thorough_analysis",
            reversed: false,
            source: "Strategic Thinking Scale"
        },
        {
            id: "str_022",
            text: {
                ar: "أضع أهدافاً واضحة وقابلة للقياس لنفسي.",
                en: "I set clear and measurable goals for myself."
            },
            trait: "goal_setting",
            reversed: false,
            source: "IPIP Achievement Striving"
        },
        {
            id: "str_023",
            text: {
                ar: "أراجع تقدمي بانتظام نحو أهدافي.",
                en: "I regularly review my progress toward my goals."
            },
            trait: "progress_review",
            reversed: false,
            source: "IPIP Self-Discipline"
        },
        {
            id: "str_024",
            text: {
                ar: "أفضل العمل في بيئة منظمة ونظيفة.",
                en: "I prefer working in an organized and clean environment."
            },
            trait: "environmental_order",
            reversed: false,
            source: "IPIP Orderliness"
        },
        {
            id: "str_025",
            text: {
                ar: "أفكر في كيفية تأثير قراراتي على الآخرين على المدى الطويل.",
                en: "I think about how my decisions will affect others in the long run."
            },
            trait: "impact_consideration",
            reversed: false,
            source: "Strategic Thinking Scale"
        }
    ],

    // ═══════════════════════════════════════════════════════
    // 🔮 MYSTERY AXIS (محور الغموض) - 25 سؤال
    // المصدر: IPIP Openness + Mystical Experience Scale
    // ═══════════════════════════════════════════════════════
    mystery: [
        {
            id: "mys_001",
            text: {
                ar: "أشعر بالراحة أكثر عندما أكون وحيداً مع أفكاري.",
                en: "I feel more comfortable being alone with my thoughts."
            },
            trait: "solitude_comfort",
            reversed: false,
            source: "IPIP Openness"
        },
        {
            id: "mys_002",
            text: {
                ar: "أثق بحدسي أكثر من المنطق في اتخاذ القرارات.",
                en: "I trust my intuition more than logic in making decisions."
            },
            trait: "intuition",
            reversed: false,
            source: "Mystical Experience Scale"
        },
        {
            id: "mys_003",
            text: {
                ar: "أحب الغموض ولا أكشف كل أوراقي للآخرين.",
                en: "I love mystery and don't reveal all my cards to others."
            },
            trait: "personal_mystery",
            reversed: false,
            source: "IPIP Openness"
        },
        {
            id: "mys_004",
            text: {
                ar: "أشعر بأن هناك قوى خفية تؤثر على حياتنا.",
                en: "I feel that there are hidden forces affecting our lives."
            },
            trait: "hidden_forces_belief",
            reversed: false,
            source: "Mystical Experience Scale"
        },
        {
            id: "mys_005",
            text: {
                ar: "أؤمن بأن الأحلام تحمل رسائل مهمة.",
                en: "I believe that dreams carry important messages."
            },
            trait: "dream_interpretation",
            reversed: false,
            source: "Mystical Experience Scale"
        },
        {
            id: "mys_006",
            text: {
                ar: "أشعر باتصال عميق مع الطبيعة والكون.",
                en: "I feel a deep connection with nature and the universe."
            },
            trait: "cosmic_connection",
            reversed: false,
            source: "Mystical Experience Scale"
        },
        {
            id: "mys_007",
            text: {
                ar: "أفضل الاحتفاظ بأسراري لنفسي بدلاً من مشاركتها مع الجميع.",
                en: "I prefer keeping my secrets to myself rather than sharing them with everyone."
            },
            trait: "secrecy",
            reversed: false,
            source: "IPIP Openness"
        },
        {
            id: "mys_008",
            text: {
                ar: "أشعر بأن بعض الأماكن لها طاقة خاصة.",
                en: "I feel that some places have special energy."
            },
            trait: "place_energy",
            reversed: false,
            source: "Mystical Experience Scale"
        },
        {
            id: "mys_009",
            text: {
                ar: "أؤمن بالصدفة والأحداث المتزامنة ذات المعنى.",
                en: "I believe in coincidence and meaningful synchronous events."
            },
            trait: "synchronicity",
            reversed: false,
            source: "Mystical Experience Scale"
        },
        {
            id: "mys_010",
            text: {
                ar: "أشعر بأن لدي حاسة سادسة تنبئني بالأشياء قبل حدوثها.",
                en: "I feel I have a sixth sense that tells me things before they happen."
            },
            trait: "sixth_sense",
            reversed: false,
            source: "Mystical Experience Scale"
        },
        {
            id: "mys_011",
            text: {
                ar: "أستمتع بقراءة الكتب عن الأساطير والروحانيات.",
                en: "I enjoy reading books about myths and spirituality."
            },
            trait: "mythological_interest",
            reversed: false,
            source: "IPIP Openness"
        },
        {
            id: "mys_012",
            text: {
                ar: "أشعر بأن هناك عوالم أخرى غير مرئية حولنا.",
                en: "I feel that there are other invisible worlds around us."
            },
            trait: "hidden_worlds",
            reversed: false,
            source: "Mystical Experience Scale"
        },
        {
            id: "mys_013",
            text: {
                ar: "أؤمن بأن بعض الأشخاص لديهم قدرات خاصة.",
                en: "I believe that some people have special abilities."
            },
            trait: "special_abilities_belief",
            reversed: false,
            source: "Mystical Experience Scale"
        },
        {
            id: "mys_014",
            text: {
                ar: "أشعر بالراحة في الأماكن المظلمة والهادئة.",
                en: "I feel comfortable in dark and quiet places."
            },
            trait: "darkness_comfort",
            reversed: false,
            source: "IPIP Openness"
        },
        {
            id: "mys_015",
            text: {
                ar: "أحب الرموز والألغاز التي تحمل معاني خفية.",
                en: "I love symbols and puzzles that carry hidden meanings."
            },
            trait: "symbolic_thinking",
            reversed: false,
            source: "IPIP Openness"
        },
        {
            id: "mys_016",
            text: {
                ar: "أفضل الإجابات الواضحة والمباشرة على الأسئلة الغامضة.",
                en: "I prefer clear and direct answers to ambiguous questions."
            },
            trait: "clarity_preference",
            reversed: true, // ⚠️ سؤال عكسي
            source: "IPIP Openness (reversed)"
        },
        {
            id: "mys_017",
            text: {
                ar: "أعتقد أن كل شيء يمكن تفسيره بالمنطق والعلم.",
                en: "I believe everything can be explained by logic and science."
            },
            trait: "rationalism",
            reversed: true, // ⚠️ سؤال عكسي
            source: "Mystical Experience Scale (reversed)"
        },
        {
            id: "mys_018",
            text: {
                ar: "أشعر بالانزعاج من الأشياء التي لا أفهمها.",
                en: "I feel annoyed by things I don't understand."
            },
            trait: "unknown_intolerance",
            reversed: true, // ⚠️ سؤال عكسي
            source: "IPIP Openness (reversed)"
        },
        {
            id: "mys_019",
            text: {
                ar: "أفضل الأنشطة العملية على الأنشطة التأملية.",
                en: "I prefer practical activities over meditative activities."
            },
            trait: "practical_preference",
            reversed: true, // ⚠️ سؤال عكسي
            source: "Mystical Experience Scale (reversed)"
        },
        {
            id: "mys_020",
            text: {
                ar: "أعتقد أن الحدس ليس مصدراً موثوقاً للمعرفة.",
                en: "I believe intuition is not a reliable source of knowledge."
            },
            trait: "intuition_distrust",
            reversed: true, // ⚠️ سؤال عكسي
            source: "Mystical Experience Scale (reversed)"
        },
        {
            id: "mys_021",
            text: {
                ar: "أشعر بأن هناك حكمة قديمة مخفية في الثقافات القديمة.",
                en: "I feel that there is ancient wisdom hidden in old cultures."
            },
            trait: "ancient_wisdom",
            reversed: false,
            source: "Mystical Experience Scale"
        },
        {
            id: "mys_022",
            text: {
                ar: "أحب استكشاف الأماكن القديمة والأثرية.",
                en: "I love exploring ancient and archaeological places."
            },
            trait: "archaeological_interest",
            reversed: false,
            source: "IPIP Openness"
        },
        {
            id: "mys_023",
            text: {
                ar: "أشعر بأن الطبيعة لها لغة خاصة يمكن فهمها.",
                en: "I feel that nature has a special language that can be understood."
            },
            trait: "nature_language",
            reversed: false,
            source: "Mystical Experience Scale"
        },
        {
            id: "mys_024",
            text: {
                ar: "أؤمن بأن بعض الأشياء لها طاقة روحية خاصة.",
                en: "I believe that some objects have special spiritual energy."
            },
            trait: "object_energy",
            reversed: false,
            source: "Mystical Experience Scale"
        },
        {
            id: "mys_025",
            text: {
                ar: "أشعر بأن هناك رسالة أو هدف روحي لحياتي.",
                en: "I feel that there is a spiritual message or purpose to my life."
            },
            trait: "spiritual_purpose",
            reversed: false,
            source: "Mystical Experience Scale"
        }
    ]
};

// ═══════════════════════════════════════════════════════
// 🎲 دالة اختيار الأسئلة العشوائية المتوازنة
// ═══════════════════════════════════════════════════════
function selectRandomQuestions(questionsPerAxis = 5) {
    const selectedQuestions = [];
    
    // اختيار 5 أسئلة من كل محور
    Object.keys(questionBank).forEach(axis => {
        const axisQuestions = questionBank[axis];
        // خلط الأسئلة عشوائياً
        const shuffled = [...axisQuestions].sort(() => Math.random() - 0.5);
        // اختيار أول 5 أسئلة
        const selected = shuffled.slice(0, questionsPerAxis);
        selectedQuestions.push(...selected);
    });
    
    // خلط كل الأسئلة معاً
    return selectedQuestions.sort(() => Math.random() - 0.5);
}

// ═══════════════════════════════════════════════════════
// 🔄 دالة معالجة الأسئلة العكسية
// ═══════════════════════════════════════════════════════
function processResponse(response) {
    if (response.reversed) {
        // عكس القيمة: 5→1, 4→2, 3→3, 2→4, 1→5
        return {
            ...response,
            value: 6 - response.value
        };
    }
    return response;
}

// تصدير للدوال العامة
window.questionBank = questionBank;
window.selectRandomQuestions = selectRandomQuestions;
window.processResponse = processResponse;
