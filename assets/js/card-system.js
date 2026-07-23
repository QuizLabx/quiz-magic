/* ============================================================
   🃏 COLLECTIBLE CARD SYSTEM
   نظام البطاقات القابلة للجمع - ملف منفصل
   ============================================================ 
   هذا الملف يحتوي على جميع دوال وإعدادات نظام البطاقات
   ============================================================ */

// ==================== CONSTANTS ====================

// مفاتيح التخزين المحلي
const CARDS_KEY = 'quiz_cards';

/// مستويات البطاقات
const CARD_TIERS = {
    common:  { key: 'common',  label: { ar: 'عادية', en: 'Common' },    weight: 47 },
    silver:  { key: 'silver',  label: { ar: 'فضية', en: 'Silver' },    weight: 25 },
    gold:    { key: 'gold',    label: { ar: 'ذهبية', en: 'Gold' },      weight: 15 },
    diamond: { key: 'diamond', label: { ar: 'ماسية', en: 'Diamond' },  weight: 10 },
    mythic:  { key: 'mythic',  label: { ar: 'خرافية', en: 'Mythic' },   weight: 2.5 },
    cosmic:  { key: 'cosmic',  label: { ar: 'كونية', en: 'Cosmic' },    weight: 0.5 }
};

const TIER_ORDER = ['common', 'silver', 'gold', 'diamond', 'mythic', 'cosmic'];


// التكوين البصري لكل مستوى
// ============================================================
// التكوين البصري للمواد الفيزيائية (المرحلة الأولى: النقاء والمعدن)
// ============================================================
const TIER_VISUALS = {
    common: { // سبيكة برونزية / نحاس عتيق
        // تدرجات المعدن (من الظلام إلى النور لمحاكاة الانعكاس)
        baseGradient: ['#2E1D12', '#5D4037', '#3E2723', '#8D6E63', '#1A110A'],
        // ألوان النحت والبروز (3D Engraving)
        highlight: 'rgba(255, 255, 255, 0.15)',
        shadow: 'rgba(0, 0, 0, 0.7)',
        textAccent: '#D7CCC8',
        glow: 'rgba(141, 110, 99, 0.4)',
        // خصائص المادة
        isTranslucent: false, // صلب
        glassOpacity: 0.2,    // لمعة زجاجية خفيفة
        rankLabel: { ar: 'برونزي', en: 'BRONZE' }
    },
    silver: { // سبيكة فضة مصقولة / فولاذ نقي
        baseGradient: ['#212121', '#757575', '#E0E0E0', '#9E9E9E', '#121212'],
        highlight: 'rgba(255, 255, 255, 0.7)',
        shadow: 'rgba(0, 0, 0, 0.6)',
        textAccent: '#FFFFFF',
        glow: 'rgba(224, 224, 224, 0.5)',
        isTranslucent: false,
        glassOpacity: 0.4,
        rankLabel: { ar: 'فضي', en: 'SILVER' }
    },
    gold: { // سبيكة ذهب خالص عاكس للضوء
        baseGradient: ['#332600', '#B8860B', '#FFF8DC', '#D4AF37', '#1A1300'],
        highlight: 'rgba(255, 255, 255, 0.8)',
        shadow: 'rgba(0, 0, 0, 0.7)',
        textAccent: '#FFF8DC',
        glow: 'rgba(212, 175, 55, 0.6)',
        isTranslucent: false,
        glassOpacity: 0.5,
        rankLabel: { ar: 'ذهبي', en: 'GOLD' }
    },
    diamond: { // كريستال ماسي نقي (شفاف)
        // ألوان شبه شفافة (rgba) لدمجها مع الخلفية والصورة
        baseGradient: [
            'rgba(0, 10, 30, 0.5)', 
            'rgba(0, 255, 255, 0.3)', 
            'rgba(255, 255, 255, 0.6)', 
            'rgba(0, 150, 255, 0.4)', 
            'rgba(0, 5, 15, 0.7)'
        ],
        highlight: 'rgba(255, 255, 255, 0.95)',
        shadow: 'rgba(0, 20, 50, 0.5)',
        textAccent: '#E0FFFF',
        glow: 'rgba(0, 255, 255, 0.8)',
        // خصائص المادة الماسية
        isTranslucent: true,  // شفاف! سيسمح بمرور الضوء والصورة
        glassOpacity: 0.8,    // لمعة زجاجية قوية جداً (انكسار ضوئي)
        rankLabel: { ar: 'ماسي', en: 'DIAMOND' }
    },

      mythic: { // خرافية (أحمر وأسود)
        baseGradient: ['#050505', '#1a0b14', '#0a0005', '#2d0a1f', '#000000'],
        highlight: 'rgba(255, 0, 85, 0.4)',
        shadow: 'rgba(0, 0, 0, 0.95)',
        textAccent: '#ff1a66',
        glow: 'rgba(255, 0, 85, 0.6)',
        isTranslucent: false,
        glassOpacity: 0.1,
        rankLabel: { ar: 'خرافي', en: 'MYTHIC' }
    },
    dark: { // الثقب الأسود (المظلمة الحقيقية)
        baseGradient: ['#000000', '#030303', '#000000', '#050505', '#000000'],
        highlight: 'rgba(70, 0, 130, 0.3)', // إضاءة بنفسجية داكنة جداً (أفق الحدث)
        shadow: 'rgba(0, 0, 0, 1)',
        textAccent: '#8a8a8a', // رمادي فضي باهت
        glow: 'rgba(20, 0, 40, 0.9)', // توهج الثقب الأسود
        isTranslucent: false,
        glassOpacity: 0.02, // شبه معدومة اللمعان (تمتص الضوء)
        rankLabel: { ar: 'مظلم', en: 'DARK' }
    },
    cosmic: { // سديم الفضاء اللانهائي
        baseGradient: ['#0b001a', '#1a0033', '#001133', '#330033', '#00001a'],
        highlight: 'rgba(0, 255, 255, 0.8)',
        shadow: 'rgba(0, 0, 0, 0.8)',
        textAccent: '#e6ffff',
        glow: 'rgba(138, 43, 226, 0.8)',
        isTranslucent: true,
        glassOpacity: 0.6,
        rankLabel: { ar: 'كوني', en: 'COSMIC' }
    }

};


// تأثيرات الكائنات الأسطورية
const CREATURE_EFFECTS = {
    dragon: {
        particleType: 'embers',
        particleColor: '#ff6b35',
        particleCount: 45,
        glowColor: 'rgba(255, 107, 53, 0.4)',
        auraColor: 'rgba(220, 38, 38, 0.15)',
        specialEffect: 'fire_aura'
    },
    phoenix: {
        particleType: 'feathers',
        particleColor: '#fbbf24',
        particleCount: 35,
        glowColor: 'rgba(251, 191, 36, 0.4)',
        auraColor: 'rgba(234, 88, 12, 0.15)',
        specialEffect: 'golden_glow'
    },
    unicorn: {
        particleType: 'sparkles',
        particleColor: '#f0abfc',
        particleCount: 50,
        glowColor: 'rgba(240, 171, 252, 0.4)',
        auraColor: 'rgba(236, 72, 153, 0.15)',
        specialEffect: 'rainbow_sparkle'
    },
    sphinx: {
        particleType: 'sand',
        particleColor: '#d4a574',
        particleCount: 40,
        glowColor: 'rgba(212, 165, 116, 0.35)',
        auraColor: 'rgba(139, 92, 246, 0.12)',
        specialEffect: 'mystic_runes'
    },
    kraken: {
        particleType: 'bubbles',
        particleColor: '#67e8f9',
        particleCount: 40,
        glowColor: 'rgba(103, 232, 249, 0.4)',
        auraColor: 'rgba(3, 105, 161, 0.15)',
        specialEffect: 'water_waves'
    },
    owl_of_athena: {
        particleType: 'stars',
        particleColor: '#c4b5fd',
        particleCount: 55,
        glowColor: 'rgba(196, 181, 253, 0.4)',
        auraColor: 'rgba(124, 58, 237, 0.12)',
        specialEffect: 'constellation'
    },
    centaur: {
        particleType: 'leaves',
        particleColor: '#86efac',
        particleCount: 35,
        glowColor: 'rgba(134, 239, 172, 0.35)',
        auraColor: 'rgba(5, 150, 105, 0.12)',
        specialEffect: 'nature_aura'
    },
    cerberus: {
        particleType: 'shadows',
        particleColor: '#64748b',
        particleCount: 30,
        glowColor: 'rgba(100, 116, 139, 0.3)',
        auraColor: 'rgba(31, 41, 55, 0.2)',
        specialEffect: 'dark_aura'
    },
    faun: {
        particleType: 'petals',
        particleColor: '#fda4af',
        particleCount: 40,
        glowColor: 'rgba(253, 164, 175, 0.35)',
        auraColor: 'rgba(132, 204, 22, 0.1)',
        specialEffect: 'floral_burst'
    },
    golem: {
        particleType: 'crystals',
        particleColor: '#a78bfa',
        particleCount: 25,
        glowColor: 'rgba(167, 139, 250, 0.35)',
        auraColor: 'rgba(107, 114, 128, 0.15)',
        specialEffect: 'crystal_shards'
    },
    hydra: {
        particleType: 'droplets',
        particleColor: '#7dd3fc',
        particleCount: 45,
        glowColor: 'rgba(125, 211, 252, 0.35)',
        auraColor: 'rgba(127, 29, 29, 0.12)',
        specialEffect: 'multi_heads'
    },
    kitsune: {
        particleType: 'fox_fire',
        particleColor: '#60a5fa',
        particleCount: 35,
        glowColor: 'rgba(96, 165, 250, 0.4)',
        auraColor: 'rgba(249, 115, 22, 0.12)',
        specialEffect: 'illusion_trails'
    },
    pegasus: {
        particleType: 'feathers_white',
        particleColor: '#e0e7ff',
        particleCount: 40,
        glowColor: 'rgba(224, 231, 255, 0.4)',
        auraColor: 'rgba(59, 130, 246, 0.12)',
        specialEffect: 'sky_aura'
    },
    simurgh: {
        particleType: 'rainbow_feathers',
        particleColor: '#f0abfc',
        particleCount: 45,
        glowColor: 'rgba(217, 70, 239, 0.4)',
        auraColor: 'rgba(217, 70, 239, 0.15)',
        specialEffect: 'cosmic_aura'
    },
    siren: {
        particleType: 'waves',
        particleColor: '#22d3ee',
        particleCount: 40,
        glowColor: 'rgba(34, 211, 238, 0.4)',
        auraColor: 'rgba(6, 182, 212, 0.12)',
        specialEffect: 'ocean_depth'
    },
    valkyrie: {
        particleType: 'runes',
        particleColor: '#fbbf24',
        particleCount: 30,
        glowColor: 'rgba(251, 191, 36, 0.4)',
        auraColor: 'rgba(220, 38, 38, 0.12)',
        specialEffect: 'divine_light'
    }
};

// ==================== CARD MANAGEMENT FUNCTIONS ====================

function getUserCards() {
    try { 
        const cards = JSON.parse(localStorage.getItem(CARDS_KEY) || '{}');
        
        // 🔄 نظام التوافق (Migration): تحويل البيانات القديمة إلى النظام الجديد
        let migrated = false;
        for (const id in cards) {
            // إذا كانت البطاقة محفوظة كنص (مثلاً 'gold')، نحولها لمصفوفة ['common', 'silver', 'gold']
            if (typeof cards[id] === 'string') {
                const tier = cards[id];
                const tierIdx = TIER_ORDER.indexOf(tier);
                cards[id] = TIER_ORDER.slice(0, tierIdx + 1);
                migrated = true;
            }
        }
        if (migrated) saveUserCards(cards); // حفظ التحديثات فوراً
        
        return cards;
    } 
    catch (e) { 
        console.log('❌ Error reading cards from localStorage:', e);
        return {}; 
    }
}

function saveUserCards(cards) {
    localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
}

function getRandomTier() {
    const roll = Math.random() * 100;
    let cumulative = 0;
    for (const tier of TIER_ORDER) {
        cumulative += CARD_TIERS[tier].weight;
        if (roll <= cumulative) return tier;
    }
    return 'common';
}

function getOrAssignCardTier(creatureId) {
    const cards = getUserCards();
    
    // إذا لم يكن يملك أي بطاقة لهذا الكائن
    if (!cards[creatureId] || cards[creatureId].length === 0) {
        const initialTier = getRandomTier();
        const tierIdx = TIER_ORDER.indexOf(initialTier);
        // نحفظ كل المستويات وصولاً للمستوى الذي حصل عليه
        cards[creatureId] = TIER_ORDER.slice(0, tierIdx + 1);
        saveUserCards(cards);
    }
    
    // إرجاع أعلى مستوى (آخر عنصر في المصفوفة) لكي يعمل باقي الموقع بشكل طبيعي
    const userTiers = cards[creatureId];
    return userTiers[userTiers.length - 1];
}

function tryUpgradeCard(creatureId) {
    const cards = getUserCards();
    
    // حماية إضافية
    if (!cards[creatureId] || !Array.isArray(cards[creatureId])) {
        return getOrAssignCardTier(creatureId);
    }

    const currentTiers = cards[creatureId];
    const highestTier = currentTiers[currentTiers.length - 1];
    const currentIdx = TIER_ORDER.indexOf(highestTier);
    
    if (currentIdx >= TIER_ORDER.length - 1) return highestTier; // وصل للماسي

    // 30% فرصة للترقية عند إعادة الاختبار
    if (Math.random() <= 0.30) {
        const newTier = TIER_ORDER[currentIdx + 1];
        if (!currentTiers.includes(newTier)) {
            currentTiers.push(newTier); // إضافة البطاقة الجديدة للمجموعة
            saveUserCards(cards);
        }
        return newTier;
    }
    return highestTier;
}

// ==================== HELPER FUNCTIONS ====================

function loadImageAsDataURL(src) {
    return new Promise((resolve, reject) => {
        if (!src) { resolve(null); return; }
        fetch(src, { mode: 'cors' })
            .then(r => r.ok ? r.blob() : Promise.reject(new Error('fetch failed')))
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = () => resolve(null);
                    img.src = reader.result;
                };
                reader.onerror = () => resolve(null);
                reader.readAsDataURL(blob);
            })
            .catch(() => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => resolve(img);
                img.onerror = () => resolve(null);
                img.src = src;
            });
    });
}

function wrapText(ctx, text, maxWidth, maxLines) {
    if (!text) return [];
    const words = String(text).split(/\s+/);
    const lines = [];
    let current = '';
    for (const w of words) {
        const test = current ? current + ' ' + w : w;
        if (ctx.measureText(test).width > maxWidth && current) {
            lines.push(current);
            current = w;
            if (maxLines && lines.length >= maxLines) break;
        } else {
            current = test;
        }
    }
    if (current && (!maxLines || lines.length < maxLines)) lines.push(current);
    if (maxLines && lines.length === maxLines && words.length > lines.join(' ').split(/\s+/).length) {
        let last = lines[maxLines - 1];
        while (ctx.measureText(last + '…').width > maxWidth && last.length > 0) last = last.slice(0, -1);
        lines[maxLines - 1] = last + '…';
    }
    return lines;
}

function roundRectPath(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
}

// ==================== PARTICLE RENDERING FUNCTIONS ====================

function drawParticle(ctx, type, x, y, size, color, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    
    switch(type) {
        case 'embers':
            ctx.shadowColor = color;
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = alpha * 0.3;
            ctx.beginPath();
            ctx.arc(x - size * 2, y + size, size * 0.6, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'feathers':
            ctx.shadowColor = color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.ellipse(x, y, size * 1.5, size * 0.5, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'sparkles':
            ctx.shadowColor = color;
            ctx.shadowBlur = 15;
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                const angle = (i * Math.PI / 2);
                ctx.lineTo(x + Math.cos(angle) * size * 1.5, y + Math.sin(angle) * size * 1.5);
                ctx.lineTo(x + Math.cos(angle + Math.PI/4) * size * 0.4, y + Math.sin(angle + Math.PI/4) * size * 0.4);
            }
            ctx.closePath();
            ctx.fill();
            break;
        case 'sand':
            ctx.beginPath();
            ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'bubbles':
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.shadowColor = color;
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.beginPath();
            ctx.arc(x - size * 0.3, y - size * 0.3, size * 0.25, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'stars':
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI / 3);
                const radius = i % 2 === 0 ? size : size * 0.4;
                ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
            }
            ctx.closePath();
            ctx.fill();
            break;
        case 'leaves':
            ctx.beginPath();
            ctx.ellipse(x, y, size * 1.2, size * 0.6, Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(x - size * 0.8, y - size * 0.4);
            ctx.lineTo(x + size * 0.8, y + size * 0.4);
            ctx.stroke();
            break;
        case 'shadows':
            ctx.fillStyle = `rgba(30,30,30,${alpha * 0.5})`;
            ctx.beginPath();
            ctx.arc(x, y, size * 2, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'petals':
            ctx.shadowColor = color;
            ctx.shadowBlur = 5;
            ctx.beginPath();
            ctx.ellipse(x, y, size, size * 0.7, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'crystals':
            ctx.shadowColor = color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.moveTo(x, y - size);
            ctx.lineTo(x + size * 0.7, y);
            ctx.lineTo(x, y + size);
            ctx.lineTo(x - size * 0.7, y);
            ctx.closePath();
            ctx.fill();
            break;
        case 'droplets':
            ctx.shadowColor = color;
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.moveTo(x, y - size);
            ctx.bezierCurveTo(x + size, y, x + size * 0.5, y + size, x, y + size);
            ctx.bezierCurveTo(x - size * 0.5, y + size, x - size, y, x, y - size);
            ctx.fill();
            break;
        case 'fox_fire':
            ctx.shadowColor = color;
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.moveTo(x, y - size * 1.5);
            ctx.bezierCurveTo(x + size * 0.8, y - size * 0.5, x + size, y + size, x, y + size * 0.8);
            ctx.bezierCurveTo(x - size, y + size, x - size * 0.8, y - size * 0.5, x, y - size * 1.5);
            ctx.fill();
            break;
        case 'feathers_white':
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.shadowColor = '#fff';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.ellipse(x, y, size * 1.5, size * 0.5, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'rainbow_feathers':
            const rainbowColors = ['#ff006e', '#fb5607', '#ffbe0b', '#8338ec', '#3a86ff'];
            ctx.fillStyle = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
            ctx.shadowColor = ctx.fillStyle;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.ellipse(x, y, size * 1.3, size * 0.5, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'waves':
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x - size * 2, y);
            ctx.bezierCurveTo(x - size, y - size, x + size, y + size, x + size * 2, y);
            ctx.stroke();
            break;
        case 'runes':
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;
            ctx.font = `${size * 2}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const runes = ['ᚱ', 'ᚦ', 'ᚨ', 'ᚷ', 'ᛗ', 'ᛟ'];
            ctx.fillText(runes[Math.floor(Math.random() * runes.length)], x, y);
            break;
        default:
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
    }
    ctx.restore();
}

function drawCreatureParticles(ctx, creatureId, W, H, pad) {
    const effects = CREATURE_EFFECTS[creatureId];
    if (!effects) return;
    
    const { particleType, particleColor, particleCount } = effects;
    
    const positions = [
        ...Array.from({length: Math.floor(particleCount * 0.3)}, () => ({
            x: pad + Math.random() * (W - pad * 2),
            y: pad + 80 + Math.random() * 150
        })),
        ...Array.from({length: Math.floor(particleCount * 0.4)}, () => ({
            x: pad + Math.random() * (W - pad * 2),
            y: H * 0.25 + Math.random() * H * 0.3
        })),
        ...Array.from({length: Math.floor(particleCount * 0.3)}, () => ({
            x: pad + Math.random() * (W - pad * 2),
            y: H * 0.7 + Math.random() * (H * 0.2)
        }))
    ];
    
    positions.forEach((pos, i) => {
        const size = 2 + Math.random() * 6;
        const alpha = 0.4 + Math.random() * 0.6;
        drawParticle(ctx, particleType, pos.x, pos.y, size, particleColor, alpha);
    });
}

function drawCreatureAura(ctx, creatureId, x, y, width, height) {
    const effects = CREATURE_EFFECTS[creatureId];
    if (!effects || !effects.auraColor) return;
    
    ctx.save();
    const auraGradient = ctx.createRadialGradient(
        x + width / 2, y + height / 2, Math.min(width, height) * 0.3,
        x + width / 2, y + height / 2, Math.max(width, height) * 0.7
    );
    auraGradient.addColorStop(0, effects.auraColor);
    auraGradient.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = auraGradient;
    ctx.fillRect(x - 50, y - 50, width + 100, height + 100);
    ctx.restore();
}

function drawCreatureGlow(ctx, creatureId, x, y, radius) {
    const effects = CREATURE_EFFECTS[creatureId];
    if (!effects || !effects.glowColor) return;
    
    ctx.save();
    ctx.shadowColor = effects.glowColor;
    ctx.shadowBlur = 40;
    ctx.fillStyle = effects.glowColor;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

// رسم ملمس الورق/المعدن (Noise Texture)
function drawNoiseTexture(ctx, W, H, opacity = 0.04) {
    ctx.save();
    ctx.globalAlpha = opacity;
    
    // إنشاء Canvas صغير للضوضاء وتكراره (لتحسين الأداء)
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = 200;
    noiseCanvas.height = 200;
    const nCtx = noiseCanvas.getContext('2d');
    const imgData = nCtx.createImageData(200, 200);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() * 255;
        data[i] = val;     // Red
        data[i+1] = val;   // Green
        data[i+2] = val;   // Blue
        data[i+3] = 255;   // Alpha
    }
    nCtx.putImageData(imgData, 0, 0);
    
    const pattern = ctx.createPattern(noiseCanvas, 'repeat');
    ctx.fillStyle = pattern;
    ctx.globalCompositeOperation = 'overlay'; // دمج الملمس مع الألوان تحته
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
}

// تأثير الهولوجرام المحدث (يتفاعل مع الضوء)
function drawHolographicEffect(ctx, W, H, intensity = 0.3) {
    ctx.save();
    // استخدام color-dodge يجعل الألوان تضيء بشكل واقعي كأنها قصدير لامع (Foil)
    ctx.globalCompositeOperation = 'color-dodge';
    ctx.globalAlpha = intensity;
    
    const holoGradient = ctx.createLinearGradient(0, 0, W, H);
    holoGradient.addColorStop(0, 'rgba(255, 0, 110, 0.8)');
    holoGradient.addColorStop(0.2, 'rgba(251, 86, 7, 0.8)');
    holoGradient.addColorStop(0.4, 'rgba(255, 190, 11, 0.8)');
    holoGradient.addColorStop(0.6, 'rgba(131, 56, 236, 0.8)');
    holoGradient.addColorStop(0.8, 'rgba(58, 134, 255, 0.8)');
    holoGradient.addColorStop(1, 'rgba(6, 255, 165, 0.8)');
    
    ctx.fillStyle = holoGradient;
    ctx.fillRect(0, 0, W, H);
    
    // خطوط الانكسار الضوئي
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = intensity * 0.5;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    for (let i = -H; i < W + H; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + H, H);
        ctx.stroke();
    }
    
    ctx.restore();
}

function drawWatermark(ctx, W, H) {
    ctx.save();
    ctx.globalAlpha = 0.04;
    ctx.font = '900 200px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('QM', W / 2, H / 2);
    ctx.restore();
}

function drawQRCode(ctx, x, y, size) {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, size, size);
    
    ctx.fillStyle = '#0f172a';
    const cellSize = size / 21;
    
    const drawFinderPattern = (px, py) => {
        ctx.fillRect(px, py, cellSize * 7, cellSize * 7);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(px + cellSize, py + cellSize, cellSize * 5, cellSize * 5);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(px + cellSize * 2, py + cellSize * 2, cellSize * 3, cellSize * 3);
    };
    
    drawFinderPattern(x, y);
    drawFinderPattern(x + cellSize * 14, y);
    drawFinderPattern(x, y + cellSize * 14);
    
    for (let i = 8; i < 13; i++) {
        for (let j = 8; j < 13; j++) {
            if (Math.random() > 0.5) {
                ctx.fillRect(x + i * cellSize, y + j * cellSize, cellSize, cellSize);
            }
        }
    }
    
    ctx.restore();
}

// ==================== MAIN CARD RENDERER (المرحلة 2 و 3: النقاء والمادة) ====================

// 1. دالة النحت المحدثة (تستخدم إضاءة وظلال قوية لضمان القراءة)
function drawEngravedText(ctx, text, x, y, visual, isEmbossed = false) {
    ctx.save();
    const offset = 1.5; 
    
    // 🌟 السحر هنا: ظل أسود قوي جداً خلف النص ليفصله عن أي خلفية مضيئة
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // رسم اللون الأساسي للنص
    ctx.fillStyle = visual.textAccent;
    ctx.fillText(text, x, y);
    
    // إيقاف الظل القوي لكي لا يتكرر في اللمعة
    ctx.shadowColor = 'transparent';
    
    // رسم الإضاءة (Highlight) لإعطاء تأثير الحفر/البروز
    ctx.fillStyle = visual.highlight;
    ctx.globalAlpha = 0.6;
    ctx.fillText(text, x + (isEmbossed ? -offset : offset), y + (isEmbossed ? -offset : offset));
    
    ctx.restore();
}


// 2. تحديث مخطط القوى ليتناسب مع النقاء الجديد
function drawCardRadarChart(ctx, cx, cy, radius, creature, visual, isAr) {
    const axes = ['willpower', 'intelligence', 'energy', 'empathy', 'strategy', 'mystery'];
    const labels = isAr ? 
        ['الإرادة', 'الذكاء', 'الطاقة', 'التعاطف', 'الاستراتيجية', 'الغموض'] : 
        ['Willpower', 'Intelligence', 'Energy', 'Empathy', 'Strategy', 'Mystery'];

    const stats = axes.map(axis => {
        if (creature && creature.fingerprint && typeof creature.fingerprint[axis] === 'number') {
            return creature.fingerprint[axis];
        }

        if (
            typeof CREATURE_FINGERPRINTS !== 'undefined' &&
            creature &&
            creature.id &&
            CREATURE_FINGERPRINTS[creature.id] &&
            typeof CREATURE_FINGERPRINTS[creature.id][axis] === 'number'
        ) {
            return CREATURE_FINGERPRINTS[creature.id][axis];
        }

        if (creature && creature.axes && typeof creature.axes[axis] === 'number') {
            return creature.axes[axis];
        }

        return 60 + (Math.random() * 35);
    });

    const sides = 6;
    const angleStep = (Math.PI * 2) / sides;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-Math.PI / 2);

    // الشبكة الخلفية (زجاجية ناعمة)
    ctx.lineWidth = 1;
    ctx.strokeStyle = visual.highlight;
    ctx.globalAlpha = 0.3;
    for (let level = 1; level <= 4; level++) {
        const r = radius * (level / 4);
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            const x = Math.cos(i * angleStep) * r;
            const y = Math.sin(i * angleStep) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    }

    // مضلع البيانات (يتوهج بلون المادة)
    ctx.globalAlpha = 1.0;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        const val = stats[i] / 100;
        const r = radius * val;
        const x = Math.cos(i * angleStep) * r;
        const y = Math.sin(i * angleStep) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    
    ctx.fillStyle = visual.glow;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = visual.textAccent;
    ctx.stroke();

      // النصوص
    ctx.rotate(Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // 🌟 تكبير خط الرادار
    ctx.font = '800 24px Cairo, sans-serif'; 
    ctx.fillStyle = visual.textAccent;

    for (let i = 0; i < sides; i++) {
        const angle = (i * angleStep) - Math.PI / 2;
        // 🌟 زيادة المسافة لكي لا يتداخل الخط الكبير مع المضلع
        const labelRadius = radius + 45; 
        const x = Math.cos(angle) * labelRadius;
        const y = Math.sin(angle) * labelRadius;
        
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        
        ctx.fillText(labels[i], x, y);
    }
    ctx.restore();
}



// 3. الدالة الرئيسية (التحفة الفنية)
async function renderCollectibleCardCanvas(creature, tier) {
    const isAr = typeof currentLang !== 'undefined' ? currentLang === 'ar' : false;
    const username = typeof getUsername === 'function' ? getUsername() : (isAr ? 'مجهول' : 'Unknown');
    const tierLabel = CARD_TIERS[tier] ? CARD_TIERS[tier].label[isAr ? 'ar' : 'en'] : tier;
    const visual = TIER_VISUALS[tier] || TIER_VISUALS.common;

    const W = 1440, H = 2016;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (document.fonts && document.fonts.ready) {
        try {
            await document.fonts.ready;
            await Promise.all([
                document.fonts.load('900 90px Cairo'),
                document.fonts.load('700 42px Cairo'),
                document.fonts.load('600 34px Cairo'),
                document.fonts.load('500 30px Cairo')
            ]);
        } catch (e) { }
    }

    const pad = 80;
    const innerW = W - pad * 2;

    // ==========================================
    // 1. بناء جسم البطاقة (المادة الأساسية)
    // ==========================================
    
    // السحر الماسي: إذا كانت شفافة، نرسم صورة الكائن كخلفية ضبابية أولاً
    if (visual.isTranslucent && creature && creature.image) {
        const bgImg = await loadImageAsDataURL(creature.image);
        if (bgImg) {
            ctx.save();
            ctx.filter = 'blur(20px) brightness(0.7)';
            ctx.drawImage(bgImg, 0, 0, W, H);
            ctx.restore();
        }
    }

    // رسم تدرج المادة (السبيكة أو الكريستال)
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, visual.baseGradient[0]);
    bgGrad.addColorStop(0.25, visual.baseGradient[1]);
    bgGrad.addColorStop(0.5, visual.baseGradient[2]);
    bgGrad.addColorStop(0.75, visual.baseGradient[3]);
    bgGrad.addColorStop(1, visual.baseGradient[4]);
    
    ctx.fillStyle = bgGrad;
    if (visual.isTranslucent) {
        ctx.globalCompositeOperation = 'hard-light'; // دمج الكريستال مع الصورة
    }
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';

    // ملمس المادة (Noise)
    drawNoiseTexture(ctx, W, H, visual.isTranslucent ? 0.03 : 0.06);

    // تظليل الحواف للعمق
    const vig = ctx.createRadialGradient(W / 2, H / 2, W * 0.4, W / 2, H / 2, W);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, visual.isTranslucent ? 'rgba(0,10,30,0.6)' : 'rgba(0,0,0,0.8)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);

        // ==========================================
    // 1.5. النجوم للبطاقة الكونية (Cosmic Stars)
    // ==========================================
    if (tier === 'cosmic') {
        ctx.save();
        for (let i = 0; i < 150; i++) {
            const x = Math.random() * W;
            const y = Math.random() * H;
            const r = Math.random() * 2.5;
            const opacity = Math.random();
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.shadowColor = ['#00ffff', '#ff00ff', '#ffffff'][Math.floor(Math.random() * 3)];
            ctx.shadowBlur = Math.random() * 10;
            ctx.fill();
        }
        ctx.restore();
    }


   
   // ✨ تفعيل تأثير الهولوجرام (ألوان الطيف اللامعة)
    if (tier === 'diamond') {
        drawHolographicEffect(ctx, W, H, 0.4); // هولوجرام قوي للماسية
    } else if (tier === 'gold') {
        drawHolographicEffect(ctx, W, H, 0.15); // هولوجرام خفيف جداً للذهبية
    }
   
    // ==========================================
    // 2. الجزيئات والهالة
    // ==========================================
    if (creature && creature.id) {
        drawCreatureAura(ctx, creature.id, 0, 0, W, H);
        if (tier !== 'common') {
            drawCreatureParticles(ctx, creature.id, W, H, pad);
        }
    }

    // ==========================================
    // 3. الإطار الداخلي المنحوت (نقي وبدون مسامير)
    // ==========================================
    const fi = 40;
    ctx.save();
    ctx.lineWidth = 3;
    ctx.strokeStyle = visual.highlight;
    roundRectPath(ctx, fi, fi, W - fi * 2, H - fi * 2, 30);
    ctx.stroke();
    
    ctx.lineWidth = 3;
    ctx.strokeStyle = visual.shadow;
    roundRectPath(ctx, fi + 3, fi + 3, W - fi * 2, H - fi * 2, 30);
    ctx.stroke();
    ctx.restore();

    let yCursor = fi + 80;

    // ==========================================
    // 4. الترويسة
    // ==========================================
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 75px Cairo, Tajawal, sans-serif';
    const creatureName = creature ? (creature.name || 'Unknown') : 'Unknown';
    drawEngravedText(ctx, creatureName, W / 2, yCursor, visual, true);
    ctx.restore();

    yCursor += 80;

    // ==========================================
    // 5. صورة الكائن (مدمجة بنعومة)
    // ==========================================
    const imgW = innerW - 40;
    const imgH = 750;
    const imgX = pad + 20;
    const imgY = yCursor;

    ctx.save();
    // إطار نحيف جداً ومضيء للصورة
    ctx.lineWidth = 2;
    ctx.strokeStyle = visual.highlight;
    roundRectPath(ctx, imgX - 2, imgY - 2, imgW + 4, imgH + 4, 20);
    ctx.stroke();

    roundRectPath(ctx, imgX, imgY, imgW, imgH, 18);
    ctx.clip();
    
    if (creature && creature.image) {
        const img = await loadImageAsDataURL(creature.image);
        if (img) {
            // إذا كانت البطاقة ماسية، نجعل الصورة شبه شفافة لتندمج مع الكريستال
            if (visual.isTranslucent) {
                ctx.globalAlpha = 0.85;
                ctx.globalCompositeOperation = 'luminosity';
            }
            ctx.drawImage(img, imgX, imgY, imgW, imgH);
            ctx.globalAlpha = 1.0;
            ctx.globalCompositeOperation = 'source-over';
        }
    }
    
    // ظل داخلي ناعم جداً لدمج حواف الصورة مع المعدن
    ctx.lineWidth = 15;
    ctx.strokeStyle = visual.shadow;
    roundRectPath(ctx, imgX, imgY, imgW, imgH, 18);
    ctx.stroke();
    ctx.restore(); // إنهاء القص

    yCursor += imgH + 60;

    // ==========================================
    // 6. شريط الندرة (منحوت في المعدن)
    // ==========================================
    ctx.save();
    // بدلاً من خلفية صلبة، نرسم تجويفاً في المعدن
    ctx.fillStyle = visual.shadow;
    ctx.globalAlpha = 0.3;
    roundRectPath(ctx, W/2 - 200, yCursor, 400, 60, 30);
    ctx.fill();
    
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = visual.highlight;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '700 30px Cairo, Tajawal, sans-serif';
    const rarityText = (isAr ? '★ ' : '★ ') + tierLabel.toUpperCase() + (isAr ? ' ★' : ' EDITION ★');
    drawEngravedText(ctx, rarityText, W / 2, yCursor + 30, visual, false);
    ctx.restore();

    yCursor += 100;

    // ==========================================
    // 7. صندوق الوصف (زجاج داكن لضمان القراءة)
    // ==========================================
    const descH = 220;
    ctx.save();
    // 🌟 جعلنا الزجاج داكناً بنسبة 45% لكي يبرز النص الأبيض فوقه
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    roundRectPath(ctx, pad + 20, yCursor, innerW - 40, descH, 20);
    ctx.fill();
    
    // لمعة الزجاج على الحواف
    ctx.strokeStyle = visual.highlight;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.4;
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // 🎯 3B-1: رسم القدرة الخاصة بالكائن بدل الوصف السردي (استبدال شامل)
    const _ability = (typeof getCreatureAbility === 'function' && creature && creature.id)
      ? getCreatureAbility(creature.id, tier, isAr)
      : null;
    if (_ability) {
      const _origAccent = visual.textAccent;
      // عنوان القدرة (ذهبي ساطع)
      ctx.font = '900 38px Cairo, Tajawal, sans-serif';
      visual.textAccent = '#fbbf24';
      drawEngravedText(ctx, _ability.name, W / 2, yCursor + 48, visual, true);
      // قيمة القدرة المتدرّجة (ملوّنة حسب اتجاه التأثير)
      if (_ability.valueText) {
        ctx.font = '900 44px Cairo, Tajawal, sans-serif';
        visual.textAccent = _ability.valueColor || '#fde68a';
        drawEngravedText(ctx, _ability.valueText, W / 2, yCursor + 104, visual, true);
    }
    // وصف القدرة (نص صغير ملتف، سطرين كحد أقصى)
    ctx.font = '600 26px Cairo, Tajawal, sans-serif';
    visual.textAccent = _origAccent;
    const _abLines = wrapText(ctx, _ability.desc, innerW - 100, 2);
    _abLines.forEach((line, i) => {
      drawEngravedText(ctx, line, W / 2, yCursor + 152 + i * 34, visual, false);
    });
    visual.textAccent = _origAccent;
    } else {
      // احتياطي آمن: إن لم توجد قدرة معرّفة، يُرسم الوصف السردي القديم
      ctx.font = '700 28px Cairo, Tajawal, sans-serif';
      const description = creature ? (creature.description || '') : '';
      const descLines = wrapText(ctx, description, innerW - 100, 4);
      descLines.forEach((line, i) => {
        drawEngravedText(ctx, line, W / 2, yCursor + descH / 2 + (i - descLines.length / 2 + 0.5) * 38, visual, false);
      });
    }
    ctx.restore();
    yCursor += descH + 60;

    // ==========================================
    // 8. مخطط القوى (تم رفعه للأعلى بعد نقل الاسم)
    // ==========================================
    yCursor += 160; // مسافة مناسبة بعد صندوق الوصف
    drawCardRadarChart(ctx, W / 2, yCursor, 140, creature, visual, isAr); // تكبير حجم الرادار قليلاً


   // ==========================================
    // 9. التذييل (QR Code، اسم المستكشف، والختم)
    // ==========================================
    const footerY = H - pad - 160; // رفعنا التذييل بالكامل قليلاً
    
    // --- 1. الـ QR Code (على اليسار) ---
    const qrSize = 130;
    const qrX = pad + 20;
    const qrY = footerY - 20; // 🌟 رفع مربع الـ QR للأعلى
    const siteUrl = encodeURIComponent('https://quizlabx.github.io/quiz-magic/' );
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${siteUrl}&color=0f172a&bgcolor=ffffff`;
    
    ctx.save( );
    const qrImg = await loadImageAsDataURL(qrApiUrl);
    if (qrImg) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        roundRectPath(ctx, qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 16);
        ctx.fill();
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
    } else {
        drawQRCode(ctx, qrX, qrY, qrSize);
    }
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    // 🌟 تكبير خط "امسح للعب"
    ctx.font = '900 24px Cairo, Tajawal, sans-serif'; 
    drawEngravedText(ctx, isAr ? 'امسح للعب' : 'SCAN TO PLAY', qrX + qrSize / 2, qrY + qrSize + 25, visual, false);
    ctx.restore();

    // --- 2. اسم المستكشف (في المنتصف بالأسفل) ---
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '700 26px Cairo, Tajawal, sans-serif';
    // 🌟 إنزال كلمة "المستكشف" قليلاً للأسفل
    drawEngravedText(ctx, isAr ? 'المستكشف' : 'Explorer', W / 2, footerY + 40, visual, false);
    
    // 🌟 تلوين اسم المستخدم بالذهبي الساطع وتكبيره
    const originalAccent = visual.textAccent;
    visual.textAccent = '#fbbf24'; // لون ذهبي مميز
    // 🌟 تكبير الخط من 50 إلى 60
    ctx.font = '900 60px Cairo, Tajawal, sans-serif';
    // 🌟 إنزال الاسم لزيادة الفراغ بينه وبين كلمة المستكشف
    drawEngravedText(ctx, username, W / 2, footerY + 100, visual, true);
    visual.textAccent = originalAccent; // استرجاع اللون الأصلي لكي لا تتأثر باقي العناصر
    ctx.restore();


    // --- 3. الرقم التسلسلي والختم (على اليمين) ---
    const serialText = `SN: ${Math.random().toString(36).substr(2, 6).toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`;
    ctx.save();
    ctx.textAlign = 'right';
    ctx.font = '800 26px Cairo, sans-serif';
    drawEngravedText(ctx, serialText, W - pad - 20, footerY + 100, visual, false);
    
    ctx.translate(W - pad - 90, footerY + 30);
    ctx.rotate(-0.15);
    ctx.beginPath();
    ctx.arc(0, 0, 45, 0, Math.PI * 2);
    ctx.strokeStyle = visual.shadow;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.strokeStyle = visual.highlight;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.font = '900 20px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    drawEngravedText(ctx, 'OFFICIAL', 0, -12, visual, true);
    drawEngravedText(ctx, 'SEAL', 0, 12, visual, true);
    ctx.restore();


    // ==========================================
    // 10. الطبقة الزجاجية النهائية (The Pristine Glass Overlay)
    // ==========================================
    ctx.save();
    // رسم مضلع يقطع البطاقة قطرياً ليعطي لمعة الزجاج
    const glassGrad = ctx.createLinearGradient(0, 0, W, H);
    glassGrad.addColorStop(0, `rgba(255, 255, 255, ${visual.glassOpacity})`);
    glassGrad.addColorStop(0.4, `rgba(255, 255, 255, ${visual.glassOpacity * 0.2})`);
    glassGrad.addColorStop(0.41, 'rgba(255, 255, 255, 0)');
    glassGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = glassGrad;
    ctx.globalCompositeOperation = 'screen';
    ctx.fillRect(0, 0, W, H);
    
    // إضافة لمعة خفيفة جداً على الحواف الخارجية للبطاقة
    ctx.lineWidth = 4;
    ctx.strokeStyle = `rgba(255, 255, 255, ${visual.glassOpacity * 0.8})`;
    ctx.strokeRect(0, 0, W, H);
    ctx.restore();

    return canvas;
}

// ==================== DOWNLOAD FUNCTION ====================

async function downloadCollectibleCard(btn, creature, tier) {
    const originalText = btn.innerHTML;
    const isAr = typeof currentLang !== 'undefined' ? currentLang === 'ar' : false;
    btn.innerHTML = '<i class="fas fa-spinner animate-spin"></i> ' + (isAr ? 'جاري الرسم...' : 'Rendering...');
    btn.disabled = true;
    try {
        const canvas = await renderCollectibleCardCanvas(creature, tier);
        const link = document.createElement('a');
        const safeName = creature.id + '-' + tier;
        link.download = 'QuizMagic-Card-' + safeName + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        if (typeof trackEvent === 'function') trackEvent('card_download', { 'creature_id': creature.id, 'tier': tier });
    } catch (err) {
        console.error('Card download failed:', err);
        if (typeof showErrorToast === 'function') {
            showErrorToast(isAr ? 'حدث خطأ أثناء رسم البطاقة' : 'Error rendering card', isAr);
        }
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}
// ========================================================================
// 🎯 3B-1: CREATURE ABILITIES (قدرات الكائنات + عرضها المتدرّج على البطاقة)
// ========================================================================
// معاملات التدرّج حسب الندرة (مطابقة لما سيُستخدم في السيرفر في 3B-2)
const ABILITY_TIER_MULTIPLIERS = {
  common: 1.0, silver: 1.25, gold: 1.5, diamond: 1.8, mythic: 2.2, cosmic: 2.75
};
// اختصارات أسماء المحاور (لقدرة passive_axis)
const ABILITY_AXIS_SHORT = {
  ar: { intelligence: 'ذكاء', energy: 'طاقة', empathy: 'تعاطف', strategy: 'استراتيجية', mystery: 'غموض', willpower: 'إرادة' },
  en: { intelligence: 'INT', energy: 'ENR', empathy: 'EMP', strategy: 'STR', mystery: 'MYS', willpower: 'WIL' }
};
// خريطة القدرات الـ 16 (القيم الأساسية base = عند الندرة العادية)
const CREATURE_ABILITIES = {
  dragon:        { type: 'on_win', base: 15, name: { ar: 'نَفَس التنين', en: "Dragon's Breath" }, desc: { ar: 'عند فوزك بالجولة، يلحق التنين ضرراً إضافياً بالحارس.', en: 'On round win, the dragon deals bonus damage to the guardian.' } },
  phoenix:       { type: 'revive', basePercent: 40, name: { ar: 'انبعاث الرماد', en: 'Ash Rebirth' }, desc: { ar: 'مرة واحدة: إن سقطتَ، ينبعث العنقاء من رماده.', en: 'Once: if you fall, the phoenix rises from its ashes.' } },
  unicorn:       { type: 'passive_axis', axis: 'empathy', base: 10, name: { ar: 'هالة النقاء', en: 'Purity Aura' }, desc: { ar: 'قوة إضافية دائمة في محور التعاطف.', en: 'Permanent bonus power on the Empathy axis.' } },
  sphinx:        { type: 'reveal', baseInsight: 8, name: { ar: 'كشف اللغز', en: 'Riddle Sight' }, desc: { ar: 'يكشف بطاقة الحارس، ويمنحك بصيرة إضافية.', en: 'Reveals the guardian card and grants bonus insight.' } },
  kraken:        { type: 'on_clash_reduce', base: 12, name: { ar: 'قبضة الأعماق', en: 'Abyssal Grip' }, desc: { ar: 'عند التصادم، تخنق قبضته قوة بطاقة الخصم.', en: 'On clash, its grip chokes the foe card power.' } },
  owl_of_athena: { type: 'passive_axis', axis: 'intelligence', base: 10, name: { ar: 'حكمة أثينا', en: "Athena's Wisdom" }, desc: { ar: 'قوة إضافية دائمة في محور الذكاء.', en: 'Permanent bonus power on the Intelligence axis.' } },
  centaur:       { type: 'on_win', base: 10, name: { ar: 'اندفاع السهول', en: 'Plains Charge' }, desc: { ar: 'عند فوزك بالجولة، يضيف اندفاعه ضرراً إضافياً.', en: 'On round win, its charge adds bonus damage.' } },
  cerberus:      { type: 'passive_axis', axis: 'willpower', base: 8, name: { ar: 'حرّاس البوابة', en: 'Gate Wardens' }, desc: { ar: 'قوة إضافية دائمة في محور الإرادة.', en: 'Permanent bonus power on the Willpower axis.' } },
  faun:          { type: 'on_win_heal', base: 12, name: { ar: 'همس الغابة', en: 'Forest Whisper' }, desc: { ar: 'عند فوزك بالجولة، يشفيك همس الغابة.', en: 'On round win, the forest whisper heals you.' } },
  golem:         { type: 'passive_armor', base: 8, name: { ar: 'جلد الصخر', en: 'Stone Skin' }, desc: { ar: 'درع دائم يقلّل الضرر الوارد عليك.', en: 'Permanent armor that reduces incoming damage.' } },
  hydra:         { type: 'on_win', base: 18, name: { ar: 'رؤوس متجددة', en: 'Regrowing Heads' }, desc: { ar: 'عند فوزك بالجولة، تضرب رؤوسها بضرر إضافي.', en: 'On round win, its heads strike for bonus damage.' } },
  kitsune:       { type: 'on_clash_illusion', base: 10, name: { ar: 'خداع الأرواح', en: 'Spirit Illusion' }, desc: { ar: 'عند التصادم، يرفع وهمٌ قوتك لحظياً.', en: 'On clash, an illusion boosts your power.' } },
  pegasus:       { type: 'passive_axis', axis: 'energy', base: 10, name: { ar: 'رياح السماء', en: 'Sky Winds' }, desc: { ar: 'قوة إضافية دائمة في محور الطاقة.', en: 'Permanent bonus power on the Energy axis.' } },
  simurgh:       { type: 'on_win_heal', base: 18, name: { ar: 'ريش الشفاء', en: 'Healing Plumes' }, desc: { ar: 'عند فوزك بالجولة، يغطّيك ريشه بالشفاء.', en: 'On round win, its plumes shower you with healing.' } },
  siren:         { type: 'on_clash_reduce', base: 10, name: { ar: 'أغنية الأعماق', en: "Siren's Song" }, desc: { ar: 'عند التصادم، تُضعف أغنيتها قوة الخصم.', en: 'On clash, her song weakens the foe power.' } },
  valkyrie:      { type: 'on_win_combo', baseDmg: 12, baseHeal: 8, name: { ar: 'بركة المعركة', en: 'Battle Blessing' }, desc: { ar: 'عند فوزك بالجولة، بركة تجمع الضرر والشفاء.', en: 'On round win, a blessing grants damage and healing.' } }
};
/**
 * 🎯 إرجاع بيانات القدرة جاهزة للرسم، مع قيمة متدرّجة حسب الندرة.
 * القيمة المحسوبة هنا للعرض فقط؛ السيرفر يحسب نفس القيمة بنفس المعاملات في 3B-2.
 */
function getCreatureAbility(creatureId, tier, isAr) {
  const def = (typeof CREATURE_ABILITIES !== 'undefined') ? CREATURE_ABILITIES[creatureId] : null;
  if (!def) return null;
  const mult = ABILITY_TIER_MULTIPLIERS[tier] || 1.0;
  const name = def.name ? (isAr ? def.name.ar : def.name.en) : '';
  const desc = def.desc ? (isAr ? def.desc.ar : def.desc.en) : '';
  const r = (n) => Math.round(n);
  let valueText = '', valueColor = '#fde68a';
  switch (def.type) {
    case 'on_win': {
      const v = r((def.base || 0) * mult);
      valueText = isAr ? `+${v} ضرر` : `+${v} DMG`; valueColor = '#fca5a5'; break;
    }
    case 'on_win_heal': {
      const v = r((def.base || 0) * mult);
      valueText = isAr ? `+${v} شفاء` : `+${v} HEAL`; valueColor = '#86efac'; break;
    }
    case 'on_win_combo': {
      const d = r((def.baseDmg || 0) * mult), h = r((def.baseHeal || 0) * mult);
      valueText = isAr ? `+${d} ضرر / +${h} شفاء` : `+${d} DMG / +${h} HEAL`; valueColor = '#fde68a'; break;
    }
    case 'passive_axis': {
      const v = r((def.base || 0) * mult);
      const ax = (ABILITY_AXIS_SHORT[isAr ? 'ar' : 'en'] || {})[def.axis] || '';
      valueText = `+${v} ${ax}`; valueColor = '#93c5fd'; break;
    }
    case 'passive_armor': {
      const v = r((def.base || 0) * mult);
      valueText = isAr ? `−${v} ضرر وارد` : `−${v} incoming`; valueColor = '#86efac'; break;
    }
    case 'on_clash_reduce': {
      const v = r((def.base || 0) * mult);
      valueText = isAr ? `−${v} قوة الخصم` : `−${v} foe POW`; valueColor = '#fdba74'; break;
    }
    case 'on_clash_illusion': {
      const v = r((def.base || 0) * mult);
      valueText = isAr ? `+${v} قوة وهمية` : `+${v} illusion`; valueColor = '#93c5fd'; break;
    }
    case 'revive': {
      let v = r((def.basePercent || 0) * mult); if (v > 100) v = 100;
      valueText = isAr ? `إحياء ${v}%` : `Revive ${v}%`; valueColor = '#c4b5fd'; break;
    }
    case 'reveal': {
      const v = r((def.baseInsight || 0) * mult);
      valueText = v > 0
        ? (isAr ? `يكشف +${v} بصيرة` : `Reveal +${v} sight`)
        : (isAr ? `يكشف بطاقة الخصم` : `Reveals foe card`);
      valueColor = '#c4b5fd'; break;
    }
  }
  return { id: creatureId, type: def.type, name, desc, valueText, valueColor };
}
