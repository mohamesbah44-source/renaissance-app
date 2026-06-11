import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Fraunces, Montserrat, Outfit } from "next/font/google";
import { CosmicBackground } from "@/components/layout/CosmicBackground";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Charte dédiée au Radar Renaissance™ (scopée à /radar/*)
const cinzel = Cinzel({
  variable: "--font-rr-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-rr-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-rr-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Renaissance — Plus qu'un accompagnement, une rencontre avec vous-même",
  description:
    "Renaissance est un accompagnement transformationnel de 8 semaines pour les entrepreneurs qui veulent retrouver sécurité intérieure, clarté et vitalité.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${outfit.variable} ${cinzel.variable} ${cormorantGaramond.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <CosmicBackground />
        {children}
      </body>
    </html>
  );
}
