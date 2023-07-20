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
