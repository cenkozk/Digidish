import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "../Supabase";
import Categories from "./Categories";
import imageCompression from "browser-image-compression"; // Import image compression library
import BusinessInfo from "./BusinessInfo";
import { AnimatePresence, motion } from "framer-motion";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";

function CreateMenu(steps) {
  // Cloudinary configuration
  const cloudName = import.meta.env.VITE_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_PRESET_NAME; // Replace with your Cloudinary upload preset
  const navigate = useNavigate();

  const [restaurantMenu, setRestaurantMenu] = useState({
    businessName: "",
    description: "",
    restaurantLogo: "",
    restaurantBackgroundImage: "",
    categories: [],
  });
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [imageUploadingAnimations, setImageUploadingAnimations] = useState([]);
  const [
    categoryImageUploadingAnimations,
    setCategoryImageUploadingAnimations,
  ] = useState([]);

  const [isFetching, setIsFetching] = useState(false);

  async function fetchRestaurantMenu(restaurantId) {
    try {
      setIsFetching(true);
      const { data, error } = await supabase
        .from("menu")
        .select("menuJson")
        .eq("id", restaurantId)
        .single();

      if (error) {
        console.error("Error fetching restaurant menu:", error);
        setIsFetching(false);
        return;
      }

      if (data === null) {
        console.log("Restaurant menu not found.");
        setIsFetching(false);
        return;
      }

      setRestaurantMenu(data.menuJson);
    } catch (error) {
      console.error("Error fetching restaurant menu:", error);
      setIsFetching(false);
    }

    setIsFetching(false);
  }

  async function uploadRestaurantMenu(
    restaurantId,
    menuJson,
    userId,
    paidPlan
  ) {
    try {
      // Check if the restaurant exists in the database
      setImageUploadingAnimations((prevAnimations) => [
        ...prevAnimations,
        restaurantId,
      ]);
      const { data: restaurantData, error: restaurantError } = await supabase
        .from("menu")
        .select("id")
        .eq("id", restaurantId)
        .single();

      if (restaurantError) {
        console.error("Error checking restaurant existence:", restaurantError);
      }

      if (restaurantData === null) {
        // Restaurant does not exist, perform an insert to create a new record
        const { data: newData, error: newError } = await supabase
          .from("menu")
          .insert([{ id: restaurantId, menuJson: menuJson }]);

        if (newError) {
          console.error("Error creating new restaurant:", newError);
          return;
        }

        console.log("New restaurant menu uploaded successfully.");
      } else {
        // Restaurant exists, perform an update
        const { data: updateData, error: updateError } = await supabase
          .from("menu")
          .update({ menuJson: menuJson })
          .eq("id", restaurantId);

        if (updateError) {
          console.error("Error updating restaurant menu:", updateError);
          navigate("/error");
          return;
        }

        console.log("Restaurant menu updated successfully.");
      }

      // Now update the user data with the corresponding restaurantId and paidPlan
      const { data: userData, error: userError } = await supabase
        .from("users")
        .update({ restaurant_id: restaurantId, paid_plan: paidPlan })
        .eq("id", userId);

      setImageUploadingAnimations((prevAnimations) =>
        prevAnimations.filter(
          (animationIndex) => animationIndex !== restaurantId
        )
      );

      if (userError) {
        console.error("Error updating user data:", userError);
        return;
      }

      console.log("User data updated successfully.");
      steps.setSelectedRoute("qr_links");
    } catch (error) {
      console.error("Error uploading restaurant menu:", error);
      steps.setSelectedRoute("home");
    }
  }

  useEffect(() => {
    if (restaurantMenu != null) {
      console.log(restaurantMenu);
    }
  }, [restaurantMenu]);

  useEffect(() => {
    fetchRestaurantMenu(steps.restaurantId);
  }, [steps.restaurantId]);

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

  const handleDishPriceChange = (categoryIndex, dishIndex, value) => {
    setRestaurantMenu((prevMenu) => {
      const updatedCategories = [...prevMenu.categories];
      updatedCategories[categoryIndex].dishes[dishIndex].price = value;

      return { ...prevMenu, categories: updatedCategories };
    });
  };

  /////////////////////////////////////////////////////////////////

  const handleImageUpload = async (event, categoryIndex, dishIndex) => {
    var file = event.target.files[0];
    setImageUploadingAnimations((prevAnimations) => [
      ...prevAnimations,
      categoryIndex + dishIndex,
    ]);

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

        setImageUploadingAnimations((prevAnimations) =>
          prevAnimations.filter(
            (animationIndex) => animationIndex !== categoryIndex + dishIndex
          )
        );

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
        setImageUploadingAnimations((prevAnimations) =>
          prevAnimations.filter(
            (animationIndex) => animationIndex !== categoryIndex + dishIndex
          )
        );
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleImageUploadCategory = async (event, category, index) => {
    console.log(event.target.files[0]);
    var file = event.target.files[0];
    setCategoryImageUploadingAnimations((prevAnimations) => [
      ...prevAnimations,
      index,
    ]);

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

        setImageUploadingAnimations((prevAnimations) =>
          prevAnimations.filter((animationIndex) => animationIndex !== index)
        );

        setRestaurantMenu((prevMenu) => {
          const updatedCategories = [...prevMenu.categories];
          updatedCategories[index].image_url = imageUrl;
          updatedCategories[index].public_id = publicId;
          updatedCategories[index].delete_token = deleteToken;

          return { ...prevMenu, categories: updatedCategories };
        });
      } else {
        console.error("Error uploading image:", response.status);
        setImageUploadingAnimations((prevAnimations) =>
          prevAnimations.filter((animationIndex) => animationIndex !== index)
        );
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleImageUploadLogo = async (event) => {
    console.log(event.target.files[0]);
    var file = event.target.files[0];
    /*setCategoryImageUploadingAnimations((prevAnimations) => [
      ...prevAnimations,
      index,
    ]);*/

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

        /*((prevAnimations) =>
          prevAnimations.filter((animationIndex) => animationIndex !== index)
        );*/

        setRestaurantMenu((prevMenu) => ({
          ...prevMenu,
          logo: {
            image_url: imageUrl,
            public_id: publicId,
            delete_token: deleteToken,
          },
        }));
      } else {
        console.error("Error uploading image:", response.status);
        /*setImageUploadingAnimations((prevAnimations) =>
          prevAnimations.filter((animationIndex) => animationIndex !== index)
        );*/
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleImageUploadBackground = async (event) => {
    console.log(event.target.files[0]);
    var file = event.target.files[0];
    /*setCategoryImageUploadingAnimations((prevAnimations) => [
      ...prevAnimations,
      index,
    ]);*/

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

        /*((prevAnimations) =>
          prevAnimations.filter((animationIndex) => animationIndex !== index)
        );*/

        setRestaurantMenu((prevMenu) => ({
          ...prevMenu,
          background: {
            image_url: imageUrl,
            public_id: publicId,
            delete_token: deleteToken,
          },
        }));
      } else {
        console.error("Error uploading image:", response.status);
        /*setImageUploadingAnimations((prevAnimations) =>
          prevAnimations.filter((animationIndex) => animationIndex !== index)
        );*/
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
    const resizedImageUrl = canvas.toDataURL("image/png", 0.8); // Adjust the image quality as needed (0.8 is a recommended value)

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
        setRestaurantMenu((prevMenu) => {
          const updatedCategories = [...prevMenu.categories];
          updatedCategories[categoryIndex].dishes[dishIndex].image_url = "";
          updatedCategories[categoryIndex].dishes[dishIndex].public_id = "";
          updatedCategories[categoryIndex].dishes[dishIndex].delete_token = "";

          return { ...prevMenu, categories: updatedCategories };
        });
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleCategoryDeleteImage = async (categoryIndex) => {
    const publicId = restaurantMenu.categories[categoryIndex].public_id;
    const deleteToken = restaurantMenu.categories[categoryIndex].delete_token;

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
          updatedCategories[categoryIndex].image_url = "";
          updatedCategories[categoryIndex].public_id = "";
          updatedCategories[categoryIndex].delete_token = "";

          return { ...prevMenu, categories: updatedCategories };
        });
      } else {
        console.error("Error deleting image:", response.status);
        setRestaurantMenu((prevMenu) => {
          const updatedCategories = [...prevMenu.categories];
          updatedCategories[categoryIndex].image_url = "";
          updatedCategories[categoryIndex].public_id = "";
          updatedCategories[categoryIndex].delete_token = "";

          return { ...prevMenu, categories: updatedCategories };
        });
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleLogoDeleteImage = async () => {
    const publicId = restaurantMenu.logo.public_id;
    const deleteToken = restaurantMenu.logo.delete_token;

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
        setRestaurantMenu((prevMenu) => ({
          ...prevMenu,
          logo: {
            image_url: "",
            public_id: "",
            delete_token: "",
          },
        }));
      } else {
        console.error("Error deleting image:", response.status);
        setRestaurantMenu((prevMenu) => ({
          ...prevMenu,
          logo: {
            image_url: "",
            public_id: "",
            delete_token: "",
          },
        }));
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleBackgroundDeleteImage = async () => {
    const publicId = restaurantMenu.background.public_id;
    const deleteToken = restaurantMenu.background.delete_token;

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
        setRestaurantMenu((prevMenu) => ({
          ...prevMenu,
          background: {
            image_url: "",
            public_id: "",
            delete_token: "",
          },
        }));
      } else {
        console.error("Error deleting image:", response.status);
        setRestaurantMenu((prevMenu) => ({
          ...prevMenu,
          background: {
            image_url: "",
            public_id: "",
            delete_token: "",
          },
        }));
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

  const handleCheckboxChange = (categoryIndex, dishIndex, isBig) => {
    setRestaurantMenu((prevMenu) => {
      const updatedCategories = [...prevMenu.categories];
      updatedCategories[categoryIndex].dishes[dishIndex].isBig = isBig;
      return { ...prevMenu, categories: updatedCategories };
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
        // Check if every dish in the categories is valid
        return restaurantMenu.categories.every((category) => {
          return (
            category.dishes.length > 0 &&
            category.dishes.every((dish) => {
              return (
                dish.name.trim() !== "" && dish.hasOwnProperty("description")
              ); // You can add more checks for the image in the future
            })
          );
        });
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

  const handleMoveDishUp = (categoryIndex, dishIndex) => {
    if (dishIndex > 0) {
      setRestaurantMenu((prevMenu) => {
        const updatedCategories = [...prevMenu.categories];
        const temp = updatedCategories[categoryIndex].dishes[dishIndex];
        updatedCategories[categoryIndex].dishes[dishIndex] =
          updatedCategories[categoryIndex].dishes[dishIndex - 1];
        updatedCategories[categoryIndex].dishes[dishIndex - 1] = temp;
        return { ...prevMenu, categories: updatedCategories };
      });
    }
  };

  const handleMoveDishDown = (categoryIndex, dishIndex) => {
    const categoryLength =
      restaurantMenu.categories[categoryIndex].dishes.length;
    if (dishIndex < categoryLength - 1) {
      setRestaurantMenu((prevMenu) => {
        const updatedCategories = [...prevMenu.categories];
        const temp = updatedCategories[categoryIndex].dishes[dishIndex];
        updatedCategories[categoryIndex].dishes[dishIndex] =
          updatedCategories[categoryIndex].dishes[dishIndex + 1];
        updatedCategories[categoryIndex].dishes[dishIndex + 1] = temp;
        return { ...prevMenu, categories: updatedCategories };
      });
    }
  };

  ////////////////////////////////////////////////////////////

  return (
    <div>
      {!isFetching ? (
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
                  handleImageUploadLogo={handleImageUploadLogo}
                  handleImageUploadBackground={handleImageUploadBackground}
                  handleLogoDeleteImage={handleLogoDeleteImage}
                  handleBackgroundDeleteImage={handleBackgroundDeleteImage}
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
                  handleImageUploadCategory={handleImageUploadCategory}
                  handleCategoryDeleteImage={handleCategoryDeleteImage}
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
                <div className=" w-auto h- flex flex-col items-center justify-center ">
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
                              className="flex flex-col items-center justify-center gap-6 border-none shadow-lg bg-white p-6 rounded-lg mb-6"
                              initial={{ opacity: 0, scale: 0.7 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.7 }}
                              transition={{ duration: 0.3 }}
                            >
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
                                <div>
                                  <label
                                    htmlFor={`dishDescription_${selectedCategory}_${dishIndex}`}
                                    className="block mb-2 text-sm font-medium text-gray-900 pt-3"
                                  >
                                    Price
                                  </label>
                                  <input
                                    type="text"
                                    id={`dishDescription_${selectedCategory}_${dishIndex}`}
                                    className="w-16 p-2.5  bg-transparent border outline-none bg-white rounded-md"
                                    placeholder="12.99"
                                    value={dish.price}
                                    defaultValue={0}
                                    onChange={(e) =>
                                      handleDishPriceChange(
                                        selectedCategory,
                                        dishIndex,
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              <div class="flex items-center mr-auto">
                                <input
                                  id="default-checkbox"
                                  type="checkbox"
                                  value=""
                                  checked={dish.isBig}
                                  className="w-4 h-4 text-orange-400 bg-gray-200 border-gray-300 rounded focus:ring-orange-400 "
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      selectedCategory,
                                      dishIndex,
                                      e.target.checked
                                    )
                                  }
                                />
                                <label
                                  for="default-checkbox"
                                  class="ml-2 text-sm font-medium text-gray-900 "
                                >
                                  Make bigger
                                </label>
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
                                  {imageUploadingAnimations.includes(
                                    selectedCategory + dishIndex
                                  ) && (
                                    <div role="status">
                                      <svg
                                        aria-hidden="true"
                                        class="w-5 h-5 mr-2 text-gray-200 animate-spin fill-orange-400"
                                        viewBox="0 0 100 101"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                          fill="currentColor"
                                        />
                                        <path
                                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                          fill="currentFill"
                                        />
                                      </svg>
                                      <span class="sr-only">Loading...</span>
                                    </div>
                                  )}
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
                                <div className="ml-auto flex flex-row gap-2">
                                  <button
                                    onClick={() =>
                                      handleMoveDishUp(
                                        selectedCategory,
                                        dishIndex
                                      )
                                    }
                                    className="p-1 text-white bg-gray-400 rounded-lg duration-150 hover:bg-gray-300 active:bg-gray-400 ml-auto"
                                    disabled={dishIndex === 0}
                                  >
                                    <svg
                                      fill="currentColor"
                                      viewBox="0 0 16 16"
                                      className="w-5 h-5"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M8 12a.5.5 0 00.5-.5V5.707l2.146 2.147a.5.5 0 00.708-.708l-3-3a.5.5 0 00-.708 0l-3 3a.5.5 0 10.708.708L7.5 5.707V11.5a.5.5 0 00.5.5z"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleMoveDishDown(
                                        selectedCategory,
                                        dishIndex
                                      )
                                    }
                                    className="p-1 text-white bg-gray-400 rounded-lg duration-150 hover:bg-gray-300 active:bg-gray-400 ml-auto"
                                    disabled={
                                      dishIndex ===
                                      restaurantMenu.categories[
                                        selectedCategory
                                      ].dishes.length -
                                        1
                                    }
                                  >
                                    <svg
                                      fill="currentColor"
                                      viewBox="0 0 16 16"
                                      className="w-5 h-5 rotate-180"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M8 12a.5.5 0 00.5-.5V5.707l2.146 2.147a.5.5 0 00.708-.708l-3-3a.5.5 0 00-.708 0l-3 3a.5.5 0 10.708.708L7.5 5.707V11.5a.5.5 0 00.5.5z"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteDish(
                                        selectedCategory,
                                        dishIndex
                                      )
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
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence>
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.3 }}
                  >
                    {imageUploadingAnimations.includes(steps.restaurantId) !=
                    true ? (
                      <div>
                        <div class="bg-white border border-gray-200  rounded-lg p-8 md:p-12 scale-90">
                          <a
                            href="#"
                            class="bg-green-300 text-gray-900 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md "
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
                            You successfuly created your menu!
                          </a>
                          <h1 class="text-gray-900  text-3xl md:text-5xl font-extrabold mb-2">
                            Great job! You have successfully completed the
                            process of creating your menu.
                          </h1>
                          <p class="text-lg font-normal text-gray-500 mb-6">
                            Now, by clicking the "Create" button, you can save
                            your changes and finalize your menu.
                          </p>
                          <button
                            onClick={() => {
                              uploadRestaurantMenu(
                                steps.restaurantId,
                                restaurantMenu,
                                steps.user.user.id,
                                steps.user.paidPlan
                              );
                            }}
                            class="inline-flex justify-center items-center py-2.5 px-5 text-base font-medium text-center text-white rounded-lg bg-green-400 hover:bg-green-300 focus:bg-green-400"
                          >
                            Create
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
                    ) : (
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          class="w-8 h-8 mr-2 text-gray-200 animate-spin fill-green-400"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span class="sr-only">Loading...</span>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </div>
          <div className="flex flex-col justify-center items-center pb-24">
            {!restaurantMenu.categories.every((category) => {
              return (
                category.dishes.length > 0 &&
                category.dishes.every((dish) => {
                  return (
                    dish.name.trim() !== "" &&
                    dish.hasOwnProperty("description")
                  );
                })
              );
            }) &&
              steps.steps.currentStep == 3 && (
                <label
                  htmlFor="categoryInput"
                  className="block mt-4 h-full text-sm font-medium text-red-400 "
                >
                  Add a Dish, and name each Dish / Dish image is optional
                </label>
              )}
            <div className="flex flex-row gap-10 mt-10">
              {!(steps.steps.currentStep == 1) && (
                <button
                  onClick={() => {
                    handlePreviousStep();
                  }}
                  className="px-6 py-1.5 w-[70px] text-white bg-orange-400 rounded-lg duration-150 hover:bg-orange-300 active:shadow-lg items-center justify-center flex"
                >
                  Previous
                </button>
              )}
              {!(steps.steps.currentStep == 4) && (
                <button
                  onClick={() => {
                    handleNextStep();
                  }}
                  className="px-6 py-1.5 w-[70px] text-white bg-orange-400 rounded-lg duration-150 hover:bg-orange-300 active:shadow-lg items-center justify-center flex"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div role="status" className="mt-12">
          <svg
            aria-hidden="true"
            class="w-8 h-8 mr-2 text-gray-200 animate-spin  fill-orange-400"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      )}
    </div>
  );
}

export default CreateMenu;
