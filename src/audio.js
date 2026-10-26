/**
 * Calm Lo-Fi Procedural Music Engine for Pranesh's Journey
 * Warm Rhodes jazz chords, vinyl crackle, gentle chillhop beat (74 BPM), and relaxing vibes.
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.isMuted = false;
        this.isMusicPlaying = false;
        this.timer = null;
        this.step = 0;
        this.tempo = 74; // Relaxed lo-fi BPM
        this.stepTime = (60 / this.tempo) / 4; // 16th note

        // Lush jazz 7th / 9th chords in C major / A minor
        // 1. Fmaj9, 2. Em7, 3. Dm9, 4. Cmaj7 (add9)
        this.chordProgression = [
            [174.61, 261.63, 329.63, 392.00, 523.25], // F3, C4, E4, G4, C5 (Fmaj9)
            [164.81, 246.94, 293.66, 392.00, 493.88], // E3, B3, D4, G4, B4 (Em7)
            [146.83, 220.00, 261.63, 349.23, 440.00], // D3, A3, C4, F4, A4 (Dm9)
            [130.81, 196.00, 246.94, 293.66, 392.00]  // C3, G3, B3, D4, G4 (Cmaj9)
        ];

        this.bassNotes = [87.31, 82.41, 73.42, 65.41]; // F2, E2, D2, C2
    }

    init() {
        if (this.ctx) return;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;

        this.ctx = new AudioContextClass();

        // Master Gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // Music bus with warm lowpass master filter
        this.musicFilter = this.ctx.createBiquadFilter();
        this.musicFilter.type = 'lowpass';
        this.musicFilter.frequency.setValueAtTime(2200, this.ctx.currentTime); // Cozy vintage roll-off
        this.musicFilter.connect(this.masterGain);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(0.55, this.ctx.currentTime);
        this.musicGain.connect(this.musicFilter);

        // SFX bus
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        this.startVinylNoise();
    }

    ensureContext() {
        if (!this.ctx) this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.75, this.ctx.currentTime);
        }
        return this.isMuted;
    }

    // Gentle vinyl crackle & cassette hiss generator
    startVinylNoise() {
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            // Pink noise filter
            const white = Math.random() * 2 - 1;
            lastOut = (lastOut * 0.96) + (white * 0.04);
            // Occasional gentle vinyl crackle pop
            const crackle = (Math.random() > 0.998) ? (Math.random() - 0.5) * 0.4 : 0;
            data[i] = (lastOut * 0.15) + crackle;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);
        noiseFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.045, this.ctx.currentTime);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        noise.start();
    }

    startMusic() {
        if (this.isMusicPlaying) return;
        this.ensureContext();
        if (!this.ctx) return;

        this.isMusicPlaying = true;
        this.step = 0;

        const loop = () => {
            if (!this.isMusicPlaying || !this.ctx) return;

            const now = this.ctx.currentTime;
            const bar = Math.floor(this.step / 16) % 4;
            const stepInBar = this.step % 16;
            const chord = this.chordProgression[bar];

            // 1. Rhodes Keyboard Chords on beats 0 and 6 (gentle syncopation)
            if (stepInBar === 0 || stepInBar === 6) {
                const vel = (stepInBar === 0) ? 0.18 : 0.12;
                this.playRhodesChord(now, chord, vel);
            }

            // 2. Lo-Fi Drums (Kick, Rim/Snare, Shaker)
            // Kick on 0, 10
            if (stepInBar === 0 || stepInBar === 10) {
                this.playLofiKick(now);
            }
            // Soft Snare / Rimshot on 4, 12
            if (stepInBar === 4 || stepInBar === 12) {
                this.playLofiSnare(now);
            }
            // Gentle closed hat on every 2 steps with chill swing
            if (stepInBar % 2 === 0) {
                const isAccent = (stepInBar % 4 === 2);
                this.playLofiHat(now, isAccent);
            }

            // 3. Sub Bass on 0 and 8
            if (stepInBar === 0 || stepInBar === 8) {
                this.playSubBass(now, this.bassNotes[bar]);
            }

            // 4. Occasional sweet melodic chime
            if (stepInBar === 2 || stepInBar === 14) {
                if (Math.random() > 0.4) {
                    const note = chord[Math.floor(Math.random() * chord.length)] * 1.5;
                    this.playBell(now, note);
                }
            }

            this.step++;
            this.timer = setTimeout(loop, this.stepTime * 1000);
        };

        loop();
    }

    stopMusic() {
        this.isMusicPlaying = false;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    // Warm Rhodes Piano Note
    playRhodesChord(time, freqs, vol = 0.15) {
        if (this.isMuted) return;

        freqs.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'sine';
            // Slight detune for warm vintage character
            osc.frequency.setValueAtTime(freq + (idx % 2 === 0 ? 0.3 : -0.3), time);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(900, time);
            filter.frequency.exponentialRampToValueAtTime(300, time + 1.6);

            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(vol / freqs.length, time + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.8);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.musicGain);

            osc.start(time);
            osc.stop(time + 1.85);
        });
    }

    playSubBass(time, freq) {
        if (this.isMuted) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.28, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(time);
        osc.stop(time + 0.85);
    }

    playLofiKick(time) {
        if (this.isMuted) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.frequency.setValueAtTime(95, time);
        osc.frequency.exponentialRampToValueAtTime(36, time + 0.12);

        gain.gain.setValueAtTime(0.4, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(time);
        osc.stop(time + 0.19);
    }

    playLofiSnare(time) {
        if (this.isMuted) return;

        // Soft filtered noise snap
        const bufferSize = this.ctx.sampleRate * 0.08;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.4;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1600, time);
        filter.Q.value = 1.2;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.18, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        noise.start(time);
        noise.stop(time + 0.09);
    }

    playLofiHat(time, accent = false) {
        if (this.isMuted) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'highpass';
        osc.frequency.setValueAtTime(8000, time);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(7500, time);

        const vol = accent ? 0.05 : 0.025;
        gain.gain.setValueAtTime(vol, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        osc.start(time);
        osc.stop(time + 0.045);
    }

    playBell(time, freq) {
        if (this.isMuted) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.08, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.2);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(time);
        osc.stop(time + 1.25);
    }

    // Peaceful milestone chime when cycling near a station
    playStationChime() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = now + i * 0.07;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.12, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(t);
            osc.stop(t + 0.75);
        });
    }

    playClick() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.035);
    }
}

window.soundEngine = new SoundEngine();
