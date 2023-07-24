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
  handleImageUploadCategory,
  handleCategoryDeleteImage,
}) => {
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
                  <div className="flex flex-row items-center gap-2">
                    {category.image_url && (
                      <div className="flex items-center flex-row ml-2">
                        <button
                          onClick={() => handleCategoryDeleteImage(index)}
                          className="px-0 py-0 text-white fill-white bg-red-500 rounded-lg duration-150 hover:bg-red-400 active:bg-red-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 m-1.5"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fillRule="none"
                              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <img
                          src={categories[index].image_url}
                          alt="Dish"
                          className="w-10 h-10 object-cover rounded-md ml-4"
                        />
                      </div>
                    )}
                    <div className=" w-auto">
                      <label class="flex justify-center w-full h-auto px-2 py-1 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                        <span class="flex items-center space-x-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-5 h-5 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </span>
                        <input
                          type="file"
                          name="file_upload"
                          class="hidden"
                          id={`categoryImage_${category}`}
                          accept="image/*"
                          onChange={(e) =>
                            handleImageUploadCategory(e, category, index)
                          }
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={`${category.name}`}
                      className="w-auto p-2.5 mr-1 bg-transparent border outline-none bg-white rounded-md"
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
              className="w-full p-2.5 border outline-none rounded-md"
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
              className="block mt-5 mb-2 text-sm font-medium text-red-400 "
            >
              Add at least one category / Category image is optional
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
