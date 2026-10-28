class SoundEngine {
  private ctx: AudioContext | null = null
  private isEnabled: boolean = false

  private getContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioContextClass) {
        this.ctx = new AudioContextClass()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  public toggleSound(): boolean {
    this.isEnabled = !this.isEnabled
    if (this.isEnabled) {
      this.playMechanicalClick()
    }
    return this.isEnabled
  }

  public get soundEnabled(): boolean {
    return this.isEnabled
  }

  // Tactile Porsche cockpit switch click
  public playMechanicalClick(): void {
    if (!this.isEnabled) return
    try {
      const ctx = this.getContext()
      if (!ctx) return

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(1400, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.04)

      filter.type = 'highpass'
      filter.frequency.setValueAtTime(800, ctx.currentTime)

      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.04)
    } catch {
      // ignore audio errors
    }
  }

  // Soft selection tone
  public playSelectionTone(): void {
    if (!this.isEnabled) return
    try {
      const ctx = this.getContext()
      if (!ctx) return

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08) // A5

      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.12)
    } catch {
      // ignore
    }
  }

  // Subtle Flat-6 boxer throttle acoustic purr
  public playBoxerRumble(): void {
    if (!this.isEnabled) return
    try {
      const ctx = this.getContext()
      if (!ctx) return

      const now = ctx.currentTime
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      osc1.type = 'sawtooth'
      osc1.frequency.setValueAtTime(65, now)
      osc1.frequency.exponentialRampToValueAtTime(140, now + 0.6)
      osc1.frequency.exponentialRampToValueAtTime(85, now + 1.2)

      osc2.type = 'triangle'
      osc2.frequency.setValueAtTime(130, now)
      osc2.frequency.exponentialRampToValueAtTime(280, now + 0.6)
      osc2.frequency.exponentialRampToValueAtTime(170, now + 1.2)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(450, now)
      filter.frequency.exponentialRampToValueAtTime(900, now + 0.6)
      filter.frequency.exponentialRampToValueAtTime(350, now + 1.2)

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(0.06, now + 0.1)
      gain.gain.linearRampToValueAtTime(0.05, now + 0.6)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2)

      osc1.connect(filter)
      osc2.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      osc1.start(now)
      osc2.start(now)
      osc1.stop(now + 1.25)
      osc2.stop(now + 1.25)
    } catch {
      // ignore
    }
  }
}

export const soundEngine = new SoundEngine()
