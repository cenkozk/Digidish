import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import BusinessInfo from "./components/BusinessInfo";
import Categories from "./components/Categories";
import imageCompression from "browser-image-compression"; // Import image compression library

function CreateMenu() {
  /*useEffect(() => {
    //fetchRestaurantMenu("-N5RWDD");
  }, []);

  async function fetchRestaurantMenu(restaurantId) {
    try {
      const { data, error } = await supabase
        .from("menu")
        .select("menuJson")
        .eq("id", restaurantId)
        .single();

      if (error) {
        console.error("Error fetching restaurant menu:", error);
        return;
      }

      if (data === null) {
        console.log("Restaurant menu not found.");
        return;
      }

      setRestaurantMenu(data.menuJson);
    } catch (error) {
      console.error("Error fetching restaurant menu:", error);
    }
  }

  useEffect(() => {
    if (restaurantMenu != null) {
      console.log(restaurantMenu);
    }
  }, [restaurantMenu]);

  /*if (!restaurantMenu) {
    return <div>Loading...</div>;
  }*/

  // Access the variables from the fetched restaurant menu
  //const restaurantName = restaurantMenu.restaurantName;
  //const categories = restaurantMenu.categories;

  // Cloudinary configuration
  const cloudName = "dewy2csvc";
  const uploadPreset = "ml_default"; // Replace with your Cloudinary upload preset

  const [restaurantMenu, setRestaurantMenu] = useState({
    businessName: "",
    description: "",
    categories: [],
  });
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    console.log(restaurantMenu);
  }, [restaurantMenu]);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory.trim() === "") {
      return; // Don't add empty categories
    }

    setRestaurantMenu((prevMenu) => {
      const newCategoryObj = {
        name: newCategory,
        dishes: [],
      };

      const updatedCategories = [...prevMenu.categories, newCategoryObj];

      return {
        ...prevMenu,
        categories: updatedCategories,
      };
    });

    setNewCategory("");
  };

  const handleDeleteCategory = (index) => {
    if (index == selectedCategory) {
      setSelectedCategory(null);
    }
    setRestaurantMenu((prevMenu) => {
      const updatedCategories = prevMenu.categories.filter(
        (_, i) => i !== index
      );

      return { ...prevMenu, categories: updatedCategories };
    });
  };

  const handleDishNameChange = (categoryIndex, dishIndex, value) => {
    setRestaurantMenu((prevMenu) => {
      const updatedCategories = [...prevMenu.categories];
      updatedCategories[categoryIndex].dishes[dishIndex].name = value;

      return { ...prevMenu, categories: updatedCategories };
    });
  };

  const handleDishDescriptionChange = (categoryIndex, dishIndex, value) => {
    setRestaurantMenu((prevMenu) => {
      const updatedCategories = [...prevMenu.categories];
      updatedCategories[categoryIndex].dishes[dishIndex].description = value;

      return { ...prevMenu, categories: updatedCategories };
    });
  };

  const handleImageUpload = async (event, categoryIndex, dishIndex) => {
    var file = event.target.files[0];

    file = await resizeAndCompressImage(file);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.secure_url;
        const publicId = data.public_id;
        const deleteToken = data.delete_token;

        setRestaurantMenu((prevMenu) => {
          const updatedCategories = [...prevMenu.categories];
          updatedCategories[categoryIndex].dishes[dishIndex].image_url =
            imageUrl;
          updatedCategories[categoryIndex].dishes[dishIndex].public_id =
            publicId;
          updatedCategories[categoryIndex].dishes[dishIndex].delete_token =
            deleteToken;

          return { ...prevMenu, categories: updatedCategories };
        });
      } else {
        console.error("Error uploading image:", response.status);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  async function resizeAndCompressImage(file) {
    // Define the desired width and height for the resized image
    const maxWidth = 360;
    const maxHeight = 360;

    // Compress the image using imageCompression library
    const compressedImage = await imageCompression(file, {
      maxWidthOrHeight: Math.max(maxWidth, maxHeight),
      useWebWorker: true,
    });

    // Create a temporary image element
    const img = new Image();

    // Create a Promise to handle the image loading
    const imageLoaded = new Promise((resolve) => {
      img.onload = resolve;
    });

    // Set the source of the image to the compressed image data URL
    img.src = URL.createObjectURL(compressedImage);

    // Wait for the image to finish loading
    await imageLoaded;

    // Calculate the target width and height for the resized image while maintaining the aspect ratio
    let targetWidth, targetHeight;
    if (img.width > img.height) {
      targetWidth = maxWidth;
      targetHeight = (maxWidth * img.height) / img.width;
    } else {
      targetWidth = (maxHeight * img.width) / img.height;
      targetHeight = maxHeight;
    }

    // Create a canvas element to draw the resized image
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Get the 2D context of the canvas
    const ctx = canvas.getContext("2d");

    // Draw the resized image on the canvas
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    // Get the data URL of the resized image
    const resizedImageUrl = canvas.toDataURL("image/jpeg", 0.8); // Adjust the image quality as needed (0.8 is a recommended value)

    // Return the resized image data URL
    console.log("Resizing and compressing completed.");
    return resizedImageUrl;
  }

  const handleDeleteImage = async (categoryIndex, dishIndex) => {
    const publicId =
      restaurantMenu.categories[categoryIndex].dishes[dishIndex].public_id;
    const deleteToken =
      restaurantMenu.categories[categoryIndex].dishes[dishIndex].delete_token;

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/delete_by_token`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: deleteToken, public_id: publicId }),
        }
      );

      if (response.ok) {
        setRestaurantMenu((prevMenu) => {
          const updatedCategories = [...prevMenu.categories];
          updatedCategories[categoryIndex].dishes[dishIndex].image_url = "";
          updatedCategories[categoryIndex].dishes[dishIndex].public_id = "";
          updatedCategories[categoryIndex].dishes[dishIndex].delete_token = "";

          return { ...prevMenu, categories: updatedCategories };
        });
      } else {
        console.error("Error deleting image:", response.status);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleDeleteDish = (categoryIndex, dishIndex) => {
    setRestaurantMenu((prevMenu) => {
      const updatedCategories = [...prevMenu.categories];
      updatedCategories[categoryIndex].dishes.splice(dishIndex, 1);

      return { ...prevMenu, categories: updatedCategories };
    });
  };

  const handleAddDish = (categoryIndex) => {
    setRestaurantMenu((prevMenu) => {
      const newDish = {
        name: "",
        description: "",
        image_url: "",
      };

      const updatedCategories = [...prevMenu.categories];
      updatedCategories[categoryIndex].dishes.push(newDish);

      return { ...prevMenu, categories: updatedCategories };
    });
  };

  const handleCategorySelection = (index) => {
    setSelectedCategory(index);
  };

  //////////////////////////////////////////////////////

  const handleInputChange = (field, value) => {
    setRestaurantMenu((prevMenu) => ({
      ...prevMenu,
      [field]: value,
    }));
  };

  const handleCategoryNameChange = (index, newName) => {
    setRestaurantMenu((prevMenu) => {
      const updatedMenu = { ...prevMenu };
      updatedMenu.categories[index].name = newName;
      return updatedMenu;
    });
  };

  return (
    <div>
      <div className="w-[100vw] flex flex-col justify-center items-center mt-10 gap-10">
        <div>
          <BusinessInfo onInputChange={handleInputChange} />
          <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
          <Categories
            categories={restaurantMenu.categories}
            newCategory={newCategory}
            handleDeleteCategory={handleDeleteCategory}
            handleAddCategory={handleAddCategory}
            handleCategorySelection={handleCategorySelection}
            selectedCategory={selectedCategory}
            setNewCategory={setNewCategory}
            handleCategoryNameChange={handleCategoryNameChange}
          />
          {selectedCategory !== null && (
            <div>
              <label
                htmlFor={`category${selectedCategory}`}
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                {categories[selectedCategory]}
              </label>
              {restaurantMenu.categories[selectedCategory].dishes.map(
                (dish, dishIndex) => (
                  <div key={dishIndex} className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label
                        htmlFor={`dishName_${selectedCategory}_${dishIndex}`}
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Dish Name
                      </label>
                      <input
                        type="text"
                        id={`dishName_${selectedCategory}_${dishIndex}`}
                        className="bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Enter dish name"
                        value={dish.name}
                        onChange={(e) =>
                          handleDishNameChange(
                            selectedCategory,
                            dishIndex,
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`dishDescription_${selectedCategory}_${dishIndex}`}
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Dish Description
                      </label>
                      <input
                        type="text"
                        id={`dishDescription_${selectedCategory}_${dishIndex}`}
                        className="bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Enter dish description"
                        value={dish.description}
                        onChange={(e) =>
                          handleDishDescriptionChange(
                            selectedCategory,
                            dishIndex,
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`dishImage_${selectedCategory}_${dishIndex}`}
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Dish Image
                      </label>
                      <div className="flex items-center">
                        <input
                          type="file"
                          id={`dishImage_${selectedCategory}_${dishIndex}`}
                          accept="image/*"
                          onChange={(e) =>
                            handleImageUpload(e, selectedCategory, dishIndex)
                          }
                        />
                        {restaurantMenu.categories[selectedCategory].dishes[
                          dishIndex
                        ].image_url && (
                          <div className="flex items-center">
                            <img
                              src={
                                restaurantMenu.categories[selectedCategory]
                                  .dishes[dishIndex].image_url
                              }
                              alt="Dish"
                              className="w-24 h-24 object-cover rounded-md ml-4"
                            />
                            <button
                              onClick={() =>
                                handleDeleteImage(selectedCategory, dishIndex)
                              }
                              className="text-red-500 ml-2 focus:outline-none"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9.293 10l-2.147 2.146a.5.5 0 00.708.708L10 10.707l2.147 2.147a.5.5 0 00.708-.708L10.707 10l2.147-2.146a.5.5 0 00-.708-.708L10 9.293 7.853 7.146a.5.5 0 00-.708.708L9.293 10zM10 2a8 8 0 100 16 8 8 0 000-16zm0 1a7 7 0 110 14A7 7 0 0110 3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-span-3 flex items-center justify-end">
                      <button
                        onClick={() =>
                          handleDeleteDish(selectedCategory, dishIndex)
                        }
                        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-2 py-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              )}
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleAddDish(selectedCategory)}
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-2 py-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                >
                  Add Dish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateMenu;
