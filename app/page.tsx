import HeroSection from "@/components/HeroSection";
import { heroImages } from "@/data/heroImages";
import { getAssetUrl } from "@/lib/assets";

export default function Home() {
  return (
    <main className="min-h-screen bg-warm-cream">
      <HeroSection images={heroImages.map(getAssetUrl)} />
    </main>
  );
}
