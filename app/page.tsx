import HeroSection from "@/components/HeroSection";
import { heroImages } from "@/data/heroImages";
import { getAssetUrl } from "@/lib/assets";

export default function Home() {
  const images = heroImages.map(getAssetUrl);

  return (
    <main className="min-h-screen bg-warm-cream">
      <HeroSection images={images} />
    </main>
  );
}
