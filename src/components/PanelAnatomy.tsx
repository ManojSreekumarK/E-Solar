"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

type Beat = {
  label: string;
  title: string;
  body: string;
  stats: { value: string; caption: string }[];
  image: string;
  /** annotation chips pinned over the artwork, positioned in % of the stage */
  chips: { text: string; top: string; left: string }[];
};

const BEATS: Beat[] = [
  {
    label: "Layer 01",
    title: "Tempered glass built to take a beating.",
    body: "A 3.2mm hardened front sheet rated for one-inch hail at 50mph, so a bad monsoon never costs you a panel.",
    stats: [
      { value: "3.2mm", caption: "Front sheet" },
      { value: "50mph", caption: "Hail rating" },
    ],
    image: "/images/anatomy/tempered-glass-cut.png",
    chips: [
      { text: "Tempered glass 3.2mm", top: "29%", left: "42%" },
      { text: "Impact resistant", top: "21%", left: "70%" },
    ],
  },
  {
    label: "Layer 02",
    title: "Anti-reflective coating that chases the sun.",
    body: "Light striking the panel at a shallow angle usually bounces away. The coating pulls it inward instead, adding yield at dawn and dusk.",
    stats: [
      { value: "+3%", caption: "Extra capture" },
      { value: "Multi-angle", caption: "Low-sun absorption" },
    ],
    image: "/images/anatomy/tempered-glass-cut.png",
    chips: [
      { text: "AR coating", top: "41%", left: "41%" },
      { text: "Reflection under 2%", top: "32%", left: "69%" },
      { text: "EVA encapsulant film", top: "63%", left: "62%" },
    ],
  },
  {
    label: "Layer 03",
    title: "Monocrystalline cells doing the actual work.",
    body: "Half-cut cells are wired so shade across one section cannot drag down the rest, which is the difference between a good day and a wasted one.",
    stats: [
      { value: "22.8%", caption: "Module efficiency" },
      { value: "144", caption: "Half-cut cells" },
    ],
    image: "/images/anatomy/solar-cells-clean.png",
    chips: [
      { text: "Shade tolerant", top: "26%", left: "6%" },
      { text: "Monocrystalline cell", top: "22%", left: "58%" },
    ],
  },
  {
    label: "Layer 04",
    title: "An anodized frame that outlasts the warranty.",
    body: "Corrosion-resistant aluminium rated for three decades in coastal salt air, which is exactly what Kerala roofs ask of it.",
    stats: [
      { value: "30 yrs", caption: "Structural rating" },
      { value: "Salt-safe", caption: "Coastal corrosion" },
    ],
    image: "/images/anatomy/frame-clean.png",
    chips: [
      { text: "Anodized alloy", top: "34%", left: "50%" },
      { text: "IP68 junction box", top: "16%", left: "62%" },
    ],
  },
];

export default function PanelAnatomy() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const texts = gsap.utils.toArray<HTMLElement>("[data-beat-text]");
      const media = gsap.utils.toArray<HTMLElement>("[data-beat-media]");
      const marks = gsap.utils.toArray<HTMLElement>("[data-beat-mark]");

      // Only the first beat starts visible; the timeline hands off from there.
      texts.forEach((el, i) =>
        gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 60 })
      );
      media.forEach((el, i) =>
        gsap.set(el, { opacity: i === 0 ? 1 : 0, scale: i === 0 ? 1 : 1.06 })
      );
      marks.forEach((el, i) => gsap.set(el, { opacity: i === 0 ? 1 : 0.25 }));

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          // A numeric scrub adds a short catch-up ease instead of snapping
          // the timeline to the scroll position on every tick, which is what
          // made discrete wheel/trackpad steps read as a hard jump-cut
          // between beats once the pinned height was shortened.
          scrub: 0.6,
          // recompute fromTo values on refresh so a resize or late-loading
          // asset cannot leave the beats measured against a stale layout
          invalidateOnRefresh: true,
        },
      });

      // One timeline unit per beat, so the positions below read as beat indices.
      tl.to({}, { duration: BEATS.length }, 0);

      BEATS.forEach((_, i) => {
        if (i > 0) {
          // Strictly sequential: the outgoing beat finishes at i-0.15, which
          // is exactly where the incoming one starts. Overlapping these was
          // what made two half-transparent beats ghost over each other.
          tl.to(texts[i - 1], { opacity: 0, y: -40, duration: 0.15, ease: "none" }, i - 0.3);
          tl.to(marks[i - 1], { opacity: 0.25, duration: 0.12, ease: "none" }, i - 0.3);

          // When the next beat reuses the same artwork, fading it out and back
          // in would read as a blink. Swap the layers instantly instead so the
          // render simply stays put and only the annotations change.
          if (BEATS[i].image === BEATS[i - 1].image) {
            tl.set(media[i - 1], { opacity: 0 }, i - 0.15);
            tl.set(media[i], { opacity: 1, scale: 1 }, i - 0.15);
          } else {
            tl.to(media[i - 1], { opacity: 0, scale: 0.97, duration: 0.15, ease: "none" }, i - 0.3);
            tl.fromTo(
              media[i],
              { opacity: 0, scale: 1.04 },
              { opacity: 1, scale: 1, duration: 0.15, ease: "none" },
              i - 0.15
            );
          }

          tl.fromTo(
            texts[i],
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.15, ease: "none" },
            i - 0.15
          );
          tl.to(marks[i], { opacity: 1, duration: 0.12, ease: "none" }, i - 0.15);
        }

        // chips resolve slightly after the artwork has settled
        const chips = gsap.utils.toArray<HTMLElement>(
          `[data-chip-group="${i}"] > *`
        );
        gsap.set(chips, { opacity: 0, y: 10 });
        tl.to(
          chips,
          { opacity: 1, y: 0, duration: 0.18, stagger: 0.06, ease: "none" },
          i + 0.08
        );
        if (i < BEATS.length - 1) {
          // clear before the beat starts handing over at i+0.70
          tl.to(chips, { opacity: 0, duration: 0.12, ease: "none" }, i + 0.62);
        }
      });
    }, rootRef);

    // Positions are measured before fonts and artwork settle, and a hot
    // reload can re-mount this against a half-laid-out page; refreshing on
    // the next frame re-measures once the DOM is stable.
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      // z-20 puts this above the pinned Service Rating panel (z-10) so it
      // slides over the top rather than appearing from underneath.
      className="relative z-20 bg-black"
      style={{ height: `${BEATS.length * 75}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* ---- artwork stage. Previously bled 6% past the right edge, which
                clipped wider renders like the solar-cell callout; now sized to
                sit fully inside the viewport. ---- */}
        <div className="pointer-events-none absolute top-[13%] left-1/2 aspect-square h-[21vh] w-auto -translate-x-1/2 [@media(min-height:700px)_and_(max-width:1023px)]:top-[12%] [@media(min-height:700px)_and_(max-width:1023px)]:h-[30vh] lg:top-1/2 lg:right-[2%] lg:left-auto lg:aspect-auto lg:h-[80vh] lg:w-[50%] lg:translate-x-0 lg:-translate-y-1/2">
          {BEATS.map((beat, i) => (
            <div key={beat.label} className="absolute inset-0">
              <div data-beat-media className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={beat.image}
                  alt={`Exploded panel view highlighting ${beat.label}`}
                  className="h-full w-full object-contain"
                />
              </div>
              <div data-chip-group={i} className="absolute inset-0 hidden lg:block">
                {beat.chips.map((chip) => (
                  <span
                    key={chip.text}
                    style={{ top: chip.top, left: chip.left }}
                    className="absolute flex items-center gap-2 rounded bg-black/75 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.12em] text-white uppercase backdrop-blur-sm"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />
                    {chip.text}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ---- persistent section heading, top-left ---- */}
        <div className="absolute top-[9%] left-[3%] z-10 lg:left-[3%]">
          <h2 className="font-heading text-xl font-bold text-white sm:text-3xl">
            Panel Anatomy.
          </h2>
          <p className="mt-1 font-mono text-[11px] tracking-[0.16em] text-white/40 uppercase">
            Four layers, sun to meter
          </p>
        </div>

        {/* ---- text beats: flush-left column, one visible at a time ---- */}
        <div className="absolute top-[30%] left-[3%] z-10 h-[420px] w-[92%] [@media(min-height:700px)_and_(max-width:1023px)]:top-[43%] lg:top-[32%] lg:w-[42%]">
          {BEATS.map((beat) => (
            <div key={beat.title} data-beat-text className="absolute inset-0">
              <span className="inline-block bg-lime-300 px-3 py-1 font-mono text-[11px] tracking-[0.18em] text-black uppercase">
                {beat.label}
              </span>
              <h3 className="font-heading mt-4 text-2xl font-bold text-white sm:mt-5 sm:text-4xl xl:text-[2.5rem] xl:leading-[1.06]">
                {beat.title}
              </h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/55 sm:mt-4 sm:text-base">
                {beat.body}
              </p>

              <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-4 sm:mt-7 sm:gap-x-12 sm:gap-y-5">
                {beat.stats.map((stat) => (
                  <div key={stat.caption}>
                    <dt className="font-heading text-2xl font-bold text-white sm:text-3xl">
                      {stat.value}
                    </dt>
                    <dd className="mt-1 font-mono text-[11px] tracking-[0.12em] text-white/45 uppercase">
                      {stat.caption}
                    </dd>
                  </div>
                ))}
              </dl>

              <button className="mt-5 inline-flex items-center gap-3 rounded-lg border border-white/25 py-2.5 pr-2.5 pl-5 font-mono text-[11px] tracking-[0.16em] text-white uppercase transition-colors hover:border-white/50 sm:mt-8">
                {beat.label} spec
                <span className="flex h-7 w-7 items-center justify-center rounded bg-lime-300 text-black">
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                    <path
                      d="M4 8h7M8 4.5 11.5 8 8 11.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </div>
          ))}
        </div>

        {/* ---- beat progress ---- */}
        <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
          {BEATS.map((beat, i) => (
            <div key={beat.label} className="flex items-center gap-3">
              <span
                data-beat-mark
                className="font-mono text-[11px] tracking-[0.14em] text-white uppercase"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {i < BEATS.length - 1 && <span className="h-px w-6 bg-white/25" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
