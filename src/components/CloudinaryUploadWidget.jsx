import React from "react";

const CloudinaryUploadWidget = ({
  categoryIndex,
  dishIndex,
  handleImageUpload,
}) => {
  return (
    <button
      className="cloudinary-button"
      onClick={() => handleImageUpload(categoryIndex, dishIndex)}
    >
      Upload
    </button>
  );
};

export default CloudinaryUploadWidget;
