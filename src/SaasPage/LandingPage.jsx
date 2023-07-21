import { useCallback, useEffect, useRef, useState } from "react";
import Hero from "./Hero";
import Features from "./Features";
import Pricing from "./Pricing";

function Login() {
  return (
    <div>
      <Hero />
      <div id="features">
        <Features />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
    </div>
  );
}

export default Login;
