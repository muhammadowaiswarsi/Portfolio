export const serviceIllustrations: Record<string, string> = {
  "web-app-development": "/services/web-app.webp",
  "mobile-app-development": "/services/mobile-app.webp",
  "chatbot-development": "/services/chatbot.webp",
  "ui-ux-revamp": "/services/ui-ux.webp",
  seo: "/services/seo.webp",
  "ai-solutions": "/services/ai.webp",
};

export function getServiceIllustration(slug: string | null | undefined) {
  if (!slug) return null;
  return serviceIllustrations[slug] ?? null;
}
