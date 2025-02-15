import React from "react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  headline?: string;
}

const HeroSection = ({
  headline = "Let's turn your ideas into exceptional software",
}: HeroSectionProps) => {
  return (
    <div className="w-full min-h-[200px] flex items-center justify-center bg-[#0D0D1F] px-4 py-12">
      <motion.h1
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-center max-w-[1200px] bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {headline}
      </motion.h1>
    </div>
  );
};

export default HeroSection;
