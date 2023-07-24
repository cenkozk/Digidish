import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

const ScrollUpButton = () => {
  const [showButton, setShowButton] = useState(false);
  const controls = useAnimation();

  const handleScroll = () => {
    const scrollY = window.scrollY;
    setShowButton(scrollY > 80);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    controls.start({ opacity: showButton ? 1 : 0, y: showButton ? 0 : 50 });
  }, [showButton, controls]);

  return (
    <motion.div
      className="fixed bottom-8 right-8 bg-white p-5 rounded-full shadow-gray-400 shadow-lg"
      onClick={handleScrollUp}
      animate={controls}
      initial={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <svg
        viewBox="0 0 1024 1024"
        fill="currentColor"
        height="1.5em"
        width="1.5em"
      >
        <path d="M868 545.5L536.1 163a31.96 31.96 0 00-48.3 0L156 545.5a7.97 7.97 0 006 13.2h81c4.6 0 9-2 12.1-5.5L474 300.9V864c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V300.9l218.9 252.3c3 3.5 7.4 5.5 12.1 5.5h81c6.8 0 10.5-8 6-13.2z" />
      </svg>
    </motion.div>
  );
};

export default ScrollUpButton;
