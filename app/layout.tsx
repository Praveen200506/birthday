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
        {/* Global Noise Texture */}
        <div
          className="fixed inset-0 opacity-40 pointer-events-none z-0 mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          }}
        />

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
