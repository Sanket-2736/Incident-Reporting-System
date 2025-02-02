import React, { useState } from "react";
import { useAuthStore } from "../../stores/authStore";

const IncidentForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    severity: "low", // Default value
    image: "",
  });

  const { reportIncident, isReportingIncident } = useAuthStore();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type (e.g., only allow images)
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
        alert("Please upload an image file (jpg, png, gif).");
        return;
    }

    // Validate file size (e.g., limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB.");
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        setFormData({ ...formData, image: reader.result });
    };
  };


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await reportIncident(formData);
  };

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-8 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl w-full bg-white shadow-md rounded-lg p-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Report an Incident
        </h1>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a title for the incident"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Provide a detailed description of the incident"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="location">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter the location of the incident"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Severity */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="severity">
            Severity
          </label>
          <select
            id="severity"
            value={formData.severity}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="images">
            Upload Image
          </label>
          <input
            type="file"
            id="images"
            onChange={handleImageUpload}
            className="w-full text-gray-700"
          />
          <p className="text-sm text-gray-500 mt-1">
            You can upload one image for the incident.
          </p>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isReportingIncident}
          >
            {isReportingIncident ? "Submitting..." : "Submit Incident"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IncidentForm;
