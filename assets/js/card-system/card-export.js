// ============================================================
// 📤 CARD EXPORTER - تصدير البطاقة بنسختين مختلفتين
// ============================================================

window.cardExporter = {
    download: async function(format, creature, tier) {
        const isAr = typeof currentLang !== 'undefined' && currentLang === 'ar';
        
        try {
            // تحميل المكتبة
            if (typeof htmlToImage === 'undefined') {
                await this.loadLibrary();
            }
            
            // بناء HTML البطاقة
            const cardHTML = window.cardRenderer.renderCard(creature, tier, 'export');
            
            // حاوية مؤقتة
            const container = document.createElement('div');
            container.style.cssText = `
                position: fixed;
                left: -9999px;
                top: -9999px;
                z-index: -1;
                background: #0f172a;
            `;
            
            if (format === 'square') {
                // 📱 نسخة مربعة (1:1) - 1080x1080px
                container.style.width = '1080px';
                container.style.height = '1080px';
                container.innerHTML = `
                    <div style="
                        width: 1080px;
                        height: 1080px;
                        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 40px;
                        font-family: 'Cairo', sans-serif;
                        position: relative;
                        overflow: hidden;
                    ">
                        <!-- Logo -->
                        <div style="
                            position: absolute;
                            top: 30px;
                            left: 30px;
                            font-size: 1.5rem;
                            font-weight: 900;
                            background: linear-gradient(135deg, #a855f7, #ec4899);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            letter-spacing: 0.1em;
                        ">✨ QuizMagic</div>
                        
                        <!-- الصورة الرئيسية -->
                        <div style="
                            width: 500px;
                            height: 500px;
                            border-radius: 24px;
                            overflow: hidden;
                            border: 6px solid ${this.getTierColor(tier)};
                            box-shadow: 0 20px 60px rgba(168, 85, 247, 0.6);
                            margin-bottom: 30px;
                        ">
                            <img src="${creature.image}" style="width: 100%; height: 100%; object-fit: cover;" crossorigin="anonymous">
                        </div>
                        
                        <!-- اسم الكائن -->
                        <h1 style="
                            font-size: 3rem;
                            font-weight: 900;
                            color: #fff;
                            margin: 0 0 10px;
                            text-align: center;
                            text-shadow: 0 4px 20px rgba(168, 85, 247, 0.8);
                        ">${creature.name}</h1>
                        
                        <!-- الندرة -->
                        <div style="
                            display: inline-block;
                            padding: 8px 24px;
                            background: linear-gradient(135deg, #a855f7, #ec4899);
                            color: #fff;
                            border-radius: 999px;
                            font-weight: 900;
                            font-size: 1rem;
                            letter-spacing: 0.1em;
                            margin-bottom: 20px;
                            text-transform: uppercase;
                        ">${this.getTierName(tier, isAr)}</div>
                        
                        <!-- الإحصائيات الرئيسية (3 فقط للبساطة) -->
                        <div style="
                            display: flex;
                            gap: 20px;
                            margin-bottom: 20px;
                        ">
                            ${this.getMainStats(creature).map(stat => `
                                <div style="
                                    background: rgba(255,255,255,0.1);
                                    padding: 12px 20px;
                                    border-radius: 12px;
                                    text-align: center;
                                    border: 2px solid ${stat.color};
                                ">
                                    <div style="font-size: 2rem; line-height: 1;">${stat.icon}</div>
                                    <div style="font-size: 2rem; font-weight: 900; color: #fff; line-height: 1;">${stat.value}</div>
                                    <div style="font-size: 0.75rem; color: rgba(255,255,255,0.7); text-transform: uppercase; font-weight: 700;">${stat.label}</div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <!-- اسم اللاعب -->
                        <div style="
                            position: absolute;
                            bottom: 30px;
                            font-size: 1rem;
                            color: rgba(255,255,255,0.7);
                            font-weight: 700;
                        ">🎮 ${(typeof getUsername === 'function' ? getUsername() : '') || (isAr ? 'مجهول' : 'Unknown')}</div>
                        
                        <!-- الرابط -->
                        <div style="
                            position: absolute;
                            bottom: 30px;
                            right: 30px;
                            font-size: 0.875rem;
                            color: rgba(255,255,255,0.6);
                            font-weight: 600;
                        ">quizlabx.github.io/quiz-magic</div>
                    </div>
                `;
            } else {
                // 📄 نسخة كاملة (5:7) - 1050x1470px
                container.style.width = '1050px';
                container.style.height = '1470px';
                container.innerHTML = `
                    <div style="
                        width: 1050px;
                        height: 1470px;
                        transform-origin: top left;
                        transform: scale(${1050 / 450});
                    ">
                        ${cardHTML}
                    </div>
                `;
            }
            
            document.body.appendChild(container);
            
            // انتظار تحميل الخطوط والصور
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // تحويل إلى صورة
            const options = {
                quality: 1.0,
                pixelRatio: 2,
                backgroundColor: '#0f172a',
                cacheBust: true,
                filter: (node) => {
                    // تجاهل العناصر التي قد تسبب مشاكل
                    return !node.classList?.contains('no-export');
                }
            };
            
            let dataUrl;
            try {
                dataUrl = await htmlToImage.toPng(container.firstElementChild, options);
            } catch (e) {
                // Fallback: canvas مباشر
                dataUrl = await htmlToImage.toCanvas(container.firstElementChild, options).then(canvas => canvas.toDataURL('image/png'));
            }
            
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
    
    // الحصول على لون المستوى
    getTierColor: function(tier) {
        const colors = {
            common: '#8b5a2b',
            uncommon: '#b87333',
            rare: '#c0c0c0',
            epic: '#ffd700',
            legendary: '#e5e4e2'
        };
        return colors[tier] || colors.common;
    },
    
    // الحصول على اسم المستوى
    getTierName: function(tier, isAr) {
        const names = {
            common: isAr ? 'عادية' : 'Common',
            uncommon: isAr ? 'غير شائعة' : 'Uncommon',
            rare: isAr ? 'نادرة' : 'Rare',
            epic: isAr ? 'ملحمية' : 'Epic',
            legendary: isAr ? 'أسطورية' : 'Legendary'
        };
        return names[tier] || names.common;
    },
    
    // الحصول على 3 إحصائيات رئيسية
    getMainStats: function(creature) {
        const fingerprints = typeof CREATURE_FINGERPRINTS !== 'undefined' ? CREATURE_FINGERPRINTS : {};
        const fp = fingerprints[creature.id] || {};
        
        return [
            { icon: '⚔️', label: 'ATK', value: Math.round(fp.willpower || 50), color: '#ef4444' },
            { icon: '🛡️', label: 'DEF', value: Math.round(fp.strategy || 50), color: '#a855f7' },
            { icon: '⚡', label: 'SPD', value: Math.round(fp.energy || 50), color: '#eab308' }
        ];
    },
    
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

console.log('📤 Card Exporter v2 loaded');
