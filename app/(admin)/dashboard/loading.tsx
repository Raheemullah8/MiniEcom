"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-40 bg-black">
      <motion.div
        className="w-5 h-5 bg-white rounded-full"
        animate={{
          y: [0, -10, 0],  // bounce effect
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="w-5 h-5 bg-white rounded-full mx-2"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2,
        }}
      />
      <motion.div
        className="w-5 h-5 bg-white rounded-full"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4,
        }}
      />
    </div>
  );
}
