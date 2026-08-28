"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { X, Shuffle } from "lucide-react";
import memoryCaptions from "@/data/memoryCaptions";

interface MemoryGalleryProps {
    images: string[];
}

const MemoryGallery = ({ images }: MemoryGalleryProps) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [rotations, setRotations] = useState<number[]>([]);
    const [flash, setFlash] = useState(false);
    const [shuffled, setShuffled] = useState<string[]>(images);

    useEffect(() => {
        const randomRotations = images.map(() => Math.random() * 10 - 5);
        setRotations(randomRotations);
    }, [images]);

    const shuffleImages = () => {
        const shuffledArr = [...shuffled].sort(() => 0.5 - Math.random());
        setShuffled(shuffledArr);
    };

    const openImage = (src: string) => {
        setFlash(true);
        setTimeout(() => setFlash(false), 150);
        setSelectedImage(src);
        window.dispatchEvent(new Event("memory-open"));
    };

    const closeImage = () => {
        setSelectedImage(null);
        window.dispatchEvent(new Event("memory-close"));
    };

    return (
        <section className="pt-16 sm:pt-24 pb-28 sm:pb-32 px-3 sm:px-6 bg-warm-cream/30 min-h-screen overflow-x-hidden">
            {flash && (
                <div className="fixed inset-0 bg-white z-50 pointer-events-none animate-ping" />
            )}

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mb-8 sm:mb-12 text-center"
            >
                <h2 className="text-3xl xs:text-4xl sm:text-5xl font-handwriting text-stone-800 mb-2 sm:mb-4">
                    Our Little Universe 📸
                </h2>
                <p className="text-xs sm:text-base md:text-lg font-sans text-stone-500 mb-4 sm:mb-6">
                    Click on a memory to bring it closer...
                </p>

                <motion.button
                    onClick={shuffleImages}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white/90 backdrop-blur-md rounded-full shadow-md hover:shadow-lg text-mypink font-handwriting text-base sm:text-lg border border-white/60 transition-all"
                >
                    <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" /> Shuffle Memories
                </motion.button>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-3 xs:gap-4 sm:gap-8 max-w-7xl mx-auto pb-16">
                {shuffled.map((src, index) => (
                    <motion.div
                        key={src}
                        layoutId={`photo-${src}`}
                        className="relative group cursor-pointer z-0 hover:z-20 w-[calc(50%-0.45rem)] xs:w-[165px] sm:w-[240px] md:w-[280px]"
                        drag
                        dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
                        dragElastic={0.1}
                        whileDrag={{ scale: 1.05, zIndex: 100 }}
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{
                            opacity: 1,
                            scale: 1,
                            rotate: rotations[index] || 0,
                        }}
                        viewport={{ once: true }}
                        whileHover={{
                            scale: 1.06,
                            rotate: 0,
                            transition: { type: "spring", stiffness: 300, damping: 20 },
                        }}
                        onClick={() => openImage(src)}
                    >
                        <div className="bg-white p-2 xs:p-2.5 sm:p-3 pb-7 xs:pb-8 sm:pb-12 shadow-md group-hover:shadow-xl transition-shadow duration-300 w-full rounded-xs sm:rounded-sm">
                            <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100 rounded-[2px]">
                                <Image
                                    src={src}
                                    alt="Memory"
                                    fill
                                    sizes="(max-width: 640px) 165px, (max-width: 768px) 240px, 280px"
                                    className="object-cover"
                                    loading="lazy"
                                />
                            </div>

                            <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 text-center font-handwriting text-stone-400 opacity-70 text-xs xs:text-sm sm:text-xl">
                                moment #{index + 1}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 xs:p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeImage}
                    >
                        <motion.div
                            className="relative max-w-4xl w-full p-4 sm:p-6 bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl"
                            layoutId={`photo-${selectedImage}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={closeImage}
                                aria-label="Close image preview"
                                className="absolute top-3 right-3 sm:-top-10 sm:right-0 bg-stone-900/60 sm:bg-transparent text-white hover:text-mypink rounded-full p-1.5 sm:p-0 transition-colors z-10"
                            >
                                <X size={24} className="sm:w-8 sm:h-8" />
                            </button>

                            <div className="relative max-h-[60vh] sm:max-h-[70vh] flex items-center justify-center overflow-hidden rounded-xl bg-stone-50">
                                <img
                                    src={selectedImage}
                                    alt="Expanded memory"
                                    className="max-w-full max-h-[60vh] sm:max-h-[70vh] object-contain rounded-lg sm:rounded-xl mx-auto"
                                />
                            </div>

                            <p className="mt-4 sm:mt-6 text-center font-handwriting text-lg sm:text-2xl text-stone-700 leading-snug px-2">
                                {memoryCaptions[
                                    selectedImage.split("/").pop() || ""
                                ] || "A moment I’ll always cherish ❤️"}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default MemoryGallery;
