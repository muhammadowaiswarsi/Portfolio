"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";

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
    label: "Phone",
    value: "+92 336 308 3049",
    href: "tel:+923363083049",
    icon: Phone,
    external: false,
  },
  {
    label: "Email",
    value: "info@computingyard.com",
    href: "mailto:info@computingyard.com",
    icon: Mail,
    external: false,
  },
  {
    label: "Address",
    value: "Office No. 08, Faiyaz Center, SMCHS Block A, Shahrah-e-Faisal, Karachi",
    icon: MapPin,
  },
  {
    label: "Business Hours",
    value: "Open 24 hours",
    icon: Clock,
  },
] as const;

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/computingyard",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/computingyard/",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/computingyard/",
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

      <section className="border-t border-border bg-background py-20 sm:py-24 lg:py-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={0.08}
              variants={fadeUp}
            >
              <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-foreground sm:text-3xl">
                Contact Information
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted sm:text-[15px] sm:leading-7">
                Reach us by phone, email or at our Karachi office. You can also
                share your project brief using the form.
              </p>

              <ul className="mt-8 space-y-4">
                {contactDetails.map((item) => {
                  const Icon = item.icon;
                  const href = "href" in item ? item.href : undefined;

                  return (
                    <li
                      key={item.label}
                      className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5"
                    >
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/50 bg-primary/20 text-accent">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
                          {item.label}
                        </p>
                        {href ? (
                          <a
                            href={href}
                            className="mt-1 block break-words text-sm leading-6 text-foreground/80 transition-colors hover:text-accent sm:text-[15px] sm:leading-7"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="mt-1 break-words text-sm leading-6 text-foreground/80 sm:text-[15px] sm:leading-7">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
                  Social
                </p>
                <ul className="mt-4 flex flex-wrap gap-3">
                  {socialLinks.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-foreground/80 transition-colors hover:border-primary hover:text-accent"
                      >
                        {item.label}
                        <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              custom={0.14}
              variants={fadeUp}
            >
              <h2 className="mb-6 font-display text-2xl font-semibold tracking-[-0.02em] text-foreground sm:text-3xl">
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
