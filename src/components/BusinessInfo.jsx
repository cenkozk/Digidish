import React from "react";

const BusinessInfo = ({ onInputChange }) => {
  const handleNameChange = (e) => {
    onInputChange("businessName", e.target.value);
  };

  const handleDescriptionChange = (e) => {
    onInputChange("description", e.target.value);
  };

  return (
    <div className="grid gap-6 mb-6 md:grid-cols-2">
      <div>
        <label
          htmlFor="business_name"
          className="block mb-2 text-sm font-medium text-gray-900 :text-white"
        >
          İş Yeri Adı
        </label>
        <input
          type="text"
          id="business_name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 :bg-gray-700 :border-gray-600 :placeholder-gray-400 :text-white :focus:ring-blue-500 :focus:border-blue-500"
          placeholder="Daisy Coffee"
          onChange={handleNameChange}
          required
        />
      </div>
      <div>
        <label
          htmlFor="desc"
          className="block mb-2 text-sm font-medium text-gray-900 :text-white"
        >
          Açıklama / Bilgi
        </label>
        <input
          type="text"
          id="desc"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 :bg-gray-700 :border-gray-600 :placeholder-gray-400 :text-white :focus:ring-blue-500 :focus:border-blue-500"
          onChange={handleDescriptionChange}
          placeholder="İçinizi ısıtacak kahveler.."
        />
      </div>
    </div>
  );
};

export default BusinessInfo;
