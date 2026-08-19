import { expandTechnologies, getTechMeta } from "@/lib/technologies";
import { cn } from "@/lib/cn";

type TechChipProps = {
  name: string;
  className?: string;
};

export function TechChip({ name, className }: TechChipProps) {
  const { label, icon: Icon } = getTechMeta(name);

  return (
    <span
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-xl border border-border bg-[#1A202C] px-3.5 py-2.5 text-sm leading-none text-white/90 transition-[border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-white",
        className,
      )}
    >
      <Icon
        className="size-4 text-primary transition-colors duration-200 group-hover:text-accent"
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

type TechChipListProps = {
  items: string[];
  className?: string;
};

export function TechChipList({ items, className }: TechChipListProps) {
  const technologies = expandTechnologies(items);

  if (technologies.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap gap-3", className)}>
      {technologies.map((tech) => (
        <li key={tech}>
          <TechChip name={tech} />
        </li>
      ))}
    </ul>
  );
}
