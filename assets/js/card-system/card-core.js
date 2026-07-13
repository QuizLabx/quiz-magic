// ============================================================
// 🎴 CARD SYSTEM CORE - النواة الأساسية لنظام البطاقات
// ============================================================

const CARD_SYSTEM_VERSION = '2.0.0';

// 🎯 دالة رئيسية لعرض البطاقة (معاينة)
window.showCardPreview = function(creature, tier) {
    console.log('🎴 Opening card preview:', creature.id, tier);
    
    const modal = document.getElementById('card-preview-modal');
    const container = document.getElementById('card-preview-container');
    const title = document.getElementById('card-preview-title');
    
    if (!modal || !container) {
        console.error('❌ Card preview modal not found');
        return;
    }
    
    const isAr = currentLang === 'ar';
    if (title) title.textContent = isAr ? 'معاينة البطاقة' : 'Card Preview';
    
    // بناء HTML للبطاقة
    const cardHTML = window.cardRenderer.renderCard(creature, tier, 'preview');
    container.innerHTML = cardHTML;
    
    // إظهار المودال
    modal.classList.add('show');
    
    // حبس التركيز
    if (typeof trapFocus === 'function') trapFocus(modal);
};

// 🎯 دالة إغلاق المعاينة
window.closeCardPreview = function() {
    const modal = document.getElementById('card-preview-modal');
    if (modal) {
        modal.classList.remove('show');
        if (typeof removeFocusTrap === 'function') removeFocusTrap(modal);
    }
};

// 🎯 دالة تنزيل البطاقة
window.downloadCard = async function(format, creature, tier) {
    const isAr = currentLang === 'ar';
    
    try {
        // إظهار مؤشر التحميل
        const toast = document.getElementById('achievement-toast');
        if (toast) {
            const title = toast.querySelector('.toast-title');
            const message = toast.querySelector('.toast-message');
            const icon = toast.querySelector('.toast-icon');
            
            toast.style.background = 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
            title.textContent = isAr ? 'جاري التحضير...' : 'Preparing...';
            message.textContent = isAr ? 'يتم إنشاء البطاقة عالية الجودة' : 'Generating high-quality card';
            icon.textContent = '⏳';
            toast.classList.add('show');
        }
        
        // انتظار صغير للسماح برسم الـ toast
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // تنزيل البطاقة
        await window.cardExporter.download(format, creature, tier);
        
        // إخفاء الـ toast
        if (toast) {
            setTimeout(() => {
                toast.classList.remove('show');
                toast.style.background = '';
            }, 2000);
        }
        
        // Analytics
        if (typeof trackEvent === 'function') {
            trackEvent('card_download', { 
                'creature_id': creature.id, 
                'tier': tier,
                'format': format 
            });
        }
        
    } catch (error) {
        console.error('❌ Card download failed:', error);
        
        if (typeof showErrorToast === 'function') {
            showErrorToast(
                isAr ? 'حدث خطأ أثناء تنزيل البطاقة' : 'Error downloading card',
                isAr
            );
        }
    }
};

// 🎯 تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎴 Card System v' + CARD_SYSTEM_VERSION + ' initialized');
});