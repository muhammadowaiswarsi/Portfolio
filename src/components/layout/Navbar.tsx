import { Logo } from "@/components/layout/Logo";
import { MobileNav } from "@/components/layout/MobileNav";
import { NavLinks } from "@/components/layout/NavLinks";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function Navbar() {
  return (
    <header className="relative sticky top-0 z-50 border-b border-border bg-background">
      <Container>
        <div className="flex h-[5.5rem] items-center justify-between gap-4 lg:h-24">
          <Logo />
          <NavLinks className="hidden items-center gap-1 lg:flex" />
          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <Button href="/contact" prefetch={false} size="sm">
              Let&apos;s Talk
              <ArrowIcon />
            </Button>
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <MobileNav />
          </div>
        </div>
      </Container>
      <script
        dangerouslySetInnerHTML={{
          __html: `(()=>{var p=location.pathname;document.querySelectorAll("[data-nav]").forEach(function(a){var h=a.getAttribute("data-nav");if(!h)return;if(h==="/"?p==="/":p===h||p.indexOf(h+"/")===0)a.setAttribute("data-active","")})})()`,
        }}
      />
    </header>
  );
}
