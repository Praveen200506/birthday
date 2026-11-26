import HeroSection from "@/components/HeroSection";
import { heroImages } from "@/data/heroImages";

export default function Home() {
  const localHeroImages = heroImages.map((image) => "/" + image.replace(/^\/+/, ""));

  return (
    <main className="min-h-screen bg-transparent">
      <HeroSection images={localHeroImages} />
    </main>
  );
}
