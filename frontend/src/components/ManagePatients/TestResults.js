import React from "react";
import axios from "axios";

const TestResults = ({ result, onHide }) => {
  const downloadReport = async () => {
    if (!result || !result.id) {
      console.error("Invalid test ID");
      alert("Invalid test ID. Cannot download the report.");
      return;
    }

    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/report/download/${result.id}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Report_${result.test_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      onHide();
    } catch (error) {
      console.error("Error downloading the report:", error);
      alert("Failed to download the report.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-2">
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        Test Details
      </h3>
      <ul>
        <li>
          <strong>Result:</strong> {result.result}
        </li>
        <li>
          <strong>Confidence:</strong> {result.confidence.toFixed(2)}%
        </li>
        <li>
          <strong>Date Conducted:</strong>{" "}
          {new Date(result.date_conducted).toLocaleDateString()}
        </li>
        <li>
          <strong>Patient ID:</strong> {result.patient_id}
        </li>
        <li>
          <strong>Test ID:</strong> {result.id}
        </li>
      </ul>
      <button
        onClick={downloadReport}
        className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Download Report
      </button>
    </div>
  );
};

export default TestResults;
