// ============================================================
// 🎴 CARD TIERS SYSTEM - نظام مستويات البطاقات
// ============================================================

window.cardTiers = {
    // 🎯 تعريف المستويات الخمسة
    levels: {
        common: {
            id: 'common',
            name: { ar: 'عادية', en: 'Common' },
            weight: 50, // احتمالية الحصول عليه
            material: 'bronze', // المادة الأساسية
            effects: {
                holographic: false,
                particles: false,
                glow: false
            },
            stats: {
                multiplier: 1.0, // مضاعف الإحصائيات
                bonus: 0
            }
        },
        uncommon: {
            id: 'uncommon',
            name: { ar: 'غير شائعة', en: 'Uncommon' },
            weight: 25,
            material: 'copper',
            effects: {
                holographic: false,
                particles: false,
                glow: 'subtle'
            },
            stats: {
                multiplier: 1.1,
                bonus: 5
            }
        },
        rare: {
            id: 'rare',
            name: { ar: 'نادرة', en: 'Rare' },
            weight: 15,
            material: 'silver',
            effects: {
                holographic: 'light',
                particles: true,
                glow: 'medium'
            },
            stats: {
                multiplier: 1.25,
                bonus: 10
            }
        },
        epic: {
            id: 'epic',
            name: { ar: 'ملحمية', en: 'Epic' },
            weight: 7,
            material: 'gold',
            effects: {
                holographic: 'medium',
                particles: true,
                glow: 'strong',
                gems: true
            },
            stats: {
                multiplier: 1.5,
                bonus: 20
            }
        },
        legendary: {
            id: 'legendary',
            name: { ar: 'أسطورية', en: 'Legendary' },
            weight: 3,
            material: 'platinum',
            effects: {
                holographic: 'full',
                particles: true,
                glow: 'intense',
                gems: true,
                animated: true
            },
            stats: {
                multiplier: 1.8,
                bonus: 35
            }
        }
    },
    
    // 🎯 ترتيب المستويات
    order: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    
    // 🎯 الحصول على مستوى عشوائي
    getRandomTier: function() {
        const roll = Math.random() * 100;
        let cumulative = 0;
        
        for (const tierId of this.order) {
            cumulative += this.levels[tierId].weight;
            if (roll <= cumulative) {
                return tierId;
            }
        }
        
        return 'common';
    },
    
    // 🎯 ترقية البطاقة عند إعادة الاختبار
    tryUpgrade: function(creatureId) {
        const cards = this.getUserCards();
        const currentTier = cards[creatureId] || 'common';
        const currentIdx = this.order.indexOf(currentTier);
        
        // إذا كان في أعلى مستوى، لا ترقية
        if (currentIdx >= this.order.length - 1) {
            return currentTier;
        }
        
        // احتمالية 30% للترقية
        if (Math.random() <= 0.30) {
            const newTier = this.order[currentIdx + 1];
            cards[creatureId] = newTier;
            this.saveUserCards(cards);
            return newTier;
        }
        
        return currentTier;
    },
    
    // 🎯 الحصول على بطاقات المستخدم
    getUserCards: function() {
        try {
            return JSON.parse(localStorage.getItem('quiz_cards') || '{}');
        } catch {
            return {};
        }
    },
    
    // 🎯 حفظ بطاقات المستخدم
    saveUserCards: function(cards) {
        localStorage.setItem('quiz_cards', JSON.stringify(cards));
    },
    
    // 🎯 تعيين أو الحصول على مستوى البطاقة
    getOrAssign: function(creatureId) {
        const cards = this.getUserCards();
        
        if (!cards[creatureId]) {
            cards[creatureId] = this.getRandomTier();
            this.saveUserCards(cards);
        }
        
        return cards[creatureId];
    }
};

console.log('🎴 Card Tiers System loaded');