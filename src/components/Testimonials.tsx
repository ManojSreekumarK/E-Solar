"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import TestimonialScene from "./TestimonialScene";

const TESTIMONIALS = [
  {
    scene: "traditional" as const,
    stat: "5 kW",
    quote:
      "Installed a 5kW solar plant with E Solar — fast delivery, smooth processing, and professional workmanship. Highly recommend.",
    name: "Mohanan",
    location: "Kerala",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (TESTIMONIALS.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const current = TESTIMONIALS[index];

  return (
    <section
      id="testimonials"
      className="grid min-h-screen scroll-mt-24 bg-white sm:grid-cols-2"
    >
      <div className="relative h-[50vh] overflow-hidden sm:h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.scene}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <TestimonialScene variant={current.scene} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col justify-center px-8 py-16 sm:px-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-[11px] font-semibold tracking-[0.2em] text-black/40">
              SYSTEM INSTALLED
            </p>
            <p className="font-heading mt-1 text-6xl font-bold sm:text-7xl">
              {current.stat}
            </p>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-black/70">
              &ldquo;{current.quote}&rdquo;
            </p>
            <p className="mt-6 text-sm font-semibold">{current.name}</p>
            <p className="text-xs text-black/40">
              {current.location} · Verified Installation
            </p>
          </motion.div>
        </AnimatePresence>

        {TESTIMONIALS.length > 1 && (
          <div className="mt-10 flex gap-2">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.name}
                onClick={() => setIndex(i)}
                aria-label={`Show testimonial from ${t.name}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-8 bg-black" : "w-4 bg-black/15"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
