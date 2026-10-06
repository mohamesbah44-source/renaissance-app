import type { Metadata, Viewport } from "next";
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

// Charte Le Programme Re-Naissance™ (noir / or / ivoire), utilisée dans toute l'application
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

const TITLE = "Le Programme Re-Naissance™ — Plus qu'un accompagnement, une rencontre avec toi-même";
const DESCRIPTION =
  "Le Programme Re-Naissance™ est un accompagnement transformationnel de 8 semaines pour les entrepreneurs qui veulent retrouver sécurité intérieure, clarté et vitalité.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: "/favicon-32.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/logo-re-naissance.png", width: 1254, height: 1254, alt: "Le Programme Re-Naissance™" }],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/logo-re-naissance.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0c0b0a",
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
      <body className="min-h-full pt-[env(safe-area-inset-top)]">
        <CosmicBackground />
        {children}
      </body>
    </html>
  );
}
