import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "../Supabase";
import Categories from "./Categories";
import imageCompression from "browser-image-compression"; // Import image compression library
import BusinessInfo from "./BusinessInfo";
import { AnimatePresence, motion } from "framer-motion";
import { nanoid } from "nanoid";

function CreateMenu(steps) {
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
    const maxWidth = 240;
    const maxHeight = 240;

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

  //////////////////////////////////////////////////////

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return restaurantMenu.businessName.trim() !== "";
      case 2:
        return restaurantMenu.categories.length > 0;
      case 3:
        return restaurantMenu.categories.some(
          (category) => category.dishes.length > 0
        );
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (isStepValid(steps.steps.currentStep)) {
      //Initialize the selected category on first step 3.
      if (steps.steps.currentStep + 1 == 3) {
        if (selectedCategory == null) {
          setSelectedCategory(0);
        }
      }

      steps.handleSteps(1);
    } else {
      console.log(restaurantMenu.businessName, restaurantMenu.description);
      // Handle invalid step, show error message, etc.
    }
  };

  const handlePreviousStep = () => {
    steps.handleSteps(-1);
  };

  ///////////////////////////////////////////////////////

  return (
    <div>
      <div className="w-auto flex flex-col justify-center items-center gap-10 mt-12 divide-y-2">
        <div>
          {steps.steps.currentStep == 1 && (
            <motion.div
              key="1"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.3 }}
            >
              <BusinessInfo
                onInputChange={handleInputChange}
                restaurantMenu={restaurantMenu}
              />
            </motion.div>
          )}
          {steps.steps.currentStep == 2 && (
            <motion.div
              key="2"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.3 }}
            >
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
            </motion.div>
          )}
          {steps.steps.currentStep == 3 && (
            <motion.div
              key={"test"}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.3 }}
            >
              <div className=" w-auto flex flex-col items-center justify-center ">
                <div className="mb-6">
                  <label
                    htmlFor="categories"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Edit Dishes On Category
                  </label>
                  <div className="flex gap-2">
                    {restaurantMenu.categories.map((category, index) => (
                      <button
                        key={index}
                        onClick={() => handleCategorySelection(index)}
                        className={`px-3 py-1 rounded-lg duration-150  active:bg-orange-400  ${
                          selectedCategory == index
                            ? "bg-orange-400 text-white hover:bg-orange-300"
                            : "bg-white text-gray-900 border hover:bg-gray-200"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
                {selectedCategory !== null && (
                  <div className="flex flex-col mt-2 justify-center items-center divide-y-2">
                    <label
                      htmlFor={`category${selectedCategory}`}
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {categories[selectedCategory]}
                    </label>
                    <AnimatePresence className="divide-y-2">
                      {restaurantMenu.categories[selectedCategory].dishes.map(
                        (dish, dishIndex) => (
                          <motion.div
                            key={dishIndex}
                            className="flex flex-col items-center justify-center gap-6"
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            transition={{ duration: 0.3 }}
                          >
                            <hr className="w-full" />
                            <div className="flex flex-auto gap-10">
                              <div className="col-span-2">
                                <label
                                  htmlFor={`dishName_${selectedCategory}_${dishIndex}`}
                                  className="block mb-2 text-sm font-medium text-gray-900 pt-3"
                                >
                                  Dish Name
                                </label>
                                <input
                                  type="text"
                                  id={`dishName_${selectedCategory}_${dishIndex}`}
                                  className="w-auto p-2.5  bg-transparent border outline-none bg-white rounded-md"
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
                                  className="block mb-2 text-sm font-medium text-gray-900 pt-3"
                                >
                                  Dish Description
                                </label>
                                <input
                                  type="text"
                                  id={`dishDescription_${selectedCategory}_${dishIndex}`}
                                  className="w-auto p-2.5  bg-transparent border outline-none bg-white rounded-md"
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
                            </div>

                            <div className="flex w-full flex-row gap-2 items-center justify-center">
                              <div className="flex flex-row justify-center items-center mb-6 gap-2">
                                <label
                                  htmlFor={`dishImage_${selectedCategory}_${dishIndex}`}
                                  className="block text-sm font-medium text-gray-900"
                                >
                                  Dish Image
                                </label>
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
                                      id={`dishImage_${selectedCategory}_${dishIndex}`}
                                      accept="image/*"
                                      onChange={(e) =>
                                        handleImageUpload(
                                          e,
                                          selectedCategory,
                                          dishIndex
                                        )
                                      }
                                    />
                                  </label>
                                </div>

                                {restaurantMenu.categories[selectedCategory]
                                  .dishes[dishIndex].image_url && (
                                  <div className="flex items-center flex-row ml-2">
                                    <button
                                      onClick={() =>
                                        handleDeleteImage(
                                          selectedCategory,
                                          dishIndex
                                        )
                                      }
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
                                      src={
                                        restaurantMenu.categories[
                                          selectedCategory
                                        ].dishes[dishIndex].image_url
                                      }
                                      alt="Dish"
                                      className="w-10 h-10 object-cover rounded-md ml-4"
                                    />
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() =>
                                  handleDeleteDish(selectedCategory, dishIndex)
                                }
                                className="px-2 py-2 text-white bg-red-500 rounded-lg duration-150 hover:bg-red-400 active:bg-red-500 ml-auto"
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
                          </motion.div>
                        )
                      )}
                    </AnimatePresence>
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => handleAddDish(selectedCategory)}
                        className="px-6 py-1.5 w-auto mt-10 text-white bg-gray-800 rounded-lg duration-150 hover:bg-gray-600 active:shadow-lg items-center justify-center flex"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 mr-1 m-0"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Add Dish
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          {steps.steps.currentStep == 4 && (
            <motion.div
              key="4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>Step 4 Content</div>
            </motion.div>
          )}
        </div>
        <div className="flex flex-row gap-16 pb-24">
          <button
            onClick={() => {
              handlePreviousStep();
            }}
            className="px-6 py-1.5 w-[70px] mt-10 text-white bg-orange-400 rounded-lg duration-150 hover:bg-orange-300 active:shadow-lg items-center justify-center flex"
          >
            Prev
          </button>
          <button
            onClick={() => {
              handleNextStep();
            }}
            className="px-6 py-1.5 w-[70px] mt-10 text-white bg-orange-400 rounded-lg duration-150 hover:bg-orange-300 active:shadow-lg items-center justify-center flex"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateMenu;
