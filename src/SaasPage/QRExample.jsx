import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function QRExample() {
  const AnimatedGradientBackground = () => {
    return (
      <motion.div
        className="absolute inset-0 blur-xl h-[580px]"
        style={{
          opacity: "75%",
          background:
            "linear-gradient(0.6deg, rgba(251, 177, 56,0) 00.79%, rgba(219, 148, 31,0.2) 50.92%, rgba(219, 167, 81,0) 100.35%)",
        }}
        animate={{
          rotate: [-5, 5, -5],
          backgroundPosition: ["20% 50%", "40% 50%", "20% 50%"],
        }} // Rotate back and forth between -30 and 30 degrees
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }} // Set animation duration and repeat
      ></motion.div>
    );
  };
  return (
    <div className="relative flex flex-row items-center gap-10 justify-center my-12 mb-48 p-6">
      <h2 className="text-gray-800 text-3xl font-semibold sm:text-4xl w-[28rem]">
        Scan this QR code and indulge in a sneak peek of an example menu! 🎉
      </h2>
      <div className="w-48 h-48 hidden sm:block rotate-[45deg] absolute mt-56 mr-32">
        <svg
          fill="#000000"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 352.2 352.2"
          xml:space="preserve"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <g>
              <path d="M348.232,100.282c-13.464-32.436-35.496-60.588-45.9-94.86c-1.836-5.508-11.016-7.956-13.464-1.836 c-14.688,34.272-36.72,65.484-47.124,101.592c-1.836,6.732,7.344,13.464,12.24,7.344c7.344-9.18,15.912-16.524,24.479-25.092 c-1.224,52.632,0,105.264-9.18,157.284c-4.896,28.152-11.628,59.977-31.824,81.396c-24.479,25.704-55.08,2.448-68.544-21.42 c-11.628-20.809-31.823-110.772-72.215-79.561c-23.868,18.36-29.988,43.452-37.332,70.992c-1.836,7.956-4.896,15.3-8.568,22.032 c-14.076,26.316-32.436-16.524-33.048-26.928c-1.224-20.809,4.896-42.229,9.792-62.424c1.836-6.12-7.344-8.568-9.792-2.448 c-11.016,28.764-26.316,77.724,0,102.815c23.256,21.42,42.84,7.345,52.02-17.748c6.12-16.523,29.376-108.323,56.304-65.483 c17.748,28.151,22.644,61.812,44.064,88.128c15.3,18.359,42.84,22.644,64.26,13.464c25.704-11.628,36.72-45.9,43.452-70.38 c16.523-61.2,16.523-127.296,14.688-190.332c14.688,9.792,31.212,18.972,47.736,25.092 C347.008,113.746,350.681,105.178,348.232,100.282z M268.672,78.25c7.956-17.136,17.748-34.272,26.316-51.408 c9.18,21.42,20.808,40.392,31.824,61.2c-12.853-7.956-25.092-17.136-39.168-18.972c-3.061-0.612-5.509,1.224-6.732,3.672 C276.628,73.354,272.345,75.19,268.672,78.25z"></path>{" "}
            </g>
          </g>
        </svg>
      </div>
      <img src="qr.png" className="w-32 h-32 sm:w-64 sm:h-64" />
      <AnimatedGradientBackground />
    </div>
  );
}

export default QRExample;
