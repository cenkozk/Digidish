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
    <div>
      <div className="mb-6">
        <label
          htmlFor="categories"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Kategoriler
        </label>
        <div>
          {categories.length === 0 ? (
            <div className="bg-red-500 text-white w-10 px-2 py-1 text-sm rounded-lg">
              Boş
            </div>
          ) : (
            categories.map((category, index) => (
              <div key={index} className="flex items-center mb-2">
                <div>
                  <input
                    type="text"
                    value={`${category.name}`}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(e) =>
                      handleCategoryNameChange(index, e.target.value)
                    }
                  />
                </div>
                <button
                  onClick={() => handleDeleteCategory(index)}
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-2 py-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                >
                  Sil
                </button>
              </div>
            ))
          )}
        </div>
        <div>
          <label
            htmlFor="categoryInput"
            className="block mt-5 mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Kategori Ekle
          </label>
          <input
            type="text"
            id="categoryInput"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Soğuk içecekler"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-2 py-1 mr-2 mt-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            Ekle
          </button>
        </div>
        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
      </div>
      <div className="mb-6">
        <label
          htmlFor="categories"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Kategori İçeriği
        </label>
        <div className="flex">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => handleCategorySelection(index)}
              className={`text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-2 py-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 ${
                selectedCategory === index ? "bg-blue-500 text-white" : ""
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
