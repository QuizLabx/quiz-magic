// ============================================================
// ⚔️ ARENA BATTLE SYSTEM - FULL VERSION (REAL CARDS + CLEAN)
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

// ==================== REAL CARD RENDERING FOR ARENA ====================
let arenaCardCache = {};

function getArenaCreatureById(creatureId) {
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'ar';
    const tryLangs = [lang, 'ar', 'en'];
    for (const l of tryLangs) {
        const data = quizzesData[l];
        if (!data || !data.quizzes || !data.quizzes[0]) continue;
        const creature = data.quizzes[0].results.find(r => r.id === creatureId);
        if (creature) {
            return JSON.parse(JSON.stringify(creature));
        }
    }
    return null;
}

async function getArenaCardDataURL(creatureId, tier = 'common') {
    if (!creatureId) return null;
    if (typeof renderCollectibleCardCanvas !== 'function') return null;

    const username = typeof getUsername === 'function' ? getUsername() : '';
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'ar';
    const cacheKey = `${lang}:${username}:${creatureId}:${tier}`;

    if (arenaCardCache[cacheKey]) {
        return arenaCardCache[cacheKey];
    }

    const creature = getArenaCreatureById(creatureId);
    if (!creature) return null;

    if (typeof CREATURE_FINGERPRINTS !== 'undefined' && CREATURE_FINGERPRINTS[creatureId]) {
        creature.fingerprint = CREATURE_FINGERPRINTS[creatureId];
    }

    try {
        const canvas = await renderCollectibleCardCanvas(creature, tier);
        const url = canvas.toDataURL('image/png');
        arenaCardCache[cacheKey] = url;
        return url;
    } catch (error) {
        return null;
    }
}

async function preloadArenaCards() {
    const promises = [];

    (battleState.playerDeck || []).forEach(card => {
        promises.push(getArenaCardDataURL(card.creature_id, card.tier || 'common'));
    });

    (battleState.roundResults || []).forEach(roundResult => {
        if (roundResult.enemy_card) {
            promises.push(getArenaCardDataURL(roundResult.enemy_card.creature_id, roundResult.enemy_card.tier || 'common'));
        }
        if (roundResult.player_card) {
            promises.push(getArenaCardDataURL(roundResult.player_card.creature_id, roundResult.player_card.tier || 'common'));
        }
    });

    await Promise.all(promises);
}

function arenaCardLoadingHTML() {
    return `<div class="arena-card-loading"><i class="fas fa-spinner fa-spin"></i></div>`;
}

function arenaSimpleCardHTML(creatureId, tier = 'common') {
    const isAr = currentLang === 'ar';
    const creature = getArenaCreatureById(creatureId);
    if (!creature) return '';

    const tierLabel = (typeof CARD_TIERS !== 'undefined' && CARD_TIERS[tier])
        ? CARD_TIERS[tier].label[isAr ? 'ar' : 'en']
        : tier;

    return `
        <img src="${creature.image}" style="width:100%;height:70%;object-fit:cover;">
        <div style="font-size:0.55rem;font-weight:900;text-align:center;padding:2px;color:#fff;">
            ${creature.name}
        </div>
        <div style="font-size:0.5rem;text-align:center;color:#cbd5e1;font-weight:700;">
            ★ ${tierLabel}
        </div>
    `;
}

// ==================== DECK BUILDER ====================
function openDeckBuilder() {
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
    updateDeckBuilderTexts();
}

function closeDeckBuilder() {
    document.getElementById('deck-builder-screen').classList.add('hidden-game');
    document.getElementById('game-main-menu').classList.remove('hidden-game');
}

function updateDeckBuilderTexts() {
    const isAr = currentLang === 'ar';

    const setText = (id, arText, enText) => {
        const el = document.getElementById(id);
        if (el) el.innerText = isAr ? arText : enText;
    };

    setText('deck-builder-title', 'تجهيز التشكيلة', 'Prepare Deck');
    setText('deck-back-text', 'عودة', 'Back');
    setText('deck-hint-text', 'اختر كائناً لعرض بطاقاتك', 'Choose a creature to view your cards');

    if (typeof updateDeckUI === 'function') {
        updateDeckUI();
    }
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

    const isAr = currentLang === 'ar';

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

    startBtn.innerText = isAr ? 'ادخل الساحة ⚔️' : 'Enter Arena ⚔️';
}

// ==================== BATTLE START ====================
async function enterArena() {
    const isAr = currentLang === 'ar';

    if (selectedDeck.length !== 3) {
        showProfileNotification(isAr ? '⚠️ اختر 3 بطاقات أولاً' : '⚠️ Select 3 cards first', 'error');
        return;
    }

    const deckForServer = selectedDeck.map(c => ({
        creature_id: c.creatureId,
        tier: c.tier
    }));

    showArenaLoading(true);

    try {
        const result = await window.firebaseDB.startArenaBattle(deckForServer);

        if (!result.success) {
            handleBattleError(result.code);
            showArenaLoading(false);
            return;
        }

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

        localStorage.setItem('quiz_arena_battle_id', result.battle_id);

        document.getElementById('deck-builder-screen').classList.add('hidden-game');
        document.getElementById('arena-screen').classList.remove('hidden-game');

        updateArenaTexts();

        await preloadArenaCards();
        await renderBattleUI();

        showArenaLoading(false);

        if (window.audioManager) window.audioManager.play('ui-click');

    } catch (err) {
        showProfileNotification(
            isAr ? '❌ خطأ في الاتصال بالسيرفر' : '❌ Server connection error',
            'error'
        );
        showArenaLoading(false);
    }
}

// ==================== ARENA TEXTS (LANGUAGE) ====================
function updateArenaTexts() {
    const isAr = currentLang === 'ar';

    const setText = (id, arText, enText) => {
        const el = document.getElementById(id);
        if (el) el.innerText = isAr ? arText : enText;
    };

    setText('arena-retreat-text', 'انسحاب', 'Retreat');
    setText('arena-title-text', 'تحدي الحراس', 'Guardian Challenge');
    setText('arena-round-label', 'الجولة', 'Round');
    setText('arena-enemy-label', 'بطاقات الحارس', 'Guardian Cards');
    setText('arena-challenge-label', 'تحدي:', 'Challenge:');
    setText('arena-attack-label', 'اختر بطاقة للهجوم', 'Select a card to attack');
    setText('arena-vs-text', 'VS', 'VS');
}

// ==================== BATTLE UI RENDERING ====================
async function renderBattleUI() {
    document.getElementById('arena-round').innerText = battleState.currentRound;
    updateChallengeDisplay();

    await renderPlayerBattleCards();
    await renderEnemyCards();

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

async function renderPlayerBattleCards() {
    const container = document.getElementById('player-arena-cards');
    if (!container) return;

    container.innerHTML = '';

    for (let index = 0; index < battleState.playerDeck.length; index++) {
        const card = battleState.playerDeck[index];
        const isUsed = battleState.usedPlayerIndexes.includes(index);

        const slot = document.createElement('div');
        slot.className = `arena-card-slot player-slot ${isUsed ? 'used' : ''}`;
        slot.innerHTML = arenaCardLoadingHTML();

        if (!isUsed) {
            slot.onclick = () => selectBattleCard(index);
            slot.style.cursor = 'pointer';
        } else {
            slot.style.cursor = 'default';
            slot.style.opacity = '0.4';
        }

        container.appendChild(slot);

        const cardURL = await getArenaCardDataURL(
            card.creature_id,
            card.tier || 'common'
        );

        if (cardURL) {
            slot.innerHTML = `
                <img src="${cardURL}" class="arena-real-card-img" alt="">
            `;
        } else {
            slot.innerHTML = arenaSimpleCardHTML(
                card.creature_id,
                card.tier || 'common'
            );
        }

        if (isUsed) {
            slot.style.opacity = '0.4';
        }
    }
}

async function renderEnemyCards() {
    const container = document.getElementById('enemy-cards-container');
    if (!container) return;

    container.innerHTML = '';

    for (let i = 0; i < 3; i++) {
        const roundResult = battleState.roundResults.find(r => r.round === i + 1);

        const slot = document.createElement('div');
        slot.className = 'arena-card-slot enemy-slot';

        if (roundResult && roundResult.enemy_card) {
            slot.classList.add('revealed');
            slot.innerHTML = arenaCardLoadingHTML();
            container.appendChild(slot);

            const enemyCardURL = await getArenaCardDataURL(
                roundResult.enemy_card.creature_id,
                roundResult.enemy_card.tier || 'common'
            );

            if (enemyCardURL) {
                slot.innerHTML = `
                    <img src="${enemyCardURL}" class="arena-real-card-img" alt="">
                `;
            } else {
                slot.innerHTML = arenaSimpleCardHTML(
                    roundResult.enemy_card.creature_id,
                    roundResult.enemy_card.tier || 'common'
                );
            }

            slot.style.borderColor = '#ef4444';
        } else {
            slot.innerHTML = '<div class="card-back-pattern"></div>';
            container.appendChild(slot);
        }
    }
}

// ==================== CARD SELECTION ====================
async function selectBattleCard(cardIndex) {
    if (battleState.isProcessing) return;
    if (!battleState.isActive) return;
    if (battleState.usedPlayerIndexes.includes(cardIndex)) return;

    battleState.isProcessing = true;

    const playerCards = document.querySelectorAll('#player-arena-cards .arena-card-slot');
    if (playerCards[cardIndex]) {
        playerCards[cardIndex].classList.add('flying');
    }

    await delay(300);

    await renderPlayerBattleCards();

    try {
        const result = await window.firebaseDB.selectArenaCard(battleState.battleId, cardIndex);

        if (!result || !result.success) {
            handleBattleError(result?.code || 'rpc_failed');
            battleState.isProcessing = false;
            await renderPlayerBattleCards();
            return;
        }

        battleState.usedPlayerIndexes.push(cardIndex);

        if (result.round_result) {
            battleState.roundResults.push(result.round_result);
            battleState.playerWins = result.player_wins ?? battleState.playerWins;
            battleState.enemyWins = result.enemy_wins ?? battleState.enemyWins;

            await showRoundResult(result.round_result);
        }

        if (result.battle_finished) {
            battleState.isActive = false;
            localStorage.removeItem('quiz_arena_battle_id');
            await showBattleResult(result);
            battleState.isProcessing = false;
        } else {
            battleState.currentRound = result.current_round ?? battleState.currentRound + 1;
            battleState.challenge = result.next_challenge ?? battleState.challenge;

            await renderBattleUI();

            battleState.isProcessing = false;
        }

    } catch (err) {
        battleState.isProcessing = false;

        const isAr = currentLang === 'ar';

        showProfileNotification(
            isAr ? '❌ خطأ في تنفيذ الجولة' : '❌ Round error',
            'error'
        );

        await renderPlayerBattleCards();
    }
}

// ==================== ROUND RESULT DISPLAY ====================
async function showRoundResult(roundResult) {
    if (!roundResult) return;

    if (!roundResult.player_card || !roundResult.enemy_card) {
        return;
    }

    const isAr = currentLang === 'ar';

    const clashEnemy = document.getElementById('clash-enemy');
    const clashPlayer = document.getElementById('clash-player');

    const playerCard = roundResult.player_card || {};
    const enemyCard = roundResult.enemy_card || {};

    if (clashPlayer) {
        clashPlayer.classList.add('clash-slot-active');
        clashPlayer.innerHTML = arenaCardLoadingHTML();
    }

    if (clashEnemy) {
        clashEnemy.classList.add('clash-slot-active');
        clashEnemy.innerHTML = arenaCardLoadingHTML();
    }

    const [playerCardURL, enemyCardURL] = await Promise.all([
        getArenaCardDataURL(playerCard.creature_id, playerCard.tier || 'common'),
        getArenaCardDataURL(enemyCard.creature_id, enemyCard.tier || 'common')
    ]);

    if (clashPlayer) {
        clashPlayer.innerHTML = playerCardURL
            ? `
                <div class="clash-card-display">
                    <img src="${playerCardURL}" class="arena-real-card-img" alt="">
                    <div class="clash-power-badge player-power">
                        ${roundResult.player_power !== undefined ? roundResult.player_power : ''}
                    </div>
                </div>
            `
            : '';
    }

    await delay(350);

    if (clashEnemy) {
        clashEnemy.innerHTML = enemyCardURL
            ? `
                <div class="clash-card-display">
                    <img src="${enemyCardURL}" class="arena-real-card-img" alt="">
                    <div class="clash-power-badge enemy-power">
                        ${roundResult.enemy_power !== undefined ? roundResult.enemy_power : ''}
                    </div>
                </div>
            `
            : '';
    }

    await renderEnemyCards();

    await delay(300);

    if (clashEnemy) clashEnemy.classList.add('clash-flash');
    if (clashPlayer) clashPlayer.classList.add('clash-flash');

    await delay(500);

    const winner = roundResult.winner;
    const isVictory = winner === 'player';

    const playerCardsContainer = document.getElementById('player-arena-cards');

    if (playerCardsContainer) {
        if (isVictory) {
            playerCardsContainer.classList.add('round-win');
        } else {
            playerCardsContainer.classList.add('round-lose');
        }
    }

    const resultText = isVictory
        ? (isAr ? '✅ فزت بالجولة!' : '✅ You won the round!')
        : (isAr ? '❌ خسرت الجولة' : '❌ You lost the round');

    showProfileNotification(resultText, isVictory ? 'success' : 'error');

    if (window.audioManager) {
        window.audioManager.play(isVictory ? 'magical-reveal' : 'ui-click');
    }

    await delay(1500);

    if (clashEnemy) {
        clashEnemy.classList.remove('clash-flash', 'clash-slot-active');
        clashEnemy.innerHTML = '';
    }

    if (clashPlayer) {
        clashPlayer.classList.remove('clash-flash', 'clash-slot-active');
        clashPlayer.innerHTML = '';
    }

    if (playerCardsContainer) {
        playerCardsContainer.classList.remove('round-win', 'round-lose');
    }
}

// ==================== BATTLE CINEMATIC (مشهد التتويج السينمائي) ====================
async function showBattleCinematic(result) {
  const overlay = document.getElementById('battle-cinematic-overlay');
  if (!overlay) return;
  const isAr = currentLang === 'ar';
  const isVictory = result.final_winner === 'player';

  // 1) اسم الفائز + صورة شخصيته + تشكيلته الفائزة
  let winnerName, characterImage, winnerDeck = [];
  if (isVictory) {
    winnerName = (typeof getUsername === 'function' && getUsername()) ? getUsername() : (isAr ? 'أنت' : 'You');
    characterImage = (typeof getEquippedCharacterImage === 'function') ? getEquippedCharacterImage() : DEFAULT_CHARACTER.image;
    winnerDeck = (battleState.playerDeck || []).map(c => ({ creature_id: c.creature_id, tier: c.tier || 'common' }));
  } else {
    winnerName = isAr ? ARENA_GUARDIAN_NAME.ar : ARENA_GUARDIAN_NAME.en;
    characterImage = (typeof DEFAULT_CHARACTER !== 'undefined') ? DEFAULT_CHARACTER.image : '';
    winnerDeck = (battleState.roundResults || [])
      .map(r => r.enemy_card).filter(Boolean)
      .map(c => ({ creature_id: c.creature_id, tier: c.tier || 'common' }));
  }

  // 2) شارة الحالة من وجهة نظر المشاهد (أنا)
  const statusEl = document.getElementById('cinematic-status');
  if (statusEl) {
    statusEl.textContent = isVictory ? (isAr ? 'فائز' : 'VICTOR') : (isAr ? 'خاسر' : 'DEFEATED');
    statusEl.classList.toggle('cinematic-status-win', isVictory);
    statusEl.classList.toggle('cinematic-status-lose', !isVictory);
  }

  // 3) سطر "الفائز هو ..."
  const winnerLineEl = document.getElementById('cinematic-winner-line');
  if (winnerLineEl) {
    const safeName = (typeof escapeHtml === 'function') ? escapeHtml(winnerName) : winnerName;
    winnerLineEl.textContent = isAr ? `الفائز هو ${safeName}` : `Winner: ${safeName}`;
  }

  // 4) المكافآت (بدون إيموجي)
  const rewardsEl = document.getElementById('cinematic-rewards');
  if (rewardsEl) {
    const gems = (result.rewards && result.rewards.gems) || 0;
    const xp = (result.rewards && result.rewards.xp) || 0;
    let html = '';
    if (gems > 0) html += `<span class="cinematic-reward-item">${gems} ${isAr ? 'جوهرة' : 'Gems'}</span>`;
    if (xp > 0) html += `<span class="cinematic-reward-item">${xp} XP</span>`;
    if (!html) html = `<span class="cinematic-reward-item">${isAr ? 'لا مكافآت' : 'No rewards'}</span>`;
    rewardsEl.innerHTML = html;
  }

  // 5) صورة الشخصية
  const charImg = document.getElementById('cinematic-character-img');
  if (charImg) {
    charImg.style.display = '';
    charImg.src = characterImage || '';
    charImg.onerror = () => { charImg.style.display = 'none'; };
  }

  // 6) نص زر الإغلاق
  const closeText = document.getElementById('cinematic-close-text');
  if (closeText) closeText.textContent = isAr ? 'العودة للقائمة' : 'Back to Menu';

  // 7) بناء حلقة البطاقات الدوارة من تشكيلة الفائز
  const ring = document.getElementById('cinematic-cards-ring');
  if (ring) {
    ring.innerHTML = '';
    const cards = winnerDeck.length > 0 ? winnerDeck : [];
    const total = Math.max(cards.length, 1);
    const rendered = await Promise.all(cards.map(c => getArenaCardDataURL(c.creature_id, c.tier)));
    cards.forEach((c, i) => {
      const angle = (360 / total) * i;
      const orbit = document.createElement('div');
      orbit.className = 'cinematic-card-orbit';
      orbit.style.setProperty('--orbit-angle', angle + 'deg');
      const inner = document.createElement('div');
      inner.className = 'cinematic-card-orbit-inner';
      const url = rendered[i];
      inner.innerHTML = url
        ? `<img src="${url}" alt="" class="cinematic-orbit-img">`
        : arenaSimpleCardHTML(c.creature_id, c.tier);
      orbit.appendChild(inner);
      ring.appendChild(orbit);
    });
  }

  // 8) إظهار المشهد
  overlay.classList.add('cinematic-active');
}

function closeBattleCinematic() {
  const overlay = document.getElementById('battle-cinematic-overlay');
  if (overlay) overlay.classList.remove('cinematic-active');
  // تصفير حالة المعركة يدوياً (closeArena الفعّالة لا تصفّرها)
  battleState = {
    battleId: null, currentRound: 1, totalRounds: 3, challenge: null,
    playerDeck: [], usedPlayerIndexes: [], playerWins: 0, enemyWins: 0,
    roundResults: [], isActive: false, isProcessing: false
  };
  localStorage.removeItem('quiz_arena_battle_id');
  syncArenaData();
  closeArena();
}

// ==================== BATTLE RESULT ====================

async function showBattleResult(result) {
  // 🎬 عرض المشهد السينمائي الجديد بدلاً من النافذة القديمة
  await showBattleCinematic(result);

  // مزامنة البيانات + الصوت + التتبع (كما كان سابقاً)
  await syncArenaData();
  const isVictory = result.final_winner === 'player';
  if (window.audioManager) {
    window.audioManager.play(isVictory ? 'magical-reveal' : 'ui-click');
  }
  if (typeof trackEvent === 'function') {
    trackEvent('arena_battle_complete', {
      result: result.final_winner,
      player_wins: battleState.playerWins,
      enemy_wins: battleState.enemyWins
    });
  }
}
async function closeBattleResult() {
    const modal = document.getElementById('battle-result-modal');

    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    await syncArenaData();
    closeArena();
}

// ==================== ARENA NAVIGATION ====================
function closeArena() {
    document.getElementById('arena-screen').classList.add('hidden-game');
    document.getElementById('game-main-menu').classList.remove('hidden-game');

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

    if (code === 'not_logged_in' || code === 'banned') {
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
        btn.innerText = isAr ? 'ادخل الساحة ⚔️' : 'Enter Arena ⚔️';
    }
}

// ==================== SYNC DATA AFTER BATTLE ====================
async function syncArenaData() {
    try {
        if (window.firebaseDB && window.firebaseDB.isLoggedIn()) {
            const cloudData = await window.firebaseDB.fetchUserData();

            if (cloudData) {
                if (typeof cloudData.gems === 'number') {
                    localStorage.setItem('quiz_gems', String(cloudData.gems));
                }
                if (typeof cloudData.xp === 'number') {
                    localStorage.setItem('quiz_xp', String(cloudData.xp));
                }
                if (typeof cloudData.level === 'number') {
                    localStorage.setItem('quiz_level', String(cloudData.level));
                }
                if (cloudData.stats) {
                    localStorage.setItem('quiz_stats', JSON.stringify(cloudData.stats));
                }
                if (cloudData.achievements) {
                    localStorage.setItem('quiz_achievements', JSON.stringify(cloudData.achievements));
                }
            }
        }

        if (typeof updateGemsHeader === 'function') {
            updateGemsHeader();
        }

        if (typeof updateGameMenuStats === 'function') {
            updateGameMenuStats();
        }

        if (window.firebaseDB && window.firebaseDB.isLoggedIn() && window.sbClient) {
            const userId = window.firebaseDB.getCurrentUserId();

            const { data: energyVal } = await window.sbClient.rpc('server_get_energy', {
                p_user_id: userId
            });

            const energyText = `${energyVal !== null ? energyVal : 5}/5`;

            const energyEl = document.getElementById('energy-header-count');
            if (energyEl) energyEl.textContent = energyText;

            const gameEnergyEl = document.getElementById('game-energy-count');
            if (gameEnergyEl) gameEnergyEl.textContent = energyText;
        }

        if (typeof renderXPBar === 'function') {
            renderXPBar();
        }

        if (window.firebaseDB && window.firebaseDB.isLoggedIn()) {
            const stats = JSON.parse(localStorage.getItem('quiz_stats') || '{}');
            const achievements = JSON.parse(localStorage.getItem('quiz_achievements') || '{}');
            const cards = JSON.parse(localStorage.getItem('quiz_cards') || '{}');

            await window.firebaseDB.syncGameData(stats, achievements, cards);
        }

    } catch (err) {
        // Silent fail for sync
    }
}

// ==================== HELPERS ====================
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ==================== BATTLE RESUME ====================
async function tryResumeBattle() {
    const savedBattleId = localStorage.getItem('quiz_arena_battle_id');

    if (!savedBattleId) return;

    try {
        const result = await window.firebaseDB.getArenaBattle(savedBattleId);

        if (!result.success || result.status !== 'active') {
            localStorage.removeItem('quiz_arena_battle_id');
            return;
        }

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

        updateArenaTexts();

        await preloadArenaCards();
        await renderBattleUI();

    } catch (err) {
        localStorage.removeItem('quiz_arena_battle_id');
    }
}
