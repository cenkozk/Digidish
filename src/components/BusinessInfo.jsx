import React from "react";
import { useState } from "react";

const BusinessInfo = (restaurantMenu) => {
  const handleNameChange = (e) => {
    restaurantMenu.onInputChange("businessName", e.target.value);
  };

  const handleDescriptionChange = (e) => {
    restaurantMenu.onInputChange("description", e.target.value);
  };

  return (
    <div className=" flex-col flex w-full md:grid-cols-1 items-center justify-center">
      <div className="max-w-md px-4 mx-auto ">
        <label
          for="username"
          className="block mt-5 mb-2 text-sm font-medium text-gray-900 "
        >
          Business Name
        </label>
        <div className="flex items-center bg-white  border rounded-md">
          <input
            type="text"
            value={restaurantMenu.restaurantMenu.businessName}
            id="business_name"
            className="w-full p-2.5 bg-transparent outline-none bg-white rounded-md"
            placeholder="Required"
            onChange={handleNameChange}
          />
        </div>
      </div>
      <div className="max-w-md px-4 mx-auto mt-3">
        <label
          for="username"
          className="block mt-5 mb-2 text-sm font-medium text-gray-900 "
        >
          Business Description
        </label>
        <div className="flex items-center bg-white  border rounded-md">
          <input
            type="text"
            value={restaurantMenu.restaurantMenu.description}
            id="desc"
            className="w-full p-2.5 bg-transparent outline-none rounded-md bg-white"
            onChange={handleDescriptionChange}
            placeholder="Optional"
          />
        </div>
      </div>
      <div className="max-w-md px-4 mt-3 mr-auto">
        <label
          for="username"
          className="block mt-5 mb-2 text-sm font-medium text-gray-900 "
        >
          Business Logo
        </label>
        <div className="flex flex-row items-center justify-center">
          <div className=" w-auto mr-auto">
            <label class="flex justify-center w-full h-auto px-2 py-1 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
              <span class="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-16 h-5 text-gray-600"
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
                id={`logo`}
                accept="image/*"
                onChange={(e) => restaurantMenu.handleImageUploadLogo(e)}
              />
            </label>
          </div>
          {restaurantMenu.restaurantMenu.logo?.image_url && (
            <div className="flex items-center ml-2 flex-row h-auto">
              <button
                onClick={() => restaurantMenu.handleLogoDeleteImage()}
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
                src={restaurantMenu.restaurantMenu.logo.image_url}
                alt="Dish"
                className="w-10 h-10 object-cover rounded-md ml-4"
              />
            </div>
          )}
        </div>
      </div>
      <div className="max-w-md px-4 mt-3 mr-auto">
        <label
          for="username"
          className="block mt-5 mb-2 text-sm font-medium text-gray-900 "
        >
          Business Background Image
        </label>
        <div className="flex flex-row items-center justify-center">
          <div className=" w-auto mr-auto">
            <label class="flex justify-center w-full h-auto px-2 py-1 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
              <span class="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-16 h-5 text-gray-600"
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
                id={`logo`}
                accept="image/*"
                onChange={(e) => restaurantMenu.handleImageUploadBackground(e)}
              />
            </label>
          </div>
          {restaurantMenu.restaurantMenu.background?.image_url && (
            <div className="flex items-center flex-row h-auto">
              <button
                onClick={() => restaurantMenu.handleBackgroundDeleteImage()}
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
                src={restaurantMenu.restaurantMenu.background.image_url}
                alt="Dish"
                className="w-10 h-10 object-cover rounded-md ml-4"
              />
            </div>
          )}
        </div>
      </div>
      {restaurantMenu.restaurantMenu.businessName.trim() == "" && (
        <label
          htmlFor="categoryInput"
          className="block mt-2 mb-2 text-sm font-medium text-red-400 mr-auto ml-4"
        >
          Add a Business Name.
        </label>
      )}
    </div>
  );
};

export default BusinessInfo;
