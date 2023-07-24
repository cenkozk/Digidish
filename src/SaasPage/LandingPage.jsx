import { useCallback, useEffect, useRef, useState } from "react";
import Hero from "./Hero";
import Features from "./Features";
import Pricing from "./Pricing";
import ScrollUpButton from "../Menu/ScrollUpButton";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const ScrollAnimatedComponent = ({ children }) => {
  const [ref, inView] = useInView({
    triggerOnce: true, // Only trigger the animation once
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
      transition={{ duration: 2 }} // Adjust animation duration as needed
    >
      {children}
    </motion.div>
  );
};

function LandingPage() {
  return (
    <div>
      <Hero />
      <div id="features">
        <ScrollAnimatedComponent>
          <Features />
        </ScrollAnimatedComponent>
      </div>
      <div id="pricing">
        <ScrollAnimatedComponent>
          <Pricing />
        </ScrollAnimatedComponent>
      </div>
      <ScrollUpButton />
    </div>
  );
}

export default LandingPage;
