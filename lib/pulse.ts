// A visual "kick" that animations follow even when sound is off.
let kickAt = -1e9;
let kickStrength = 0;
let kickDur = 700;

export function kick(strength = 1, durationMs = 700) {
  kickAt = performance.now();
  kickStrength = strength;
  kickDur = durationMs;
}

/** 0..1, decays smoothly after each kick. */
export function pulse(now = performance.now()) {
  const dt = now - kickAt;
  if (dt < 0 || dt > kickDur * 2.5) return 0;
  // fast attack, wobbly decay
  const env = Math.exp(-dt / (kickDur * 0.45));
  return kickStrength * env * (0.85 + 0.15 * Math.cos(dt / 38));
}
