import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Le Programme Re-Naissance",
    short_name: "Renaissance",
    start_url: "/aujourdhui",
    display: "standalone",
    background_color: "#05060d",
    theme_color: "#05060d",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
