import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
          {eyebrow}
        </p>
      ) : null}
      <Heading className="font-display text-4xl leading-[1.12] text-foreground sm:text-5xl lg:text-[3.5rem]">
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            "mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
