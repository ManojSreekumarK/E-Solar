"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import StatChip from "./StatChip";
import TextReveal from "./TextReveal";

const HEADING =
  "Every roof tells a different energy story. We turn satellite imagery and real usage data into a solar plan built for your home — priced clearly, backed by our team throughout.";

// xl+ positions mirror the reference layout: overline top-left, heading in the
// upper-right, chips scattered across the lower band. The vertical split
// (heading above ~35%, chips below ~46%) is what keeps them from colliding.
// `depth` drives the parallax rate — bigger = travels further = reads nearer.
const CHIPS = [
  {
    lines: ["Electricity rates climbed", "again in 2024"],
    position: "xl:absolute xl:top-[54%] xl:left-[26%]",
    depth: -40,
  },
  {
    lines: ["1,000+ homes powered", "by E Solar"],
    position: "xl:absolute xl:top-[52%] xl:left-[70%]",
    depth: -62,
  },
  {
    lines: ["72% year-over-year", "customer growth"],
    position: "xl:absolute xl:top-[74%] xl:left-[4%]",
    depth: -95,
  },
  {
    lines: ["4.9 / 5 average", "customer rating"],
    position: "xl:absolute xl:top-[80%] xl:left-[54%]",
    depth: -120,
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const overlineRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;

    // Drive off the sticky-stack wrapper, not the section: while the section
    // is pinned its own rect never moves, so it can't report scroll progress.
    const wrapper = section.parentElement;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        overlineRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 80%" },
        }
      );

      // Parallax: layers drift upward at different rates as the Service
      // Rating panel slides over, so the section recedes rather than just
      // sitting still. Applied to wrappers — the inner elements own their
      // entrance transforms and would fight a second writer.
      const drift = (el: Element | null, to: number) => {
        if (!el || !wrapper) return;
        gsap.fromTo(
          el,
          { y: 0 },
          {
            y: to,
            ease: "none",
            scrollTrigger: {
              trigger: wrapper,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            },
          }
        );
      };

      drift(overlineRef.current, -30);
      drift(headingRef.current, -70);
      CHIPS.forEach((chip, i) => drift(chipRefs.current[i], chip.depth));
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-white px-6 py-28 sm:py-36 xl:block xl:h-screen xl:py-0 xl:sticky xl:top-0"
    >
      <div className="mx-auto w-full max-w-6xl xl:max-w-none">
        <div
          ref={overlineRef}
          className="mx-auto max-w-3xl font-mono text-base leading-snug tracking-wide text-black/45 uppercase xl:absolute xl:top-[10%] xl:left-[2%] xl:mx-0 xl:max-w-none"
        >
          <div>Satellite-verified, data-driven</div>
          <div>solar intelligence</div>
        </div>

        <div
          ref={headingRef}
          className="mt-8 xl:absolute xl:top-[12%] xl:left-[44%] xl:mt-0 xl:w-[53%]"
        >
          <TextReveal
            text={HEADING}
            delay={0.1}
            stagger={0.022}
            className="font-heading mx-auto max-w-3xl text-2xl leading-relaxed font-medium text-neutral-900 sm:text-4xl sm:leading-[1.4] xl:mx-0 xl:max-w-none xl:text-[clamp(2rem,2.6vw,3.5rem)]"
          />
        </div>

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 xl:mt-0 xl:block">
          {CHIPS.map((chip, i) => (
            <div
              key={chip.lines.join()}
              ref={(el) => {
                chipRefs.current[i] = el;
              }}
              className={chip.position}
            >
              <StatChip lines={chip.lines} delay={i * 0.15} tone="onLight" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
