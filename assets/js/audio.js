/**
 * 🎵 QuizMagic Audio Manager
 * نظام الصوت الاحترافي مع تحكم منفصل بالموسيقى والمؤثرات
 */

class AudioManager {
    constructor() {
        // تعريف جميع الأصوات (الحالية والمستقبلية)
        this.sounds = {
            // 🎼 الموسيقى الخلفية
            'background': {
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
            // 🔇 أصوات مستقبلية (غير متوفرة حالياً - أضف ملفات الصوت لإمكانية التفعيل)
            // 'achievement-unlocked': { path: 'assets/audio/achievement-unlocked.mp3', volume: 0.5, loop: false, type: 'sfx' },
            // 'hover-sound':         { path: 'assets/audio/hover-sound.mp3',         volume: 0.3, loop: false, type: 'sfx' },
            // 'quiz-complete':        { path: 'assets/audio/quiz-complete.mp3',       volume: 0.6, loop: false, type: 'sfx' },
            // 'splash-whoosh':       { path: 'assets/audio/splash-whoosh.mp3',      volume: 0.4, loop: false, type: 'sfx' }
        };

        this.audioElements = {};
        
        this.settings = {
            musicEnabled: localStorage.getItem('quiz_music_enabled') !== 'false',
            sfxEnabled: localStorage.getItem('quiz_sfx_enabled') !== 'false'
        };

        this.userInteracted = false;
        this.setupUserInteractionListener();
    }

    setupUserInteractionListener() {
        const startAudio = () => {
            if (!this.userInteracted) {
                this.userInteracted = true;
                if (this.settings.musicEnabled) {
                    this.play('background').catch(e => console.log('Background music blocked:', e));
                }
                ['click', 'touchstart', 'keydown'].forEach(evt => {
                    document.removeEventListener(evt, startAudio);
                });
            }
        };

        ['click', 'touchstart', 'keydown'].forEach(evt => {
            document.addEventListener(evt, startAudio, { once: false });
        });
    }

    async play(soundName) {
        const soundConfig = this.sounds[soundName];
        if (!soundConfig) {
            console.warn(`⚠️ الصوت "${soundName}" غير معرف`);
            return;
        }

        if (soundConfig.type === 'music' && !this.settings.musicEnabled) return;
        if (soundConfig.type === 'sfx' && !this.settings.sfxEnabled) return;

        try {
            if (!this.audioElements[soundName]) {
                this.audioElements[soundName] = new Audio(soundConfig.path);
                this.audioElements[soundName].loop = soundConfig.loop;
                this.audioElements[soundName].volume = soundConfig.volume;
                this.audioElements[soundName].preload = 'auto';
            }

            const audio = this.audioElements[soundName];
            
            if (!soundConfig.loop) {
                audio.currentTime = 0;
            }

            await audio.play();
        } catch (error) {
            console.log(`🔇 تعذر تشغيل الصوت "${soundName}":`, error.message);
        }
    }

    stop(soundName) {
        const audio = this.audioElements[soundName];
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }

    toggleMusic() {
        this.settings.musicEnabled = !this.settings.musicEnabled;
        localStorage.setItem('quiz_music_enabled', this.settings.musicEnabled);

        if (this.settings.musicEnabled) {
            this.play('background');
        } else {
            this.stop('background');
        }
        
        this.updateUI();
        return this.settings.musicEnabled;
    }

    toggleSfx() {
        this.settings.sfxEnabled = !this.settings.sfxEnabled;
        localStorage.setItem('quiz_sfx_enabled', this.settings.sfxEnabled);
        this.updateUI();
        return this.settings.sfxEnabled;
    }

    updateUI() {
        const musicBtn = document.getElementById('music-toggle');
        const sfxBtn = document.getElementById('sfx-toggle');

        if (musicBtn) {
            const icon = musicBtn.querySelector('i');
            if (icon) {
                icon.className = this.settings.musicEnabled 
                    ? 'fas fa-volume-up' 
                    : 'fas fa-volume-mute';
            }
            musicBtn.title = this.settings.musicEnabled 
                ? 'إيقاف الموسيقى / Mute Music' 
                : 'تشغيل الموسيقى / Play Music';
        }

        if (sfxBtn) {
            const icon = sfxBtn.querySelector('i');
            if (icon) {
                icon.className = this.settings.sfxEnabled 
                    ? 'fas fa-bell' 
                    : 'fas fa-bell-slash';
            }
            sfxBtn.title = this.settings.sfxEnabled 
                ? 'إيقاف المؤثرات / Mute SFX' 
                : 'تشغيل المؤثرات / Play SFX';
        }
    }

    initButtons() {
        this.updateUI();
    }
}

window.audioManager = new AudioManager();

document.addEventListener('DOMContentLoaded', function() {
    window.audioManager.initButtons();
});
