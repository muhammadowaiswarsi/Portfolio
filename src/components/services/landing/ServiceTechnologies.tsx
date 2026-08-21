"use client";

import { motion } from "framer-motion";

import {
  completeTechnologies,
  fadeUp,
} from "@/components/services/landing/helpers";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechChipList } from "@/components/ui/TechChip";
import type { ServiceLanding } from "@/types/sanity";

type ServiceTechnologiesProps = {
  service: ServiceLanding;
};

export function ServiceTechnologies({ service }: ServiceTechnologiesProps) {
  const technologies = completeTechnologies(service.technologies);

  if (technologies.length === 0) return null;

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          custom={0.08}
          variants={fadeUp}
        >
          <SectionHeading
            eyebrow="TECHNOLOGIES"
            title="Technologies"
            headingClassName="font-display font-semibold"
          />
          <div className="mt-10">
            <TechChipList items={technologies} />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
