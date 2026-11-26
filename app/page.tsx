import HeroSection from "@/components/HeroSection";
import { heroImages } from "@/data/heroImages";

export default function Home() {
  // These photographs are committed in /public, so the homepage does not
  // depend on a Supabase Storage upload or public-bucket configuration.
  const localHeroImages = heroImages.map((image) => "/" + image.replace(/^\/+/, ""));

  return (
    <main className="min-h-screen bg-warm-cream">
      <HeroSection images={localHeroImages} />
    </main>
  );
}
