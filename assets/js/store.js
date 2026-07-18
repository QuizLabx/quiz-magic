/**
 * 🛒 QuizMagic Store & Inventory Manager
 * يدير عمليات الشراء، البيع، وتغيير مظهر الملف الشخصي
 */

let currentStoreTab = 'pfp';
let currentInventoryTab = 'pfp';
let userInventory = {};
let equippedItems = { pfp: 'default', title: 'default', banner: 'default', sleeve: 'default' };
let userCardInventory = {};

// ==================== INITIALIZATION ====================

// جلب بيانات المتجر للمستخدم عند تحميل الصفحة
async function initStoreData() {
    if (window.firebaseDB && window.firebaseDB.isLoggedIn() && window.sbClient) {
        try {
            const userId = window.firebaseDB.getCurrentUserId();
            const { data, error } = await window.sbClient
                .from('users')
                .select('inventory, equipped_items, gems, card_inventory')
                .eq('id', userId)
                .single();

            if (!error && data) {
                userInventory = data.inventory || {};
                equippedItems = data.equipped_items || { pfp: 'default', title: 'default', banner: 'default', sleeve: 'default' };
                userCardInventory = data.card_inventory || {};
                localStorage.setItem('quiz_gems', data.gems || 0);
                updateGemsHeader();
                // ⚡ جلب الطاقة الحقيقية من السيرفر (مع التجديد اليومي)
                const { data: energyVal } = await window.sbClient.rpc('server_get_energy', { p_user_id: userId });
                const energyEl = document.getElementById('energy-header-count');
                if (energyEl) energyEl.textContent = `${energyVal !== null ? energyVal : 5}/5`;
                applyEquippedItems(); // تطبيق المظهر فوراً
            }
        } catch (err) {
            console.error("Failed to load store data:", err);
        }
    }
}

// تطبيق العناصر الملبوسة على الواجهة (القائمة الجانبية)
function applyEquippedItems() {
    const isAr = currentLang === 'ar';
    
    // 1. تطبيق الصورة المربعة (PFP)
    const pfpImg = document.getElementById('drawer-pfp-img');
    const pfpIcon = document.getElementById('drawer-pfp-icon');
    if (equippedItems.pfp !== 'default') {
        const item = STORE_ITEMS.pfp.find(i => i.id === equippedItems.pfp);
        if (item && pfpImg && pfpIcon) {
            pfpImg.src = item.image;
            pfpImg.style.display = 'block';
            pfpIcon.style.display = 'none';
        }
    } else {
        if (pfpImg) pfpImg.style.display = 'none';
        if (pfpIcon) pfpIcon.style.display = 'block';
    }

    // 2. تطبيق البانر (Banner)
    const bannerEl = document.getElementById('drawer-user-banner');
    if (equippedItems.banner !== 'default') {
        const item = STORE_ITEMS.banners.find(i => i.id === equippedItems.banner);
        if (item && bannerEl) {
            bannerEl.style.backgroundImage = `url('${item.image}')`;
        }
    } else {
        if (bannerEl) bannerEl.style.backgroundImage = 'none';
    }

    // 3. تطبيق اللقب (Title)
    const titleEl = document.getElementById('drawer-user-title-display');
    if (equippedItems.title !== 'default') {
        const item = STORE_ITEMS.titles.find(i => i.id === equippedItems.title);
        if (item && titleEl) {
            titleEl.textContent = isAr ? item.name.ar : item.name.en;
            titleEl.style.color = item.color;
        }
    } else {
        if (titleEl) titleEl.textContent = '';
    }
}

// ==================== STORE MODAL ====================

function showStoreModal() {
    const modal = document.getElementById('store-modal');
    if (!modal) return;
    
    document.getElementById('store-gems-count').textContent = getGemsCount();
    changeStoreTab('pfp'); // فتح قسم الصور افتراضياً
    
    modal.classList.add('show');
    if (typeof trapFocus === 'function') trapFocus(modal);
}

function closeStoreModal() {
    const modal = document.getElementById('store-modal');
    if (!modal) return;
    modal.classList.remove('show');
    if (typeof removeFocusTrap === 'function') removeFocusTrap(modal);
}

function changeStoreTab(tab) {
    currentStoreTab = tab;
    // تحديث الأزرار النشطة
    const tabs = document.getElementById('store-tabs').querySelectorAll('.admin-tab');
    tabs.forEach(t => t.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    // إذا اختار المستخدم قسم العروض، نشغل دالة جلب العروض
    if (tab === 'offers') {
        renderOffersTab();
    } else {
        renderStoreGrid();
    }
}

function renderStoreGrid() {
    const grid = document.getElementById('store-grid');
    grid.innerHTML = '';
    const isAr = currentLang === 'ar';

    if (currentStoreTab === 'sell') {
        renderSellTab(grid, isAr);
        return;
    }

    const items = STORE_ITEMS[currentStoreTab] || [];
    
    items.forEach(item => {
        const isOwned = userInventory[item.id] === 'true' || userInventory[item.id] === true;
        const name = isAr ? item.name.ar : item.name.en;
        
        let visualHtml = '';
        if (currentStoreTab === 'titles') {
            visualHtml = `<div class="text-2xl font-black" style="color: ${item.color}; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${name}</div>`;
        } else {
            visualHtml = `<img src="${item.image}" alt="${name}">`;
        }

        const card = document.createElement('div');
        card.className = `store-item-card type-${currentStoreTab}`;
        card.innerHTML = `
            ${isOwned ? `<div class="store-owned-badge">${isAr ? 'مملوك' : 'Owned'}</div>` : ''}
            <div class="store-item-image-wrapper">
                ${visualHtml}
            </div>
            <div class="store-item-info">
                <div class="store-item-name">${name}</div>
                ${!isOwned ? `<div class="store-item-price"><i class="fas fa-gem"></i> ${item.price}</div>` : '<div class="mb-4"></div>'}
                ${isOwned 
                    ? `<button class="store-btn store-btn-equipped" disabled>${isAr ? 'تم الشراء' : 'Purchased'}</button>`
                    : `<button class="store-btn store-btn-buy" onclick="buyStoreItem('${item.id}', ${item.price}, '${currentStoreTab}')">${isAr ? 'شراء' : 'Buy'}</button>`
                }
            </div>
        `;
        grid.appendChild(card);
    });
}

// ==================== INVENTORY MODAL ====================

function showInventoryModal() {
    const modal = document.getElementById('inventory-modal');
    if (!modal) return;
    
    changeInventoryTab('pfp');
    modal.classList.add('show');
    if (typeof trapFocus === 'function') trapFocus(modal);
}

function closeInventoryModal() {
    const modal = document.getElementById('inventory-modal');
    if (!modal) return;
    modal.classList.remove('show');
    if (typeof removeFocusTrap === 'function') removeFocusTrap(modal);
}

function changeInventoryTab(tab) {
    currentInventoryTab = tab;
    const tabs = document.getElementById('inventory-tabs').querySelectorAll('.admin-tab');
    tabs.forEach(t => t.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    renderInventoryGrid();
}

function renderInventoryGrid() {
    const grid = document.getElementById('inventory-grid');
    grid.innerHTML = '';
    const isAr = currentLang === 'ar';

    const items = STORE_ITEMS[currentInventoryTab] || [];
    
    // 🛠️ تصحيح: تحويل اسم القسم (الجمع) إلى مفتاح قاعدة البيانات (المفرد)
    const categoryMap = { 'pfp': 'pfp', 'titles': 'title', 'banners': 'banner', 'sleeves': 'sleeve' };
    const categoryKey = categoryMap[currentInventoryTab];
    
    // إضافة العنصر الافتراضي (المجاني)
    const defaultCard = document.createElement('div');
    defaultCard.className = `store-item-card type-${currentInventoryTab}`;
    const isDefaultEquipped = equippedItems[categoryKey] === 'default';
    
    defaultCard.innerHTML = `
        <div class="store-item-image-wrapper">
            <i class="fas fa-ban text-4xl text-slate-500"></i>
        </div>
        <div class="store-item-info">
            <div class="store-item-name">${isAr ? 'الافتراضي' : 'Default'}</div>
            <button class="store-btn ${isDefaultEquipped ? 'store-btn-equipped' : 'store-btn-equip'}" 
                onclick="equipStoreItem('${categoryKey}', 'default')" ${isDefaultEquipped ? 'disabled' : ''}>
                ${isDefaultEquipped ? (isAr ? 'مستخدم' : 'Equipped') : (isAr ? 'استخدام' : 'Equip')}
            </button>
        </div>
    `;
    grid.appendChild(defaultCard);

    // عرض العناصر المملوكة فقط
    items.forEach(item => {
        if (userInventory[item.id] === 'true' || userInventory[item.id] === true) {
            const isEquipped = equippedItems[categoryKey] === item.id;
            const name = isAr ? item.name.ar : item.name.en;
            
            let visualHtml = currentInventoryTab === 'titles' 
                ? `<div class="text-2xl font-black" style="color: ${item.color};">${name}</div>` 
                : `<img src="${item.image}" alt="${name}">`;

            const card = document.createElement('div');
            card.className = `store-item-card type-${currentInventoryTab}`;
            card.innerHTML = `
                <div class="store-item-image-wrapper">${visualHtml}</div>
                <div class="store-item-info">
                    <div class="store-item-name">${name}</div>
                    <button class="store-btn ${isEquipped ? 'store-btn-equipped' : 'store-btn-equip'}" 
                        onclick="equipStoreItem('${categoryKey}', '${item.id}')" ${isEquipped ? 'disabled' : ''}>
                        ${isEquipped ? (isAr ? 'مستخدم' : 'Equipped') : (isAr ? 'استخدام' : 'Equip')}
                    </button>
                </div>
            `;
            grid.appendChild(card);
        }
    });
}

// ==================== BACKEND ACTIONS (SECURE) ====================

async function buyStoreItem(itemId, price, category) {
    const isAr = currentLang === 'ar';
    if (!window.firebaseDB || !window.firebaseDB.isLoggedIn() || !window.sbClient) {
        showProfileNotification(isAr ? 'يجب تسجيل الدخول للشراء' : 'Must be logged in to buy', 'error');
        return;
    }

    const confirm = await showConfirmDialog({
        title: isAr ? 'تأكيد الشراء' : 'Confirm Purchase',
        message: isAr ? `هل تريد شراء هذا العنصر مقابل ${price} جوهرة؟` : `Buy this item for ${price} gems?`,
        okText: isAr ? 'شراء' : 'Buy',
        cancelText: isAr ? 'إلغاء' : 'Cancel'
    });

    if (!confirm) return;

    try {
        const userId = window.firebaseDB.getCurrentUserId();
        const { data, error } = await window.sbClient.rpc('server_buy_item', {
            p_user_id: userId,
            p_item_id: itemId,
            p_price: price
        });

        if (error) throw error;

        if (data.success) {
            userInventory = data.inventory;
            localStorage.setItem('quiz_gems', data.new_gems);
            updateGemsHeader();
            document.getElementById('store-gems-count').textContent = data.new_gems;
            renderStoreGrid(); // تحديث الواجهة لتظهر شارة "مملوك"
            showProfileNotification(isAr ? '✅ تم الشراء بنجاح!' : '✅ Purchase successful!', 'success');
            if (window.audioManager) window.audioManager.play('magical-reveal');
        } else {
            showProfileNotification(isAr ? '❌ ' + data.message : '❌ ' + data.message, 'error');
        }
    } catch (err) {
        console.error("Buy error:", err);
        showProfileNotification(isAr ? 'حدث خطأ أثناء الشراء' : 'Error during purchase', 'error');
    }
}

async function equipStoreItem(category, itemId) {
    const isAr = currentLang === 'ar';
    if (!window.firebaseDB || !window.firebaseDB.isLoggedIn() || !window.sbClient) return;

    try {
        const userId = window.firebaseDB.getCurrentUserId();
        const { data, error } = await window.sbClient.rpc('server_equip_item', {
            p_user_id: userId,
            p_category: category,
            p_item_id: itemId
        });

        if (error) throw error;

        if (data.success) {
            equippedItems = data.equipped_items;
            applyEquippedItems(); // تحديث القائمة الجانبية فوراً
            renderInventoryGrid(); // تحديث أزرار "مستخدم"
            showProfileNotification(isAr ? '✅ تم التغيير بنجاح' : '✅ Equipped successfully', 'success');
            if (window.audioManager) window.audioManager.play('ui-click');
        }
    } catch (err) {
        console.error("Equip error:", err);
    }
}

// =================== SELL DUPLICATES (BLACK MARKET) ====================

function renderSellTab(grid, isAr) {
    let hasDuplicates = false;

    Object.keys(userCardInventory).forEach(creatureId => {
        const tiersObj = userCardInventory[creatureId];
        const creatureData = findCreatureById(creatureId);
        if (!creatureData) return;

        Object.keys(tiersObj).forEach(tier => {
            const count = tiersObj[tier];
            if (count > 1) {
                hasDuplicates = true;
                const reward = CARD_SELL_PRICES[tier] || 10;
                const tierLabel = CARD_TIERS[tier] ? CARD_TIERS[tier].label[isAr ? 'ar' : 'en'] : tier;

                const card = document.createElement('div');
                card.className = `store-item-card`;
                card.style.padding = '1rem';
                card.style.alignItems = 'center';
                
                // 🌟 السحر هنا: استخدام تصميم البطاقة الفخمة من المعرض
                card.innerHTML = `
                    <div class="store-owned-badge bg-red-500" style="z-index: 10;">مكرر: ${count - 1}</div>
                    <div class="base-card tier-${tier}" style="width: 140px; margin: 0 auto 1rem auto; pointer-events: none;">
                        <img src="${creatureData.image}" alt="${creatureData.name}">
                        <div class="gallery-badge">${tierLabel}</div>
                        <div class="gallery-name">${creatureData.name}</div>
                    </div>
                    <div class="store-item-info" style="padding: 0; width: 100%;">
                        <button class="store-btn store-btn-buy" style="background: linear-gradient(135deg, #ef4444, #b91c1c);" 
                            onclick="sellDuplicateCard('${creatureId}', '${tier}', ${reward})">
                            ${isAr ? 'بيع بـ' : 'Sell for'} <i class="fas fa-gem"></i> ${reward}
                        </button>
                    </div>
                `;
                grid.appendChild(card);
            }
        });
    });

    if (!hasDuplicates) {
        grid.innerHTML = `<div class="col-span-full text-center py-10 text-slate-400">
            <i class="fas fa-box-open text-4xl mb-4"></i>
            <p>${isAr ? 'لا تملك بطاقات مكررة للبيع حالياً.' : 'No duplicate cards to sell.'}</p>
        </div>`;
    }
}

async function sellDuplicateCard(creatureId, tier, reward) {
    const isAr = currentLang === 'ar';
    if (!window.firebaseDB || !window.firebaseDB.isLoggedIn() || !window.sbClient) return;

    const confirm = await showConfirmDialog({
        title: isAr ? 'تأكيد البيع' : 'Confirm Sale',
        message: isAr ? `هل تريد بيع نسخة مكررة (${tier}) مقابل ${reward} جوهرة؟` : `Sell a duplicate (${tier}) for ${reward} gems?`,
        okText: isAr ? 'بيع' : 'Sell',
        cancelText: isAr ? 'إلغاء' : 'Cancel',
        okType: 'danger'
    });

    if (!confirm) return;

    try {
        const userId = window.firebaseDB.getCurrentUserId();
        const { data, error } = await window.sbClient.rpc('server_sell_duplicate_card', {
            p_user_id: userId,
            p_creature_id: creatureId,
            p_tier: tier,
            p_reward: reward
        });

        if (error) throw error;

        if (data.success) {
            userCardInventory = data.card_inventory; // تحديث المخزون محلياً
            localStorage.setItem('quiz_gems', data.new_gems);
            updateGemsHeader();
            document.getElementById('store-gems-count').textContent = data.new_gems;
            
            renderStoreGrid(); // إعادة رسم صفحة البيع
            showProfileNotification(isAr ? `✅ تم البيع! ربحت ${reward} جوهرة` : `✅ Sold! Earned ${reward} gems`, 'success');
            if (window.audioManager) window.audioManager.play('magical-reveal');
        } else {
            showProfileNotification(isAr ? '❌ ' + data.message : '❌ ' + data.message, 'error');
        }
    } catch (err) {
        console.error("Sell error:", err);
    }
}

// ==================== OGADS OFFERS (EDGE FUNCTION) ====================

async function renderOffersTab() {
    const grid = document.getElementById('store-grid');
    const isAr = currentLang === 'ar';
    
    // إظهار شاشة تحميل أنيقة
    grid.innerHTML = `
        <div class="col-span-full text-center py-10">
            <i class="fas fa-spinner fa-spin text-4xl text-accent mb-4"></i>
            <p class="theme-text-secondary">${isAr ? 'جاري البحث عن كنوز وعروض متاحة لك...' : 'Searching for available offers...'}</p>
        </div>
    `;

    // التحقق من تسجيل الدخول
    if (!window.firebaseDB || !window.firebaseDB.isLoggedIn()) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-10 text-red-400">
                <i class="fas fa-lock text-4xl mb-4"></i>
                <p>${isAr ? 'يجب تسجيل الدخول لرؤية العروض وربح الجواهر.' : 'Must be logged in to see offers.'}</p>
            </div>
        `;
        return;
    }

    try {
        // 🚀 استدعاء دالة الحافة (Edge Function) من Supabase
        const { data, error } = await window.sbClient.functions.invoke('ogads-offers');

        if (error) throw error;

        const offers = data.offers || [];

        // إذا لم تكن هناك عروض متاحة في دولة المستخدم
        if (offers.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-10 text-slate-400">
                    <i class="fas fa-box-open text-4xl mb-4"></i>
                    <p>${isAr ? 'لا توجد عروض متاحة في منطقتك حالياً. عد لاحقاً!' : 'No offers available in your region right now.'}</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = '';
        const userId = window.firebaseDB.getCurrentUserId();

        // رسم العروض
        offers.forEach(offer => {
            // حساب الجواهر (الأرباح بالدولار × 1000)
            const gemsReward = Math.floor(offer.payout * 1000);
            
            // دمج ID المستخدم في رابط العرض لكي يعرف السيرفر لمن يعطي الجواهر
            const offerLink = offer.link + (offer.link.includes('?') ? '&' : '?') + 'aff_sub=' + encodeURIComponent(userId);

            const card = document.createElement('div');
            card.className = 'store-item-card';
            card.style.padding = '1rem';
            card.innerHTML = `
                <div class="store-item-image-wrapper" style="height: 120px; border-radius: 1rem; overflow: hidden; margin-bottom: 1rem; background: #fff;">
                    <img src="${offer.picture}" alt="${offer.name_short}" style="width: 100%; height: 100%; object-fit: contain;">
                </div>
                <div class="store-item-info" style="padding: 0; width: 100%; text-align: center;">
                    <div class="store-item-name" style="font-size: 1.1rem; margin-bottom: 0.5rem;">${offer.name_short}</div>
                    <p style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 1rem; height: 40px; overflow: hidden; text-overflow: ellipsis;">${offer.adcopy}</p>
                    <button class="store-btn store-btn-buy" style="background: linear-gradient(135deg, #8b5cf6, #d946ef); width: 100%; border: none;"
                        onclick="window.open('${offerLink}', '_blank')">
                        ${isAr ? 'أكمل واربح' : 'Complete & Earn'} <i class="fas fa-gem"></i> ${gemsReward}
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });

    } catch (err) {
        console.error("Error fetching offers:", err);
        grid.innerHTML = `
            <div class="col-span-full text-center py-10 text-red-400">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>${isAr ? 'حدث خطأ أثناء جلب العروض. يرجى المحاولة لاحقاً.' : 'Error loading offers.'}</p>
            </div>
        `;
    }
}
