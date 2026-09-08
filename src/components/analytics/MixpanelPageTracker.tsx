"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { initMixpanel, trackPageView } from "@/lib/mixpanel";

export function MixpanelPageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!initMixpanel()) return;
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
