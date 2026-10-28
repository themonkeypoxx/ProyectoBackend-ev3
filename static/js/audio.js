/**
 * Porsche Showroom Web Audio API Sound Engine
 * Synthesizes high-end tactile switch clicks, selection tones, and Flat-6 boxer rumble.
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isEnabled = false;
  }

  getContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  toggleSound() {
    this.isEnabled = !this.isEnabled;
    if (this.isEnabled) {
      this.playMechanicalClick();
    }
    return this.isEnabled;
  }

  get soundEnabled() {
    return this.isEnabled;
  }

  // Tactile Porsche cockpit switch click
  playMechanicalClick() {
    if (!this.isEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.04);

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
      // Audio context might need user gesture
    }
  }

  // Soft selection tone
  playSelectionTone() {
    if (!this.isEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08); // A5

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      // ignore
    }
  }

  // Subtle Flat-6 boxer throttle acoustic purr
  playBoxerRumble() {
    if (!this.isEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(65, now);
      osc1.frequency.linearRampToValueAtTime(145, now + 0.3);
      osc1.frequency.linearRampToValueAtTime(80, now + 0.6);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(130, now);
      osc2.frequency.linearRampToValueAtTime(290, now + 0.3);
      osc2.frequency.linearRampToValueAtTime(160, now + 0.6);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.65);
      osc2.stop(now + 0.65);
    } catch (e) {
      // ignore
    }
  }
}

window.soundEngine = new SoundEngine();

