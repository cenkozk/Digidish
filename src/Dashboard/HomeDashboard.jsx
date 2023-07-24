import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FaqsCard = (props) => {
  const answerElRef = useRef();
  const [state, setState] = useState(false);
  const [answerH, setAnswerH] = useState("0px");
  const { faqsList, idx } = props;

  const handleOpenAnswer = () => {
    const answerElH = answerElRef.current.childNodes[0].offsetHeight;
    setState(!state);
    setAnswerH(`${answerElH + 20}px`);
  };

  return (
    <div
      className="space-y-3 mt-5 overflow-hidden border-b"
      key={idx}
      onClick={handleOpenAnswer}
    >
      <h4 className="cursor-pointer pb-5 flex items-center justify-between text-lg text-gray-700 font-medium">
        {faqsList.q}
        {state ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 12H4"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        )}
      </h4>
      <div
        ref={answerElRef}
        className="duration-300"
        style={state ? { height: answerH } : { height: "0px" }}
      >
        <div>
          <p className="text-gray-500">{faqsList.a}</p>
        </div>
      </div>
    </div>
  );
};

function HomeDashboard(props) {
  const faqsList = [
    {
      q: "How do I get started with creating my restaurant menu using DigiDish?",
      a: `Navigate to the "Menu" section and follow the step-by-step guide to add your business details, categories, and dishes. It's a seamless and intuitive process!`,
    },
    {
      q: "Can I add multiple categories to my restaurant menu?",
      a: "Absolutely! DigiDish allows you to create and customize multiple categories for your restaurant menu. Whether it's starters, main courses, desserts, or beverages, you can easily organize your menu to suit your needs.",
    },
    {
      q: "Is it possible to upload images for each dish in the menu?",
      a: `Yes, you can enhance your menu by uploading captivating images for each dish. Simply select the dish you want to add an image to and click the "Upload" button.`,
    },
    {
      q: "How can I generate a QR code for my restaurant menu",
      a: `After creating your menu, go to the "QR Code & Links" section, and click on "Generate QR Code." You can then download and print the QR code to display it at your restaurant for easy access by your customers.`,
    },
    {
      q: "How do I share my restaurant menu with customers using DigiDish?",
      a: "Sharing your restaurant menu with customers is simple. Each menu you create comes with a unique URL. You can share this URL through social media, your website, or even print it on flyers. Additionally, customers can scan the QR code displayed at your restaurant to access the menu instantly.",
    },
  ];

  return (
    <motion.div className="flex flex-col h-auto w-full my-10">
      <div className="">
        <div className="h-auto w-full flex-row mr-auto scale-90">
          <div class="bg-white border border-gray-200  rounded-lg p-8 scale-90">
            <button
              onClick={() => {
                props.setSelectedRoute("menu_edit");
              }}
              class="bg-orange-400 duration-150 hover:bg-orange-300 text-gray-900 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md "
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                height="1em"
                width="1em"
                className="mr-1"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M4.222 3.808l6.717 6.717-2.828 2.829-3.89-3.89a4 4 0 010-5.656zm10.046 8.338l-.854.854 7.071 7.071-1.414 1.414L12 14.415l-7.071 7.07-1.414-1.414 9.339-9.339c-.588-1.457.02-3.555 1.62-5.157 1.953-1.952 4.644-2.427 6.011-1.06s.892 4.058-1.06 6.01c-1.602 1.602-3.7 2.21-5.157 1.621z" />
              </svg>
              Create your first menu!
            </button>
            <h1 class="text-gray-900  text-3xl md:text-5xl font-extrabold mb-2">
              Welcome to DigiDish!
            </h1>
            <p class="text-lg font-normal text-gray-500 mb-6">
              Easily create and customize your restaurant's menu with our
              user-friendly "Menu" sidebar.
            </p>
            <button
              onClick={() => {
                props.setSelectedRoute("menu_edit");
              }}
              class="inline-flex justify-center items-center py-2.5 px-5 text-base font-medium text-center text-white rounded-lg bg-orange-400 duration-150 hover:bg-orange-300 "
            >
              Take me there
              <svg
                class="w-3.5 h-3.5 ml-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="h-auto w-full flex-row mr-auto scale-90">
          <div class="bg-white border border-gray-200  rounded-lg p-8  scale-90">
            <button
              onClick={() => {
                props.setSelectedRoute("qr_links");
              }}
              class="bg-orange-400 hover:bg-orange-300 duration-150 text-gray-900 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md "
            >
              <svg
                fill="currentColor"
                viewBox="0 0 16 16"
                class="mr-1"
                height="1em"
                width="1em"
              >
                <path d="M0 .5A.5.5 0 01.5 0h3a.5.5 0 010 1H1v2.5a.5.5 0 01-1 0v-3zm12 0a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v3a.5.5 0 01-1 0V1h-2.5a.5.5 0 01-.5-.5zM.5 12a.5.5 0 01.5.5V15h2.5a.5.5 0 010 1h-3a.5.5 0 01-.5-.5v-3a.5.5 0 01.5-.5zm15 0a.5.5 0 01.5.5v3a.5.5 0 01-.5.5h-3a.5.5 0 010-1H15v-2.5a.5.5 0 01.5-.5zM4 4h1v1H4V4z" />
                <path d="M7 2H2v5h5V2zM3 3h3v3H3V3zm2 8H4v1h1v-1z" />
                <path d="M7 9H2v5h5V9zm-4 1h3v3H3v-3zm8-6h1v1h-1V4z" />
                <path d="M9 2h5v5H9V2zm1 1v3h3V3h-3zM8 8v2h1v1H8v1h2v-2h1v2h1v-1h2v-1h-3V8H8zm2 2H9V9h1v1zm4 2h-1v1h-2v1h3v-2zm-4 2v-1H8v1h2z" />
                <path d="M12 9h2V8h-2v1z" />
              </svg>
              QR and Links
            </button>
            <h1 class="text-gray-900  text-3xl md:text-5xl font-extrabold mb-2">
              Effortless QR Codes and Links
            </h1>
            <p class="text-lg font-normal text-gray-500 mb-6">
              Enhance your customers' experience by generating QR codes and
              links for quick access to your delectable dishes through our
              intuitive "QR and Links" tab.
            </p>
            <button
              onClick={() => {
                props.setSelectedRoute("qr_links");
              }}
              class="inline-flex justify-center items-center py-2.5 px-5 text-base font-medium text-center text-white rounded-lg bg-orange-400 duration-150 hover:bg-orange-300 "
            >
              Take me there!
              <svg
                class="w-3.5 h-3.5 ml-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <section className="leading-relaxed h-auto w-full flex-row mr-auto scale-90 max-w-screen-xl p-10 mx-auto px-4 md:px-8 bg-white border rounded-lg mb-6">
        <div className="space-y-3 text-center">
          <h1 className="text-3xl text-gray-800 font-semibold">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto text-lg">
            Answered all frequently asked questions, Still confused? feel free
            to contact us.
          </p>
        </div>
        <div className="mt-14 max-w-2xl mx-auto">
          {faqsList.map((item, idx) => (
            <FaqsCard idx={idx} faqsList={item} />
          ))}
        </div>
      </section>
    </motion.div>
  );
}

export default HomeDashboard;
