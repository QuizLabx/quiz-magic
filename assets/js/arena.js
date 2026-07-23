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
    playerHp: 100,
    enemyHp: 100,
    revealedEnemyCards: {},
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
        // ❤️ 3A: تهيئة HP لبداية المعركة
        battleState.playerHp = 100;
        battleState.enemyHp = 100;
        if (typeof updateHpBars === 'function') updateHpBars();
        // 🦅🗿 3B-3: تهيئة الكشف + كشف الجولة 1 إن وُجدت قدرة الكشف
        battleState.revealedEnemyCards = {};
        if (result.revealed_enemy_card) battleState.revealedEnemyCards[0] = result.revealed_enemy_card;
        document.getElementById('deck-builder-screen').classList.add('hidden-game');

        document.getElementById('arena-screen').classList.remove('hidden-game');

        updateArenaTexts();

        await preloadArenaCards();
        await renderBattleUI();
        // 🧩 3D: شارة + ومضة تآزر التشكيلة (محسوبة محلياً للعرض؛ الحكم في السيرفر)
        if (typeof computeDeckSynergyClient === 'function') {
          const _syn = computeDeckSynergyClient(battleState.playerDeck);
          if (typeof renderSynergyBadge === 'function') renderSynergyBadge(_syn);
          if (_syn && _syn.type !== 'none' && typeof showSynergyFlash === 'function') showSynergyFlash(_syn);
        }
        showArenaLoading(false);
        if (window.audioManager) window.audioManager.play('ui-click');
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
  // 📊 2A-4: تحديث شريط الجولات الحي
  if (typeof updateRoundsTrack === 'function') updateRoundsTrack();
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
        // 🔥 3C: أيقونة العنصر على بطاقة اللاعب
        if (typeof elementBadgeHTML === 'function') slot.insertAdjacentHTML('beforeend', elementBadgeHTML(card.creature_id));
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
        slot.innerHTML = `<img src="${enemyCardURL}" class="arena-real-card-img" alt="">`;
      } else {
        slot.innerHTML = arenaSimpleCardHTML(
          roundResult.enemy_card.creature_id,
          roundResult.enemy_card.tier || 'common'
        );
      }
      // 🔥 3C: أيقونة العنصر على بطاقة الحارس المكشوفة
      if (typeof elementBadgeHTML === 'function') slot.insertAdjacentHTML('beforeend', elementBadgeHTML(roundResult.enemy_card.creature_id));
      slot.style.borderColor = '#ef4444';
    } else {
      // 🗿 3B-3: بطاقة مكشوفة بالبصيرة (أبو الهول في التشكيلة)
      const _revealed = (battleState.revealedEnemyCards || {})[i];
      if (_revealed) {
        slot.classList.add('revealed', 'revealed-sight');
        slot.innerHTML = arenaCardLoadingHTML();
        container.appendChild(slot);
        const _revURL = await getArenaCardDataURL(_revealed.creature_id, _revealed.tier || 'common');
        if (_revURL) {
          slot.innerHTML = `<img src="${_revURL}" class="arena-real-card-img" alt="">`;
        } else {
          slot.innerHTML = arenaSimpleCardHTML(_revealed.creature_id, _revealed.tier || 'common');
        }
        // 🔥 3C: أيقونة العنصر على بطاقة الحارس المكشوفة بالبصيرة
        if (typeof elementBadgeHTML === 'function') slot.insertAdjacentHTML('beforeend', elementBadgeHTML(_revealed.creature_id));
        slot.style.borderColor = '#a855f7';
      } else {
        slot.innerHTML = '<div class="card-back-pattern"></div>';
        container.appendChild(slot);
      }
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
        // 🗿 3B-3: خزّن بطاقة الحارس المكشوفة للجولة التالية
        if (result.revealed_enemy_card) {
          if (!battleState.revealedEnemyCards) battleState.revealedEnemyCards = {};
          battleState.revealedEnemyCards[result.current_round - 1] = result.revealed_enemy_card;
        }
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
  if (!roundResult.player_card || !roundResult.enemy_card) return;

  const isAr = currentLang === 'ar';
  const clashEnemy = document.getElementById('clash-enemy');
  const clashPlayer = document.getElementById('clash-player');
  const playerCard = roundResult.player_card || {};
  const enemyCard = roundResult.enemy_card || {};

  // 🎬 2A-1: شاشة VS
  const prePlayerURL = await getArenaCardDataURL(playerCard.creature_id, playerCard.tier || 'common');
  showArenaVS(prePlayerURL);
  await delay(1150);
  hideArenaVS();

  if (clashPlayer) { clashPlayer.classList.add('clash-slot-active'); clashPlayer.innerHTML = arenaCardLoadingHTML(); }
  if (clashEnemy) { clashEnemy.classList.add('clash-slot-active'); clashEnemy.innerHTML = arenaCardLoadingHTML(); }

  const [playerCardURL, enemyCardURL] = await Promise.all([
    getArenaCardDataURL(playerCard.creature_id, playerCard.tier || 'common'),
    getArenaCardDataURL(enemyCard.creature_id, enemyCard.tier || 'common')
  ]);

  if (clashPlayer) {
    const _pElBadge = (typeof elementBadgeHTML === 'function') ? elementBadgeHTML(playerCard.creature_id) : '';
    clashPlayer.innerHTML = playerCardURL
      ? `<div class="clash-card-display"><img src="${playerCardURL}" class="arena-real-card-img" alt="">${_pElBadge}<div class="clash-power-badge player-power power-pop">${roundResult.player_power !== undefined ? roundResult.player_power : ''}</div></div>`
      : '';
  }

  await delay(350);
  if (clashEnemy) {
    const _eElBadge = (typeof elementBadgeHTML === 'function') ? elementBadgeHTML(enemyCard.creature_id) : '';
    clashEnemy.innerHTML = enemyCardURL
      ? `<div class="clash-card-display"><img src="${enemyCardURL}" class="arena-real-card-img" alt="">${_eElBadge}<div class="clash-power-badge enemy-power power-pop">${roundResult.enemy_power !== undefined ? roundResult.enemy_power : ''}</div></div>`
      : '';
  }
  await renderEnemyCards();
  await delay(300);

  // 💥 2A-2: التصادم
  const winner = roundResult.winner;            // 'player' | 'enemy' | 'draw'
  const isVictory = winner === 'player';
  if (clashEnemy) clashEnemy.classList.add('clash-flash');
  if (clashPlayer) clashPlayer.classList.add('clash-flash');
  triggerScreenShake();
  spawnClashShockwave();
  spawnClashParticles(winner);
    // 🔥 3C: ومضة التوافق العنصري (تظهر قبل ومضات القدرات)
  if (typeof showElementFlashes === 'function') showElementFlashes(roundResult);
  // ⚡ 3B-2: ومضات القدرات الخاصة (تظهر فوق التصادم)
  if (typeof showAbilityFlashes === 'function') showAbilityFlashes(roundResult);

  // ❤️ 3A: أنيميشن تناقص HP + ضربة قاضية
  const _toP = (roundResult.player_hp != null) ? roundResult.player_hp : battleState.playerHp;
  const _toE = (roundResult.enemy_hp != null) ? roundResult.enemy_hp : battleState.enemyHp;
  if (typeof animateHpBars === 'function') {
    animateHpBars(battleState.playerHp, _toP, battleState.enemyHp, _toE);
  }
  battleState.playerHp = _toP;
  battleState.enemyHp = _toE;
  if ((_toP <= 0 || _toE <= 0) && typeof triggerKO === 'function') {
    triggerKO(winner);
  }
  // 🦅 3B-3: ومضة الإحياء (إن حدثت هذه الجولة)
  if (roundResult.player_revived && typeof showReviveFlash === 'function') showReviveFlash('player');
  if (roundResult.enemy_revived && typeof showReviveFlash === 'function') showReviveFlash('enemy');

  // ✨ 2A-5: توهج/تصدّع (لا شيء عند التعادل)
  if (winner === 'player') {
    if (clashPlayer) clashPlayer.classList.add('clash-card-win');
    if (clashEnemy) clashEnemy.classList.add('clash-card-lose');
  } else if (winner === 'enemy') {
    if (clashPlayer) clashPlayer.classList.add('clash-card-lose');
    if (clashEnemy) clashEnemy.classList.add('clash-card-win');
  }

  await delay(500);

  // 📊 2A-4: شريط الجولات
  if (typeof updateRoundsTrack === 'function') updateRoundsTrack();

  const playerCardsContainer = document.getElementById('player-arena-cards');
  if (playerCardsContainer) {
    if (winner === 'player') playerCardsContainer.classList.add('round-win');
    else if (winner === 'enemy') playerCardsContainer.classList.add('round-lose');
  }

  // ❤️ 3A: نص النتيجة يدعم التعادل
  const resultText = winner === 'player'
    ? (isAr ? '✅ فزت بالجولة!' : '✅ You won the round!')
    : (winner === 'enemy' ? (isAr ? '❌ خسرت الجولة' : '❌ You lost the round')
                          : (isAr ? '➖ تعادل الجولة' : '➖ Round draw'));
  const resultType = (winner === 'enemy') ? 'error' : 'success';
  showProfileNotification(resultText, resultType);
  if (window.audioManager) {
    window.audioManager.play(isVictory ? 'magical-reveal' : 'ui-click');
  }

  await delay(1500);

  // تنظيف
  if (clashEnemy) {
    clashEnemy.classList.remove('clash-flash', 'clash-slot-active', 'clash-card-win', 'clash-card-lose');
    clashEnemy.innerHTML = '';
  }
  if (clashPlayer) {
    clashPlayer.classList.remove('clash-flash', 'clash-slot-active', 'clash-card-win', 'clash-card-lose');
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

  // 4) المكافآت (بدون إيموجي) + شارة سلسلة الانتصارات + شارة الفوز النظيف
  const rewardsEl = document.getElementById('cinematic-rewards');
  if (rewardsEl) {
    const totalGems   = (result.rewards && result.rewards.gems) || 0;
    const totalXp     = (result.rewards && result.rewards.xp) || 0;
    const streak      = (result.rewards && result.rewards.streak) || 0;
    const streakBonus = (result.rewards && result.rewards.streak_bonus_gems) || 0;
    const perfectBonus= (result.rewards && result.rewards.perfect_bonus_xp) || 0;
    // القيم الأساسية = الكلي − المكافآت الإضافية (لتجنّب الإرباك البصري عند الجمع)
    const baseGems = Math.max(0, totalGems - streakBonus);
    const baseXp   = Math.max(0, totalXp - perfectBonus);
    let html = '';
    if (baseGems > 0)      html += `<span class="cinematic-reward-item">${baseGems} ${isAr ? 'جوهرة' : 'Gems'}</span>`;
    if (streakBonus > 0)   html += `<span class="cinematic-reward-item cinematic-reward-streak">+${streakBonus} ${isAr ? 'مكافأة سلسلة' : 'Streak Bonus'}</span>`;
    if (baseXp > 0)        html += `<span class="cinematic-reward-item">${baseXp} XP</span>`;
    if (perfectBonus > 0)  html += `<span class="cinematic-reward-item cinematic-reward-perfect">+${perfectBonus} ${isAr ? 'فوز نظيف' : 'Flawless'}</span>`;
    if (isVictory && streak >= 2) html += `<span class="cinematic-reward-item cinematic-streak-badge">${isAr ? 'سلسلة' : 'Streak'} ×${streak}</span>`;
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
  // 🏅 فحص الإنجازات بعد تحديث إحصائيات الساحة (لإتمام فتح إنجازات الساحة)
  if (typeof checkAchievements === 'function') {
    await checkAchievements();
  }  const isVictory = result.final_winner === 'player';
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
            // ❤️ 3A: إعادة بناء HP من سجلّ الجولات عند الاستئناف
            const _rhp = (typeof deriveHpFromRoundResults === 'function') ? deriveHpFromRoundResults(result.round_results || []) : { playerHp: 100, enemyHp: 100 };
            battleState.playerHp = _rhp.playerHp;
            battleState.enemyHp = _rhp.enemyHp;
            if (typeof updateHpBars === 'function') updateHpBars();
            // 🗿 3B-3: الكشف لا يُستأنف (تقييد معروف — يعود بعد لعب جولة)
            battleState.revealedEnemyCards = {};
            document.getElementById('game-main-menu').classList.add('hidden-game');

        
        document.getElementById('arena-screen').classList.remove('hidden-game');

        updateArenaTexts();

        await preloadArenaCards();
        await renderBattleUI();
        // 🧩 3D: شارة التآزر عند الاستئناف (محسوبة محلياً للعرض)
        if (typeof renderSynergyBadge === 'function' && typeof computeDeckSynergyClient === 'function') {
          renderSynergyBadge(computeDeckSynergyClient(battleState.playerDeck));
        }
        } catch (err) {

        localStorage.removeItem('quiz_arena_battle_id');
    }
}

// ==================== 2A: CINEMATIC BATTLE FX ====================
// 🎬 شاشة VS
function showArenaVS(playerCardURL) {
  const ov = document.getElementById('arena-vs-overlay');
  if (!ov) return;
  const playerSide = document.getElementById('vs-player-card');
  const enemySide = document.getElementById('vs-enemy-card');
  if (playerSide) {
    playerSide.innerHTML = playerCardURL
      ? `<img src="${playerCardURL}" class="vs-card-img" alt="">`
      : `<div class="vs-card-placeholder"><i class="fas fa-shield-halved"></i></div>`;
  }
  if (enemySide) {
    // بطاقة الخصم مخفية (ظهر البطاقة) لإبقاء عنصر المفاجأة
    enemySide.innerHTML = `<div class="card-back-pattern vs-enemy-back"></div>`;
  }
  ov.classList.remove('vs-active-overlay');
  void ov.offsetWidth; // إعادة تشغيل الأنيميشن
  ov.classList.add('vs-active-overlay');
}
function hideArenaVS() {
  const ov = document.getElementById('arena-vs-overlay');
  if (ov) ov.classList.remove('vs-active-overlay');
}
// 💥 اهتزاز الشاشة
function triggerScreenShake() {
  const screen = document.getElementById('arena-screen');
  if (!screen) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  screen.classList.remove('arena-shake');
  void screen.offsetWidth;
  screen.classList.add('arena-shake');
  setTimeout(() => screen.classList.remove('arena-shake'), 450);
}
// 💥 موجة الصدمة
function spawnClashShockwave() {
  const layer = document.getElementById('clash-fx-layer');
  if (!layer) return;
  const wave = document.createElement('div');
  wave.className = 'clash-shockwave';
  layer.appendChild(wave);
  setTimeout(() => wave.remove(), 650);
}
// 💥 الجزيئات المتطايرة (ملوّنة حسب الفائز)
function spawnClashParticles(winner) {
  const layer = document.getElementById('clash-fx-layer');
  if (!layer) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const palette = winner === 'player'
    ? ['#60a5fa', '#93c5fd', '#ffffff', '#3b82f6']
    : (winner === 'enemy' ? ['#f87171', '#fca5a5', '#ffffff', '#ef4444'] : ['#cbd5e1', '#ffffff', '#94a3b8']);
  const count = 16;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'clash-particle';
    const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.5 - 0.25);
    const dist = 50 + Math.random() * 70;
    p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
    p.style.background = palette[Math.floor(Math.random() * palette.length)];
    const size = 4 + Math.random() * 6;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    layer.appendChild(p);
    setTimeout(() => p.remove(), 750);
  }
}
// 📊 شريط الجولات الحي (3 نقاط: فوز/خسارة/حالية/قادمة)
function updateRoundsTrack() {
  const track = document.getElementById('arena-rounds-track');
  if (!track) return;
  const total = battleState.totalRounds || 3;
  track.innerHTML = '';
  for (let i = 1; i <= total; i++) {
    const r = (battleState.roundResults || []).find(x => x.round === i);
    const pip = document.createElement('span');
    pip.className = 'round-pip';
    if (r) {
      if (r.winner === 'player') pip.classList.add('pip-win');
      else if (r.winner === 'enemy') pip.classList.add('pip-lose');
      else pip.classList.add('pip-draw'); // ❤️ 3A: تعادل
    } else if (i === battleState.currentRound && battleState.isActive) {
      pip.classList.add('pip-current');
    } else {
      pip.classList.add('pip-idle');
    }
    track.appendChild(pip);
  }
}
// ==================== 3A: HP SYSTEM ====================
const ARENA_MAX_HP = 100;

// ❤️ اشتقاق HP الحالي من سجلّ الجولات (للاستئناف)
function deriveHpFromRoundResults(roundResults) {
  let pDmg = 0, eDmg = 0;
  (roundResults || []).forEach(r => {
    if (!r) return;
    pDmg += (r.damage_to_player || 0);
    eDmg += (r.damage_to_enemy || 0);
  });
  return {
    playerHp: Math.max(0, ARENA_MAX_HP - pDmg),
    enemyHp: Math.max(0, ARENA_MAX_HP - eDmg)
  };
}
// ❤️ تحديث عرض الشريطَين (العرض + الرقم)
function updateHpBars() {
  const pH = (battleState.playerHp != null) ? battleState.playerHp : ARENA_MAX_HP;
  const eH = (battleState.enemyHp != null) ? battleState.enemyHp : ARENA_MAX_HP;
  const pFill = document.getElementById('hp-fill-player');
  const eFill = document.getElementById('hp-fill-enemy');
  if (pFill) pFill.style.width = Math.max(0, Math.min(100, (pH / ARENA_MAX_HP) * 100)) + '%';
  if (eFill) eFill.style.width = Math.max(0, Math.min(100, (eH / ARENA_MAX_HP) * 100)) + '%';
  updateHpText();
}
function updateHpText() {
  const pEl = document.getElementById('hp-value-player');
  const eEl = document.getElementById('hp-value-enemy');
  if (pEl) pEl.textContent = Math.max(0, battleState.playerHp != null ? battleState.playerHp : ARENA_MAX_HP);
  if (eEl) eEl.textContent = Math.max(0, battleState.enemyHp != null ? battleState.enemyHp : ARENA_MAX_HP);
}
// ❤️ أنيميشن تناقص HP (العرض عبر CSS transition + عدّاد تنازلي للرقم + وميض)
function animateHpBars(fromP, toP, fromE, toE) {
  fromP = (fromP != null ? fromP : ARENA_MAX_HP); toP = (toP != null ? toP : fromP);
  fromE = (fromE != null ? fromE : ARENA_MAX_HP); toE = (toE != null ? toE : fromE);
  const pFill = document.getElementById('hp-fill-player');
  const eFill = document.getElementById('hp-fill-enemy');
  if (pFill) pFill.style.width = Math.max(0, (toP / ARENA_MAX_HP) * 100) + '%';
  if (eFill) eFill.style.width = Math.max(0, (toE / ARENA_MAX_HP) * 100) + '%';
  hpAnimateNumber('hp-value-player', fromP, toP);
  hpAnimateNumber('hp-value-enemy', fromE, toE);
  if (toP < fromP) hpFlashBar('hp-bar-player');
  if (toE < fromE) hpFlashBar('hp-bar-enemy');
}
function hpAnimateNumber(id, from, to) {
  const el = document.getElementById(id);
  if (!el) return;
  from = Math.max(0, from | 0); to = Math.max(0, to | 0);
  const dur = 500, start = performance.now();
  function step(t) {
    const k = Math.min(1, (t - start) / dur);
    el.textContent = Math.round(from + (to - from) * k);
    if (k < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function hpFlashBar(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('hp-hit');
  void el.offsetWidth;
  el.classList.add('hp-hit');
  setTimeout(() => el.classList.remove('hp-hit'), 520);
}
// ❤️ تأثير الضربة القاضية (اهتزاز قوي + نص K.O.)
function triggerKO(winner) {
  const screen = document.getElementById('arena-screen');
  if (screen && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    screen.classList.remove('arena-ko');
    void screen.offsetWidth;
    screen.classList.add('arena-ko');
    setTimeout(() => screen.classList.remove('arena-ko'), 900);
  }
  const layer = document.getElementById('clash-fx-layer');
  if (layer) {
    const ko = document.createElement('div');
    ko.className = 'ko-text';
    ko.textContent = 'K.O.';
    layer.appendChild(ko);
    setTimeout(() => ko.remove(), 1150);
  }
}
// ==================== 3B-2: ABILITY FLASHES (ومضات القدرات في الساحة) ====================
// ترجمة نوع الحدث → نص تأثير قصير (بدون إيموجي)
const ABILITY_EVENT_TEXT = {
  ar: { on_win: 'ضرر إضافي', heal: 'شفاء', armor: 'درع', illusion: 'وهم', grip: 'إضعاف' },
  en: { on_win: 'Bonus DMG', heal: 'Heal', armor: 'Armor', illusion: 'Illusion', grip: 'Weaken' }
};
// تحليل رمز الحدث (مثل "player_on_win") → { side, kind }
function parseAbilityEvent(ev) {
  const s = String(ev || '');
  const side = s.startsWith('player_') ? 'player' : (s.startsWith('enemy_') ? 'enemy' : null);
  if (!side) return null;
  const kind = s.slice(side.length + 1); // on_win | heal | armor | illusion | grip
  return { side, kind };
}
function showAbilityFlashes(roundResult) {
  const layer = document.getElementById('clash-fx-layer');
  if (!layer) return;
  const events = (roundResult && Array.isArray(roundResult.ability_events)) ? roundResult.ability_events : [];
  if (events.length === 0) return;
  const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');
  const pCreature = (roundResult.player_card && roundResult.player_card.creature_id) || null;
  const eCreature = (roundResult.enemy_card && roundResult.enemy_card.creature_id) || null;
  const nameOf = (cid) => {
    const def = (typeof CREATURE_ABILITIES !== 'undefined') ? CREATURE_ABILITIES[cid] : null;
    if (!def || !def.name) return '';
    return isAr ? def.name.ar : def.name.en;
  };
  const dict = ABILITY_EVENT_TEXT[isAr ? 'ar' : 'en'];
  // حاوية الومضات (تُبنى مرة واحدة لكل جولة)
  let stack = layer.querySelector('.ability-flashes-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'ability-flashes-stack';
    layer.appendChild(stack);
  }
  events.forEach((ev, i) => {
    const parsed = parseAbilityEvent(ev);
    if (!parsed) return;
    const cid = parsed.side === 'player' ? pCreature : eCreature;
    const abilityName = nameOf(cid);
    if (!abilityName) return; // قدرة غير معرّفة (مثل none) → لا ومضة
    const effectText = dict[parsed.kind] || '';
    const line = document.createElement('div');
    line.className = 'ability-flash-line ' + (parsed.side === 'player' ? 'flash-player' : 'flash-enemy');
    line.style.animationDelay = (0.15 * i) + 's';
    line.innerHTML = `<i class="fas fa-bolt ability-flash-bolt"></i>`
      + `<span class="ability-flash-name">${escapeHtmlSafe(abilityName)}</span>`
      + (effectText ? `<span class="ability-flash-effect">${escapeHtmlSafe(effectText)}</span>` : '');
    stack.appendChild(line);
    setTimeout(() => line.remove(), 1700 + i * 150);
  });
  // تنظيف الحاوية بعد انتهاء كل الومضات
  setTimeout(() => { if (stack && stack.parentNode) stack.remove(); }, 1700 + events.length * 150 + 100);
}
function escapeHtmlSafe(t) {
  const d = document.createElement('div');
  d.textContent = String(t == null ? '' : t);
  return d.innerHTML;
}

// ==================== 3B-3: REVIVE FLASH (ومضة الإحياء السينمائية) ====================
function showReviveFlash(side) {
  const layer = document.getElementById('clash-fx-layer');
  if (!layer) return;
  const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');
  const flash = document.createElement('div');
  flash.className = 'revive-flash ' + (side === 'player' ? 'revive-flash-player' : 'revive-flash-enemy');
  flash.innerHTML = `<i class="fas fa-fire revive-flash-icon"></i>`
    + `<span class="revive-flash-text">${isAr ? 'انبعاث!' : 'REBIRTH!'}</span>`;
  layer.appendChild(flash);
  setTimeout(() => flash.remove(), 1500);
}

// ==================== 3C: ELEMENTAL SYSTEM (نظام العناصر/التوافق) ====================
// خريطة عنصر كل كائن (مطابقة لـ arena_get_element في السيرفر)
const CREATURE_ELEMENTS = {
  dragon: 'fire', phoenix: 'fire', kitsune: 'fire', cerberus: 'fire',
  kraken: 'water', siren: 'water', hydra: 'water',
  faun: 'nature', centaur: 'nature', unicorn: 'nature', golem: 'nature',
  owl_of_athena: 'spirit', pegasus: 'spirit', simurgh: 'spirit', valkyrie: 'spirit', sphinx: 'spirit'
};
const ELEMENT_META = {
  fire:   { icon: '🔥', color: '#ef4444', name: { ar: 'نار', en: 'Fire' } },
  water:  { icon: '💧', color: '#38bdf8', name: { ar: 'ماء', en: 'Water' } },
  nature: { icon: '🌿', color: '#22c55e', name: { ar: 'طبيعة', en: 'Nature' } },
  spirit: { icon: '✨', color: '#c084fc', name: { ar: 'روح', en: 'Spirit' } }
};
const ELEMENT_FLASH_TEXT = {
  ar: { strong: 'تفوّق عنصري', weak: 'ضعف عنصري' },
  en: { strong: 'Type Advantage', weak: 'Type Weakness' }
};
function getElementMeta(elementKey) {
  return (elementKey && ELEMENT_META[elementKey]) ? ELEMENT_META[elementKey] : null;
}
// 🔥 شارة العنصر الصغيرة (تُحقن فوق بطاقة الساحة/التصادم)
function elementBadgeHTML(creatureId) {
  const key = CREATURE_ELEMENTS[creatureId];
  const m = getElementMeta(key);
  if (!m) return '';
  const label = (typeof currentLang !== 'undefined' && currentLang === 'en') ? m.name.en : m.name.ar;
  return `<span class="element-badge" title="${label}" style="--el-color:${m.color}">${m.icon}</span>`;
}
// 🔥 ومضة التوافق العنصري فوق التصادم (ومضة واحدة من وجهة اللاعب)
function showElementFlashes(rr) {
  const layer = document.getElementById('clash-fx-layer');
  if (!layer) return;
  const adv = rr && rr.element_advantage; // 'strong' | 'weak' | 'neutral'
  if (!adv || adv === 'neutral') return;
  const mp = getElementMeta(rr.player_element);
  const me = getElementMeta(rr.enemy_element);
  if (!mp || !me) return;
  const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');
  const t = ELEMENT_FLASH_TEXT[isAr ? 'ar' : 'en'];
  let stack = layer.querySelector('.element-flashes-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'element-flashes-stack';
    layer.appendChild(stack);
  }
  const line = document.createElement('div');
  line.className = 'element-flash-line ' + (adv === 'strong' ? 'element-flash-strong' : 'element-flash-weak');
  const arrow = adv === 'strong' ? '›' : '‹';
  line.innerHTML = `<span class="element-flash-icons">${mp.icon} ${arrow} ${me.icon}</span>`
    + `<span class="element-flash-text">${adv === 'strong' ? t.strong : t.weak}</span>`;
  stack.appendChild(line);
  setTimeout(() => line.remove(), 1700);
  setTimeout(() => { if (stack && stack.parentNode) stack.remove(); }, 1850);
}

// ==================== 3D: DECK SYNERGY (تآزر التشكيلة) ====================
// قيم التآزر (مطابقة لـ arena_get_deck_synergy في السيرفر — غيّرها في الطرفين معاً)
const SYNERGY_MULT = { harmony: 1.18, trinity: 1.10, pair: 1.05 };
const SYNERGY_META = {
  harmony: { icon: '🔥', color: '#f59e0b', name: { ar: 'تآزر عنصري', en: 'Elemental Harmony' }, desc: { ar: 'تآزر كامل — قوة التشكيلة في ذروتها', en: 'Full synergy — deck at peak power' } },
  trinity: { icon: '🌈', color: '#a855f7', name: { ar: 'تآزر التنوع', en: 'Trinity' }, desc: { ar: 'ثلاثة عناصر متوازنة', en: 'Three balanced elements' } },
  pair:    { icon: '🔗', color: '#38bdf8', name: { ar: 'رابطة ثنائية', en: 'Pair Bond' }, desc: { ar: 'بطاقتان متناغمتان', en: 'Two harmonized cards' } }
};
// 🧩 حساب التآزر محلياً (للعرض فقط — الحكم في السيرفر)
function computeDeckSynergyClient(deck) {
  const els = (deck || []).map(c => (typeof CREATURE_ELEMENTS !== 'undefined') ? CREATURE_ELEMENTS[c.creature_id] : null).filter(Boolean);
  if (els.length < 3) return { type: 'none', mult: 1.0, element: null };
  if (els[0] === els[1] && els[1] === els[2]) return { type: 'harmony', mult: SYNERGY_MULT.harmony, element: els[0] };
  if (els[0] !== els[1] && els[1] !== els[2] && els[0] !== els[2]) return { type: 'trinity', mult: SYNERGY_MULT.trinity, element: null };
  const pair = (els[0] === els[1] || els[0] === els[2]) ? els[0] : els[1];
  return { type: 'pair', mult: SYNERGY_MULT.pair, element: pair };
}
// 🧩 شارة التآزر الدائمة (تُحقن داخل شريط HP اللاعب)
function renderSynergyBadge(synergy) {
  const bar = document.getElementById('hp-bar-player');
  if (!bar) return;
  let badge = bar.querySelector('.synergy-badge');
  if (!synergy || !synergy.type || synergy.type === 'none') {
    if (badge) badge.remove();
    return;
  }
  const meta = SYNERGY_META[synergy.type];
  if (!meta) return;
  const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');
  let icon = meta.icon;
  if (synergy.type === 'harmony' && synergy.element && typeof getElementMeta === 'function') {
    const em = getElementMeta(synergy.element);
    if (em) icon = em.icon;
  }
  if (!badge) {
    badge = document.createElement('div');
    badge.className = 'synergy-badge';
    bar.appendChild(badge);
  }
  badge.style.setProperty('--syn-color', meta.color);
  badge.innerHTML = `<span class="synergy-badge-icon">${icon}</span><span class="synergy-badge-text">${isAr ? meta.name.ar : meta.name.en}</span>`;
  badge.title = (isAr ? meta.desc.ar : meta.desc.en);
}
// 🧩 ومضة التآزر السينمائية عند بدء المعركة
function showSynergyFlash(synergy) {
  const layer = document.getElementById('clash-fx-layer');
  if (!layer || !synergy || !synergy.type || synergy.type === 'none') return;
  const meta = SYNERGY_META[synergy.type];
  if (!meta) return;
  const isAr = (typeof currentLang !== 'undefined' && currentLang === 'ar');
  let icon = meta.icon;
  if (synergy.type === 'harmony' && synergy.element && typeof getElementMeta === 'function') {
    const em = getElementMeta(synergy.element);
    if (em) icon = em.icon;
  }
  const multPct = Math.round(((synergy.mult || 1) - 1) * 100);
  const line = document.createElement('div');
  line.className = 'synergy-flash-line';
  line.style.setProperty('--syn-color', meta.color);
  line.innerHTML = `<span>${icon}</span><span>${isAr ? meta.name.ar : meta.name.en}</span>`
    + (multPct > 0 ? `<span class="synergy-flash-mult">+${multPct}%</span>` : '');
  layer.appendChild(line);
  setTimeout(() => line.remove(), 2300);
}