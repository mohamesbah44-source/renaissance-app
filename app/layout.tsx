import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
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
      className={`${fraunces.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <CosmicBackground />
        {children}
      </body>
    </html>
  );
}
