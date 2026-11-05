import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Agenko Starter",
    short_name: "Agenko",
    description:
      "A Next.js AI chat starter with receipts for every action and a human gate before irreversible ones.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0b0b0f",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
