"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay, ease: "easeOut" as const },
  }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--primary)_8%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--primary)_8%,transparent)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_18%,transparent_72%)]"
      />

      <Container className="relative grid items-center gap-14 py-20 sm:py-24 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:py-28 xl:py-32">
        <div className="max-w-2xl">
          <motion.p
            className="mb-5 text-[11px] font-medium uppercase tracking-[0.28em] text-accent"
            initial="hidden"
            animate="visible"
            custom={0.05}
            variants={fadeUp}
          >
            Computing Yard
          </motion.p>

          <motion.h1
            className="font-display text-4xl leading-[1.08] tracking-tight text-white uppercase sm:text-5xl lg:text-[3.35rem] xl:text-[3.75rem]"
            initial="hidden"
            animate="visible"
            custom={0.12}
            variants={fadeUp}
          >
            We build digital products that move businesses forward.
          </motion.h1>

          <motion.p
            className="mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8"
            initial="hidden"
            animate="visible"
            custom={0.2}
            variants={fadeUp}
          >
            We design and develop high-performance websites, web applications,
            mobile apps and digital solutions for ambitious businesses.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            initial="hidden"
            animate="visible"
            custom={0.28}
            variants={fadeUp}
          >
            <Button href="/contact" size="lg">
              Start a Project
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Button>
            <Button href="/portfolio" variant="secondary" size="lg">
              View Our Work
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="relative mx-auto w-full max-w-lg lg:max-w-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18, ease: "easeOut" }}
        >
          <HeroVisual />
        </motion.div>
      </Container>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative aspect-square w-full max-h-[34rem]">
      <div className="absolute inset-0 rounded-[2rem] border border-border bg-surface shadow-[0_24px_80px_color-mix(in_srgb,var(--primary)_12%,transparent)]" />

      <svg
        viewBox="0 0 520 520"
        className="relative h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="hero-glow" cx="50%" cy="42%" r="48%">
            <stop offset="0%" stopColor="#F57B00" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#2C5270" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="520" height="520" rx="32" fill="url(#hero-glow)" />

        <g opacity="0.22" stroke="#2C5270" strokeWidth="1">
          {Array.from({ length: 7 }, (_, index) => (
            <line
              key={`v-${index}`}
              x1={80 + index * 60}
              y1="70"
              x2={80 + index * 60}
              y2="450"
            />
          ))}
          {Array.from({ length: 7 }, (_, index) => (
            <line
              key={`h-${index}`}
              x1="70"
              y1={80 + index * 60}
              x2="450"
              y2={80 + index * 60}
            />
          ))}
        </g>

        <rect
          x="96"
          y="118"
          width="210"
          height="132"
          rx="18"
          fill="#2C5270"
          fillOpacity="0.28"
          stroke="#2C5270"
          strokeWidth="1.5"
        />
        <circle cx="118" cy="140" r="5" fill="#F57B00" />
        <circle cx="136" cy="140" r="5" fill="#2C5270" opacity="0.35" />
        <circle cx="154" cy="140" r="5" fill="#2C5270" opacity="0.35" />
        <rect x="118" y="168" width="128" height="8" rx="4" fill="#2C5270" opacity="0.18" />
        <rect x="118" y="186" width="168" height="8" rx="4" fill="#2C5270" opacity="0.12" />
        <rect x="118" y="204" width="96" height="8" rx="4" fill="#F57B00" opacity="0.55" />

        <rect
          x="248"
          y="232"
          width="176"
          height="158"
          rx="18"
          fill="#2C5270"
          fillOpacity="0.28"
          stroke="#2C5270"
          strokeWidth="1.5"
        />
        <rect x="272" y="258" width="48" height="48" rx="10" fill="#2C5270" />
        <rect x="334" y="268" width="64" height="8" rx="4" fill="#2C5270" opacity="0.2" />
        <rect x="334" y="286" width="48" height="8" rx="4" fill="#2C5270" opacity="0.12" />
        <rect x="272" y="326" width="128" height="36" rx="8" fill="#F57B00" opacity="0.16" />

        <motion.circle
          cx="198"
          cy="338"
          r="7"
          fill="#F57B00"
          animate={{ r: [6, 8.5, 6], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="318" cy="168" r="6" fill="#2C5270" />
        <circle cx="392" cy="278" r="5" fill="#2C5270" opacity="0.7" />

        <path
          d="M198 338C198 338 238 286 318 168"
          fill="none"
          stroke="#2C5270"
          strokeWidth="1.5"
          strokeDasharray="5 7"
          opacity="0.45"
        />
        <path
          d="M198 338C248 352 330 320 392 278"
          fill="none"
          stroke="#F57B00"
          strokeWidth="1.5"
          strokeDasharray="5 7"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}
