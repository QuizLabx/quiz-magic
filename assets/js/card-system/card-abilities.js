// ============================================================
// ⚡ CARD ABILITIES - قدرات الكائنات الأسطورية
// ============================================================

window.cardAbilities = {
    dragon: {
        name: { ar: "Breath of Fire", en: "Breath of Fire" },
        description: {
            ar: "يطلق لهباً يحرق جميع الأعداء ويترك حرقاً لـ 3 أدوار",
            en: "Deals 150% damage to all enemies. Burns for 3 turns"
        },
        icon: "🔥",
        cost: 4,
        cooldown: 3,
        type: "attack"
    },
    phoenix: {
        name: { ar: "Rebirth from Ashes", en: "Rebirth from Ashes" },
        description: {
            ar: "يعود للحياة بـ 50% من الصحة عند الهزيمة",
            en: "Revives with 50% HP when defeated"
        },
        icon: "🔥",
        cost: 0,
        cooldown: 0,
        type: "passive"
    },
    unicorn: {
        name: { ar: "Purifying Light", en: "Purifying Light" },
        description: {
            ar: "يشفي جميع الحلفاء ويزيل السموم",
            en: "Heals all allies and removes debuffs"
        },
        icon: "✨",
        cost: 3,
        cooldown: 4,
        type: "support"
    },
    sphinx: {
        name: { ar: "Riddle of Ages", en: "Riddle of Ages" },
        description: {
            ar: "يشل حركة العدو إذا فشل في حل اللغز",
            en: "Stuns enemy if they fail the riddle"
        },
        icon: "🧠",
        cost: 3,
        cooldown: 5,
        type: "control"
    },
    kraken: {
        name: { ar: "Deep Embrace", en: "Deep Embrace" },
        description: {
            ar: "يخفض سرعة جميع الأعداء بنسبة 50%",
            en: "Reduces all enemies' speed by 50%"
        },
        icon: "🌊",
        cost: 3,
        cooldown: 4,
        type: "control"
    },
    owl_of_athena: {
        name: { ar: "Ancient Wisdom", en: "Ancient Wisdom" },
        description: {
            ar: "يكشف نقاط ضعف العدو ويزيد الضرر 30%",
            en: "Reveals enemy weakness. +30% damage"
        },
        icon: "🦉",
        cost: 2,
        cooldown: 3,
        type: "support"
    },
    centaur: {
        name: { ar: "Arrow of the Wild", en: "Arrow of the Wild" },
        description: {
            ar: "رمية دقيقة لا تخطئ مع ضرر حرج 200%",
            en: "Never misses. 200% critical damage"
        },
        icon: "🏹",
        cost: 3,
        cooldown: 3,
        type: "attack"
    },
    cerberus: {
        name: { ar: "Triple Guard", en: "Triple Guard" },
        description: {
            ar: "يدافع عن 3 حلفاء ويزيد دفاعهم 40%",
            en: "Guards 3 allies. +40% defense"
        },
        icon: "🛡️",
        cost: 3,
        cooldown: 4,
        type: "defense"
    },
    faun: {
        name: { ar: "Melody of Joy", en: "Melody of Joy" },
        description: {
            ar: "يرفع معنويات الحلفاء ويزيد طاقتهم 25%",
            en: "Boosts allies' morale. +25% energy"
        },
        icon: "🎵",
        cost: 2,
        cooldown: 3,
        type: "support"
    },
    golem: {
        name: { ar: "Unbreakable Will", en: "Unbreakable Will" },
        description: {
            ar: "يصبح غير قابل للهزيمة لدورين",
            en: "Becomes invulnerable for 2 turns"
        },
        icon: "⛰️",
        cost: 4,
        cooldown: 6,
        type: "defense"
    },
    hydra: {
        name: { ar: "Multi-Head Assault", en: "Multi-Head Assault" },
        description: {
            ar: "يهاجم 3 مرات بأهداف عشوائية",
            en: "Attacks 3 times at random targets"
        },
        icon: "🐉",
        cost: 4,
        cooldown: 4,
        type: "attack"
    },
    kitsune: {
        name: { ar: "Illusion Master", en: "Illusion Master" },
        description: {
            ar: "يخلق نسخة وهمية تشتت الأعداء",
            en: "Creates an illusion that distracts enemies"
        },
        icon: "🦊",
        cost: 3,
        cooldown: 4,
        type: "control"
    },
    pegasus: {
        name: { ar: "Sky Dive", en: "Sky Dive" },
        description: {
            ar: "يهاجم من السماء مع ضرر 180% ويتفادى الهجوم التالي",
            en: "Aerial strike 180% damage. Dodges next attack"
        },
        icon: "🪽",
        cost: 4,
        cooldown: 4,
        type: "attack"
    },
    simurgh: {
        name: { ar: "Cosmic Vision", en: "Cosmic Vision" },
        description: {
            ar: "يكشف كل تحركات العدو لـ 3 أدوار",
            en: "Reveals all enemy moves for 3 turns"
        },
        icon: "🦅",
        cost: 3,
        cooldown: 5,
        type: "support"
    },
    siren: {
        name: { ar: "Enchanting Song", en: "Enchanting Song" },
        description: {
            ar: "تسحر العدو ليجعلها تحارب حلفاءه",
            en: "Charms enemy to fight their allies"
        },
        icon: "🎤",
        cost: 4,
        cooldown: 5,
        type: "control"
    },
    valkyrie: {
        name: { ar: "Spear of Valor", en: "Spear of Valor" },
        description: {
            ar: "رمية شرف تتجاهل كل الدفاعات",
            en: "Honorable strike that ignores all defense"
        },
        icon: "⚔️",
        cost: 4,
        cooldown: 4,
        type: "attack"
    }
};

// 🎯 الحصول على قدرة كائن
window.cardAbilities.get = function(creatureId) {
    return this[creatureId] || null;
};

console.log('⚡ Card Abilities System loaded');