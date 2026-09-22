"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

const MIN_BILL = 1000;
const MAX_BILL = 15000;
const SAVINGS_RATE = 0.85;
const SYSTEM_COST_MULTIPLIER = 45.9;

const HOUSES = "/images/anatomy/houses";

/**
 * Bill brackets, smallest roof first. `upTo` is the inclusive top of each
 * bracket; the last one absorbs everything above it. All four images are
 * mounted at once (hidden ones at opacity 0) so the browser has them decoded
 * before the slider ever moves — a lazy swap flashes an empty box mid-drag.
 */
const TIERS = [
  {
    upTo: 4400,
    image: `${HOUSES}/tier-1-bungalow.webp`,
    label: "Compact home",
    note: "Single-storey roof, one panel bank",
  },
  {
    upTo: 8400,
    image: `${HOUSES}/tier-2-villa.webp`,
    label: "Independent house",
    note: "Two-storey roof with room to expand",
  },
  {
    upTo: 11900,
    image: `${HOUSES}/tier-3-apartment.webp`,
    label: "Multi-storey home",
    note: "Terrace array on a taller structure",
  },
  {
    upTo: Infinity,
    image: `${HOUSES}/tier-4-complex.webp`,
    label: "Apartment / commercial",
    note: "Full terrace coverage across blocks",
  },
];

function formatINR(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export default function Calculator() {
  const [bill, setBill] = useState(7500);

  const tierIndex = TIERS.findIndex((t) => bill <= t.upTo);
  const tier = TIERS[tierIndex];

  const { savings25, payback } = useMemo(() => {
    const monthlySavings = bill * SAVINGS_RATE;
    const annualSavings = monthlySavings * 12;
    const systemCost = bill * SYSTEM_COST_MULTIPLIER;
    return {
      savings25: annualSavings * 25,
      payback: systemCost / annualSavings,
    };
  }, [bill]);

  return (
    <section id="calculator" className="scroll-mt-24 bg-white px-6 py-28 sm:py-36">
      {/* DOM order is heading -> artwork -> card, which is also the mobile
          stacking order: the roof always sits directly above the slider, so it
          is on screen while you drag. On lg the artwork moves into its own
          column spanning both rows. */}
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:grid-rows-[auto_auto] lg:items-center lg:gap-x-16 lg:gap-y-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="lg:col-start-2 lg:row-start-1 lg:self-end"
        >
          <h2 className="font-heading text-4xl leading-tight font-bold sm:text-5xl">
            Calculate Your Potential
          </h2>
          <p className="mt-4 max-w-sm text-sm text-black/55">
            See exactly how much you could save by switching to solar. The
            numbers speak for themselves.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="lg:col-start-1 lg:row-span-2 lg:row-start-1"
        >
          <div className="relative mx-auto aspect-square w-full max-w-[17rem] sm:max-w-[24rem] lg:max-w-[28rem]">
            {TIERS.map((t, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={t.image}
                src={t.image}
                alt={
                  i === tierIndex ? `${t.label} with a rooftop solar array` : ""
                }
                aria-hidden={i !== tierIndex}
                draggable={false}
                className={`absolute inset-0 h-full w-full object-contain transition-[opacity,transform] duration-500 ease-out ${
                  i === tierIndex ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
              />
            ))}
          </div>

          <div className="mt-1 text-center">
            <p className="text-sm font-semibold">{tier.label}</p>
            <p className="mt-1 text-xs text-black/45">{tier.note}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-md rounded-3xl border border-black/10 bg-white p-8 shadow-xl shadow-black/5 lg:col-start-2 lg:row-start-2"
        >
          <p className="text-[11px] font-semibold tracking-[0.15em] text-black/40">
            AVERAGE MONTHLY BILL
          </p>
          <p className="font-heading mt-1 text-4xl font-bold tabular-nums">
            {formatINR(bill)}
          </p>

          <input
            type="range"
            min={MIN_BILL}
            max={MAX_BILL}
            step={100}
            value={bill}
            onChange={(e) => setBill(Number(e.target.value))}
            aria-label="Average monthly electricity bill"
            className="mt-6 h-6 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-black/10 [&::-webkit-slider-thumb]:mt-[-9px] [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-black/10 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-black"
          />
          <div className="mt-1 flex justify-between text-[11px] text-black/40">
            <span>₹1,000</span>
            <span>₹15,000+</span>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-black/10 pt-6">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.1em] text-black/40">
                EST. 25-YEAR SAVINGS
              </p>
              <p className="font-heading mt-1 text-2xl font-bold tabular-nums">
                {formatINR(savings25)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.1em] text-black/40">
                PAYBACK PERIOD
              </p>
              <p className="font-heading mt-1 text-2xl font-bold tabular-nums">
                {payback.toFixed(1)}{" "}
                <span className="text-base font-medium">Yrs</span>
              </p>
            </div>
          </div>

          <button className="mt-8 w-full rounded-full bg-black py-4 text-sm font-semibold text-white transition-colors hover:bg-black/85">
            Get a Custom Quote
          </button>
        </motion.div>
      </div>
    </section>
  );
}
