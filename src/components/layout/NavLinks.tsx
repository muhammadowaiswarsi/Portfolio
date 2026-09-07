import { cn } from "@/lib/cn";
import { navigation } from "@/lib/navigation";

export function NavLinks({
  className,
  itemClassName,
}: {
  className?: string;
  itemClassName?: string;
}) {
  return (
    <nav className={className} aria-label="Primary">
      {navigation.map((item) => (
        <a
          key={item.href}
          href={item.href}
          data-nav={item.href}
          className={cn(
            "group relative px-3 py-2 text-sm text-foreground/70 transition-colors duration-200 hover:text-accent data-[active]:text-foreground",
            itemClassName,
          )}
        >
          {item.label}
          <span className="absolute inset-x-3 -bottom-px hidden h-0.5 bg-accent group-data-[active]:block" />
        </a>
      ))}
    </nav>
  );
}
