// Synthesized Web Audio API sound generator - no external file dependencies needed!

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play alert chimes using Web Audio synthesizer
 * @param {'work_end' | 'break_end' | 'wellness_alert' | 'tick' | 'task_done'} type 
 */
export function playSound(type = 'work_end') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'work_end') {
      // Pleasant multi-tone chime (E5 -> G#5 -> B5 -> E6)
      const freqs = [659.25, 830.61, 987.77, 1318.51];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.18);

        gain.gain.setValueAtTime(0.01, now + idx * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.25, now + idx * 0.18 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.18 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.18);
        osc.stop(now + idx * 0.18 + 1.3);
      });
    } else if (type === 'break_end') {
      // Rising energized chime
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.14);

        gain.gain.setValueAtTime(0.01, now + idx * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.2, now + idx * 0.14 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.14);
        osc.stop(now + idx * 0.14 + 0.9);
      });
    } else if (type === 'wellness_alert') {
      // Gentle 3-pulse notification chime (Stretch, Drink Water, Look Outside)
      const freqs = [440, 554.37, 659.25];
      [0, 0.3, 0.6].forEach((delay, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freqs[idx], now + delay);

        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(0.2, now + delay + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.75);
      });
    } else if (type === 'tick') {
      // Soft mechanical woodblock tick
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } else if (type === 'task_done') {
      // Quick cheerful task completion sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.08); // A5

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.32);
    }
  } catch (e) {
    console.error('Audio play error:', e);
  }
}

// Ambient Sound Generator (Rain, Ocean, Brown Noise, Focus Drone)
class AmbientSoundEngine {
  constructor() {
    this.source = null;
    this.gainNode = null;
    this.currentType = null;
    this.isPlaying = false;
    this.volume = 0.3;
  }

  start(type, volume = 0.3) {
    this.stop();
    this.volume = volume;
    this.currentType = type;

    const ctx = getAudioContext();
    if (!ctx) return;

    this.gainNode = ctx.createGain();
    this.gainNode.gain.setValueAtTime(this.volume, ctx.currentTime);
    this.gainNode.connect(ctx.destination);

    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'rain') {
      // Pink/White noise filtered for soft rain
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }
      this.source = ctx.createBufferSource();
      this.source.buffer = buffer;
      this.source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);

      this.source.connect(filter);
      filter.connect(this.gainNode);
      this.source.start();
    } else if (type === 'brown') {
      // Deep brown noise (smoother low frequency rumble)
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // Gain boost
      }
      this.source = ctx.createBufferSource();
      this.source.buffer = buffer;
      this.source.loop = true;
      this.source.connect(this.gainNode);
      this.source.start();
    } else if (type === 'ocean') {
      // Modulated pink noise for gentle ocean waves
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }
      this.source = ctx.createBufferSource();
      this.source.buffer = buffer;
      this.source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, ctx.currentTime);

      // Wave LFO
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // 8 second cycle wave
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.15, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(this.gainNode.gain);

      this.source.connect(filter);
      filter.connect(this.gainNode);

      lfo.start();
      this.source.start();
    } else if (type === 'focus_drone') {
      // Warm 432Hz + 442Hz alpha-wave binaural pulse
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.frequency.setValueAtTime(216, ctx.currentTime); // Root 432 / 2
      osc2.frequency.setValueAtTime(226, ctx.currentTime); // 10Hz binaural alpha beat

      const droneGain = ctx.createGain();
      droneGain.gain.setValueAtTime(0.1, ctx.currentTime);

      osc1.connect(droneGain);
      osc2.connect(droneGain);
      droneGain.connect(this.gainNode);

      osc1.start();
      osc2.start();
      this.source = {
        stop: () => {
          osc1.stop();
          osc2.stop();
        }
      };
    }
    this.isPlaying = true;
  }

  setVolume(vol) {
    this.volume = vol;
    if (this.gainNode && audioCtx) {
      this.gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
    }
  }

  stop() {
    if (this.source) {
      try {
        this.source.stop();
      } catch (e) {}
      this.source = null;
    }
    this.isPlaying = false;
    this.currentType = null;
  }
}

export const ambientEngine = new AmbientSoundEngine();
