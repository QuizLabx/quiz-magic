// ============================================================
// 📤 CARD EXPORTER - تصدير البطاقة كصورة عالية الجودة
// ============================================================

window.cardExporter = {
    // 🎯 دالة رئيسية للتصدير
    download: async function(format, creature, tier) {
        const isAr = typeof currentLang !== 'undefined' && currentLang === 'ar';
        
        try {
            // تحميل المكتبة عند الحاجة
            if (typeof htmlToImage === 'undefined') {
                await this.loadLibrary();
            }
            
            // بناء HTML البطاقة في حاوية مؤقتة
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.left = '-9999px';
            container.style.top = '-9999px';
            container.style.width = format === 'square' ? '1080px' : '1050px';
            container.style.height = format === 'square' ? '1080px' : '1470px';
            container.innerHTML = window.cardRenderer.renderCard(creature, tier, 'export');
            document.body.appendChild(container);
            
            // انتظار تحميل الخطوط والصور
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // تحويل إلى صورة
            const options = {
                quality: 1.0,
                pixelRatio: format === 'square' ? 2 : 3,
                backgroundColor: '#0f172a',
                cacheBust: true
            };
            
            const dataUrl = await htmlToImage.toPng(container.firstElementChild, options);
            
            // تنزيل الصورة
            const link = document.createElement('a');
            const safeName = creature.id + '-' + tier;
            link.download = `QuizMagic-Card-${safeName}-${format}-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
            
            // تنظيف
            document.body.removeChild(container);
            
            // Analytics
            if (typeof trackEvent === 'function') {
                trackEvent('card_exported', {
                    'creature_id': creature.id,
                    'tier': tier,
                    'format': format
                });
            }
            
        } catch (error) {
            console.error('❌ Card export failed:', error);
            throw error;
        }
    },
    
    // 🎯 تحميل المكتبة
    loadLibrary: function() {
        return new Promise((resolve, reject) => {
            if (typeof htmlToImage !== 'undefined') {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
};

console.log('📤 Card Exporter loaded');