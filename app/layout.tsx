import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Poppins } from "next/font/google";
import "./globals.css";

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const display = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE_URL = "https://starter.agenko.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Agenko Starter",
  title: {
    default: "Agenko Starter — a chat you can audit",
    template: "%s · Agenko Starter",
  },
  description:
    "A Next.js + AI SDK chat starter with a deterministic trust boundary: a receipt for every action, a human gate before every irreversible one.",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Agenko Starter",
    title: "Agenko Starter — a chat you can audit",
    description:
      "Streaming tool loop, human approval gates and a tamper-evident receipt for every action.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agenko Starter — a chat you can audit",
    description:
      "Streaming tool loop, human approval gates and a tamper-evident receipt for every action.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0f",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
    >
      <body>
        <a
          href="#chat"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-ink focus:bg-paper focus:px-3 focus:py-2 focus:font-mono focus:text-xs"
        >
          Skip to chat
        </a>
        {children}
      </body>
    </html>
  );
}
