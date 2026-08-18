import { cn } from "@/lib/cn";

type ContainerProps = {
  as?: "div" | "section" | "header" | "footer" | "nav" | "main";
  className?: string;
  children: React.ReactNode;
};

export function Container({
  as: Component = "div",
  className,
  children,
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10",
        className,
      )}
    >
      {children}
    </Component>
  );
}
