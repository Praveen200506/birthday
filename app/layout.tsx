import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Nunito_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import AudioPlayer from "@/components/AudioPlayer";
import GlobalLockWrapper from "@/components/GlobalLockWrapper";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  display: "swap",
});

const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: birthdayConfig.site.title,
  description: birthdayConfig.site.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: birthdayConfig.site.themeColor,
};

import FinalScene from "@/components/FinalScene";
import VisitorTracker from "@/components/VisitorTracker";
import { birthdayConfig } from "@/data/birthdayConfig";
import RoamingMascot from "@/components/RoamingMascot";
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
        className={`${bodoni.variable} ${nunito.variable} min-h-[100dvh] w-full max-w-full overflow-x-hidden font-sans antialiased`}
      >
        <VisitorTracker />
        <Analytics />
        <SpeedInsights />

        <GlobalLockWrapper>
          <FinalScene />
          <AudioPlayer />
          <RoamingMascot />
          <main className="relative min-h-[100dvh] w-full">
            {children}
          </main>
          <Navbar />
        </GlobalLockWrapper>
      </body>
    </html>
  );
}
