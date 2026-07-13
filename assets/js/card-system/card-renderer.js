// ============================================================
// 🎨 CARD RENDERER - بناء HTML البطاقة الاحترافية
// ============================================================

window.cardRenderer = {
    // 🎯 دالة رئيسية لبناء HTML البطاقة
    renderCard: function(creature, tier, mode = 'preview') {
        const isAr = typeof currentLang !== 'undefined' && currentLang === 'ar';
        const tierData = window.cardTiers.levels[tier] || window.cardTiers.levels.common;
        const ability = window.cardAbilities.get ? window.cardAbilities.get(creature.id) : null;
        const username = typeof getUsername === 'function' ? getUsername() : (isAr ? 'مجهول' : 'Unknown');
        
        // حساب المستوى (1-100) بناءً على الندرة
        const level = this.calculateLevel(creature.rarity);
        
        // حساب الإحصائيات من بصمة الكائن
        const stats = this.calculateStats(creature, tierData);
        
        // الحصول على رقم البطاقة
        const cardNumber = this.getCardNumber(creature.id);
        
        // بناء HTML البطاقة
        return `
            <div class="magic-card tier-${tier} material-${tierData.material}">
                ${tierData.effects.holographic ? '<div class="holographic-foil"></div>' : ''}
                
                <div class="card-frame">
                    <div class="card-content">
                        
                        <!-- 🎯 HEADER: Logo + اسم الكائن + المستوى -->
                        <div class="card-header">
                            <div class="card-header-left">
                                <div class="card-logo">✨</div>
                                <div class="card-site-name">QuizMagic</div>
                            </div>
                            <div class="card-level">
                                <span>LV.${level}</span>
                                <span>${this.getAttributeIcon(creature)}</span>
                            </div>
                        </div>
                        
                        <!-- 🖼️ ARTWORK: الصورة الرئيسية -->
                        <div class="card-artwork">
                            <img src="${creature.image}" alt="${creature.name}" loading="lazy">
                            ${this.renderGems(tierData)}
                        </div>
                        
                        <!-- 🎯 اسم الكائن -->
                        <div class="card-creature-name-wrapper">
                            <h2 class="card-creature-name">${creature.name}</h2>
                            <div class="card-tier-badge">
                                <span class="tier-stars">${this.getTierStars(tier)}</span>
                                <span>${tierData.name[isAr ? 'ar' : 'en']}</span>
                            </div>
                        </div>
                        
                        <!-- 📊 STATS: الإحصائيات الست -->
                        <div class="card-stats-grid">
                            ${stats.map(stat => `
                                <div class="stat-item stat-${stat.id}">
                                    <div class="stat-icon">${stat.icon}</div>
                                    <div class="stat-value">${stat.value}</div>
                                    <div class="stat-label">${stat.label[isAr ? 'ar' : 'en']}</div>
                                    <div class="stat-bar">
                                        <div class="stat-bar-fill" style="width: ${stat.value}%"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <!-- ⚡ ABILITY: القدرة الخاصة -->
                        ${ability ? `
                            <div class="card-ability">
                                <div class="ability-header">
                                    <span class="ability-icon">${ability.icon}</span>
                                    <span class="ability-name">${ability.name[isAr ? 'ar' : 'en']}</span>
                                </div>
                                <p class="ability-description">${ability.description[isAr ? 'ar' : 'en']}</p>
                                <div class="ability-meta">
                                    ${ability.cost > 0 ? `<span class="ability-cost">💰 ${ability.cost}</span>` : ''}
                                    ${ability.cooldown > 0 ? `<span class="ability-cooldown">⏱️ ${ability.cooldown}</span>` : ''}
                                </div>
                            </div>
                        ` : ''}
                        
                        <!-- 🔻 FOOTER: اسم اللاعب + رقم البطاقة + QR -->
                        <div class="card-footer">
                            <div class="card-collector">
                                <span class="collector-label">${isAr ? 'الجامع' : 'COLLECTOR'}</span>
                                <span class="collector-name">${username}</span>
                            </div>
                            <div class="card-number">
                                #${cardNumber}/192
                            </div>
                            <div class="card-qr">
                                <div class="qr-placeholder">📱</div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        `;
    },
    
    // 🎯 حساب المستوى (1-100)
    calculateLevel: function(rarity) {
        const rarityMap = {
            'شائع': 25, 'Common': 25,
            'نادر': 50, 'Rare': 50,
            'نادر جداً': 75, 'Very Rare': 75,
            'أسطوري': 95, 'Legendary': 95
        };
        return rarityMap[rarity] || 50;
    },
    
    // 🎯 حساب الإحصائيات من بصمة الكائن
    calculateStats: function(creature, tierData) {
        const fingerprints = typeof CREATURE_FINGERPRINTS !== 'undefined' ? CREATURE_FINGERPRINTS : {};
        const fingerprint = fingerprints[creature.id] || {};
        
        const multiplier = tierData.stats.multiplier || 1.0;
        const bonus = tierData.stats.bonus || 0;
        
        return [
            {
                id: 'atk',
                icon: '⚔️',
                label: { ar: 'الهجوم', en: 'ATK' },
                value: Math.min(99, Math.round((fingerprint.willpower || 50) * multiplier + bonus))
            },
            {
                id: 'def',
                icon: '🛡️',
                label: { ar: 'الدفاع', en: 'DEF' },
                value: Math.min(99, Math.round((fingerprint.strategy || 50) * multiplier + bonus))
            },
            {
                id: 'spd',
                icon: '⚡',
                label: { ar: 'السرعة', en: 'SPD' },
                value: Math.min(99, Math.round((fingerprint.energy || 50) * multiplier + bonus))
            },
            {
                id: 'int',
                icon: '🧠',
                label: { ar: 'الذكاء', en: 'INT' },
                value: Math.min(99, Math.round((fingerprint.intelligence || 50) * multiplier + bonus))
            },
            {
                id: 'mag',
                icon: '🔮',
                label: { ar: 'السحر', en: 'MAG' },
                value: Math.min(99, Math.round((fingerprint.mystery || 50) * multiplier + bonus))
            },
            {
                id: 'hp',
                icon: '❤️',
                label: { ar: 'الصحة', en: 'HP' },
                value: Math.min(99, Math.round((fingerprint.empathy || 50) * multiplier + bonus))
            }
        ];
    },
    
    // 🎯 الحصول على أيقونة السمة
    getAttributeIcon: function(creature) {
        const axes = creature.axes || [];
        const primaryAxis = axes[0] || 'willpower';
        
        const iconMap = {
            'willpower': '🔥',
            'energy': '⚡',
            'intelligence': '🧠',
            'empathy': '💖',
            'strategy': '🎯',
            'mystery': '🔮'
        };
        
        return iconMap[primaryAxis] || '✨';
    },
    
    // 🎯 الحصول على نجوم المستوى
    getTierStars: function(tier) {
        const starMap = {
            'common': '•',
            'uncommon': '◆',
            'rare': '★',
            'epic': '★★',
            'legendary': '★★★'
        };
        return starMap[tier] || '•';
    },
    
    // 🎯 رسم الأحجار الكريمة للزوايا
    renderGems: function(tierData) {
        if (!tierData.effects.gems) return '';
        
        return `
            <div class="card-gems">
                <span class="gem-stone gem-red"></span>
                <span class="gem-stone gem-blue"></span>
                <span class="gem-stone gem-green"></span>
                <span class="gem-stone gem-purple"></span>
            </div>
        `;
    },
    
    // 🎯 الحصول على رقم البطاقة
    getCardNumber: function(creatureId) {
        try {
            const cards = typeof getUserCards === 'function' ? getUserCards() : {};
            const index = Object.keys(cards).indexOf(creatureId) + 1;
            return String(index || 1).padStart(3, '0');
        } catch {
            return '001';
        }
    }
};

console.log('🎨 Card Renderer loaded');