import type { Metadata, Viewport } from "next";
import { Dancing_Script, Nunito } from "next/font/google";
import Navbar from "@/components/Navbar";
import AudioPlayer from "@/components/AudioPlayer";
import GlobalLockWrapper from "@/components/GlobalLockWrapper";
import "./globals.css";

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Happy Birthday Sharmila! 🎉",
  description: "A little digital gift for you.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FFF9F0",
};

import FloatingParticles from "@/components/FloatingParticles";
import CursorTrail from "@/components/CursorTrail";
import FinalScene from "@/components/FinalScene";
import VisitorTracker from "@/components/VisitorTracker";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full overflow-x-hidden">
      <body
        className={`${dancingScript.variable} ${nunito.variable} antialiased font-sans bg-warm-cream relative min-h-[100dvh] w-full max-w-full overflow-x-hidden`}
      >
        <VisitorTracker />
        <Analytics />
        <SpeedInsights />

        <GlobalLockWrapper>
          <FloatingParticles />
          <CursorTrail />
          <FinalScene />
          <AudioPlayer />
          <main className="relative z-10 w-full min-h-[100dvh]">
            {children}
          </main>
          <Navbar />
        </GlobalLockWrapper>
      </body>
    </html>
  );
}
