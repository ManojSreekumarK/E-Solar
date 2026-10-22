"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Lenis is driven from GSAP's ticker rather than its own rAF loop, so the
// smoothed scroll position and every ScrollTrigger scrub update in the same
// frame. Two separate loops would let pinned/scrubbed sections lag a frame.
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // Read the ref on every tick: ReactLenis creates its instance in state,
    // after this effect has already run.
    const tick = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      // anchors: native `href="#id"` links go through Lenis, which honours the
      // sections' `scroll-mt-24` so they still clear the fixed nav.
      options={{ autoRaf: false, lerp: 0.1, anchors: true }}
    >
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}

function ScrollTriggerSync() {
  useLenis(ScrollTrigger.update);
  return null;
}
