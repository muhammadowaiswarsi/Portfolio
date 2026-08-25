import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import Script from "next/script";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Computing Yard",
    template: "%s · Computing Yard",
  },
  description:
    "Computing Yard is a premium software development agency building refined digital products.",
  icons: {
    icon: "/computing-yard-icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-color-mode="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Script id="cy-color-mode" strategy="beforeInteractive">
          {`try{var m=localStorage.getItem('cy-color-mode');if(m==='light'||m==='dark'){document.documentElement.setAttribute('data-color-mode',m);document.documentElement.style.colorScheme=m}}catch(e){}`}
        </Script>
        {children}
      </body>
    </html>
  );
}
