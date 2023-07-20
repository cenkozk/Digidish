import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Pricing() {
  const navigate = useNavigate();
  const plans = [
    {
      name: "Free Plan",
      desc: "Enjoy the essential features you need for your digital menu.",
      price: 0,
      isMostPop: true,
      features: [
        "Simple and intuitive interface",
        "Create and customize your menu effortlessly",
        "Responsive design for seamless mobile experience",
        "QR code and URL Link generation for easy access to your menu",
        "Unlimited menu items and categories",
        "Easy sharing options with customers",
        "24/7 customer support",
      ],
    },
    {
      name: "Paid Plan",
      desc: "Get access to our premium features and take your digital menu to the next level.",
      price: 12,
      isMostPop: false,
      features: [
        "Advanced menu customization options",
        "Access to premium menu templates",
        "Custom Domain for menu",
        "Priority customer support",
        "Automatic language translation",
      ],
    },
  ];

  return (
    <section className="relative py-14">
      <div
        className="absolute inset-0 blur-xl h-[580px]"
        style={{
          background:
            "linear-gradient(-153.6deg, rgba(251, 177, 56,0) 10.79%, rgba(219, 148, 31,0.2) 60.92%, rgba(219, 167, 81,0) 90.35%)",
        }}
      ></div>
      <div className="max-w-screen-xl mx-auto text-gray-600 sm:px-4 md:px-8">
        <div className="relative max-w-xl mx-auto space-y-3 px-4 sm:text-center sm:px-0">
          <h3 className="text-orange-400 font-semibold">Pricing</h3>
          <p className="text-gray-800 text-3xl font-semibold sm:text-4xl">
            Savor the Free Plan, Forever!
          </p>
          <div className="max-w-xl">
            <p>
              Enjoy the full DigiDish experience with our forever free plan. No
              strings attached.
            </p>
          </div>
        </div>
        <div className="mt-16 justify-center sm:flex">
          {plans.map((item, idx) => (
            <div
              key={idx}
              className={`relative flex-1 flex items-stretch flex-col mt-6 sm:mt-0 sm:rounded-xl sm:max-w-md ${
                item.isMostPop ? "bg-white shadow-lg sm:border" : ""
              }`}
            >
              <div className="p-4 py-8 space-y-4 border-b md:p-8">
                <span className="text-orange-400 font-medium">{item.name}</span>
                <div className="text-gray-800 text-3xl font-semibold">
                  ${item.price}{" "}
                  <span className="text-xl text-gray-600 font-normal">/mo</span>
                </div>
                <p>{item.desc}</p>
                <button
                  disabled={item.price != 0 ? true : false}
                  onClick={() => {
                    navigate("/login");
                  }}
                  className={
                    item.price != 0
                      ? "px-3 py-3 rounded-lg w-full font-semibold text-sm duration-150 text-gray-300 bg-gray-500"
                      : "px-3 py-3 rounded-lg w-full font-semibold text-sm duration-150 text-white bg-orange-400 hover:bg-orange-400 active:bg-orange-300"
                  }
                >
                  {item.price != 0 ? "Not available for now." : "Get Started"}
                </button>
              </div>
              <ul className="p-4 py-8 space-y-3 md:p-8">
                <li className="pb-2 text-gray-800 font-medium">
                  <p>Features</p>
                </li>
                {item.features.map((featureItem, idx) => (
                  <li key={idx} className="flex items-center gap-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-orange-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    {featureItem}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Pricing;
