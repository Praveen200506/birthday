import type { Metadata } from "next";
import { Dancing_Script, Nunito } from "next/font/google";
import Navbar from "@/components/Navbar";
import AudioPlayer from "@/components/AudioPlayer";
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

import FloatingParticles from "@/components/FloatingParticles";
import CursorTrail from "@/components/CursorTrail";
import FinalScene from "@/components/FinalScene";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dancingScript.variable} ${nunito.variable} antialiased font-sans bg-warm-cream relative min-h-screen overflow-x-hidden`}
      >
        <FloatingParticles />
        <CursorTrail />
        <FinalScene />
        <AudioPlayer />
        <main className="relative z-10">
          {children}
        </main>
        <Navbar />
      </body>
    </html>
  );
}
