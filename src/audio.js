/**
 * Sunset Warm Lo-Fi Audio Engine
 * Features warm Rhodes 9th chords, gentle chillhop drum groove, vinyl warmth,
 * and a subtle synthesized evening twilight cicada ambience.
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.musicGain = null;
        this.ambientGain = null;
        this.sfxGain = null;
        this.isMuted = false;
        this.isMusicPlaying = false;
        this.timer = null;
        this.step = 0;
        this.tempo = 70; // Ultra-relaxing sunset tempo
        this.stepTime = (60 / this.tempo) / 4;

        // Warm evening chords (Dbmaj9 -> Bbm9 -> Ebm9 -> Ab13)
        // Transposed to cozy Cmaj9 / Am9 / Dm9 / G13
        this.chords = [
            [130.81, 196.00, 246.94, 293.66, 392.00, 493.88], // Cmaj9: C3, G3, B3, D4, G4, B4
            [110.00, 164.81, 220.00, 261.63, 329.63, 392.00], // Am9:   A2, E3, A3, C4, E4, G4
            [146.83, 220.00, 261.63, 349.23, 440.00, 523.25], // Dm9:   D3, A3, C4, F4, A4, C5
            [98.00,  146.83, 196.00, 246.94, 329.63, 440.00]  // G13:   G2, D3, G3, B3, E4, A4
        ];

        this.bassLines = [
            65.41, 65.41, 73.42, 65.41, // C
            55.00, 55.00, 65.41, 55.00, // A
            73.42, 73.42, 82.41, 73.42, // D
            49.00, 49.00, 58.27, 49.00  // G
        ];
    }

    init() {
        if (this.ctx) return;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;

        this.ctx = new AudioContextClass();

        // Master Gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.72, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // Warm Master Tape Filter (subtle high-end roll-off for that cozy analog cassette vibe)
        this.tapeFilter = this.ctx.createBiquadFilter();
        this.tapeFilter.type = 'lowpass';
        this.tapeFilter.frequency.setValueAtTime(2400, this.ctx.currentTime);
        this.tapeFilter.connect(this.masterGain);

        // Music bus
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        this.musicGain.connect(this.tapeFilter);

        // Ambient evening background bus
        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
        this.ambientGain.connect(this.masterGain);

        // SFX bus
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        this.startEveningAmbience();
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
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.72, this.ctx.currentTime);
        }
        return this.isMuted;
    }

    // Cozy Vinyl & Subtle Evening Cricket Ambience
    startEveningAmbience() {
        if (!this.ctx) return;

        // 1. Vinyl Crackle & Tape Flutter
        const bufferSize = this.ctx.sampleRate * 3;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        let pink = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            pink = (pink * 0.95) + (white * 0.05);
            // Occasional warm vinyl pop
            const pop = (Math.random() > 0.9985) ? (Math.random() - 0.5) * 0.35 : 0;
            data[i] = (pink * 0.12) + pop;
        }

        const vinylSource = this.ctx.createBufferSource();
        vinylSource.buffer = buffer;
        vinylSource.loop = true;

        const vinylFilter = this.ctx.createBiquadFilter();
        vinylFilter.type = 'bandpass';
        vinylFilter.frequency.setValueAtTime(1200, this.ctx.currentTime);
        vinylFilter.Q.setValueAtTime(1.0, this.ctx.currentTime);

        vinylSource.connect(vinylFilter);
        vinylFilter.connect(this.ambientGain);
        vinylSource.start();

        // 2. Gentle Twilight Cicada / Cricket Pulses
        const cricketLoop = () => {
            if (!this.ctx || this.isMuted) return;
            const now = this.ctx.currentTime;
            if (Math.random() > 0.35) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(4600 + Math.random() * 400, now);

                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.012, now + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

                osc.connect(gain);
                gain.connect(this.ambientGain);

                osc.start(now);
                osc.stop(now + 0.26);
            }
            setTimeout(cricketLoop, 2000 + Math.random() * 3000);
        };
        cricketLoop();
    }

    startMusic() {
        if (this.isMusicPlaying) return;
        this.ensureContext();
        if (!this.ctx) return;

        this.isMusicPlaying = true;
        this.step = 0;

        const playStep = () => {
            if (!this.isMusicPlaying || !this.ctx) return;

            const now = this.ctx.currentTime;
            const bar = Math.floor(this.step / 16) % 4;
            const stepInBar = this.step % 16;
            const chord = this.chords[bar];

            // 1. Warm Rhodes Jazz Chords (Beats 0 and 6)
            if (stepInBar === 0 || stepInBar === 6) {
                const vel = (stepInBar === 0) ? 0.16 : 0.11;
                this.playRhodes(now, chord, vel);
            }

            // 2. Warm Sub Bass
            if (stepInBar === 0 || stepInBar === 8) {
                const bassFreq = this.bassLines[(bar * 4) + (stepInBar === 0 ? 0 : 2)];
                this.playBass(now, bassFreq);
            }

            // 3. Relaxed Lo-Fi Chillhop Drum Beat
            // Warm sub kick on 0, 10
            if (stepInBar === 0 || stepInBar === 10) {
                this.playKick(now);
            }
            // Brushed Snare on 4, 12
            if (stepInBar === 4 || stepInBar === 12) {
                this.playSnare(now);
            }
            // Soft Hi-Hat with gentle swing
            if (stepInBar % 2 === 0) {
                this.playHat(now, stepInBar % 4 === 2);
            }

            // 4. Delicate Sunset Acoustic Bell Chimes
            if (stepInBar === 2 || stepInBar === 14) {
                if (Math.random() > 0.45) {
                    const note = chord[Math.floor(Math.random() * chord.length)] * 1.5;
                    this.playBell(now, note);
                }
            }

            this.step++;
            this.timer = setTimeout(playStep, this.stepTime * 1000);
        };

        playStep();
    }

    stopMusic() {
        this.isMusicPlaying = false;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    // Warm Rhodes Piano Synth with gentle chorus vibrato
    playRhodes(time, freqs, vol = 0.14) {
        if (this.isMuted) return;

        freqs.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'sine';
            // Subtle vintage detuning
            osc.frequency.setValueAtTime(freq + (i % 2 === 0 ? 0.4 : -0.4), time);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(850, time);
            filter.frequency.exponentialRampToValueAtTime(320, time + 2.0);

            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(vol / freqs.length, time + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + 2.2);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.musicGain);

            osc.start(time);
            osc.stop(time + 2.25);
        });
    }

    playBass(time, freq) {
        if (this.isMuted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.24, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 1.1);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(time);
        osc.stop(time + 1.15);
    }

    playKick(time) {
        if (this.isMuted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.frequency.setValueAtTime(85, time);
        osc.frequency.exponentialRampToValueAtTime(34, time + 0.14);

        gain.gain.setValueAtTime(0.35, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(time);
        osc.stop(time + 0.21);
    }

    playSnare(time) {
        if (this.isMuted) return;
        const bufferSize = this.ctx.sampleRate * 0.09;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.35;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, time);
        filter.Q.value = 1.0;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.14, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        noise.start(time);
        noise.stop(time + 0.095);
    }

    playHat(time, accent = false) {
        if (this.isMuted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'highpass';
        osc.frequency.setValueAtTime(7500, time);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(6500, time);

        const vol = accent ? 0.04 : 0.02;
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

        gain.gain.setValueAtTime(0.06, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.4);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(time);
        osc.stop(time + 1.45);
    }

    // Peaceful milestone chime
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

            gain.gain.setValueAtTime(0.1, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(t);
            osc.stop(t + 0.85);
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
        osc.frequency.setValueAtTime(540, now);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.035);
    }
}

window.soundEngine = new SoundEngine();
