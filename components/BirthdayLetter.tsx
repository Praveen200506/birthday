"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const message = ` Asalu nenu eppudu peddaga cheppanu kani, nijam cheppalante naku nuvvu chala special. Mana navvulu, manam matladukune late-night kaburlu, inka naa life ni intha beautiful ga marchina prathi kshananki thanks. Nuvvu naa life lo undatam nenu cheskunna adrushtam. Happy Birthday!`;

const BirthdayLetter = () => {
    const [displayedText, setDisplayedText] = useState("");
    const [startTyping, setStartTyping] = useState(false);

    useEffect(() => {
        if (startTyping) {
            let i = 0;
            const timer = setInterval(() => {
                if (i < message.length) {
                    setDisplayedText((prev) => prev + message.charAt(i));
                    i++;
                } else {
                    clearInterval(timer);
                }
            }, 50); // Typing speed
            return () => clearInterval(timer);
        }
    }, [startTyping]);

    return (
        <section className="py-12 sm:py-20 px-3.5 sm:px-6 flex items-center justify-center bg-lavender/30 min-h-screen pb-28 sm:pb-32">
            <motion.div
                className="max-w-2xl w-full bg-white/95 backdrop-blur-md p-6 xs:p-8 md:p-12 rounded-2xl sm:rounded-3xl shadow-xl transform sm:rotate-1 border border-white/70 relative overflow-hidden"
                initial={{ opacity: 0, y: 40, rotate: -1 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0.5 }}
                viewport={{ once: true }}
                onViewportEnter={() => setStartTyping(true)}
                transition={{ duration: 0.8 }}
            >
                {/* Washi Tape Accent */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 sm:w-28 h-5 sm:h-6 bg-yellow-200/50 backdrop-blur-xs -rotate-1 border border-yellow-300/30 shadow-xs pointer-events-none" />

                <h3 className="text-2xl sm:text-3xl font-handwriting text-mypink mb-4 sm:mb-6">Dear Sharmila,</h3>
                <p className="text-lg xs:text-xl md:text-2xl font-handwriting leading-relaxed text-stone-700 min-h-[140px] sm:min-h-[180px]">
                    {displayedText}
                    <span className="animate-pulse text-mypink font-bold">|</span>
                </p>
                <div className="mt-6 sm:mt-8 text-right">
                    <p className="text-xl sm:text-2xl font-handwriting text-mypink">from ur frnd ✨</p>
                </div>
            </motion.div>
        </section>
    );
};

export default BirthdayLetter;
