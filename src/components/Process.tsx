"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    title: "Simple Booking",
    desc: "Schedule a consultation and tell us about your energy needs.",
  },
  {
    title: "Strategy",
    desc: "We analyze your needs and build a customized on-grid or hybrid plan.",
  },
  {
    title: "Continuous Support",
    desc: "Ongoing guidance from implementation through long-term optimization.",
  },
];

// At 60vw a second card is always half on screen; on a phone that means the
// neighbouring step is permanently clipped mid-sentence. Phones get one card
// at a time instead.
const ITEM_WIDTH_VW = { mobile: 86, desktop: 60 };

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  // Horizontal-on-vertical scrolling reads badly on a phone: a card is always
  // caught mid-slide, clipped at one edge. Phones get a plain vertical list,
  // which also saves ~2.8 screens of scrolling.
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const apply = () => setIsNarrow(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const itemVw = ITEM_WIDTH_VW.desktop;
  const trackVw = STEPS.length * itemVw;
  const endXVw = -(trackVw - 100);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["2vw", `${endXVw}vw`]);

  if (isNarrow) {
    return (
      <section id="process" className="scroll-mt-24 bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-heading text-3xl font-bold">The Process.</h2>
          <p className="mt-1 text-sm text-black/50">
            Seamless transition to renewable energy.
          </p>

          <ol className="mt-12 space-y-10 border-l border-lime-500/45 pl-6">
            {STEPS.map((step) => (
              <li key={step.title} className="relative">
                <span className="absolute top-2 -left-[1.8125rem] h-2.5 w-2.5 rounded-full bg-lime-500" />
                <h3 className="font-heading text-2xl font-semibold">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-black/50">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section id="process" ref={ref} className="relative h-[130vh] scroll-mt-24 bg-white">
      <div className="sticky top-0 h-screen w-full overflow-hidden px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">The Process.</h2>
          <p className="mt-1 text-sm text-black/50">
            Seamless transition to renewable energy.
          </p>
        </div>

        <div className="relative mt-20 h-40 sm:mt-40">
          <motion.div
            style={{ x, width: `${trackVw}vw` }}
            className="absolute top-0 left-0 flex"
          >
            <div className="absolute top-2 right-0 left-0 h-px bg-lime-500/45" />
            {STEPS.map((step) => (
              <div
                key={step.title}
                style={{ width: `${itemVw}vw` }}
                className="flex-shrink-0 px-[4vw]"
              >
                <div className="h-2.5 w-2.5 rounded-full bg-lime-500" />
                <h3 className="font-heading mt-5 text-2xl font-semibold sm:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm text-black/50">{step.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
