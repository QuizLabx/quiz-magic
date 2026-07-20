/**
 * 🛒 QuizMagic Store Data
 * كتالوج بضائع متجر الأساطير
 */

const STORE_ITEMS = {
    // 🖼️ 1. صور الملف الشخصي المربعة (PFPs)
    pfp: [
        { id: 'pfp_dragon_neon', price: 300, name: { ar: 'تنين النيون', en: 'Neon Dragon' }, image: 'assets/images/store/pfp/dragon_neon.jpg' },
        { id: 'pfp_phantom_spirit', price: 500, name: { ar: 'الروح الطيفية', en: 'Phantom Spirit' }, image: 'assets/images/store/pfp/phantom_spirit.jpg' },
        { id: 'pfp_frozen_griffin', price: 500, name: { ar: 'الغريفين الجليدي', en: 'Frozen Griffin' }, image: 'assets/images/store/pfp/frozen_griffin.jpg' }
        
    ],

    // 👑 2. الألقاب الفخرية (Titles)
    titles: [
        { id: 'title_explorer', price: 100, name: { ar: 'مستكشف الأساطير', en: 'Myth Explorer' }, color: '#3b82f6' }, // أزرق
        { id: 'title_shadow', price: 250, name: { ar: 'سيد الظلال', en: 'Shadow Lord' }, color: '#8b5cf6' }, // بنفسجي
        { id: 'title_dragon_tamer', price: 400, name: { ar: 'مروض التنانين', en: 'Dragon Tamer' }, color: '#ef4444' }, // أحمر
        { id: 'title_legend', price: 1000, name: { ar: 'أسطورة حية', en: 'Living Legend' }, color: '#fbbf24' } // ذهبي
    ],

    // 🌌 3. خلفيات الملف الشخصي (Banners)
    banners: [
        { id: 'banner_sunken_abyss_lighthouse', price: 700, name: { ar: 'منارة الهاوية الغارقة', en: 'Sunken Abyss Lighthouse' }, image: 'assets/images/store/banners/sunken_abyss_lighthouse.jpg' },        { id: 'banner_dark_royal_sword', price: 700, name: { ar: 'السيف الملكي المظلم', en: 'Dark Royal Sword' }, image: 'assets/images/store/banners/dark_royal_sword.jpg' },
        { id: 'banner_hellfire', price: 800, name: { ar: 'نيران الجحيم', en: 'Hellfire' }, image: 'assets/images/store/banners/hellfire.jpg' }
    ],

    // 🃏 4. أغلفة ظهر البطاقات (Card Sleeves)
    sleeves: [
        { id: 'sleeve_red_dragon', price: 500, name: { ar: 'غلاف التنين الأحمر', en: 'Red Dragon Sleeve' }, image: 'assets/images/store/sleeves/red_dragon.jpg' },
        { id: 'sleeve_cosmic', price: 800, name: { ar: 'الغلاف الكوني', en: 'Cosmic Sleeve' }, image: 'assets/images/store/sleeves/cosmic.jpg' },
        { id: 'sleeve_royal_gold', price: 1500, name: { ar: 'الغلاف الملكي الذهبي', en: 'Royal Gold Sleeve' }, image: 'assets/images/store/sleeves/royal_gold.jpg' }
    ]
};

// أسعار بيع البطاقات المكررة (السوق السوداء)
const CARD_SELL_PRICES = {
    'common': 10,
    'silver': 50,
    'gold': 200,
    'diamond': 1000
};
