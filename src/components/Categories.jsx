import { motion, AnimatePresence } from "framer-motion";
import React from "react";

const Categories = ({
  categories,
  newCategory,
  handleDeleteCategory,
  handleAddCategory,
  handleCategorySelection,
  selectedCategory,
  setNewCategory,
  handleCategoryNameChange,
}) => {
  console.log(categories);
  return (
    <div className="flex w-auto flex-col items-center justify-center">
      <div className="mb-6 flex items-center justify-center flex-col">
        <AnimatePresence>
          {categories.length === 0 ? (
            <></>
          ) : (
            <label
              htmlFor="categories"
              className="block mb-2 text-sm font-medium text-gray-800 "
            >
              Categories
            </label>
          )}
          {categories.length === 0 ? (
            <></>
          ) : (
            categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-2">
                  <div className="flex flex-row gap-2">
                    <input
                      type="text"
                      value={`${category.name}`}
                      className="w-full p-2.5  bg-transparent border outline-none bg-white rounded-md"
                      onChange={(e) =>
                        handleCategoryNameChange(index, e.target.value)
                      }
                    />
                    <button
                      onClick={() => handleDeleteCategory(index)}
                      className="px-3 py-3 text-white bg-orange-400 rounded-lg duration-150 hover:bg-orange-300 active:bg-orange-400"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12M8 9h8v10H8V9m7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        <div>
          <label
            htmlFor="categoryInput"
            className="block mt-5 mb-2 text-sm font-medium text-gray-900 "
          >
            Add Category
          </label>
          <div className="flex flex-row gap-2">
            <input
              type="text"
              id="categoryInput"
              className="w-full p-2.5 bg-transparent border outline-none bg-white rounded-md"
              placeholder="Soğuk içecekler"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button
              onClick={handleAddCategory}
              className="px-3 py-3 text-white bg-orange-400 rounded-lg duration-150 hover:bg-orange-300 active:bg-orange-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          {categories.length === 0 && (
            <label
              htmlFor="categoryInput"
              className="block mt-2 mb-2 text-sm font-medium text-red-400 "
            >
              Add at least one category.
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
