/**
 * QuizMagic Configuration File
 * استخدم هذا الملف لتحديث روابطك وإعدادات الموقع بسهولة
 */

const config = {
    // روابط وسائل التواصل الاجتماعي - ضع روابطك هنا
    socialLinks: {
        facebook: "https://www.facebook.com/profile.php?id=61591169685014",
        twitter: "https://twitter.com/quizmagic_official",
        instagram: "https://www.instagram.com/quizz.magic/",
        youtube: "https://youtube.com/@quizmagic",
        telegram: "https://t.me/quiz_magic"
    },
    
    // إعدادات الميزات
    features: {
        showWelcomeScreen: true, /// إظهار شاشة "كيف يعمل الاختبار" قبل البدء
        enableShare: true,        // تفعيل ميزة المشاركة
        enableHybridIdentity: true, // تفعيل ميزة الكائن المهيمن والمصاحب
        enablePowerBlueprint: true, // تفعيل مخطط القوى (Radar Chart)
        enableBadges: true         // تفعيل نظام الأوسمة
    },

    // إعدادات تقنية
    analysisSpeed: 3500, // مدة ظهور شاشة "جاري التحليل" (بالملي ثانية)
    security: {
        enableCSP: true, // تفعيل سياسة أمن المحتوى (تجريبي)
        relNoopener: true // إضافة rel="noopener" تلقائياً للروابط الخارجية
    },

    // تعريف محاور القوى (Power Axes)
    powerAxes: {
        ar: {
            intelligence: "الذكاء الحاد",
            energy: "الطاقة الحيوية",
            empathy: "التعاطف الروحي",
            strategy: "التخطيط الاستراتيجي",
            mystery: "الغموض والحدس",
            willpower: "قوة الإرادة"
        },
        en: {
            intelligence: "Sharp Intelligence",
            energy: "Vital Energy",
            empathy: "Spiritual Empathy",
            strategy: "Strategic Planning",
            mystery: "Mystery & Intuition",
            willpower: "Willpower"
        }
    },

        // ✨ شاشة الترحيب العامة (تظهر مرة واحدة عند أول زيارة)
    welcomeScreen: {
        enabled: true, // تفعيل/إيقاف شاشة الترحيب
        
        // النصوص متعددة اللغات
        texts: {
            ar: {
                title: "QuizMagic",
                subtitle: "عالم الاختبارات التفاعلية",
                welcomeMessage: "مرحباً بك في عالم QuizMagic! 🌟",
                welcomeDescription: "اكتشف نفسك من خلال اختباراتنا التفاعلية المتنوعة. كل اختبار هو رحلة جديدة لاكتشاف جوانب خفية من شخصيتك",
                
                // بطاقات المميزات
                features: [
                    {
                        icon: "🧠",
                        title: "تحليل عميق",
                        description: "خوارزميات ذكية تحلل شخصيتك بدقة"
                    },
                    {
                        icon: "🎨",
                        title: "نتائج تفاعلية",
                        description: "نتائج بصرية مذهلة قابلة للمشاركة"
                    },
                    {
                        icon: "🏆",
                        title: "إنجازات وأوسمة",
                        description: "اجمع الأوسمة وتحدى أصدقاءك"
                    },
                    {
                        icon: "🔐",
                        title: "تقارير سرية",
                        description: "محتوى حصري ينتظرك بعد كل اختبار"
                    }
                ],
                
                // الخيارات السريعة
                quickSettings: {
                    theme: "تبديل المظهر",
                    music: "الموسيقى",
                    language: "اللغة"
                },
                
                // زر البدء
                startButton: "✨ ابدأ رحلتك الآن",
                startHint: "اختر اختبارك المفضل من القائمة",
                
                // روابط سريعة (اختيارية)
                skipButton: "تخطي"
            },
            
            en: {
                title: "QuizMagic",
                subtitle: "Interactive Quiz Universe",
                welcomeMessage: "Welcome to QuizMagic! 🌟",
                welcomeDescription: "Discover yourself through our diverse interactive quizzes. Each quiz is a new journey to uncover hidden aspects of your personality",
                
                features: [
                    {
                        icon: "🧠",
                        title: "Deep Analysis",
                        description: "Smart algorithms analyze your personality accurately"
                    },
                    {
                        icon: "🎨",
                        title: "Interactive Results",
                        description: "Stunning visual results ready to share"
                    },
                    {
                        icon: "🏆",
                        title: "Achievements & Badges",
                        description: "Collect badges and challenge your friends"
                    },
                    {
                        icon: "🔐",
                        title: "Secret Reports",
                        description: "Exclusive content awaits after each quiz"
                    }
                ],
                
                quickSettings: {
                    theme: "Toggle Theme",
                    music: "Music",
                    language: "Language"
                },
                
                startButton: "✨ Begin Your Journey",
                startHint: "Choose your favorite quiz from the list",
                skipButton: "Skip"
            }
        }
    },

    // ==================== MAIN SECTIONS ====================
    mainSections: {
        enabled: true,
        
        // الأقسام الرئيسية
        sections: {
            mainGame: {
                id: 'main-game',
                icon: '🎮',
                title: {
                    ar: 'اللعبة الرئيسية',
                    en: 'Main Game'
                },
                subtitle: {
                    ar: 'ابدأ المغامرة الأسطورية',
                    en: 'Start the Legendary Adventure'
                },
                description: {
                    ar: 'انطلق في رحلة ملحمية عبر عوالم الأساطير والتحديات',
                    en: 'Embark on an epic journey through mythical worlds and challenges'
                },
                color: 'from-purple-500 to-pink-500',
                comingSoon: true
            },
            quizzes: {
                id: 'quizzes',
                icon: '🧬',
                title: {
                    ar: 'الاختبارات الفرعية',
                    en: 'Personality Quizzes'
                },
                subtitle: {
                    ar: 'اكتشف شخصيتك',
                    en: 'Discover Your Personality'
                },
                description: {
                    ar: 'اختبارات نفسية عميقة تكشف جوانب خفية من شخصيتك',
                    en: 'Deep psychological quizzes that reveal hidden aspects of your personality'
                },
                color: 'from-blue-500 to-cyan-500',
                comingSoon: false
            },
            encyclopedia: {
                id: 'encyclopedia',
                icon: '🏆',
                title: {
                    ar: 'الموسوعة والإنجازات',
                    en: 'Encyclopedia & Achievements'
                },
                subtitle: {
                    ar: 'استكشف المخلوقات',
                    en: 'Explore Mythical Creatures'
                },
                description: {
                    ar: 'موسوعة شاملة للكائنات الأسطورية وإنجازاتك',
                    en: 'Comprehensive encyclopedia of mythical creatures and your achievements'
                },
                color: 'from-amber-500 to-orange-500',
                comingSoon: false
            }
        }
    },

    // ==================== XP & LEVELS SYSTEM ====================
    xpSystem: {
        enabled: true,

        // نقاط XP حسب الندرة
        rarityXP: {
            'شائع': 30, 'Common': 30,
            'نادر': 80, 'Rare': 80,
            'نادر جداً': 150, 'Very Rare': 150,
            'أسطوري': 300, 'Legendary': 300,
            'خرافية': 500, 'Mythic': 500,
            'كونية': 1000, 'Cosmic': 1000
        },




        // مكافآت إضافية
        bonuses: {
            speedThreshold: 180,   // أقل من 3 دقائق
            speedBonus: 30,
            newCreatureBonus: 100, // كائن جديد لأول مرة
            retakeBonus: 10       // تكرار اختبار
        },

        // تعريف المستويات
        levels: {
            1: { xp: 0,     name: { ar: 'المبتدئ',    en: 'Novice' },   icon: '🌱', title: { ar: 'مبتدئ', en: 'Novice' } },
            2: { xp: 500,   name: { ar: 'المستكشف',  en: 'Explorer' }, icon: '🧭', title: { ar: 'مستكشف', en: 'Explorer' } },
            3: { xp: 2000,  name: { ar: 'المحارب',    en: 'Warrior' },  icon: '⚔️', title: { ar: 'محارب', en: 'Warrior' } },
            4: { xp: 5000,  name: { ar: 'البطل',      en: 'Champion' }, icon: '👑', title: { ar: 'بطل', en: 'Champion' } },
            5: { xp: 15000, name: { ar: 'الأسطورة',   en: 'Legend' },   icon: '🐉', title: { ar: 'أسطوري', en: 'Legendary' } }
        },

        // قفل السمات: null = مفتوحة، { level: N } = يتطلب مستوى N، { achievements: N } = يتطلب N إنجازات
        themeLocks: {
            dark:     null,
            light:    null,
            cyberpunk: { level: 2, requirement: { ar: 'المستوى 2 — المستكشف', en: 'Level 2 — Explorer' } },
            nature:   { level: 3, requirement: { ar: 'المستوى 3 — المحارب', en: 'Level 3 — Warrior' } },
            space:    { achievements: 8, requirement: { ar: '8 إنجازات مفتوحة', en: '8 achievements unlocked' } },
            retro:    { level: 5, requirement: { ar: 'المستوى 5 — الأسطورة', en: 'Level 5 — Legend' } }
        },

        // XP من الإنجازات
        achievementXP: 50
    }
};
