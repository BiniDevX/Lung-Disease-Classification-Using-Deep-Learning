import React from "react";
import SubmitTest from "./SubmitTest";

const SubmitTestModal = ({ patientId, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <SubmitTest patientId={patientId} />
        <button
          onClick={onClose}
          className="mt-2 bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SubmitTestModal;
