"use client";

import { motion } from "framer-motion";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/contact/ContactForm";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay, ease: "easeOut" as const },
  }),
};

const contactDetails = [
  {
    label: "Email",
    value: "To be added",
    icon: Mail,
  },
  {
    label: "Phone",
    value: "To be added",
    icon: Phone,
  },
  {
    label: "Location",
    value: "To be added",
    icon: MapPin,
  },
  {
    label: "Business hours",
    value: "To be added",
    icon: Clock,
  },
] as const;

export function ContactContent() {
  return (
    <>
      <section className="relative overflow-hidden bg-background py-20 sm:py-24 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--primary)_8%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--primary)_8%,transparent)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_18%,transparent_72%)]"
        />
        <Container className="relative">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.08}
            variants={fadeUp}
          >
            <SectionHeading
              as="h1"
              eyebrow="CONTACT US"
              title="Let's Build Something Great Together."
              description="Tell us about your project, your goals and what you're looking to build. Our team will get back to you and discuss the next steps."
            />
          </motion.div>
        </Container>
      </section>

      <section className="border-t border-border bg-background pb-20 sm:pb-24 lg:pb-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={0.08}
              variants={fadeUp}
            >
              <h2 className="font-display text-2xl tracking-tight text-white sm:text-3xl">
                Contact Information
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted sm:text-[15px] sm:leading-7">
                Company contact details will appear here once they are added.
                Until then, use the form to share your project brief.
              </p>

              <ul className="mt-8 space-y-4">
                {contactDetails.map((item) => {
                  const Icon = item.icon;

                  return (
                    <li
                      key={item.label}
                      className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5"
                    >
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/50 bg-primary/20 text-accent">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
                          {item.label}
                        </p>
                        <p className="mt-1 text-sm text-white/80">{item.value}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              custom={0.14}
              variants={fadeUp}
            >
              <h2 className="mb-6 font-display text-2xl tracking-tight text-white sm:text-3xl">
                Tell us about your project
              </h2>
              <ContactForm />
            </motion.div>
          </div>
        </Container>
      </section>
    </>
  );
}
