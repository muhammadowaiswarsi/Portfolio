import { Inter, Montserrat, Open_Sans, Roboto } from "next/font/google";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const catalog: Record<string, { className: string; cssVar: string }> = {
  "Open Sans": { className: openSans.variable, cssVar: "var(--font-open-sans)" },
  Roboto: { className: roboto.variable, cssVar: "var(--font-roboto)" },
  Montserrat: { className: montserrat.variable, cssVar: "var(--font-montserrat)" },
  Inter: { className: inter.variable, cssVar: "var(--font-inter)" },
  Syne: { className: "", cssVar: "var(--font-syne)" },
};

export function getProjectFontMeta(family?: string | null) {
  return (
    catalog[family ?? ""] ?? {
      className: "",
      cssVar: "var(--font-geist-sans)",
    }
  );
}

export function getProjectFontWeight(weight?: string | null) {
  if (weight === "400" || weight === "500" || weight === "600" || weight === "700") {
    return weight;
  }

  return "600";
}
