export const serviceIllustrations: Record<string, string> = {
  "web-app-development": "/services/web-app.webp",
  "mobile-app-development": "/services/mobile-app.webp",
  "chatbot-development": "/services/chatbot.webp",
  "ui-ux-revamp": "/services/ui-ux.webp",
  seo: "/services/seo.webp",
  "ai-solutions": "/services/ai.webp",
  "staff-augmentation": "/services/staff-augmentation.webp",
};

const serviceIllustrationAlts: Record<string, string> = {
  "web-app-development":
    "Browser window surrounded by code, settings, video, and checklist panels",
  "mobile-app-development":
    "Phone screen with a profile, calendar, message, and progress chart",
  "chatbot-development":
    "Robot beside a chat window, message bubbles, and a checked task list",
  "ui-ux-revamp":
    "Phone interface with layout controls, charts, settings, and an image card",
  seo: "Search bar with a ranking chart, keyword label, and upward traffic graph",
  "ai-solutions":
    "Robot standing next to a monitor labeled AI and machine learning",
  "staff-augmentation":
    "Team roster on a card with a plus button for adding a person",
};

export function getServiceIllustration(slug: string | null | undefined) {
  if (!slug) return null;
  return serviceIllustrations[slug] ?? null;
}

export function getServiceIllustrationAlt(slug: string | null | undefined) {
  if (!slug) return null;
  return serviceIllustrationAlts[slug] ?? null;
}
