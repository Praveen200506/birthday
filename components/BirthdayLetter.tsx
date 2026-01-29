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
        <section className="py-20 px-4 flex items-center justify-center bg-lavender/30">
            <motion.div
                className="max-w-2xl w-full bg-white p-8 md:p-12 rounded-3xl shadow-xl transform rotate-1 border border-white/50"
                initial={{ opacity: 0, y: 50, rotate: -2 }}
                whileInView={{ opacity: 1, y: 0, rotate: 1 }}
                viewport={{ once: true }}
                onViewportEnter={() => setStartTyping(true)}
                transition={{ duration: 0.8 }}
            >
                <h3 className="text-3xl font-handwriting text-mypink mb-6">Dear Sharmila,</h3>
                <p className="text-xl md:text-2xl font-handwriting leading-relaxed text-gray-700 min-h-[200px]">
                    {displayedText}
                    <span className="animate-pulse">|</span>
                </p>
                <div className="mt-8 text-right">
                    <p className="text-2xl font-handwriting text-mypink">from ur frnd  </p>
                </div>
            </motion.div>
        </section>
    );
};

export default BirthdayLetter;
