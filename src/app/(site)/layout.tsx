import { MixpanelPageTracker } from "@/components/analytics/MixpanelPageTracker";
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { ColorModeProvider } from "@/components/theme/ColorModeProvider";

export const revalidate = 30;

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ColorModeProvider>
      <MixpanelPageTracker />
      <SiteJsonLd />
      <div className="flex min-h-full flex-1 flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatbotWidget />
      </div>
    </ColorModeProvider>
  );
}
