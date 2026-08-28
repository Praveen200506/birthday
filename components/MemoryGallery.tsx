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
        <section className="py-24 px-4 bg-warm-cream/30 min-h-screen overflow-hidden">
            {flash && (
                <div className="fixed inset-0 bg-white z-50 pointer-events-none animate-ping" />
            )}

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mb-12 text-center"
            >
                <h2 className="text-5xl font-handwriting text-foreground mb-4">
                    Our Little Universe 📸
                </h2>
                <p className="text-lg font-sans text-gray-500 mb-6">
                    Click on a memory to bring it closer...
                </p>

                <motion.button
                    onClick={shuffleImages}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg text-mypink font-handwriting"
                >
                    <Shuffle className="w-5 h-5" /> Shuffle Memories
                </motion.button>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto pb-20">
                {shuffled.map((src, index) => (
                    <motion.div
                        key={src}
                        layoutId={`photo-${src}`}
                        className="relative group cursor-pointer z-0 hover:z-20"
                        drag
                        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                        dragElastic={0.1}
                        whileDrag={{ scale: 1.1, zIndex: 100 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{
                            opacity: 1,
                            scale: 1,
                            rotate: rotations[index] || 0,
                        }}
                        viewport={{ once: true }}
                        whileHover={{
                            scale: 1.1,
                            rotate: 0,
                            transition: { type: "spring", stiffness: 300, damping: 20 },
                        }}
                        onClick={() => openImage(src)}
                    >
                        <div className="bg-white p-3 pb-12 shadow-md group-hover:shadow-xl transition-shadow duration-300 w-[240px] sm:w-[280px]">
                            <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
                                <Image
                                    src={src}
                                    alt="Memory"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="absolute bottom-4 left-0 right-0 text-center font-handwriting text-gray-400 opacity-60 text-xl">
                                moment #{index + 1}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeImage}
                    >
                        <motion.div
                            className="relative max-w-5xl w-full p-4 bg-white rounded-2xl shadow-2xl"
                            layoutId={`photo-${selectedImage}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={closeImage}
                                className="absolute -top-10 right-0 text-white hover:text-mypink"
                            >
                                <X size={32} />
                            </button>

                            <img
                                src={selectedImage}
                                alt="Expanded memory"
                                className="max-w-full max-h-[70vh] mx-auto rounded-lg"
                            />

                            <p className="mt-6 text-center font-handwriting text-2xl text-gray-600">
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
