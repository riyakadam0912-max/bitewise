import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "BiteWise — Eat Smart. Live Better.", template: "%s — BiteWise" },
  description: "Personalized nutrition, thoughtful food tracking, and practical meal plans built around your life.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
