import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  Montserrat,
  Open_Sans,
  Roboto,
  Rubik,
  Syne,
} from "next/font/google";
import Script from "next/script";

import { getSiteUrl, siteDescription, siteName, siteOgImage } from "@/lib/site";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "optional",
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "optional",
  preload: false,
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600"],
  display: "optional",
  preload: false,
});

/** Case-study project fonts — loaded on <html> so client pages never import next/font. */
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-open-sans",
  display: "optional",
  preload: false,
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "optional",
  preload: false,
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "optional",
  preload: false,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "optional",
  preload: false,
});

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rubik",
  display: "optional",
  preload: false,
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  keywords: [
    "software development",
    "web applications",
    "mobile apps",
    "UI/UX design",
    "AI solutions",
    "Computing Yard",
  ],
  icons: {
    icon: "/favicon-32.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName,
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    images: [siteOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: [siteOgImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const fontVariables = [
  geistSans.variable,
  geistMono.variable,
  syne.variable,
  openSans.variable,
  roboto.variable,
  montserrat.variable,
  inter.variable,
  rubik.variable,
].join(" ");

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-color-mode="dark"
      suppressHydrationWarning
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Script id="cy-color-mode" strategy="beforeInteractive">
          {`try{var m=localStorage.getItem('cy-color-mode');if(m==='light'||m==='dark'){document.documentElement.setAttribute('data-color-mode',m);document.documentElement.style.colorScheme=m}}catch(e){}`}
        </Script>
        {children}
      </body>
    </html>
  );
}
