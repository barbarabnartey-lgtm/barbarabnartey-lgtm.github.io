"use client";

type Sound = "hover" | "select" | "back" | "open" | "chime" | "transmit";

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private started = false;
  private ambientTimer: number | null = null;
  private enabled = false;

  get isEnabled() {
    return this.enabled;
  }

  async setEnabled(on: boolean) {
    this.enabled = on;
    if (on) {
      await this.start();
      this.fadeAmbient(0.9);
      this.scheduleAmbientPing();
    } else {
      this.fadeAmbient(0);
    }
  }

  private async start() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      const ctx = new Ctor();
      this.ctx = ctx;
      const master = ctx.createGain();
      master.gain.value = 0.6;
      master.connect(ctx.destination);
      this.master = master;
      this.buildAmbient();
      this.started = true;
    }
    if (this.ctx.state === "suspended") {
      try {
        await this.ctx.resume();
      } catch {
        /* resumed by a later gesture */
      }
    }
  }

  private buildAmbient() {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;

    const droneGain = ctx.createGain();
    droneGain.gain.value = 0;
    droneGain.connect(master);
    this.droneGain = droneGain;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 520;
    filter.Q.value = 0.7;
    filter.connect(droneGain);

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.055;
    lfoGain.gain.value = 210;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    const freqs = [55, 82.5, 110, 164.81];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.value = f;
      osc.detune.value = i * 4 - 6;
      const g = ctx.createGain();
      g.gain.value = i === 0 ? 0.05 : 0.022 / i;
      osc.connect(g);
      g.connect(filter);
      osc.start();
    });

    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 1480;
    band.Q.value = 0.9;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.012;
    noise.connect(band);
    band.connect(noiseGain);
    noiseGain.connect(droneGain);
    noise.start();

    const airLfo = ctx.createOscillator();
    const airLfoGain = ctx.createGain();
    airLfo.frequency.value = 0.11;
    airLfoGain.gain.value = 260;
    airLfo.connect(airLfoGain);
    airLfoGain.connect(band.frequency);
    airLfo.start();
  }

  private fadeAmbient(target: number) {
    if (!this.ctx || !this.droneGain) return;
    const now = this.ctx.currentTime;
    this.droneGain.gain.cancelScheduledValues(now);
    this.droneGain.gain.setTargetAtTime(target, now, 1.2);
  }

  private scheduleAmbientPing() {
    if (this.ambientTimer) window.clearTimeout(this.ambientTimer);
    const delay = 9000 + Math.random() * 7000;
    this.ambientTimer = window.setTimeout(() => {
      if (this.enabled) {
        const notes = [523.25, 587.33, 659.25, 783.99, 880];
        this.tone(notes[Math.floor(Math.random() * notes.length)], 0.06, 2.4, "sine");
        this.scheduleAmbientPing();
      }
    }, delay);
  }

  private tone(freq: number, gain: number, duration: number, type: OscillatorType = "sine", slideTo?: number) {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(gain, now + Math.min(0.04, duration / 4));
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(g);
    g.connect(master);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  private noiseBurst(duration: number, gain: number, freq = 1800) {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(freq, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 0.4, now + duration);
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(filter);
    filter.connect(g);
    g.connect(master);
    src.start(now);
  }

  play(sound: Sound) {
    if (!this.enabled || !this.ctx) return;
    switch (sound) {
      case "hover":
        this.tone(1180, 0.018, 0.09, "sine", 1320);
        break;
      case "select":
        this.tone(420, 0.05, 0.5, "triangle", 980);
        this.noiseBurst(0.3, 0.05, 2400);
        break;
      case "back":
        this.tone(680, 0.04, 0.35, "sine", 320);
        break;
      case "open":
        this.tone(180, 0.035, 0.6, "sine", 360);
        this.noiseBurst(0.5, 0.035, 900);
        break;
      case "chime":
        this.tone(659.25, 0.05, 1.4, "sine");
        window.setTimeout(() => this.tone(987.77, 0.04, 1.8, "sine"), 90);
        window.setTimeout(() => this.tone(1318.5, 0.03, 2.2, "sine"), 180);
        break;
      case "transmit":
        this.tone(320, 0.05, 0.9, "sawtooth", 1400);
        this.noiseBurst(0.9, 0.04, 2000);
        break;
    }
  }
}

export const audio = new AudioEngine();
