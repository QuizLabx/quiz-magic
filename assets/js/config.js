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
        showWelcomeScreen: true, // إظهار شاشة "كيف يعمل الاختبار" قبل البدء
        enableShare: true        // تفعيل ميزة المشاركة
    },

    // إعدادات تقنية
    analysisSpeed: 3500, // مدة ظهور شاشة "جاري التحليل" (بالملي ثانية)
    security: {
        enableCSP: true, // تفعيل سياسة أمن المحتوى (تجريبي)
        relNoopener: true // إضافة rel="noopener" تلقائياً للروابط الخارجية
    }
};
