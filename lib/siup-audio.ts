// The SIUP sound engine. Every variant is built from /audio/siup.mp3, the SIUP
// from "Suggie Boogie" (0:13.5-0:14.7). A synthesized "S-IUU-P" stands in only if
// the file can't be loaded.

export type Variant = 'classic' | 'long' | 'underwater' | 'legendary' | 'chipmunk';

type Ctx = AudioContext;

const SAMPLE_URL = '/audio/siup.mp3';
// Where the held "IUUU" sits inside the recording; "Looong" loops this stretch.
const HOLD_FROM = 0.5;
const HOLD_TO = 0.95;

// Start downloading the recording as soon as the page loads, before any click,
// so even the very first SIUP is the real one.
let sampleBytes: Promise<ArrayBuffer | null> | null = null;
function prefetchSample() {
  if (!sampleBytes && typeof window !== 'undefined') {
    sampleBytes = fetch(SAMPLE_URL)
      .then((r) => (r.ok && (r.headers.get('content-type') || '').includes('audio') ? r.arrayBuffer() : null))
      .catch(() => null);
  }
  return sampleBytes;
}
prefetchSample();

class SiupEngine {
  ctx: Ctx | null = null;
  private master!: GainNode;
  private analyser!: AnalyserNode;
  private data!: Uint8Array<ArrayBuffer>;
  private reverb!: ConvolverNode;
  private sample: AudioBuffer | null = null;
  private loop: [number, number] = [HOLD_FROM, HOLD_TO];
  private noise!: AudioBuffer;

  private ready: Promise<void> | null = null;

  /** Safe to call many times: every caller waits for the same setup, including the recording. */
  async init() {
    if (!this.ready) this.ready = this.setup();
    await this.ready;
    if (this.ctx && this.ctx.state === 'suspended') await this.ctx.resume();
  }

  private async setup() {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0.85;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 4;
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 512;
    this.analyser.smoothingTimeConstant = 0.5;
    this.master.connect(comp).connect(this.analyser).connect(ctx.destination);
    this.data = new Uint8Array(new ArrayBuffer(this.analyser.fftSize));
    this.noise = this.makeNoise(2);
    this.reverb = ctx.createConvolver();
    this.reverb.buffer = this.makeImpulse(2.6);
    this.reverb.connect(this.master);
    // wait for the recording (it's ~26 KB, normally already downloaded), but never hang the click
    await Promise.race([this.loadSample(), new Promise((r) => setTimeout(r, 1500))]);
  }

  private async loadSample() {
    try {
      const bytes = await prefetchSample();
      if (!bytes) return;
      // decodeAudioData detaches the buffer, so decode a copy
      const buf = await this.ctx!.decodeAudioData(bytes.slice(0));
      this.loop = this.findLoop(buf);
      this.sample = buf;
    } catch {
      /* synth fallback */
    }
  }

  /** Snap the hold region to rising zero crossings so the loop doesn't click. */
  private findLoop(buf: AudioBuffer): [number, number] {
    const d = buf.getChannelData(0);
    const sr = buf.sampleRate;
    const snap = (sec: number) => {
      let i = Math.min(d.length - 2, Math.floor(sec * sr));
      const end = Math.min(d.length - 2, i + Math.floor(sr * 0.02));
      for (; i < end; i++) if (d[i] <= 0 && d[i + 1] > 0) return i / sr;
      return sec;
    };
    const a = snap(Math.min(HOLD_FROM, buf.duration * 0.4));
    const b = snap(Math.min(HOLD_TO, buf.duration * 0.8));
    return b > a + 0.05 ? [a, b] : [HOLD_FROM, HOLD_TO];
  }

  /** 0..1 loudness of whatever is playing right now. */
  level(): number {
    if (!this.ctx) return 0;
    this.analyser.getByteTimeDomainData(this.data);
    let s = 0;
    for (let i = 0; i < this.data.length; i++) {
      const v = (this.data[i] - 128) / 128;
      s += v * v;
    }
    return Math.min(1, Math.sqrt(s / this.data.length) * 3.4);
  }

  /** Quiet UI tick for hovers and toggles. */
  blip(freq = 880) {
    const ctx = this.ctx;
    if (!ctx) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.05);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.06, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + 0.1);
  }

  /** Plays a SIUP and returns its length in seconds. */
  play(v: Variant = 'classic'): number {
    const ctx = this.ctx;
    if (!ctx) return 0;
    const t = ctx.currentTime + 0.01;
    const out = ctx.createGain();
    out.gain.value = 1;

    if (v === 'underwater') {
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 650;
      lp.Q.value = 6;
      const lfo = ctx.createOscillator();
      const depth = ctx.createGain();
      lfo.frequency.value = 7;
      depth.gain.value = 260;
      lfo.connect(depth).connect(lp.frequency);
      lfo.start(t);
      lfo.stop(t + 3);
      out.connect(lp).connect(this.master);
      this.bubbles(t);
    } else if (v === 'legendary') {
      out.connect(this.master);
      const wet = ctx.createGain();
      wet.gain.value = 0.9;
      out.connect(wet).connect(this.reverb);
      const delay = ctx.createDelay(1);
      delay.delayTime.value = 0.28;
      const fb = ctx.createGain();
      fb.gain.value = 0.42;
      out.connect(delay);
      delay.connect(fb).connect(delay);
      delay.connect(this.master);
    } else {
      out.connect(this.master);
    }

    const rate = { classic: 1, long: 0.82, underwater: 0.9, legendary: 1.06, chipmunk: 1.75 }[v];
    const stretch = { classic: 1, long: 2.3, underwater: 1.1, legendary: 1.5, chipmunk: 0.62 }[v];

    if (this.sample) {
      const src = ctx.createBufferSource();
      src.buffer = this.sample;
      let extra = 0;
      if (v === 'long') {
        // natural pitch: loop the held "IUUU", then let it run out to the P
        src.playbackRate.value = 1;
        src.loop = true;
        [src.loopStart, src.loopEnd] = this.loop;
        extra = 1.5;
        const releaseAt = t + this.loop[1] + extra;
        src.addEventListener('ended', () => src.disconnect());
        setTimeout(() => { src.loop = false; }, Math.max(0, (releaseAt - ctx.currentTime) * 1000));
      } else {
        src.playbackRate.value = rate;
      }
      src.connect(out);
      src.start(t);
      return this.sample.duration / (v === 'long' ? 1 : rate) + extra + (v === 'legendary' ? 1.6 : 0);
    }
    const dur = 0.78 * stretch;
    this.synth(t, dur, rate, out);
    return dur + (v === 'legendary' ? 1.6 : 0);
  }

  // ---------- synthesis ----------
  private synth(t: number, dur: number, pitch: number, out: AudioNode) {
    const ctx = this.ctx!;
    const sEnd = t + Math.min(0.17, dur * 0.2);
    const vStart = sEnd - 0.02;
    const vEnd = t + dur - 0.07;

    // "S" — bright hiss
    const s = ctx.createBufferSource();
    s.buffer = this.noise;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 4200;
    const sg = ctx.createGain();
    sg.gain.setValueAtTime(0.0001, t);
    sg.gain.exponentialRampToValueAtTime(0.5, t + 0.03);
    sg.gain.setValueAtTime(0.5, sEnd - 0.04);
    sg.gain.exponentialRampToValueAtTime(0.0001, sEnd + 0.02);
    s.connect(hp).connect(sg).connect(out);
    s.start(t);
    s.stop(sEnd + 0.05);

    // "IUUU" — buzzy voice through moving formants, pitch rising like a shout
    const f0 = 200 * pitch;
    const voice = ctx.createGain();
    voice.gain.setValueAtTime(0.0001, vStart);
    voice.gain.exponentialRampToValueAtTime(0.55, vStart + 0.05);
    voice.gain.setValueAtTime(0.55, vEnd - 0.05);
    voice.gain.exponentialRampToValueAtTime(0.0001, vEnd);
    const oscs = [0, 7, -6].map((cents) => {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.detune.value = cents;
      o.frequency.setValueAtTime(f0, vStart);
      o.frequency.exponentialRampToValueAtTime(f0 * 1.55, vStart + (vEnd - vStart) * 0.35);
      o.frequency.exponentialRampToValueAtTime(f0 * 1.42, vEnd);
      return o;
    });
    const vib = ctx.createOscillator();
    const vibDepth = ctx.createGain();
    vib.frequency.value = 6.2;
    vibDepth.gain.setValueAtTime(0, vStart);
    vibDepth.gain.linearRampToValueAtTime(f0 * 0.05, vEnd);
    vib.connect(vibDepth);
    oscs.forEach((o) => vibDepth.connect(o.frequency));

    const formants: [number, number, number, number][] = [
      // [from "i", to "u", Q, gain]
      [290, 330, 9, 1],
      [2300, 820, 11, 0.55],
      [3000, 2400, 12, 0.25],
    ];
    const mix = ctx.createGain();
    mix.gain.value = 0.9;
    formants.forEach(([a, b, q, g]) => {
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.Q.value = q;
      bp.frequency.setValueAtTime(a, vStart);
      bp.frequency.setValueAtTime(a, vStart + 0.05);
      bp.frequency.exponentialRampToValueAtTime(b, vStart + (vEnd - vStart) * 0.4);
      const fg = ctx.createGain();
      fg.gain.value = g * 4;
      oscs.forEach((o) => o.connect(bp));
      bp.connect(fg).connect(mix);
    });
    mix.connect(voice).connect(out);
    oscs.forEach((o) => {
      o.start(vStart);
      o.stop(vEnd + 0.05);
    });
    vib.start(vStart);
    vib.stop(vEnd + 0.05);

    // "P" — lips close, then a pop
    const pt = vEnd + 0.03;
    const pop = ctx.createBufferSource();
    pop.buffer = this.noise;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1400;
    const pg = ctx.createGain();
    pg.gain.setValueAtTime(0.0001, pt);
    pg.gain.exponentialRampToValueAtTime(0.7, pt + 0.004);
    pg.gain.exponentialRampToValueAtTime(0.0001, pt + 0.05);
    pop.connect(lp).connect(pg).connect(out);
    pop.start(pt);
    pop.stop(pt + 0.06);
    const thump = ctx.createOscillator();
    const tg = ctx.createGain();
    thump.frequency.setValueAtTime(150, pt);
    thump.frequency.exponentialRampToValueAtTime(55, pt + 0.08);
    tg.gain.setValueAtTime(0.0001, pt);
    tg.gain.exponentialRampToValueAtTime(0.6, pt + 0.005);
    tg.gain.exponentialRampToValueAtTime(0.0001, pt + 0.1);
    thump.connect(tg).connect(out);
    thump.start(pt);
    thump.stop(pt + 0.12);
  }

  private bubbles(t: number) {
    const ctx = this.ctx!;
    for (let i = 0; i < 9; i++) {
      const at = t + 0.1 + Math.random() * 0.9;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      const f = 300 + Math.random() * 500;
      o.type = 'sine';
      o.frequency.setValueAtTime(f, at);
      o.frequency.exponentialRampToValueAtTime(f * 2.2, at + 0.06);
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(0.12, at + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.07);
      o.connect(g).connect(this.master);
      o.start(at);
      o.stop(at + 0.08);
    }
  }

  private makeNoise(sec: number) {
    const ctx = this.ctx!;
    const b = ctx.createBuffer(1, ctx.sampleRate * sec, ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }

  private makeImpulse(sec: number) {
    const ctx = this.ctx!;
    const len = ctx.sampleRate * sec;
    const b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    return b;
  }
}

export const engine = new SiupEngine();
