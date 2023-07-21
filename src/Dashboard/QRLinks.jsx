import QRCodeStyling from "qr-code-styling";
import { useEffect, useRef, useState } from "react";

function QRLinks(props) {
  console.log(props.restaurantId);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);

  const qrCode = new QRCodeStyling({
    width: 2048,
    height: 2048,
    data: `localhost:5000/${props.restaurantId}`,
    margin: 0,
    qrOptions: { typeNumber: "0", mode: "Byte", errorCorrectionLevel: "Q" },
    imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 6 },
    dotsOptions: { type: "square", color: "#000000" },
    backgroundOptions: { color: "#ffffff", gradient: null },
    image:
      "https://res.cloudinary.com/dewy2csvc/image/upload/v1689627578/app_logo.png",
    dotsOptionsHelper: {
      colorType: { single: true, gradient: false },
      gradient: {
        linear: true,
        radial: false,
        color1: "#6a1a4c",
        color2: "#6a1a4c",
        rotation: "0",
      },
    },
    cornersSquareOptions: {
      type: "square",
      color: "#000000",
      gradient: null,
    },
    cornersSquareOptionsHelper: {
      colorType: { single: true, gradient: false },
      gradient: {
        linear: true,
        radial: false,
        color1: "#000000",
        color2: "#000000",
        rotation: "0",
      },
    },
    cornersDotOptions: { type: "dot", color: "#000000" },
    cornersDotOptionsHelper: {
      colorType: { single: true, gradient: false },
      gradient: {
        linear: true,
        radial: false,
        color1: "#000000",
        color2: "#000000",
        rotation: "0",
      },
    },
    backgroundOptionsHelper: {
      colorType: { single: true, gradient: false },
      gradient: {
        linear: true,
        radial: false,
        color1: "#ffffff",
        color2: "#ffffff",
        rotation: "0",
      },
    },
  });

  useEffect(() => {
    // Get the raw data of the QR code as Uint8Array
    qrCode.getRawData("png").then((rawData) => {
      // Convert Uint8Array to data URL using FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log(reader.result);
        setQrCodeDataUrl(reader.result);
      };
      reader.readAsDataURL(new Blob([rawData], { type: "image/png" }));
    });
  }, [props.restaurantId]);

  const handleDownloadClick = () => {
    qrCode
      .download({
        dataUri: true, // Set this to true to get the data URL
      })
      .catch((error) => {
        console.error("Error generating Qr code:", error);
      });
  };
  return (
    <div>
      <div className=" flex flex-col justify-center items-center scale-90 pb-6">
        <div class="bg-white border border-gray-200  rounded-lg p-8  scale-90">
          <h1 class="text-gray-900  text-3xl md:text-5xl font-extrabold mb-2">
            QR Code
          </h1>
          <p class="text-lg font-normal text-gray-500 mb-6">
            You can download the generated QR Code by clicking the download
            button.
          </p>
          <img src={qrCodeDataUrl} className="w-36 h-36" alt="QR Code" />
          <button
            onClick={() => {
              handleDownloadClick();
            }}
            class="inline-flex mt-5 justify-center items-center py-2.5 px-5 text-base font-medium text-center text-white rounded-lg bg-green-400 duration-150 hover:bg-green-300 "
          >
            Download
            <svg
              fill="none"
              viewBox="0 0 24 24"
              height="1.2em"
              width="1.2em"
              className="ml-1"
            >
              <path
                fill="currentColor"
                d="M11 5a1 1 0 112 0v7.158l3.243-3.243 1.414 1.414L12 15.986 6.343 10.33l1.414-1.414L11 12.158V5z"
              />
              <path
                fill="currentColor"
                d="M4 14h2v4h12v-4h2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className=" flex flex-col justify-center items-center scale-90 pb-6">
        <div class="bg-white border border-gray-200  rounded-lg p-8  scale-90">
          <h1 class="text-gray-900  text-3xl md:text-5xl font-extrabold mb-2">
            Menu Link
          </h1>
          <p class="text-lg font-normal text-gray-500 mb-6">
            Quickly and easily share your menu by copying the link provided
            below.
          </p>
          <a
            href={`localhost:5000/${props.restaurantId}`}
            className=" text-orange-400 text-2xl"
          >{`localhost:5000/${props.restaurantId}`}</a>
        </div>
      </div>
    </div>
  );
}

export default QRLinks;
