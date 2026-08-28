"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const FinalScene = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const trigger = () => setShow(true);
        window.addEventListener("final-scene", trigger);
        return () => window.removeEventListener("final-scene", trigger);
    }, []);

    if (!show) return null;

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.div
                className="text-center px-4 sm:px-6 max-w-2xl"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 2 }}
            >
                <p className="text-2xl xs:text-3xl md:text-5xl font-handwriting leading-relaxed">
                    Some people become memories. <br />
                    <span className="text-mypink">
                        You became my favorite story. ❤️
                    </span>
                </p>

                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3, duration: 1 }}
                    onClick={() => {
                        setShow(false);
                        window.location.href = "/";
                    }}
                    className="mt-8 sm:mt-12 px-6 sm:px-8 py-2.5 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-sans text-base sm:text-lg hover:bg-white/20 transition-all active:scale-95"
                >
                    Back to Home 🏠
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default FinalScene;
