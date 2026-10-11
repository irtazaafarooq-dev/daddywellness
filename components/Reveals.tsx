'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Fades/slides in every [data-reveal] and drives every [data-parallax] on the current page. */
export default function Reveals() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        if (reduce) { el.classList.add('is-in'); return; }
        gsap.to(el, {
          opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', delay: Number(el.dataset.delay || 0), clearProps: 'opacity,transform', onStart: () => el.classList.add('is-in'),
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      });
      if (reduce) return;
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        gsap.to(el, {
          yPercent: Number(el.dataset.parallax), ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
    });
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    return () => { ctx.revert(); window.removeEventListener('load', refresh); };
  }, []);
  return null;
}
