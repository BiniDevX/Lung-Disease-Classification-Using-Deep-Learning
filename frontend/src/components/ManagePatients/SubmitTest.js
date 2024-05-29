import React, { useState } from "react";
import axios from "axios";

const SubmitTest = ({ patientId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError(""); // Clear any previous errors when a new file is selected
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please upload a file to proceed with the test.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("patientId", patientId);

    // Retrieve the token from local storage or your state management
    const token = localStorage.getItem("accessToken");

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/test/new",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Include the token here
          },
        }
      );
      alert("Test submitted successfully!");
      setSelectedFile(null); // Reset file input after successful submission
    } catch (error) {
      setError("Failed to submit the test. Please try again.");
      console.error("Error during test submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-center text-lg leading-6 font-medium text-gray-900">
        Submit New Test for Patient
      </h2>
      <input
        type="file"
        onChange={handleFileChange}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 w-full"
      />
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
      >
        {isSubmitting ? "Submitting..." : "Submit Test"}
      </button>
    </div>
  );
};

export default SubmitTest;
