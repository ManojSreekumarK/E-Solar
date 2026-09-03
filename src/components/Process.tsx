"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

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

const ITEM_WIDTH_VW = 60;
const TRACK_WIDTH_VW = STEPS.length * ITEM_WIDTH_VW;
const END_X_VW = -(TRACK_WIDTH_VW - 100);

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["2vw", `${END_X_VW}vw`]);

  return (
    <section id="process" ref={ref} className="relative h-[280vh] scroll-mt-24 bg-white">
      <div className="sticky top-0 h-screen w-full overflow-hidden px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">The Process.</h2>
          <p className="mt-1 text-sm text-black/50">
            Seamless transition to renewable energy.
          </p>
        </div>

        <div className="relative mt-32 h-40 sm:mt-40">
          <motion.div
            style={{ x, width: `${TRACK_WIDTH_VW}vw` }}
            className="absolute top-0 left-0 flex"
          >
            <div className="absolute top-2 right-0 left-0 h-px bg-lime-500/45" />
            {STEPS.map((step) => (
              <div
                key={step.title}
                style={{ width: `${ITEM_WIDTH_VW}vw` }}
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
