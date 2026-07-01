/**
 * QuizMagic Audio System
 * نظام المؤثرات الصوتية
 */

class AudioController {
    constructor() {
        this.sounds = {};
        this.backgroundMusic = null;
        this.isEnabled = localStorage.getItem('quiz_audio_enabled') !== 'false';
        this.bgMusicEnabled = localStorage.getItem('quiz_bg_music_enabled') === 'true';
        this.volume = parseFloat(localStorage.getItem('quiz_audio_volume')) || 0.3;
        
        this.init();
    }

    init() {
        // تحميل الأصوات
        this.loadSounds();
        
        // إنشاء مشغل الموسيقى الخلفية
        this.backgroundMusic = new Audio('assets/audio/background-fantasy.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.15; // مستوى منخفض للخلفية
        
        // استعادة حالة الموسيقى الخلفية
        if (this.bgMusicEnabled) {
            this.playBackgroundMusic();
        }
    }

    loadSounds() {
        // تعريف الأصوات
        const soundFiles = {
            click: 'assets/audio/ui-click.mp3',
            whoosh: 'assets/audio/transition-whoosh.mp3',
            result: 'assets/audio/magical-reveal.mp3',
            unlock: 'assets/audio/unlock-secret.mp3',
            confetti: 'assets/audio/confetti-pop.mp3'
        };

        // تحميل الأصوات
        for (const [name, src] of Object.entries(soundFiles)) {
            this.sounds[name] = new Audio(src);
            this.sounds[name].volume = this.volume;
        }
    }

    // تشغيل صوت معين
    play(soundName) {
        if (!this.isEnabled || !this.sounds[soundName]) return;
        
        // استنساخ الصوت للسماح بالتشغيل المتداخل
        const sound = this.sounds[soundName].cloneNode();
        sound.volume = this.volume;
        sound.play().catch(e => console.log('Audio play failed:', e));
    }

    // تشغيل الموسيقى الخلفية
    playBackgroundMusic() {
        if (!this.bgMusicEnabled || !this.backgroundMusic) return;
        
        this.backgroundMusic.volume = 0.15;
        this.backgroundMusic.play().catch(e => {
            console.log('Background music autoplay blocked:', e);
        });
    }

    // إيقاف الموسيقى الخلفية
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }

    // تبديل حالة الصوت
    toggleAudio() {
        this.isEnabled = !this.isEnabled;
        localStorage.setItem('quiz_audio_enabled', this.isEnabled);
        
        if (!this.isEnabled) {
            this.stopBackgroundMusic();
        } else if (this.bgMusicEnabled) {
            this.playBackgroundMusic();
        }
        
        return this.isEnabled;
    }

    // تبديل الموسيقى الخلفية
    toggleBackgroundMusic() {
        this.bgMusicEnabled = !this.bgMusicEnabled;
        localStorage.setItem('quiz_bg_music_enabled', this.bgMusicEnabled);
        
        if (this.bgMusicEnabled) {
            this.playBackgroundMusic();
        } else {
            this.stopBackgroundMusic();
        }
        
        return this.bgMusicEnabled;
    }

    // ضبط مستوى الصوت
    setVolume(level) {
        this.volume = level;
        localStorage.setItem('quiz_audio_volume', level);
        
        for (const sound of Object.values(this.sounds)) {
            sound.volume = level;
        }
    }
}

// إنشاء نسخة عامة
const audioController = new AudioController();
