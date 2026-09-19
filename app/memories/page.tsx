import MemoryGallery from "@/components/MemoryGallery";
import { memoryImages } from "@/data/memoryImages";
import { getAssetUrl } from "@/lib/assets";

export default function MemoriesPage() {
    const photos = memoryImages.map(getAssetUrl);

    return (
        <main className="min-h-screen bg-warm-cream w-full max-w-full overflow-x-hidden">
            <MemoryGallery images={photos} />
        </main>
    );
}
