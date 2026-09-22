"use client";

import { useEffect, useState } from "react";

const DISCOVER = [
  { href: "#home", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#calculator", label: "Calculator" },
  { href: "#process", label: "Process" },
];

// TODO: swap the "#" entries for real profile URLs once they are confirmed.
// WhatsApp is built from the phone number already shown in the footer bar.
const SOCIAL = [
  { href: "https://wa.me/918921259870", label: "WhatsApp", external: true },
  { href: "#", label: "LinkedIn" },
  { href: "#", label: "Instagram" },
  { href: "#", label: "YouTube" },
];

const SOLUTIONS = [
  {
    title: "On-Grid Solar",
    blurb: "Grid-tied rooftop systems that cut your monthly bill from day one.",
    tile: "Lower every bill.",
  },
  {
    title: "Hybrid Systems",
    blurb: "Battery-backed plans that keep the lights on through an outage.",
    tile: "Ride out outages.",
  },
  {
    title: "Service & Support",
    blurb: "Ongoing monitoring and maintenance for the life of the system.",
    tile: "Keep it producing.",
  },
];

const DWELL_MS = 5000;

export default function Footer() {
  const [active, setActive] = useState(0);
  // Drives the progress pill: remounted each beat, then flipped from 0 to 100%
  // on the next frame so the CSS transition has two states to animate between.
  const [filling, setFilling] = useState(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => setActive((i) => (i + 1) % SOLUTIONS.length), DWELL_MS);
    return () => clearTimeout(id);
  }, [active]);

  useEffect(() => {
    setFilling(false);
    const raf = requestAnimationFrame(() => setFilling(true));
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const current = SOLUTIONS[active];

  return (
    <footer className="relative overflow-hidden bg-[#0e1f16] text-white">
      {/* ---- top grid: links, rotating solutions, accent tile ---- */}
      <div className="grid grid-cols-2 border-b border-white/10 lg:grid-cols-[0.9fr_0.9fr_2.2fr_1.1fr]">
        <div className="border-b border-white/10 px-6 py-10 lg:border-b-0 lg:px-10 lg:py-14">
          <p className="text-sm text-lime-300">Discover E Solar</p>
          <ul className="mt-4 space-y-0.5">
            {DISCOVER.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="block py-1.5 text-lg text-white/70 transition-colors hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-b border-l border-white/10 px-6 py-10 lg:border-b-0 lg:px-10 lg:py-14">
          <p className="text-sm text-lime-300">Social</p>
          <ul className="mt-4 space-y-0.5">
            {SOCIAL.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target={l.external ? "_blank" : undefined}
                  rel={l.external ? "noopener noreferrer" : undefined}
                  className="block py-1.5 text-lg text-white/70 transition-colors hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative col-span-2 border-t border-white/10 px-6 py-10 lg:col-span-1 lg:border-t-0 lg:border-l lg:px-10 lg:py-14">
          {/* Fills the empty right half of this column. Hidden below lg, where
              the column is full width and there is no space beside the copy. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-mark.svg"
            alt="E Solar"
            width={310}
            height={307}
            draggable={false}
            className="pointer-events-none absolute top-1/2 right-6 hidden w-[clamp(6rem,calc(43vw_-_350px),18rem)] -translate-y-1/2 select-none lg:block"
          />

          <p className="text-sm text-lime-300">Our Solutions</p>

          <ul className="mt-6 space-y-1">
            {SOLUTIONS.map((s, i) => (
              <li key={s.title}>
                <button
                  onClick={() => setActive(i)}
                  className={`font-heading text-left text-2xl transition-colors duration-500 sm:text-3xl ${
                    i === active ? "text-white" : "text-white/25 hover:text-white/50"
                  }`}
                >
                  {s.title}
                </button>
              </li>
            ))}
          </ul>

          {/* progress indicator: dots for the queued beats, a filling pill for
              the one on screen */}
          <div className="mt-6 flex items-center gap-2">
            {SOLUTIONS.map((s, i) =>
              i === active ? (
                <span
                  key={s.title}
                  className="h-1.5 w-10 overflow-hidden rounded-full bg-white/20"
                >
                  <span
                    className="block h-full rounded-full bg-lime-300 transition-[width] ease-linear"
                    style={{
                      width: filling ? "100%" : "0%",
                      transitionDuration: `${DWELL_MS}ms`,
                    }}
                  />
                </span>
              ) : (
                <button
                  key={s.title}
                  onClick={() => setActive(i)}
                  aria-label={`Show ${s.title}`}
                  className="h-1.5 w-1.5 rounded-full bg-white/25 transition-colors hover:bg-white/50"
                />
              )
            )}
          </div>

          <p key={current.title} className="mt-6 max-w-[15rem] text-sm text-white/60">
            {current.blurb}
          </p>
        </div>

        <div className="relative col-span-2 min-h-[220px] overflow-hidden bg-lime-300 p-8 lg:col-span-1 lg:min-h-0">
          {/* line-art: four roof arrays feeding one inverter node */}
          <svg
            viewBox="0 0 200 200"
            className="absolute inset-0 h-full w-full text-black/25"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden
          >
            <g fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M40 30h50v40M160 30h-50v40M40 170h50v-40M160 170h-50v-40" />
              <path d="M20 60v80M180 60v80M20 60h20M180 60h-20M20 140h20M180 140h-20" />
              <rect x="86" y="86" width="28" height="28" />
            </g>
            <g fill="currentColor">
              {[
                [37, 27],
                [157, 27],
                [37, 167],
                [157, 167],
                [87, 67],
                [107, 67],
                [87, 127],
                [107, 127],
              ].map(([x, y]) => (
                <rect key={`${x}-${y}`} x={x} y={y} width="6" height="6" />
              ))}
            </g>
          </svg>

          <div className="relative flex h-full items-center justify-center">
            <p className="font-heading text-center text-2xl font-semibold text-black">
              {current.tile}
            </p>
          </div>
        </div>
      </div>

      {/* ---- call to action ---- */}
      <div className="relative overflow-hidden border-b border-white/10 px-6 py-16 lg:px-10 lg:py-20">
        <div className="relative z-10 max-w-xl">
          <p className="text-sm text-lime-300">Get Started with Us</p>
          <h2 className="font-heading mt-4 text-4xl leading-tight font-semibold sm:text-5xl lg:text-6xl">
            Let&rsquo;s power your roof together.
          </h2>
          <a
            href="#calculator"
            className="mt-10 inline-block rounded-full bg-lime-300 px-8 py-4 text-sm font-semibold text-black transition-colors hover:bg-lime-200"
          >
            Get a Custom Quote
          </a>
        </div>
        {/* The artwork grows left-to-right, so it fills the empty half beside
            the copy and lands its canopy at the top right. Below lg it drops
            underneath the button rather than sitting behind the text. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/anatomy/footer/solar-tree.webp"
          alt="A tree grown from solar panel icons, from seedling to full canopy"
          draggable={false}
          className="pointer-events-none mt-12 block w-full select-none lg:absolute lg:right-0 lg:bottom-0 lg:mt-0 lg:w-[58%] lg:max-w-4xl"
        />
      </div>

      {/* ---- legal / contact bar ---- */}
      <div className="flex flex-col gap-6 px-6 py-8 text-xs text-white/45 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {/* TODO: point these at real pages once they exist. */}
          <a href="#" className="transition-colors hover:text-white/80">
            Terms of Use
          </a>
          <a href="#" className="transition-colors hover:text-white/80">
            Privacy Policy
          </a>
          <span>Kozhikode &amp; Thiruvananthapuram, Kerala</span>
          <a
            href="tel:+918921259870"
            className="transition-colors hover:text-white/80"
          >
            +91 89212 59870
          </a>
        </div>
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-icon.svg"
            alt="E Solar"
            width={220}
            height={220}
            draggable={false}
            className="h-7 w-7 select-none"
          />
          <p>© {new Date().getFullYear()} E Solar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
