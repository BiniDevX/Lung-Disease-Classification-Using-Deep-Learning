import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBirthdayCake,
  faVenusMars,
  faPhone,
  faHome,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import TestResults from "./TestResults";
import SkeletonLoader from "../SkeletonLoader";

const PatientDetails = () => {
  const [patient, setPatient] = useState(null);
  const [tests, setTests] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { patientId } = useParams();

  useEffect(() => {
    const fetchPatientAndTests = async () => {
      try {
        setLoading(true);
        const [patientResponse, testsResponse] = await Promise.all([
          axios.get(`http://127.0.0.1:5000/api/patients/${patientId}`),
          axios.get(`http://127.0.0.1:5000/api/tests/patient/${patientId}`),
        ]);
        setPatient(patientResponse.data);
        setTests(testsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Try again or contact support.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientAndTests();
  }, [patientId]);

  if (loading) return <SkeletonLoader />;
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-red-600 font-medium">{error}</div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Patient Details</h1>
      <div className="bg-gradient-to-r from-blue-500 to-teal-300 shadow-lg rounded-xl overflow-hidden p-8 space-y-6">
        <h2 className="text-3xl font-semibold text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faInfoCircle} className="text-yellow-300" />
          {patient?.name}
        </h2>
        <div className="flex flex-col text-white">
          {renderDetail(
            "Date of Birth",
            patient?.date_of_birth,
            faBirthdayCake,
            "text-blue-500"
          )}
          {renderDetail(
            "Gender",
            patient?.gender,
            faVenusMars,
            "text-pink-500"
          )}
          {renderDetail("Phone", patient?.phone, faPhone, "text-green-500")}
          {renderDetail("Address", patient?.address, faHome, "text-orange-500")}
        </div>
      </div>
      <div className="bg-gradient-to-r from-blue-500 to-teal-300 shadow-lg rounded-xl overflow-hidden p-8 mt-8 space-y-6">
        <h2 className="text-3xl font-semibold text-white">Tests Conducted</h2>
        {tests.length === 0 ? (
          <p>No tests found for this patient.</p>
        ) : (
          tests.map((test) => (
            <div
              key={test.id}
              className="cursor-pointer bg-white hover:bg-gray-100 rounded-xl p-4 transition duration-300 ease-in-out"
              onClick={() =>
                setSelectedTestId(selectedTestId === test.id ? null : test.id)
              }
            >
              <p className="font-medium text-gray-800">
                Test ID: {test.id} - Click to view details
              </p>
              {selectedTestId === test.id && (
                <TestResults
                  result={test}
                  onHide={() => setSelectedTestId(null)}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

function renderDetail(label, value, icon, iconColor) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-gray-700">
      <FontAwesomeIcon icon={icon} className={`mr-2 ${iconColor}`} />
      {label}: {value}
    </div>
  );
}

export default PatientDetails;
