"use client";

import { motion } from "framer-motion";
import {
  AppWindow,
  Award,
  Briefcase,
  Clock,
  Database,
  Gauge,
  HeartHandshake,
  Layers,
  Lightbulb,
  Palette,
  RefreshCw,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";

import {
  completeBenefits,
  getImageUrl,
  hasImage,
} from "@/components/services/landing/helpers";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ServiceLanding } from "@/types/sanity";

const BENEFIT_ICONS: Record<string, LucideIcon> = {
  "business-focused solutions": Briefcase,
  "scalable architecture": Layers,
  "modern user experience": Sparkles,
  "secure & reliable": ShieldCheck,
  "user-centered experiences": Users,
  "cross-platform development": Smartphone,
  "high performance": Gauge,
  "24/7 customer support": Clock,
  "smarter automation": Workflow,
  "personalized experiences": HeartHandshake,
  "business efficiency": Zap,
  "better user experience": Sparkles,
  "modern visual design": Palette,
  "improved conversion": TrendingUp,
  "stronger brand experience": Award,
  "increased search visibility": Search,
  "targeted organic traffic": Target,
  "better website performance": Gauge,
  "sustainable growth": TrendingUp,
  "useful inside the product": AppWindow,
  "works with your data": Database,
  "faster, clearer decisions": Lightbulb,
  "built to improve": RefreshCw,
};

function iconForBenefit(title: string): LucideIcon {
  const key = title.trim().toLowerCase();
  if (BENEFIT_ICONS[key]) return BENEFIT_ICONS[key];

  if (/secure|reliab/.test(key)) return ShieldCheck;
  if (/scalab|architect/.test(key)) return Layers;
  if (/experience|interface|ux/.test(key)) return Sparkles;
  if (/business|workflow/.test(key)) return Briefcase;
  if (/search|seo|traffic/.test(key)) return Search;
  if (/data|vector/.test(key)) return Database;
  if (/automat/.test(key)) return Workflow;
  if (/design|visual|brand/.test(key)) return Palette;
  if (/mobile/.test(key)) return Smartphone;
  if (/performance/.test(key)) return Gauge;

  return Zap;
}

type ServiceBenefitsProps = {
  service: ServiceLanding;
};

export function ServiceBenefits({ service }: ServiceBenefitsProps) {
  const benefits = completeBenefits(service.benefits);

  if (benefits.length === 0) return null;

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="BENEFITS"
          title="Benefits"
          headingClassName="font-display font-semibold"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {benefits.map((benefit, index) => {
            const iconUrl = hasImage(benefit.icon)
              ? getImageUrl(benefit.icon, 160, 160)
              : null;
            const iconAlt = benefit.icon?.alt || benefit.title || "Benefit";
            const Icon = iconForBenefit(benefit.title ?? "");

            return (
              <motion.article
                key={benefit._key || `${benefit.title}-${index}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(index, 6) * 0.06,
                  ease: "easeOut",
                }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-primary sm:p-7"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,color-mix(in_srgb,var(--primary)_22%,transparent),transparent_62%)] opacity-80"
                />
                <div className="relative mb-5 flex size-14 items-center justify-center overflow-hidden rounded-xl border border-primary/40 bg-primary/20">
                  {iconUrl ? (
                    <Image
                      src={iconUrl}
                      alt={iconAlt}
                      width={40}
                      height={40}
                      className="size-9 object-contain"
                    />
                  ) : (
                    <Icon className="size-6 text-accent" aria-hidden="true" />
                  )}
                </div>
                <h3 className="relative font-display text-xl font-semibold tracking-[-0.02em] text-foreground sm:text-2xl">
                  {benefit.title}
                </h3>
                <p className="relative mt-3 text-sm leading-6 text-muted sm:text-[15px] sm:leading-7">
                  {benefit.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
