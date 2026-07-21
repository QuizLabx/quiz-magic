// ============================================================
// ⚔️ ARENA BATTLE SYSTEM - FULL VERSION
// ساحة المعركة الكاملة مع ربط Supabase
// ============================================================

// ==================== STATE ====================
let selectedDeck = [];
let currentSelectingCreature = null;

let battleState = {
    battleId: null,
    currentRound: 1,
    totalRounds: 3,
    challenge: null,
    playerDeck: [],
    usedPlayerIndexes: [],
    playerWins: 0,
    enemyWins: 0,
    roundResults: [],
    isActive: false,
    isProcessing: false
};

// ==================== DECK BUILDER ====================

function openDeckBuilder() {
    // التحقق من تسجيل الدخول
    if (!window.firebaseDB || !window.firebaseDB.isLoggedIn()) {
        const isAr = currentLang === 'ar';
        showProfileNotification(
            isAr ? '🔐 يجب تسجيل الدخول لدخول الساحة' : '🔐 Login required to enter Arena',
            'error'
        );
        showAccountModal();
        return;
    }

    document.getElementById('game-main-menu').classList.add('hidden-game');
    document.getElementById('deck-builder-screen').classList.remove('hidden-game');
    selectedDeck = [];
    renderDeckCreatures();
    updateDeckUI();
}

function closeDeckBuilder() {
    document.getElementById('deck-builder-screen').classList.add('hidden-game');
    document.getElementById('game-main-menu').classList.remove('hidden-game');
}

function renderDeckCreatures() {
    const grid = document.getElementById('deck-creatures-grid');
    grid.innerHTML = '';
    const userCards = typeof getUserCards === 'function' ? getUserCards() : {};
    const isAr = currentLang === 'ar';
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
            <div class="text-center text-[10px] text-slate-400 pb-1">${tiers.length} ${isAr ? 'بطاقات' : 'cards'}</div>
        `;
        grid.appendChild(cardEl);
    }

    if (!hasCards) {
        grid.innerHTML = `<div class="col-span-3 text-center text-slate-500 mt-10">
            ${isAr ? 'لا تملك أي بطاقات بعد. اذهب إلى بوابة الاستدعاء!' : 'No cards yet. Go to the Summoning Gate!'}
        </div>`;
    }
}

function openTierSelect(creatureId, creatureName, ownedTiers) {
    currentSelectingCreature = creatureId;
    const modal = document.getElementById('tier-select-modal');
    const sheet = document.getElementById('tier-select-sheet');
    const optionsContainer = document.getElementById('tier-select-options');
    const isAr = currentLang === 'ar';

    document.getElementById('tier-select-title').innerText = creatureName;
    optionsContainer.innerHTML = '';

    const reversedTiers = [...ownedTiers].reverse();
    reversedTiers.forEach(tier => {
        const tierLabel = CARD_TIERS[tier] ? CARD_TIERS[tier].label[isAr ? 'ar' : 'en'] : tier;
        let borderColor = '#334155';
        if (tier === 'silver') borderColor = '#E0E0E0';
        if (tier === 'gold') borderColor = '#D4AF37';
        if (tier === 'diamond') borderColor = '#00FFFF';
        if (tier === 'mythic') borderColor = '#ff1a66';
        if (tier === 'cosmic') borderColor = '#ff00ff';

        const btn = document.createElement('button');
        btn.className = 'tier-option-btn';
        btn.style.borderColor = borderColor;
        btn.innerHTML = `<span>★ ${tierLabel}</span><i class="fas fa-plus-circle text-green-400"></i>`;
        btn.onclick = () => selectCardForDeck(creatureId, tier, borderColor);
        optionsContainer.appendChild(btn);
    });

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => sheet.classList.remove('translate-y-full'), 10);
}

function closeTierSelect() {
    const sheet = document.getElementById('tier-select-sheet');
    sheet.classList.add('translate-y-full');
    setTimeout(() => {
        document.getElementById('tier-select-modal').classList.add('hidden');
        document.getElementById('tier-select-modal').classList.remove('flex');
    }, 300);
}

function selectCardForDeck(creatureId, tier, borderColor) {
    const isAr = currentLang === 'ar';

    // منع تكرار نفس الكائن
    const sameCreature = selectedDeck.some(c => c.creatureId === creatureId);
    if (sameCreature) {
        showProfileNotification(
            isAr ? '⚠️ لا يمكن اختيار نفس الكائن مرتين' : '⚠️ Cannot select same creature twice',
            'error'
        );
        return;
    }

    if (selectedDeck.length >= 3) {
        showProfileNotification(
            isAr ? '⚠️ التشكيلة ممتلئة (3 بطاقات)' : '⚠️ Deck is full (3 cards)',
            'error'
        );
        closeTierSelect();
        return;
    }

    const creaturesData = quizzesData[isAr ? 'ar' : 'en'].quizzes[0].results;
    const creatureInfo = creaturesData.find(c => c.id === creatureId);

    selectedDeck.push({
        creatureId: creatureId,
        tier: tier,
        image: creatureInfo.image,
        name: creatureInfo.name,
        borderColor: borderColor
    });

    closeTierSelect();
    updateDeckUI();

    if (window.audioManager) window.audioManager.play('ui-click');
}

function removeCardFromDeck(index) {
    if (index < selectedDeck.length) {
        selectedDeck.splice(index, 1);
        updateDeckUI();
    }
}

function updateDeckUI() {
    document.getElementById('deck-count').innerText = selectedDeck.length;

    for (let i = 0; i < 3; i++) {
        const slot = document.getElementById(`slot-${i}`);
        if (i < selectedDeck.length) {
            const card = selectedDeck[i];
            slot.className = 'deck-slot filled';
            slot.style.borderColor = card.borderColor;
            slot.innerHTML = `<img src="${card.image}" style="width:100%;height:100%;object-fit:cover;border-radius:0.6rem;">`;
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

// ==================== BATTLE START ====================

async function enterArena() {
    const isAr = currentLang === 'ar';

    if (selectedDeck.length !== 3) {
        showProfileNotification(isAr ? '⚠️ اختر 3 بطاقات أولاً' : '⚠️ Select 3 cards first', 'error');
        return;
    }

    // تجهيز التشكيلة بصيغة السيرفر
    const deckForServer = selectedDeck.map(c => ({
        creature_id: c.creatureId,
        tier: c.tier
    }));

    // إظهار حالة التحميل
    showArenaLoading(true);

    try {
        const result = await window.firebaseDB.startArenaBattle(deckForServer);

        if (!result.success) {
            handleBattleError(result.code);
            showArenaLoading(false);
            return;
        }

        // حفظ حالة المعركة
        battleState = {
            battleId: result.battle_id,
            currentRound: result.current_round,
            totalRounds: result.total_rounds || 3,
            challenge: result.challenge,
            playerDeck: result.player_deck,
            usedPlayerIndexes: [],
            playerWins: 0,
            enemyWins: 0,
            roundResults: [],
            isActive: true,
            isProcessing: false
        };

        // حفظ battle_id للاستئناف
        localStorage.setItem('quiz_arena_battle_id', result.battle_id);

        // الانتقال لشاشة المعركة
        document.getElementById('deck-builder-screen').classList.add('hidden-game');
        document.getElementById('arena-screen').classList.remove('hidden-game');

        // رسم واجهة المعركة
        renderBattleUI();
        showArenaLoading(false);

        if (window.audioManager) window.audioManager.play('ui-click');

    } catch (err) {
        console.error('Arena start error:', err);
        showProfileNotification(
            isAr ? '❌ خطأ في الاتصال بالسيرفر' : '❌ Server connection error',
            'error'
        );
        showArenaLoading(false);
    }
}

// ==================== BATTLE UI RENDERING ====================

function renderBattleUI() {
    const isAr = currentLang === 'ar';

    // تحديث رقم الجولة
    document.getElementById('arena-round').innerText = battleState.currentRound;

    // تحديث التحدي الحالي
    updateChallengeDisplay();

    // رسم بطاقات اللاعب
    renderPlayerBattleCards();

    // رسم بطاقات العدو (مقلوبة)
    renderEnemyCards();

    // مسح منطقة التصادم
    document.getElementById('clash-enemy').innerHTML = '';
    document.getElementById('clash-player').innerHTML = '';
}

function updateChallengeDisplay() {
    const isAr = currentLang === 'ar';
    const challengeEl = document.getElementById('arena-current-stat');
    if (!challengeEl || !battleState.challenge) return;

    const axisNames = {
        ar: {
            intelligence: 'الذكاء 🧠',
            energy: 'الطاقة ⚡',
            empathy: 'التعاطف 💜',
            strategy: 'الاستراتيجية 🎯',
            mystery: 'الغموض 🌙',
            willpower: 'قوة الإرادة 🔥'
        },
        en: {
            intelligence: 'Intelligence 🧠',
            energy: 'Energy ⚡',
            empathy: 'Empathy 💜',
            strategy: 'Strategy 🎯',
            mystery: 'Mystery 🌙',
            willpower: 'Willpower 🔥'
        }
    };

    const names = axisNames[isAr ? 'ar' : 'en'];
    challengeEl.innerText = names[battleState.challenge] || battleState.challenge;
}

function renderPlayerBattleCards() {
    const container = document.getElementById('player-arena-cards');
    if (!container) return;

    const isAr = currentLang === 'ar';
    const creaturesData = quizzesData[isAr ? 'ar' : 'en'].quizzes[0].results;
    container.innerHTML = '';

    battleState.playerDeck.forEach((card, index) => {
        const creatureInfo = creaturesData.find(c => c.id === card.creature_id);
        if (!creatureInfo) return;

        const isUsed = battleState.usedPlayerIndexes.includes(index);
        const tierLabel = CARD_TIERS[card.tier] ? CARD_TIERS[card.tier].label[isAr ? 'ar' : 'en'] : card.tier;

        let borderColor = '#334155';
        if (card.tier === 'silver') borderColor = '#E0E0E0';
        if (card.tier === 'gold') borderColor = '#D4AF37';
        if (card.tier === 'diamond') borderColor = '#00FFFF';
        if (card.tier === 'mythic') borderColor = '#ff1a66';
        if (card.tier === 'cosmic') borderColor = '#ff00ff';

        const cardEl = document.createElement('div');
        cardEl.className = `arena-card-slot player-slot ${isUsed ? 'used' : ''}`;
        cardEl.style.borderColor = isUsed ? '#334155' : borderColor;
        cardEl.innerHTML = `
            <img src="${creatureInfo.image}" style="width:100%;height:70%;object-fit:cover;">
            <div style="font-size:0.55rem;font-weight:900;text-align:center;padding:2px;color:#fff;">
                ${creatureInfo.name}
            </div>
            <div style="font-size:0.5rem;text-align:center;color:${borderColor};font-weight:700;">
                ★ ${tierLabel}
            </div>
        `;

        if (!isUsed && battleState.isActive && !battleState.isProcessing) {
            cardEl.onclick = () => selectBattleCard(index);
            cardEl.style.cursor = 'pointer';
        } else {
            cardEl.style.cursor = 'default';
            cardEl.style.opacity = isUsed ? '0.4' : '1';
        }

        container.appendChild(cardEl);
    });
}

function renderEnemyCards() {
    const container = document.getElementById('enemy-cards-container');
    if (!container) return;

    container.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const isRevealed = battleState.roundResults.some(r => r.round === i + 1);
        const slotEl = document.createElement('div');
        slotEl.className = 'arena-card-slot enemy-slot';

        if (isRevealed) {
            const roundResult = battleState.roundResults.find(r => r.round === i + 1);
            if (roundResult && roundResult.enemy_card) {
                const isAr = currentLang === 'ar';
                const creaturesData = quizzesData[isAr ? 'ar' : 'en'].quizzes[0].results;
                const enemyCreature = creaturesData.find(c => c.id === roundResult.enemy_card.creature_id);
                if (enemyCreature) {
                    slotEl.innerHTML = `
                        <img src="${enemyCreature.image}" style="width:100%;height:70%;object-fit:cover;">
                        <div style="font-size:0.55rem;font-weight:900;text-align:center;padding:2px;color:#fca5a5;">
                            ${enemyCreature.name}
                        </div>
                    `;
                    slotEl.style.borderColor = '#ef4444';
                }
            }
        } else {
            slotEl.innerHTML = '<div class="card-back-pattern"></div>';
        }

        container.appendChild(slotEl);
    }
}

// ==================== CARD SELECTION ====================

async function selectBattleCard(cardIndex) {
    if (battleState.isProcessing || !battleState.isActive) return;
    if (battleState.usedPlayerIndexes.includes(cardIndex)) return;

    battleState.isProcessing = true;
    renderPlayerBattleCards(); // تعطيل الأزرار

    try {
        const result = await window.firebaseDB.selectArenaCard(battleState.battleId, cardIndex);

        if (!result.success) {
            handleBattleError(result.code);
            battleState.isProcessing = false;
            renderPlayerBattleCards();
            return;
        }

        // تحديث الحالة
        battleState.usedPlayerIndexes.push(cardIndex);

        if (result.round_result) {
            battleState.roundResults.push(result.round_result);
            battleState.playerWins = result.player_wins || battleState.playerWins;
            battleState.enemyWins = result.enemy_wins || battleState.enemyWins;
        }

        // عرض نتيجة الجولة
        await showRoundResult(result.round_result);

        if (result.battle_finished) {
            // المعركة انتهت
            battleState.isActive = false;
            localStorage.removeItem('quiz_arena_battle_id');
            await showBattleResult(result);
        } else {
            // الجولة التالية
            battleState.currentRound = result.current_round;
            battleState.challenge = result.next_challenge;
            renderBattleUI();
        }

    } catch (err) {
        console.error('selectBattleCard error:', err);
        const isAr = currentLang === 'ar';
        showProfileNotification(
            isAr ? '❌ خطأ في الاتصال' : '❌ Connection error',
            'error'
        );
    }

    battleState.isProcessing = false;
}

// ==================== ROUND RESULT DISPLAY ====================

async function showRoundResult(roundResult) {
    if (!roundResult) return;

    const isAr = currentLang === 'ar';
    const creaturesData = quizzesData[isAr ? 'ar' : 'en'].quizzes[0].results;

    const clashEnemy = document.getElementById('clash-enemy');
    const clashPlayer = document.getElementById('clash-player');

    // عرض بطاقة اللاعب في منطقة التصادم
    const playerCreature = creaturesData.find(c => c.id === roundResult.player_card.creature_id);
    if (playerCreature && clashPlayer) {
        clashPlayer.innerHTML = `
            <div class="clash-card-display">
                <img src="${playerCreature.image}" style="width:100%;height:70%;object-fit:cover;border-radius:8px;">
                <div style="font-size:0.6rem;font-weight:900;color:#93c5fd;text-align:center;">
                    ${playerCreature.name}
                </div>
                <div style="font-size:0.7rem;font-weight:900;color:#fff;text-align:center;">
                    ${roundResult.player_power}
                </div>
            </div>
        `;
    }

    // عرض بطاقة العدو في منطقة التصادم
    const enemyCreature = creaturesData.find(c => c.id === roundResult.enemy_card.creature_id);
    if (enemyCreature && clashEnemy) {
        clashEnemy.innerHTML = `
            <div class="clash-card-display">
                <img src="${enemyCreature.image}" style="width:100%;height:70%;object-fit:cover;border-radius:8px;">
                <div style="font-size:0.6rem;font-weight:900;color:#fca5a5;text-align:center;">
                    ${enemyCreature.name}
                </div>
                <div style="font-size:0.7rem;font-weight:900;color:#fff;text-align:center;">
                    ${roundResult.enemy_power}
                </div>
            </div>
        `;
    }

    // تحديث بطاقات العدو المكشوفة
    renderEnemyCards();

    // إظهار نتيجة الجولة
    const winner = roundResult.winner;
    const resultText = winner === 'player'
        ? (isAr ? '✅ فزت بالجولة!' : '✅ You won the round!')
        : (isAr ? '❌ خسرت الجولة' : '❌ You lost the round');

    showProfileNotification(resultText, winner === 'player' ? 'success' : 'error');

    if (window.audioManager) {
        window.audioManager.play(winner === 'player' ? 'magical-reveal' : 'ui-click');
    }

    // انتظار قليل قبل المتابعة
    await delay(1500);

    // مسح منطقة التصادم
    if (clashEnemy) clashEnemy.innerHTML = '';
    if (clashPlayer) clashPlayer.innerHTML = '';
}

// ==================== BATTLE RESULT ====================

async function showBattleResult(result) {
    const isAr = currentLang === 'ar';
    const finalWinner = result.final_winner;
    const isVictory = finalWinner === 'player';

    // بناء محتوى النتيجة
    let rewardsHtml = '';
    if (result.rewards) {
        const gems = result.rewards.gems || 0;
        const xp = result.rewards.xp || 0;
        if (gems > 0) rewardsHtml += `<div class="battle-reward-item">💎 +${gems} ${isAr ? 'جوهرة' : 'Gems'}</div>`;
        if (xp > 0) rewardsHtml += `<div class="battle-reward-item">⚡ +${xp} XP</div>`;
    }

    const modal = document.getElementById('battle-result-modal');
    const content = document.getElementById('battle-result-content');

    if (modal && content) {
        content.innerHTML = `
            <div class="battle-result-icon">${isVictory ? '🏆' : '💀'}</div>
            <h2 class="battle-result-title" style="color: ${isVictory ? '#fbbf24' : '#ef4444'}">
                ${isVictory ? (isAr ? 'انتصار!' : 'Victory!') : (isAr ? 'هزيمة...' : 'Defeat...')}
            </h2>
            <p class="battle-result-score">
                ${battleState.playerWins} - ${battleState.enemyWins}
            </p>
            ${rewardsHtml ? `<div class="battle-rewards-container">${rewardsHtml}</div>` : ''}
            <button onclick="closeBattleResult()" class="battle-result-btn">
                ${isAr ? 'العودة للقائمة' : 'Back to Menu'}
            </button>
        `;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    // تحديث الجواهر والطاقة في الواجهة
    if (result.user) {
        if (typeof result.user.gems === 'number') {
            localStorage.setItem('quiz_gems', String(result.user.gems));
            if (typeof updateGemsHeader === 'function') updateGemsHeader();
        }
    }

    if (window.audioManager) {
        window.audioManager.play(isVictory ? 'magical-reveal' : 'ui-click');
    }

    if (typeof trackEvent === 'function') {
        trackEvent('arena_battle_complete', {
            result: finalWinner,
            player_wins: battleState.playerWins,
            enemy_wins: battleState.enemyWins
        });
    }
}

function closeBattleResult() {
    const modal = document.getElementById('battle-result-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
    closeArena();
}

// ==================== ARENA NAVIGATION ====================

function closeArena() {
    document.getElementById('arena-screen').classList.add('hidden-game');
    document.getElementById('game-main-menu').classList.remove('hidden-game');

    // إعادة تعيين حالة المعركة
    battleState = {
        battleId: null,
        currentRound: 1,
        totalRounds: 3,
        challenge: null,
        playerDeck: [],
        usedPlayerIndexes: [],
        playerWins: 0,
        enemyWins: 0,
        roundResults: [],
        isActive: false,
        isProcessing: false
    };

    localStorage.removeItem('quiz_arena_battle_id');
}

// ==================== ERROR HANDLING ====================

function handleBattleError(code) {
    const isAr = currentLang === 'ar';
    const messages = {
        'not_logged_in': isAr ? '🔐 يجب تسجيل الدخول' : '🔐 Login required',
        'no_energy': isAr ? '⚡ نفدت طاقتك! عد غدًا' : '⚡ Out of energy! Come back tomorrow',
        'invalid_deck': isAr ? '❌ تشكيلة غير صالحة' : '❌ Invalid deck',
        'card_not_owned': isAr ? '❌ لا تملك هذه البطاقة' : '❌ Card not owned',
        'duplicate_creature': isAr ? '❌ لا يمكن تكرار نفس الكائن' : '❌ Duplicate creature',
        'invalid_tier': isAr ? '❌ ندرة غير صالحة' : '❌ Invalid tier',
        'battle_not_found': isAr ? '❌ المعركة غير موجودة' : '❌ Battle not found',
        'battle_not_active': isAr ? '❌ المعركة منتهية' : '❌ Battle ended',
        'card_already_used': isAr ? '❌ البطاقة مستخدمة' : '❌ Card already used',
        'banned': isAr ? '🚫 أنت محظور' : '🚫 You are banned',
        'user_not_found': isAr ? '❌ المستخدم غير موجود' : '❌ User not found',
        'rpc_failed': isAr ? '❌ خطأ في السيرفر' : '❌ Server error',
        'server_error': isAr ? '❌ خطأ في السيرفر' : '❌ Server error'
    };

    const msg = messages[code] || (isAr ? '❌ حدث خطأ: ' + code : '❌ Error: ' + code);
    showProfileNotification(msg, 'error');

    // إذا كان خطأ طاقة، العودة للقائمة
    if (code === 'no_energy' || code === 'not_logged_in' || code === 'banned') {
        closeDeckBuilder();
    }
}

// ==================== LOADING STATE ====================

function showArenaLoading(show) {
    const btn = document.getElementById('btn-start-battle');
    if (!btn) return;

    const isAr = currentLang === 'ar';
    if (show) {
        btn.disabled = true;
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${isAr ? 'جاري الدخول...' : 'Entering...'}`;
    } else {
        btn.disabled = selectedDeck.length !== 3;
        btn.innerHTML = isAr ? 'ادخل الساحة ⚔️' : 'Enter Arena ⚔️';
    }
}

// ==================== HELPERS ====================

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ==================== BATTLE RESUME (اختياري) ====================

async function tryResumeBattle() {
    const savedBattleId = localStorage.getItem('quiz_arena_battle_id');
    if (!savedBattleId) return;

    try {
        const result = await window.firebaseDB.getArenaBattle(savedBattleId);
        if (!result.success || result.status !== 'active') {
            localStorage.removeItem('quiz_arena_battle_id');
            return;
        }

        // استئناف المعركة
        battleState = {
            battleId: savedBattleId,
            currentRound: result.current_round,
            totalRounds: 3,
            challenge: result.challenge,
            playerDeck: result.player_deck,
            usedPlayerIndexes: result.used_player_indexes || [],
            playerWins: result.player_wins || 0,
            enemyWins: result.enemy_wins || 0,
            roundResults: result.round_results || [],
            isActive: true,
            isProcessing: false
        };

        document.getElementById('game-main-menu').classList.add('hidden-game');
        document.getElementById('arena-screen').classList.remove('hidden-game');
        renderBattleUI();

    } catch (err) {
        localStorage.removeItem('quiz_arena_battle_id');
    }
}