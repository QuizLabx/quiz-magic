/**
 * 🎵 QuizMagic Audio Manager
 * نظام الصوت الاحترافي مع تحكم منفصل بالموسيقى والمؤثرات
 */

class AudioManager {
    constructor() {
        // تعريف جميع الأصوات (الحالية والمستقبلية)
        this.sounds = {
            // 🎼 الموسيقى الخلفية
            background: {
                path: 'assets/audio/background-fantasy.mp3',
                volume: 0.3,
                loop: true,
                type: 'music'
            },
            // 🔘 أصوات الواجهة (UI)
            'ui-click': {
                path: 'assets/audio/ui-click.mp3',
                volume: 0.5,
                loop: false,
                type: 'sfx'
            },
            // ✨ صوت ظهور النتيجة
            'magical-reveal': {
                path: 'assets/audio/magical-reveal.mp3',
                volume: 0.6,
                loop: false,
                type: 'sfx'
            },
            // 🔓 صوت فتح التقرير السري
            'unlock-secret': {
                path: 'assets/audio/unlock-secret.mp3',
                volume: 0.6,
                loop: false,
                type: 'sfx'
            },
            // 🎁 أصوات مستقبلية (Placeholder)
            'achievement-unlocked': {
                path: 'assets/audio/achievement-unlocked.mp3',
                volume: 0.5,
                loop: false,
                type: 'sfx'
            },
            'hover-sound': {
                path: 'assets/audio/hover-sound.mp3',
                volume: 0.3,
                loop: false,
                type: 'sfx'
            },
            'quiz-complete': {
                path: 'assets/audio/quiz-complete.mp3',
                volume: 0.6,
                loop: false,
                type: 'sfx'
            },
            'splash-whoosh': {
                path: 'assets/audio/splash-whoosh.mp3',
                volume: 0.4,
                loop: false,
                type: 'sfx'
            }
        };

        // كائن لحفظ عناصر Audio المحملة
        this.audioElements = {};
        
        // إعدادات الصوت (تُحفظ في localStorage)
        this.settings = {
            musicEnabled: localStorage.getItem('quiz_music_enabled') !== 'false',
            sfxEnabled: localStorage.getItem('quiz_sfx_enabled') !== 'false'
        };

        this.userInteracted = false;
        this.setupUserInteractionListener();
    }

    /**
     * 🎯 المستمع للتفاعل الأول (مهم جداً لتجاوز سياسة المتصفحات)
     */
    setupUserInteractionListener() {
        const startAudio = () => {
            if (!this.userInteracted) {
                this.userInteracted = true;
                // تشغيل الموسيقى الخلفية تلقائياً بعد أول تفاعل (إذا كانت مفعلة)
                if (this.settings.musicEnabled) {
                    this.play('background').catch(e => console.log('Background music blocked:', e));
                }
                // إزالة المستمع بعد التشغيل
                ['click', 'touchstart', 'keydown'].forEach(evt => {
                    document.removeEventListener(evt, startAudio);
                });
            }
        };

        ['click', 'touchstart', 'keydown'].forEach(evt => {
            document.addEventListener(evt, startAudio, { once: false });
        });
    }

    /**
     * 🔊 تشغيل صوت معين
     */
    async play(soundName) {
        const soundConfig = this.sounds[soundName];
        if (!soundConfig) {
            console.warn(`⚠️ الصوت "${soundName}" غير معرف`);
            return;
        }

        // التحقق من الإعدادات
        if (soundConfig.type === 'music' && !this
