import HeroSection from "@/components/HeroSection";
import fs from "fs";
import path from "path";

const getHeroImages = () => {
  const photoDir = path.join(process.cwd(), "public", "heroPagePhotos");
  try {
    if (!fs.existsSync(photoDir)) return [];
    const files = fs.readdirSync(photoDir);
    // Look for any image files
    return files
      .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map((file) => `/heroPagePhotos/${file}`);
  } catch (error) {
    console.error("Error reading hero photos directory:", error);
    return [];
  }
};

export default function Home() {
  const heroImages = getHeroImages();

  return (
    <main className="min-h-screen bg-warm-cream">
      <HeroSection images={heroImages} />
    </main>
  );
}
