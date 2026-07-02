/**
 * 👤 QuizMagic Profile Manager
 * نظام إدارة الملفات الشخصية (تصدير، استيراد، حذف، عرض الإحصائيات)
 */

// ==================== PROFILE MODAL ====================
function showProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (!modal) return;
    
    renderProfileStats();
    modal.classList.add('show');
    
    // ♿ Accessibility: Focus on close button
    setTimeout(() => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
    }, 100);
}

function closeProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (!modal) return;
    modal.classList.remove('show');
}

// ==================== RENDER STATISTICS ====================
function renderProfileStats() {
    const statsContainer = document.getElementById('profile-stats-grid');
    const detailsContainer = document.getElementById('profile-details');
    if (!statsContainer || !detailsContainer) return;
    
    const isAr = currentLang === 'ar';
    const stats = getUserStats();
    const achievements = JSON.parse(localStorage.getItem('quiz_achievements') || '{}');
    
    // حساب الإحصائيات
    const totalQuizzes = stats.totalQuizzes || 0;
    const unlockedAchievements = Object.values(achievements).filter(a => a.unlocked).length;
    const totalAchievements = Object.keys(ACHIEVEMENTS).length;
    const fastestTime = stats.fastestQuiz ? formatTime(stats.fastestQuiz) : '--';
    const bestCompatibility = stats.bestCompatibility ? `${stats.bestCompatibility}%` : '--';
    const uniqueCreatures = stats.creatures ? Object.keys(stats.creatures).length : 0;
    
    // أكثر كائن حصولاً عليه
    let mostFrequentCreature = '--';
    if (stats.creatures && Object.keys(stats.creatures).length > 0) {
        const sorted = Object.entries(stats.creatures).sort((a, b) => b[1] - a[1]);
        const topCreatureId = sorted[0][0];
        const creature = findCreatureById(topCreatureId);
        if (creature) {
            mostFrequentCreature = isAr ? creature.name : creature.nameEn || creature.name;
        }
    }
    
    // عرض بطاقات الإحصائيات
    statsContainer.innerHTML = `
        <div class="profile-stat-card">
            <div class="stat-icon">🎭</div>
            <div class="stat-value">${totalQuizzes}</div>
            <div class="stat-label">${isAr ? 'اختبار مكتمل' : 'Quizzes Completed'}</div>
        </div>
        <div class="profile-stat-card">
            <div class="stat-icon">🏆</div>
            <div class="stat-value">${unlockedAchievements}/${totalAchievements}</div>
            <div class="stat-label">${isAr ? 'إنجازات مفتوحة' : 'Achievements Unlocked'}</div>
        </div>
        <div class="profile-stat-card">
            <div class="stat-icon">⚡</div>
            <div class="stat-value">${fastestTime}</div>
            <div class="stat-label">${isAr ? 'أسرع اختبار' : 'Fastest Quiz'}</div>
        </div>
        <div class="profile-stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-value">${bestCompatibility}</div>
            <div class="stat-label">${isAr ? 'أفضل توافق' : 'Best Compatibility'}</div>
        </div>
        <div class="profile-stat-card">
            <div class="stat-icon">🎨</div>
            <div class="stat-value">${uniqueCreatures}</div>
            <div class="stat-label">${isAr ? 'كائنات مختلفة' : 'Unique Creatures'}</div>
        </div>
        <div class="profile-stat-card">
            <div class="stat-icon">🐉</div>
            <div class="stat-value" style="font-size: 1rem;">${mostFrequentCreature}</div>
            <div class="stat-label">${isAr ? 'أكثر كائن' : 'Most Frequent'}</div>
        </div>
    `;
    
    // عرض تفاصيل إضافية
    const totalShares = stats.shares || 0;
    const totalComparisons = stats.comparisons || 0;
    const totalSecretUnlocks = stats.secretUnlocks || 0;
    const visitDaysCount = stats.visitDays ? stats.visitDays.length : 0;
    
    detailsContainer.innerHTML = `
        <div class="profile-detail-item">
            <span class="detail-icon">🚀</span>
            <span class="detail-text">${isAr ? 'المشاركات:' : 'Shares:'}</span>
            <span class="detail-value">${totalShares}</span>
        </div>
        <div class="profile-detail-item">
            <span class="detail-icon">⚔️</span>
            <span class="detail-text">${isAr ? 'المقارنات مع الأصدقاء:' : 'Friend Comparisons:'}</span>
            <span class="detail-value">${totalComparisons}</span>
        </div>
        <div class="profile-detail-item">
            <span class="detail-icon">🔓</span>
            <span class="detail-text">${isAr ? 'التقارير السرية المفتوحة:' : 'Secret Reports Unlocked:'}</span>
            <span class="detail-value">${totalSecretUnlocks}</span>
        </div>
        <div class="profile-detail-item">
            <span class="detail-icon">📅</span>
            <span class="detail-text">${isAr ? 'أيام الاستخدام:' : 'Days Active:'}</span>
            <span class="detail-value">${visitDaysCount}</span>
        </div>
    `;
}

// ==================== HELPER FUNCTIONS ====================
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function findCreatureById(creatureId) {
    const data = quizzesData[currentLang];
    if (!data || !data.quizzes) return null;
    for (const quiz of data.quizzes) {
        const found = quiz.results.find(r => r.id === creatureId);
        if (found) return found;
    }
    return null;
}

// ==================== EXPORT DATA ====================
function exportUserData() {
    try {
        const isAr = currentLang === 'ar';
        
        // جمع جميع البيانات من localStorage
        const userData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            quizStats: JSON.parse(localStorage.getItem('quiz_stats') || '{}'),
            achievements: JSON.parse(localStorage.getItem('quiz_achievements') || '{}'),
            preferences: {
                language: localStorage.getItem('quiz_lang') || 'ar',
                theme: localStorage.getItem('quiz_theme') || 'auto',
                musicEnabled: localStorage.getItem('quiz_music_enabled') !== 'false',
                sfxEnabled: localStorage.getItem('quiz_sfx_enabled') !== 'false'
            }
        };
        
        // تحويل إلى JSON وتنزيله كملف
        const jsonString = JSON.stringify(userData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `QuizMagic-Profile-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // 📊 Analytics tracking
        if (typeof trackEvent === 'function') {
            trackEvent('profile_export', {
                'total_quizzes': userData.quizStats.totalQuizzes || 0,
                'achievements_count': Object.keys(userData.achievements).length
            });
        }
        
        showProfileNotification(
            isAr ? '✅ تم تصدير بياناتك بنجاح!' : '✅ Your data has been exported successfully!',
            'success'
        );
    } catch (error) {
        console.error('🛡️ Export failed:', error);
        const isAr = currentLang === 'ar';
        showProfileNotification(
            isAr ? '❌ فشل تصدير البيانات' : '❌ Export failed',
            'error'
        );
    }
}

// ==================== IMPORT DATA ====================
function importUserData() {
    const isAr = currentLang === 'ar';
    
    // إنشاء input file مخفي
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const text = await file.text();
            const userData = JSON.parse(text);
            
            // التحقق من صحة الملف
            if (!userData.version || !userData.quizStats) {
                throw new Error('Invalid file format');
            }
            
            // تأكيد من المستخدم
            const confirmMsg = isAr 
                ? '⚠️ سيؤدي هذا إلى استبدال بياناتك الحالية. هل أنت متأكد؟'
                : '⚠️ This will replace your current data. Are you sure?';
            
            if (!confirm(confirmMsg)) return;
            
            // استعادة البيانات
            localStorage.setItem('quiz_stats', JSON.stringify(userData.quizStats));
            localStorage.setItem('quiz_achievements', JSON.stringify(userData.achievements || {}));
            
            if (userData.preferences) {
                if (userData.preferences.language) {
                    localStorage.setItem('quiz_lang', userData.preferences.language);
                }
                if (userData.preferences.theme) {
                    localStorage.setItem('quiz_theme', userData.preferences.theme);
                }
                if (typeof userData.preferences.musicEnabled === 'boolean') {
                    localStorage.setItem('quiz_music_enabled', userData.preferences.musicEnabled);
                }
                if (typeof userData.preferences.sfxEnabled === 'boolean') {
                    localStorage.setItem('quiz_sfx_enabled', userData.preferences.sfxEnabled);
                }
            }
            
            // 📊 Analytics tracking
            if (typeof trackEvent === 'function') {
                trackEvent('profile_import', {
                    'total_quizzes': userData.quizStats.totalQuizzes || 0
                });
            }
            
            showProfileNotification(
                isAr ? '✅ تم استيراد بياناتك بنجاح! سيتم إعادة تحميل الصفحة.' : '✅ Data imported successfully! Reloading...',
                'success'
            );
            
            // إعادة تحميل الصفحة بعد ثانيتين لتطبيق التغييرات
            setTimeout(() => location.reload(), 2000);
            
        } catch (error) {
            console.error('🛡️ Import failed:', error);
            showProfileNotification(
                isAr ? '❌ ملف غير صالح أو تالف' : '❌ Invalid or corrupted file',
                'error'
            );
        }
    };
    
    input.click();
}

// ==================== DELETE ALL DATA ====================
function deleteAllData() {
    const isAr = currentLang === 'ar';
    
    const confirmMsg1 = isAr
        ? '⚠️ تحذير! سيتم حذف جميع بياناتك نهائياً:\n- جميع الإحصائيات\n- جميع الإنجازات\n- جميع التفضيلات\n\nهل أنت متأكد؟'
        : '⚠️ Warning! All your data will be permanently deleted:\n- All statistics\n- All achievements\n- All preferences\n\nAre you sure?';
    
    if (!confirm(confirmMsg1)) return;
    
    // تأكيد ثانوي للحماية
    const confirmMsg2 = isAr
        ? '🔴 هذا الإجراء لا يمكن التراجع عنه! اكتب "DELETE" للتأكيد:'
        : '🔴 This action cannot be undone! Type "DELETE" to confirm:';
    
    const userInput = prompt(confirmMsg2);
    if (userInput !== 'DELETE') {
        showProfileNotification(
            isAr ? '❌ تم إلغاء العملية' : '❌ Operation cancelled',
            'error'
        );
        return;
    }
    
    try {
        // حذف جميع البيانات المتعلقة بـ QuizMagic
        const keysToDelete = [
            'quiz_stats',
            'quiz_achievements',
            'quiz_lang',
            'quiz_theme',
            'quiz_music_enabled',
            'quiz_sfx_enabled'
        ];
        
        keysToDelete.forEach(key => localStorage.removeItem(key));
        
        // 📊 Analytics tracking
        if (typeof trackEvent === 'function') {
            trackEvent('profile_delete_all');
        }
        
        showProfileNotification(
            isAr ? '🗑️ تم حذف جميع البيانات. سيتم إعادة تحميل الصفحة.' : '🗑️ All data deleted. Reloading...',
            'success'
        );
        
        setTimeout(() => location.reload(), 2000);
        
    } catch (error) {
        console.error('🛡️ Delete failed:', error);
        showProfileNotification(
            isAr ? '❌ فشل حذف البيانات' : '❌ Delete failed',
            'error'
        );
    }
}

// ==================== NOTIFICATIONS ====================
function showProfileNotification(message, type = 'success') {
    // إنشاء عنصر إشعار مؤقت
    const notification = document.createElement('div');
    notification.className = `profile-notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // إظهارها
    setTimeout(() => notification.classList.add('show'), 10);
    
    // إخفاؤها بعد 3 ثوانٍ
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== KEYBOARD SUPPORT ====================
document.addEventListener('keydown', (e) => {
    // إغلاق الملف الشخصي بـ Escape
    if (e.key === 'Escape') {
        const profileModal = document.getElementById('profile-modal');
        if (profileModal && profileModal.classList.contains('show')) {
            closeProfileModal();
        }
    }
});
