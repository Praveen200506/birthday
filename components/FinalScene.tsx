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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink text-mist"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="max-w-2xl px-4 text-center sm:px-6"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <p className="font-display text-3xl leading-relaxed sm:text-5xl">
          Some people become memories.
          <br />
          <span className="text-rose">You became my favorite story.</span>
        </p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          onClick={() => {
            setShow(false);
            window.location.href = "/";
          }}
          className="mt-10 rounded-full border border-mist/35 px-6 py-3 text-base font-semibold text-mist transition-colors hover:bg-mist/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mist"
        >
          Back to the homepage
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default FinalScene;
