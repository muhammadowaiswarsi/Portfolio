"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  message: "",
};

const underlineField =
  "w-full border-0 border-b border-border bg-transparent px-0 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-accent";

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};

  if (values.fullName.trim().length < 2) {
    errors.fullName = "Please enter your full name.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Please enter a valid business email.";
  }

  if (values.phone.replace(/\D/g, "").length < 7) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (values.message.trim().length < 10) {
    errors.message = "Please describe your project needs.";
  }

  return errors;
}

export function PortfolioLeadForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "valid">("idle");

  function update<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setValues((current) => ({ ...current, [key]: value }));
    setStatus("idle");
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    setStatus("valid");
  }

  return (
    <form
      id="get-in-touch"
      onSubmit={onSubmit}
      noValidate
      className="rounded-[1.5rem] border border-border bg-surface p-6 shadow-[0_24px_80px_color-mix(in_srgb,var(--primary)_18%,transparent)] sm:p-8"
    >
      <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-foreground sm:text-2xl">
        Get In Touch With Us!
      </h2>

      <div className="mt-8 space-y-6">
        <Field error={errors.fullName}>
          <input
            id="portfolio-fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Full Name *"
            value={values.fullName}
            onChange={(event) => update("fullName", event.target.value)}
            className={underlineField}
            aria-invalid={Boolean(errors.fullName)}
          />
        </Field>
        <Field error={errors.email}>
          <input
            id="portfolio-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Business Email *"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            className={underlineField}
            aria-invalid={Boolean(errors.email)}
          />
        </Field>
        <Field error={errors.phone}>
          <input
            id="portfolio-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Phone Number *"
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
            className={underlineField}
            aria-invalid={Boolean(errors.phone)}
          />
        </Field>
        <Field error={errors.message}>
          <textarea
            id="portfolio-message"
            name="message"
            rows={4}
            placeholder="Describe your project needs"
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
            className={cn(underlineField, "min-h-[6.5rem] resize-y")}
            aria-invalid={Boolean(errors.message)}
          />
        </Field>
      </div>

      <div className="mt-8 flex flex-col items-start gap-3">
        <Button type="submit" className="rounded-full px-8">
          Submit
        </Button>
        {status === "valid" ? (
          <p className="text-sm leading-6 text-muted">
            Your details look complete. Message delivery is not connected yet.
          </p>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  error,
  children,
}: {
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
      {error ? (
        <p className="mt-2 text-xs text-accent" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
