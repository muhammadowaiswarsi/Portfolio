import Link from "next/link";

import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/ui/Container";
import { navigation } from "@/lib/navigation";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <Container className="flex flex-col gap-8 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-sm text-sm leading-6 text-muted">
            Premium software development studio.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors duration-200 hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <div className="border-t border-border">
        <Container className="py-5 text-xs text-muted">
          <p>© {new Date().getFullYear()} Computing Yard. All rights reserved.</p>
        </Container>
      </div>
    </footer>
  );
}
