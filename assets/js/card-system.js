/* ============================================================
   🃏 COLLECTIBLE CARD SYSTEM
   نظام البطاقات القابلة للجمع - ملف منفصل
   ============================================================ 
   هذا الملف يحتوي على جميع دوال وإعدادات نظام البطاقات
   ============================================================ */

// ==================== CONSTANTS ====================

// مفاتيح التخزين المحلي
const CARDS_KEY = 'quiz_cards';

// مستويات البطاقات
const CARD_TIERS = {
    common:  { key: 'common',  label: { ar: 'عادية', en: 'Common' },    weight: 50 },
    silver:  { key: 'silver',  label: { ar: 'فضية', en: 'Silver' },    weight: 30 },
    gold:    { key: 'gold',    label: { ar: 'ذهبية', en: 'Gold' },      weight: 15 },
    diamond: { key: 'diamond', label: { ar: 'ماسية', en: 'Diamond' },  weight: 5 }
};

const TIER_ORDER = ['common', 'silver', 'gold', 'diamond'];

// التكوين البصري لكل مستوى
// التكوين البصري لكل مستوى (محاكاة المعادن الحقيقية)
const TIER_VISUALS = {
    common:  { // برونز / نحاس مؤكسد
        border: '#8B5A2B', borderDark: '#3E2723', borderLight: '#CD853F', glow: 'rgba(139,90,43,0.5)',
        bg1: '#1A110A', bg2: '#2E1D12', bg3: '#0F0905',
        accent: '#CD853F', accentDeep: '#5C3A21', textAccent: '#E6C280',
        panelBg: 'rgba(26,17,10,0.8)', panelBorder: 'rgba(205,133,63,0.4)',
        rank: 'B', rankLabel: { ar: 'برونزي', en: 'BRONZE' }, holo: false
    },
    silver:  { // فضة مصقولة / فولاذ
        border: '#A9B0B8', borderDark: '#4A5568', borderLight: '#E2E8F0', glow: 'rgba(169,176,184,0.6)',
        bg1: '#0F172A', bg2: '#1E293B', bg3: '#020617',
        accent: '#CBD5E1', accentDeep: '#64748B', textAccent: '#F8FAFC',
        panelBg: 'rgba(15,23,42,0.8)', panelBorder: 'rgba(203,213,225,0.4)',
        rank: 'A', rankLabel: { ar: 'فضي', en: 'SILVER' }, holo: false
    },
    gold:    { // ذهب خالص عاكس للضوء
        border: '#D4AF37', borderDark: '#5C4000', borderLight: '#FFF8DC', glow: 'rgba(212,175,55,0.8)',
        bg1: '#1A1300', bg2: '#332600', bg3: '#0A0700',
        accent: '#FFD700', accentDeep: '#B8860B', textAccent: '#FFF8DC',
        panelBg: 'rgba(26,19,0,0.8)', panelBorder: 'rgba(212,175,55,0.5)',
        rank: 'S', rankLabel: { ar: 'ذهبي', en: 'GOLD' }, holo: true
    },
    diamond: { // ألماس / كريستال زجاجي
        border: '#00FFFF', borderDark: '#000080', borderLight: '#E0FFFF', glow: 'rgba(0,255,255,0.9)',
        bg1: '#000510', bg2: '#001030', bg3: '#000208',
        accent: '#00FFFF', accentDeep: '#0055FF', textAccent: '#E0FFFF',
        panelBg: 'rgba(0,5,16,0.8)', panelBorder: 'rgba(0,255,255,0.5)',
        rank: 'S++', rankLabel: { ar: 'ماسي', en: 'DIAMOND' }, holo: true
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
    try { return JSON.parse(localStorage.getItem(CARDS_KEY) || '{}'); }
    catch { return {}; }
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
    if (!cards[creatureId]) {
        cards[creatureId] = getRandomTier();
        saveUserCards(cards);
    }
    return cards[creatureId];
}

function tryUpgradeCard(creatureId) {
    const cards = getUserCards();
    const currentTier = cards[creatureId] || 'common';
    const currentIdx = TIER_ORDER.indexOf(currentTier);
    if (currentIdx >= TIER_ORDER.length - 1) return currentTier;

    // 30% chance to upgrade on retake
    if (Math.random() <= 0.30) {
        const newTier = TIER_ORDER[currentIdx + 1];
        cards[creatureId] = newTier;
        saveUserCards(cards);
        return newTier;
    }
    return currentTier;
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

// ==================== MAIN CARD RENDERER ====================

// دالة لرسم نصوص محفورة أو بارزة (3D Text Effect)
function drawEngravedText(ctx, text, x, y, visual, isEmbossed = false) {
    ctx.save();
    const offset = 3; // عمق النحت
    
    // رسم الإضاءة (Highlight)
    ctx.fillStyle = visual.borderLight;
    ctx.fillText(text, x + (isEmbossed ? -offset : offset), y + (isEmbossed ? -offset : offset));
    
    // رسم الظل (Shadow)
    ctx.fillStyle = visual.borderDark;
    ctx.fillText(text, x + (isEmbossed ? offset : -offset), y + (isEmbossed ? offset : -offset));
    
    // رسم اللون الأساسي في المنتصف
    ctx.fillStyle = visual.accent;
    ctx.fillText(text, x, y);
    ctx.restore();
}


async function renderCollectibleCardCanvas(creature, tier) {
    // الاعتمادات الخارجية: currentLang, getUsername
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

    // 1. رسم الخلفية المعدنية الأساسية
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, visual.bg1);
    bg.addColorStop(0.5, visual.bg2);
    bg.addColorStop(1, visual.bg3);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // 2. إضافة ملمس الورق/المعدن (الضوضاء)
    drawNoiseTexture(ctx, W, H, 0.06);

    // 3. رسم خطوط الخلفية الهندسية
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.strokeStyle = visual.accent;
    ctx.lineWidth = 2;
    for (let i = -H; i < W + H; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + H, H);
        ctx.stroke();
    }
    ctx.restore();

    // 4. تظليل الحواف (Vignette) لإعطاء عمق 3D
    const vig = ctx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.9);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);

    // 5. تطبيق الهولوجرام إذا كان المستوى يدعم ذلك (ذهبي أو ماسي)
    if (visual.holo) {
        drawHolographicEffect(ctx, W, H, tier === 'diamond' ? 0.4 : 0.2);
    }

    // 6. رسم هالة الكائن وجزيئاته السحرية
    if (creature && creature.id) {
        drawCreatureAura(ctx, creature.id, 0, 0, W, H);
    }

    if (creature && creature.id && tier !== 'common') {
        drawCreatureParticles(ctx, creature.id, W, H, pad);
    }

    // 7. رسم العلامة المائية
    drawWatermark(ctx, W, H);


    // ==========================================
    // 8. الإطار الخارجي المعدني (Outer Metallic Border)
    // ==========================================
    const fi = 40;
    ctx.save();
    const borderGrad = ctx.createLinearGradient(0, 0, W, H);
    borderGrad.addColorStop(0, visual.borderLight);
    borderGrad.addColorStop(0.3, visual.border);
    borderGrad.addColorStop(0.5, visual.borderDark);
    borderGrad.addColorStop(0.7, visual.border);
    borderGrad.addColorStop(1, visual.borderLight);
    
    ctx.lineWidth = 24; // إطار أسمك وأفخم
    ctx.strokeStyle = borderGrad;
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 10;
    roundRectPath(ctx, fi, fi, W - fi * 2, H - fi * 2, 40);
    ctx.stroke();
    
    // حافة داخلية للإطار
    ctx.lineWidth = 4;
    ctx.strokeStyle = visual.borderDark;
    ctx.shadowColor = 'transparent';
    roundRectPath(ctx, fi + 12, fi + 12, W - (fi + 12) * 2, H - (fi + 12) * 2, 28);
    ctx.stroke();
    ctx.restore();

    // مسامير التثبيت المعدنية في الزوايا (Rivets)
    function drawRivet(cx, cy) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fillStyle = visual.borderDark;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx - 2, cy - 2, 4, 0, Math.PI * 2);
        ctx.fillStyle = visual.borderLight;
        ctx.fill();
        ctx.restore();
    }
    drawRivet(fi + 40, fi + 40);
    drawRivet(W - fi - 40, fi + 40);
    drawRivet(fi + 40, H - fi - 40);
    drawRivet(W - fi - 40, H - fi - 40);

    let yCursor = fi + 80;

    // ==========================================
    // 9. الترويسة: اسم الكائن (Header)
    // ==========================================
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 75px Cairo, Tajawal, sans-serif';
    const creatureName = creature ? (creature.name || 'Unknown') : 'Unknown';
    // استخدام دالة النحت لاسم الكائن (نص بارز 3D)
    drawEngravedText(ctx, creatureName, W / 2, yCursor, visual, true);
    ctx.restore();

    yCursor += 80;

    // ==========================================
    // 10. نافذة الصورة الغائرة (Deep Inset Image Window)
    // ==========================================
    const imgW = innerW - 40;
    const imgH = 750;
    const imgX = pad + 20;
    const imgY = yCursor;

    ctx.save();
    // رسم الإطار المعدني الداخلي للصورة
    ctx.lineWidth = 12;
    ctx.strokeStyle = borderGrad;
    roundRectPath(ctx, imgX - 6, imgY - 6, imgW + 12, imgH + 12, 24);
    ctx.stroke();

    // قص الصورة داخل الإطار
    ctx.save();
    roundRectPath(ctx, imgX, imgY, imgW, imgH, 18);
    ctx.clip();
    
    if (creature && creature.image) {
        const img = await loadImageAsDataURL(creature.image);
        if (img) {
            ctx.drawImage(img, imgX, imgY, imgW, imgH);
        }
    }
    
    // ظل داخلي قوي (Inner Shadow) لإعطاء عمق للنافذة وكأن الصورة بالداخل
    ctx.lineWidth = 30;
    ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    roundRectPath(ctx, imgX, imgY, imgW, imgH, 18);
    ctx.stroke();
    ctx.restore(); // إنهاء القص
    ctx.restore();

    yCursor += imgH + 60;

    // ==========================================
    // 11. شريط الندرة (Rarity Ribbon)
    // ==========================================
    ctx.save();
    ctx.fillStyle = visual.panelBg;
    ctx.strokeStyle = visual.border;
    ctx.lineWidth = 3;
    roundRectPath(ctx, W/2 - 200, yCursor, 400, 60, 30);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '700 30px Cairo, Tajawal, sans-serif';
    const rarityText = (isAr ? '★ ' : '★ ') + tierLabel.toUpperCase() + (isAr ? ' ★' : ' EDITION ★');
    // نص محفور للداخل
    drawEngravedText(ctx, rarityText, W / 2, yCursor + 30, visual, false);
    ctx.restore();

    yCursor += 100;

    // ==========================================
    // 12. صندوق الوصف (Lore Box)
    // ==========================================
    const descH = 220;
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'; // خلفية زجاجية داكنة
    ctx.strokeStyle = visual.borderDark;
    ctx.lineWidth = 4;
    roundRectPath(ctx, pad + 20, yCursor, innerW - 40, descH, 20);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '500 28px Cairo, Tajawal, sans-serif';
    ctx.fillStyle = visual.textAccent;
    
    const description = creature ? (creature.description || '') : '';
    const descLines = wrapText(ctx, description, innerW - 100, 4);
    descLines.forEach((line, i) => {
        ctx.fillText(line, W / 2, yCursor + descH / 2 + (i - descLines.length / 2 + 0.5) * 38);
    });
    ctx.restore();

    yCursor += descH + 60;

    // ==========================================
    // 13. اسم المستكشف (Explorer Name)
    // ==========================================
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '600 24px Cairo, Tajawal, sans-serif';
    ctx.fillStyle = visual.accentDeep;
    ctx.fillText(isAr ? 'المستكشف' : 'Explorer', W / 2, yCursor);
    
    yCursor += 40;
    
    ctx.font = '900 45px Cairo, Tajawal, sans-serif';
    drawEngravedText(ctx, username, W / 2, yCursor, visual, true);
    ctx.restore();

    const footerY = H - pad - 120;
    const qrSize = 100;
    const qrX = W / 2 - qrSize / 2;
    const qrY = footerY - 20;
    drawQRCode(ctx, qrX, qrY, qrSize);

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '600 14px Cairo, Tajawal, sans-serif';
    ctx.fillStyle = 'rgba(203,213,225,0.6)';
    ctx.fillText(isAr ? 'امسح للعب' : 'Scan to Play', qrX + qrSize / 2, qrY + qrSize + 5);
    ctx.restore();

    const serialText = `#${Math.floor(Math.random() * 900000) + 100000}`;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '600 18px Cairo, Tajawal, sans-serif';
    ctx.fillStyle = visual.accentDeep;
    ctx.fillText(serialText, W / 2, footerY + 100);
    ctx.restore();

    if (tier === 'diamond') {
        ctx.save();
        ctx.translate(W - pad - 120, footerY + 50);
        ctx.rotate(-0.2);
        ctx.font = '900 24px Cairo, Tajawal, sans-serif';
        ctx.fillStyle = 'rgba(167,139,250,0.3)';
        ctx.textAlign = 'center';
        ctx.fillText('OFFICIAL', 0, 0);
        ctx.restore();
    }

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
