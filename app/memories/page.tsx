import MemoryGallery from "@/components/MemoryGallery";
import fs from "fs";
import path from "path";

const getPhotos = () => {
    const photoDir = path.join(process.cwd(), "public", "photos");
    try {
        if (!fs.existsSync(photoDir)) return [];
        const files = fs.readdirSync(photoDir);
        return files
            .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
            .map((file) => `/photos/${file}`);
    } catch (error) {
        console.error("Error reading photos directory:", error);
        return [];
    }
};

export default function MemoriesPage() {
    const photos = getPhotos();
    return (
        <main className="pt-20 min-h-screen bg-warm-cream">
            <MemoryGallery images={photos} />
        </main>
    );
}
