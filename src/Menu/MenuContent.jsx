import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { nanoid } from "nanoid";
import Masonry from "react-masonry-css";
import { useAnimate, stagger, motion } from "framer-motion";
import ScrollUpButton from "./ScrollUpButton";

function MenuContent(props) {
  const menuData = props.menu;
  const categories = menuData.categories;
  const [selectedItem, setSelectedItem] = useState(0);
  const [onCategoryTab, setOnCategoryTab] = useState(false);

  const tabItems = menuData.categories.map((category) => ({
    image_url: category.image_url,
    name: category.name,
  }));

  return (
    <div className="w-full flex object-center justify-center items-center">
      <nav class="bg-white fixed w-full z-20 top-0 left-0 border-b">
        <div class="relative w-full p-4 flex flex-wrap items-center justify-center">
          <img
            onClick={() => {
              setOnCategoryTab(false);
            }}
            src={menuData.logo.image_url}
            class="h-12 w-auto"
            alt="Menu Logo"
          />
          <div class="absolute w-[100vw] ml-6">
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <span class="sr-only">Open main menu</span>
              <svg
                class="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          ></div>
        </div>
      </nav>

      <div className="sm:w-full md:w-[30rem] flex-col justify-center items-center">
        {/* Category Cards (Masonry Layout) */}
        {!onCategoryTab && (
          <div className="flex items-center justify-center">
            <Masonry
              breakpointCols={{
                default: 2,
              }}
              className="my-masonry-grid p-6 mt-20 flex flex-row w-full"
              columnClassName="my-masonry-grid_column"
            >
              {categories.map((category, index) => (
                <motion.div
                  animate="visible"
                  initial="hidden"
                  variants={{
                    visible: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: 10 },
                  }}
                  transition={{ delay: index * 0.08 }} // Staggering the children based on their index
                >
                  <div
                    key={category.name}
                    onClick={() => {
                      setSelectedItem(index);
                      setOnCategoryTab(true);
                    }}
                    className="relative w-full"
                  >
                    <div className="absolute left z-10 mt-2 bg-white w-auto px-2 py-1 rounded-r-md text-sm font-bold">
                      {category.name}
                    </div>
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="h-auto max-w-full rounded-lg"
                    />
                  </div>
                </motion.div>
              ))}
            </Masonry>
          </div>
        )}

        {onCategoryTab && (
          <div className="p-6 mt-16 flex-col w-auto justify-center items-center">
            <div className="flex justify-center items-center flex-col gap-3 divide-y-2">
              <div className="w-full flex flex-row gap-6 justify-center items-center place-content-evenly">
                <motion.h2
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-3xl pt-4 mb-1.5 font-bold text-gray-800"
                >
                  {tabItems[selectedItem].name}
                </motion.h2>
                <motion.button
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setOnCategoryTab(false)}
                  className="flex rounded-full flex-row w-auto items-center px-2 py-1 mt-2 text-white bg-gray-700 hover:bg-gray-600 active:shadow-lg scale-75"
                >
                  <svg
                    viewBox="0 0 512 512"
                    fill="currentColor"
                    height="1em"
                    width="1em"
                    className="-ml-1"
                  >
                    <path d="M321.94 98L158.82 237.78a24 24 0 000 36.44L321.94 414c15.57 13.34 39.62 2.28 39.62-18.22v-279.6c0-20.5-24.05-31.56-39.62-18.18z" />
                  </svg>
                  Menu
                </motion.button>
              </div>

              {menuData.categories[selectedItem].dishes.map((dish, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.25 }}
                  className="w-full"
                >
                  {!dish.isBig ? (
                    <motion.div
                      className="flex w-full items-start flex-row gap-3 pt-6 place-content-between"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.25 }}
                    >
                      <div className="flex flex-row gap-6 ">
                        {dish.image_url && (
                          <img
                            src={dish.image_url}
                            alt={dish.name}
                            className="w-24 h-24 object-cover rounded-md mb-4"
                          />
                        )}
                        <div className="flex flex-col w-auto -mt-1.5 gap-2">
                          <h3 className="text-xl font-semibold mr-5 text-gray-800">
                            {dish.name}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {dish.description}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-indigo-600 w-auto ml-auto font-medium">
                          ${dish.price}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="flex w-full flex-col gap-3 pt-6"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.25 }}
                    >
                      <div className="flex flex-row gap-6 ">
                        {dish.image_url && (
                          <img
                            src={dish.image_url}
                            alt={dish.name}
                            className="w-full h-full  rounded-md mb-4"
                          />
                        )}
                      </div>
                      <div className="flex flex-col w-auto -mt-1.5 gap-2">
                        <h3 className="text-xl w-auto font-semibold text-gray-800">
                          {dish.name}
                        </h3>
                        <p className="text-gray-600 ">{dish.description}</p>
                      </div>
                      <div>
                        <p className="text-indigo-600 ml-auto font-medium">
                          ${dish.price}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/*<div
        className="h-56 min-w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${menuData.background.image_url})` }}
      >
        <img
          src={menuData.logo.image_url}
          alt={menuData.businessName}
          className="w-24 h-24 bg-transparent "
        />
      </div>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-3xl font-semibold text-center text-gray-900 m-6">
          {menuData.businessName}
        </h1>
        <p className="text-gray-700 m-6 text-center">{menuData.description}</p>
      </div>
      <div>
        <ul
          role="tablist"
          className="max-w-screen-xl mx-auto border-b flex items-center gap-x-6 overflow-x-auto text-sm"
        >
          {tabItems.map((item, idx) => (
            <li
              key={idx}
              className={`py-2 border-b-2 ${
                selectedItem === idx
                  ? "border-indigo-600 text-indigo-600"
                  : "border-white text-gray-500"
              }`}
            >
              <button
                role="tab"
                aria-selected={selectedItem === idx}
                aria-controls={`tabpanel-${idx + 1}`}
                className="flex items-center gap-x-2 py-2 px-2 rounded-lg duration-150 hover:text-indigo-600 hover:bg-gray-50 active:bg-gray-100 font-medium"
                onClick={() => setSelectedItem(idx)}
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-6 h-6 rounded-full"
                />
                {item.name}
              </button>
            </li>
          ))}
        </ul>

        {/* Displaying the selected category */}
        <footer className="text-gray-500 bg-white  flex flex-col justify-center items-center max-w-screen-xl mx-auto md:px-8 p-12 border-t">
          <div className="max-w-lg sm:mx-auto flex-col justify-center items-center sm:text-center">
            <a
              className="flex flex-col justify-center items-center"
              href="https://digidish.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://res.cloudinary.com/dewy2csvc/image/upload/v1689628008/DigiText_zfdjoh.svg"
                className="w-32 sm:mx-auto cursor-pointer"
                alt="Digidish Logo"
              />
            </a>
            <p className="leading-relaxed text-center mt-2 text-[15px]">
              © 2023 Digidish. All rights reserved. The Digidish name and logo
              are registered trademarks of Digidish Inc.
            </p>
          </div>
        </footer>
      </div>
      <ScrollUpButton />
    </div>
  );
}

export default MenuContent;
