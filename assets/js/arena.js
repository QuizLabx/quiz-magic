// ============================================================
// ⚔️ ARENA & DECK BUILDER SYSTEM
// ============================================================

let selectedDeck = []; // سيحتوي على 3 بطاقات كحد أقصى: {creatureId, tier}
let currentSelectingCreature = null;

// 1. فتح شاشة التشكيلة
function openDeckBuilder() {
    document.getElementById('game-main-menu').classList.add('hidden-game');
    document.getElementById('deck-builder-screen').classList.remove('hidden-game');
    renderDeckCreatures();
    updateDeckUI();
}

function closeDeckBuilder() {
    document.getElementById('deck-builder-screen').classList.add('hidden-game');
    document.getElementById('game-main-menu').classList.remove('hidden-game');
}

// 2. عرض الكائنات التي يملكها اللاعب
function renderDeckCreatures() {
    const grid = document.getElementById('deck-creatures-grid');
    grid.innerHTML = '';
    
    const userCards = typeof getUserCards === 'function' ? getUserCards() : {};
    const isAr = document.documentElement.lang === 'ar';

    // جلب بيانات الكائنات من quizzesData
    const creaturesData = quizzesData[isAr ? 'ar' : 'en'].quizzes[0].results;

    let hasCards = false;

    for (const [creatureId, tiers] of Object.entries(userCards)) {
        if (!tiers || tiers.length === 0) continue;
        hasCards = true;

        const creatureInfo = creaturesData.find(c => c.id === creatureId);
        if (!creatureInfo) continue;

        const cardEl = document.createElement('div');
        cardEl.className = 'deck-creature-card';
        cardEl.onclick = () => openTierSelect(creatureId, creatureInfo.name, tiers);
        
        cardEl.innerHTML = `
            <img src="${creatureInfo.image}" class="deck-creature-img">
            <div class="deck-creature-name">${creatureInfo.name}</div>
            <div class="text-center text-[10px] text-slate-400 pb-1">${tiers.length} بطاقات</div>
        `;
        grid.appendChild(cardEl);
    }

    if (!hasCards) {
        grid.innerHTML = `<div class="col-span-3 text-center text-slate-500 mt-10">لا تملك أي بطاقات بعد. اذهب إلى بوابة الاستدعاء!</div>`;
    }
}

// 3. فتح نافذة اختيار المستوى (الندرة)
function openTierSelect(creatureId, creatureName, ownedTiers) {
    currentSelectingCreature = creatureId;
    
    const modal = document.getElementById('tier-select-modal');
    const sheet = document.getElementById('tier-select-sheet');
    const optionsContainer = document.getElementById('tier-select-options');
    const isAr = document.documentElement.lang === 'ar';
    
    document.getElementById('tier-select-title').innerText = creatureName;
    optionsContainer.innerHTML = '';

    // عكس الترتيب لكي تظهر البطاقات الأقوى (الماسية/الذهبية) في الأعلى
    const reversedTiers = [...ownedTiers].reverse();

    reversedTiers.forEach(tier => {
        const tierLabel = CARD_TIERS[tier] ? CARD_TIERS[tier].label[isAr ? 'ar' : 'en'] : tier;
        
        // تحديد لون الإطار حسب الندرة
        let borderColor = '#334155';
        if(tier === 'silver') borderColor = '#E0E0E0';
        if(tier === 'gold') borderColor = '#D4AF37';
        if(tier === 'diamond') borderColor = '#00FFFF';
        if(tier === 'mythic') borderColor = '#ff1a66';
        if(tier === 'cosmic') borderColor = '#ff00ff';

        const btn = document.createElement('button');
        btn.className = 'tier-option-btn';
        btn.style.borderColor = borderColor;
        btn.innerHTML = `
            <span>★ ${tierLabel}</span>
            <i class="fas fa-plus-circle text-green-400"></i>
        `;
        btn.onclick = () => selectCardForDeck(creatureId, tier, borderColor);
        optionsContainer.appendChild(btn);
    });

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    // تأخير بسيط لتفعيل حركة الصعود
    setTimeout(() => {
        sheet.classList.remove('translate-y-full');
    }, 10);
}

function closeTierSelect() {
    const sheet = document.getElementById('tier-select-sheet');
    sheet.classList.add('translate-y-full');
    setTimeout(() => {
        document.getElementById('tier-select-modal').classList.add('hidden');
        document.getElementById('tier-select-modal').classList.remove('flex');
    }, 300);
}

// 4. إضافة البطاقة للتشكيلة
function selectCardForDeck(creatureId, tier, borderColor) {
    if (typeof audioManager !== 'undefined') audioManager.playSfx('click');
    
    // التحقق إذا كانت البطاقة موجودة بالفعل في التشكيلة
    const alreadyExists = selectedDeck.some(c => c.creatureId === creatureId && c.tier === tier);
    if (alreadyExists) {
        alert("هذه البطاقة موجودة بالفعل في تشكيلتك!");
        return;
    }

    if (selectedDeck.length >= 3) {
        alert("التشكيلة ممتلئة! (الحد الأقصى 3 بطاقات)");
        closeTierSelect();
        return;
    }

    const isAr = document.documentElement.lang === 'ar';
    const creaturesData = quizzesData[isAr ? 'ar' : 'en'].quizzes[0].results;
    const creatureInfo = creaturesData.find(c => c.id === creatureId);

    selectedDeck.push({
        creatureId: creatureId,
        tier: tier,
        image: creatureInfo.image,
        borderColor: borderColor
    });

    closeTierSelect();
    updateDeckUI();
}

// 5. إزالة بطاقة من التشكيلة
function removeCardFromDeck(index) {
    if (index < selectedDeck.length) {
        if (typeof audioManager !== 'undefined') audioManager.playSfx('click');
        selectedDeck.splice(index, 1);
        updateDeckUI();
    }
}

// 6. تحديث واجهة التشكيلة (الـ Slots وزر الدخول)
function updateDeckUI() {
    document.getElementById('deck-count').innerText = selectedDeck.length;

    for (let i = 0; i < 3; i++) {
        const slot = document.getElementById(`slot-${i}`);
        if (i < selectedDeck.length) {
            const card = selectedDeck[i];
            slot.className = 'deck-slot filled';
            slot.style.borderColor = card.borderColor;
            slot.innerHTML = `<img src="${card.image}" style="width:100%; height:100%; object-fit:cover; border-radius:0.6rem;">`;
        } else {
            slot.className = 'deck-slot';
            slot.style.borderColor = '#475569';
            slot.innerHTML = '';
        }
    }

    const startBtn = document.getElementById('btn-start-battle');
    if (selectedDeck.length === 3) {
        startBtn.disabled = false;
        startBtn.className = 'w-full py-3 rounded-xl font-black text-lg text-white transition-all transform hover:scale-105';
        startBtn.style.background = 'linear-gradient(135deg, #ef4444, #f97316)';
        startBtn.style.boxShadow = '0 6px 20px rgba(239,68,68,0.5)';
    } else {
        startBtn.disabled = true;
        startBtn.className = 'w-full py-3 rounded-xl font-black text-lg bg-slate-600 text-slate-400 transition-all';
        startBtn.style.background = '';
        startBtn.style.boxShadow = 'none';
    }
}

// 7. الدخول للساحة (الخطوة القادمة!)
function enterArena() {
    if (typeof audioManager !== 'undefined') audioManager.playSfx('click');
    document.getElementById('deck-builder-screen').classList.add('hidden-game');
    document.getElementById('arena-screen').classList.remove('hidden-game');
    
    // هنا سنقوم بتوزيع البطاقات في الساحة لاحقاً!
    console.log("بدأت المعركة بهذه التشكيلة:", selectedDeck);
}
