'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { engine, type Variant } from '@/lib/siup-audio';

type Sound = {
  enabled: boolean;
  enable: () => Promise<void>;
  disable: () => void;
  toggle: () => void;
  play: (v?: Variant) => number;
  blip: (freq?: number) => void;
};

const SoundCtx = createContext<Sound | null>(null);
const KEY = 'dw-sound';

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  // Browsers only allow audio after a user gesture, so a remembered "on" waits for the first click.
  useEffect(() => {
    let wanted = false;
    try { wanted = localStorage.getItem(KEY) === 'on'; } catch {}
    if (!wanted) return;
    const arm = async () => {
      await engine.init();
      setEnabled(true);
    };
    window.addEventListener('pointerdown', arm, { once: true });
    window.addEventListener('keydown', arm, { once: true });
    return () => {
      window.removeEventListener('pointerdown', arm);
      window.removeEventListener('keydown', arm);
    };
  }, []);

  const enable = useCallback(async () => {
    await engine.init();
    setEnabled(true);
    try { localStorage.setItem(KEY, 'on'); } catch {}
  }, []);

  const disable = useCallback(() => {
    setEnabled(false);
    try { localStorage.setItem(KEY, 'off'); } catch {}
  }, []);

  const value = useMemo<Sound>(() => ({
    enabled,
    enable,
    disable,
    toggle: () => (enabled ? disable() : void enable().then(() => engine.blip(660))),
    play: (v = 'classic') => (enabled ? engine.play(v) : 0),
    blip: (f) => { if (enabled) engine.blip(f); },
  }), [enabled, enable, disable]);

  return <SoundCtx.Provider value={value}>{children}</SoundCtx.Provider>;
}

export function useSound() {
  const s = useContext(SoundCtx);
  if (!s) throw new Error('useSound must be used inside <SoundProvider>');
  return s;
}

/** Calls fn(level) every frame with the current loudness (0..1); no re-renders. */
export function useAudioFrame(fn: (level: number, t: number) => void) {
  useEffect(() => {
    let raf = 0;
    const loop = (t: number) => {
      fn(engine.level(), t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // fn is expected to read refs only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
