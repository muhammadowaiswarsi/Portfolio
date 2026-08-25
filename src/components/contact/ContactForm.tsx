"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { CONTACT_LIMITS, PROJECT_TYPES } from "@/lib/contact";

type FormState = {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  projectType: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  fullName: "",
  email: "",
  company: "",
  phone: "",
  projectType: "",
  message: "",
};

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};

  if (values.fullName.trim().length < 2) {
    errors.fullName = "Please enter your full name.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (values.phone.trim() && values.phone.replace(/\D/g, "").length < 7) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!values.projectType) {
    errors.projectType = "Please select a project type.";
  }

  if (values.message.trim().length < 20) {
    errors.message = "Please tell us a bit more about your project.";
  }

  return errors;
}

const fieldClass =
  "w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/35 focus:border-accent focus:ring-2 focus:ring-accent/30 disabled:opacity-60";

export function ContactForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );

  const isSending = status === "sending";

  function update<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setValues((current) => ({ ...current, [key]: value }));
    if (status === "success" || status === "error") {
      setStatus("idle");
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          company: values.company.trim(),
          phone: values.phone.trim(),
          projectType: values.projectType,
          message: values.message.trim(),
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean }
        | null;

      if (!response.ok || !payload?.ok) {
        setStatus("error");
        return;
      }

      setValues(initialState);
      setErrors({});
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="fullName"
          label="Full Name"
          error={errors.fullName}
          className="sm:col-span-1"
        >
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            maxLength={CONTACT_LIMITS.fullName.max}
            value={values.fullName}
            onChange={(event) => update("fullName", event.target.value)}
            className={fieldClass}
            aria-invalid={Boolean(errors.fullName)}
            disabled={isSending}
          />
        </Field>

        <Field id="email" label="Email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={CONTACT_LIMITS.email.max}
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            className={fieldClass}
            aria-invalid={Boolean(errors.email)}
            disabled={isSending}
          />
        </Field>

        <Field id="company" label="Company" optional>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            maxLength={CONTACT_LIMITS.company.max}
            value={values.company}
            onChange={(event) => update("company", event.target.value)}
            className={fieldClass}
            disabled={isSending}
          />
        </Field>

        <Field id="phone" label="Phone" optional error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={CONTACT_LIMITS.phone.max}
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
            className={fieldClass}
            aria-invalid={Boolean(errors.phone)}
            disabled={isSending}
          />
        </Field>

        <Field
          id="projectType"
          label="Project Type"
          error={errors.projectType}
          className="sm:col-span-2"
        >
          <select
            id="projectType"
            name="projectType"
            value={values.projectType}
            onChange={(event) => update("projectType", event.target.value)}
            className={cn(fieldClass, "appearance-none")}
            aria-invalid={Boolean(errors.projectType)}
            disabled={isSending}
          >
            <option value="">Select a project type</option>
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id="message"
          label="Message"
          error={errors.message}
          className="sm:col-span-2"
        >
          <textarea
            id="message"
            name="message"
            rows={6}
            maxLength={CONTACT_LIMITS.message.max}
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
            className={cn(fieldClass, "resize-y min-h-[9rem]")}
            aria-invalid={Boolean(errors.message)}
            disabled={isSending}
          />
        </Field>
      </div>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={isSending}>
          {isSending ? "Sending..." : "Send Message"}
        </Button>
        {status === "success" ? (
          <p className="text-sm leading-6 text-muted" role="status">
            Thank you! Your message has been sent successfully. We&apos;ll get
            back to you soon.
          </p>
        ) : null}
        {status === "error" ? (
          <p className="text-sm leading-6 text-accent" role="alert">
            Something went wrong. Please try again.
          </p>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  optional,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-foreground">
        {label}
        {optional ? (
          <span className="ml-2 text-xs font-normal text-muted">Optional</span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p className="mt-2 text-xs text-accent" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
