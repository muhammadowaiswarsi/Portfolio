import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const revalidate = 30;

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
