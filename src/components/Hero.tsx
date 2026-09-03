"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

const VIDEO_SRC = "/videos/hero-solar.mp4";

/** Attach a listener that removes itself after firing once. */
function once(
  el: EventTarget,
  event: string,
  fn: (e: Event) => void,
  opts?: AddEventListenerOptions
) {
  const onceFn = (e: Event) => {
    el.removeEventListener(event, onceFn);
    fn(e);
  };
  el.addEventListener(event, onceFn, opts);
  return onceFn;
}

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    gsap.registerPlugin(ScrollTrigger);

    let ctx: gsap.Context | null = null;

    // iOS refuses to render any frame until the video has been "activated"
    // by a user gesture — play/pause on first touch does that.
    const touchActivate = once(document.documentElement, "touchstart", () => {
      video.play().then(
        () => video.pause(),
        () => {}
      );
    });

    const buildTimeline = () => {
      ctx = gsap.context(() => {
        // Timeline spans 10 arbitrary units: the video scrub owns the first
        // 6 (0-60% of scroll), the shrink/reveal the last 4 (60-100%).
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        // Let GSAP interpolate currentTime itself — much smoother than
        // firing discrete seeks from a scroll handler.
        tl.fromTo(
          video,
          { currentTime: 0 },
          { currentTime: video.duration || 1, duration: 6 },
          0
        );

        tl.to(cueRef.current, { opacity: 0, duration: 0.8 }, 0);
        tl.to(logoRef.current, { opacity: 0, duration: 1.2 }, 0);
        tl.to(captionRef.current, { opacity: 0, duration: 1.5 }, 0);
        tl.to(captionRef.current, { y: -40, duration: 2.5 }, 0);

        tl.to(
          videoWrapperRef.current,
          { scale: 0.62, borderRadius: 32, duration: 4 },
          6
        );
      }, sectionRef);
    };

    if (video.readyState >= 1) buildTimeline();
    else once(video, "loadedmetadata", buildTimeline);

    // NOTE: a blob-URL preload used to live here. Once the source was
    // re-encoded to a progressive, all-keyframe MP4 it stopped helping —
    // measured 46ms average seek via blob vs 39ms straight over HTTP — while
    // holding a redundant ~20MB copy in memory. `preload="auto"` already
    // caches the file, so the browser seeks locally either way.

    return () => {
      document.documentElement.removeEventListener("touchstart", touchActivate);
      ctx?.revert();
    };
  }, []);

  return (
    <section id="home" ref={sectionRef} className="relative h-[300vh] bg-white">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          ref={videoWrapperRef}
          className="absolute inset-0 overflow-hidden bg-[#0b1120]"
          style={{ willChange: "transform" }}
        >
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            muted
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-black/20" />
          {/* Scrim for the copy. Measured on the source video: the centre of
              the frame is sky at luma ~178/255, which leaves white text at
              2.1:1 — under the 4.5:1 minimum. Below the halfway line the frame
              drops to luma 111 and darker, so the copy sits there and this
              gradient carries it the rest of the way. */}
          <div className="absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-black/70 via-black/55 to-transparent" />
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={logoRef}
          src="/images/logo-mark.svg"
          alt="E Solar"
          width={310}
          height={307}
          draggable={false}
          className="pointer-events-none absolute top-24 left-4 h-auto w-28 select-none drop-shadow-[0_2px_20px_rgba(0,0,0,0.7)] sm:top-6 sm:left-8 sm:w-40"
        />

        <div
          ref={captionRef}
          className="absolute top-[54%] left-1/2 w-full max-w-4xl -translate-x-1/2 px-6 text-center"
        >
          <h1 className="font-heading text-5xl font-bold tracking-tight text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.5)] sm:text-7xl">
            Power Your Future
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/85 [text-shadow:0_1px_16px_rgba(0,0,0,0.55)] sm:text-lg">
            Experience the next generation of solar technology with our
            innovative and sleek residential systems.
          </p>
        </div>

        <div
          ref={cueRef}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-lime-300"
        >
          <span className="text-[11px] tracking-[0.2em] uppercase">Scroll</span>
          <div className="h-8 w-px bg-lime-300/60" />
        </div>
      </div>
    </section>
  );
}
