"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

const VIDEO_SRC = "/videos/solar-loop-1080.mp4";
const TARGET = 95;

export default function ReductionStat() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const numeralRef = useRef<HTMLSpanElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // `autoPlay` overrides preload="metadata": the browser pulled all 3.4 MB at
  // page load, competing with the hero video for bandwidth. Over a tunnel on a
  // phone that delays the thing the user actually sees first. Load it only
  // once this section is roughly a screen away.
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        video.src = VIDEO_SRC;
        video.play().catch(() => {});
      },
      { rootMargin: "150% 0px" }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // --- entrance fades (opacity only, so they can't fight the parallax
      //     transforms applied to the same elements below) ---
      const fadeIn = (el: Element | null, delay = 0) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.6,
            delay,
            ease: "power2.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
          }
        );
      };
      fadeIn(headingRef.current);
      fadeIn(numeralRef.current, 0.1);
      fadeIn(captionRef.current, 0.3);

      // --- parallax: each layer travels a different distance across the
      //     section's full pass through the viewport. Positive end values
      //     lag behind the scroll (read as further away), negative ones
      //     outrun it (read as nearer). ---
      const parallax = (el: Element | null, from: number, to: number) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { y: from },
          {
            y: to,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      };

      parallax(videoWrapRef.current, -90, 90); // furthest back: slowest
      parallax(numeralRef.current, -30, 30);
      parallax(headingRef.current, 18, -18);
      parallax(captionRef.current, -10, 10);
    }, sectionRef);

    // --- count-up ---
    // Deliberately NOT a ScrollTrigger. This section is `sticky`, and once it
    // pins its rect stops moving, so ScrollTrigger cannot resolve a sensible
    // start against it: "top 80%" fired while the number was still below the
    // fold (it reached 81% before being visible), and "top top" never fired
    // at all. An IntersectionObserver keys off actual visibility instead.
    const numeral = numeralRef.current;
    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (started || !entries[0].isIntersecting) return;
        started = true;
        io.disconnect();
        const counter = { value: 0 };
        gsap.to(counter, {
          value: TARGET,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => {
            if (numeral) numeral.textContent = `${Math.round(counter.value)}%`;
          },
          // Land exactly on target even if the last frame rounds short.
          onComplete: () => {
            if (numeral) numeral.textContent = `${TARGET}%`;
          },
        });
      },
      // Near-full visibility AND shrink the root's bottom edge by 35%: the
      // numeral clears 90% visibility while the panel is still sliding up,
      // which started the count at ~70% before it had settled. Requiring it
      // above the 65% line defers the start until the panel is basically in
      // place.
      { threshold: 0.9, rootMargin: "0px 0px -35% 0px" }
    );
    if (numeral) io.observe(numeral);

    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    // `relative z-10` is required, not cosmetic: About is `sticky` (therefore
    // positioned) and would paint over this static sibling, making the panel
    // slide *under* it instead of over.
    //
    // The shell is 200vh so the stage below can pin for a full viewport of
    // scroll. At exactly 100vh the section could never fill the screen —
    // any scroll position revealed a sliver of a neighbouring section.
    <section
      ref={sectionRef}
      className="sticky top-0 z-10 flex h-screen flex-col justify-center overflow-hidden bg-[#0b1120] px-6 py-20 text-center"
    >
      {/* Oversized so the parallax travel never exposes an edge. */}
      <div
        ref={videoWrapRef}
        className="absolute -top-[15%] left-0 h-[130%] w-full"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 -translate-y-[7vh]">
        <h2
          ref={headingRef}
          className="font-heading text-3xl font-semibold text-white sm:text-4xl"
        >
          Backed by a <span className="text-lime-300">Service Rating</span> of
          up to
        </h2>

        <div className="mx-auto mt-8 flex max-w-4xl items-center justify-center sm:mt-16">
          <span
            ref={numeralRef}
            // tabular-nums keeps every digit the same width, so the number
            // doesn't jitter sideways as it counts up.
            className="font-heading block tabular-nums select-none text-[20vw] leading-none font-extrabold text-transparent sm:text-[15rem]"
            style={{ WebkitTextStroke: "2px rgba(255,255,255,0.55)" }}
          >
            0%
          </span>
        </div>

        <p
          ref={captionRef}
          className="mx-auto mt-14 max-w-md rounded-2xl bg-white/10 px-6 py-4 text-sm leading-relaxed text-white/80 backdrop-blur-sm"
        >
          from over 1,000 happy customers who trust E Solar, with an average
          rating of 4.9/5.
        </p>
      </div>
    </section>
  );
}
