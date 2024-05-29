import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrashAlt,
  faVial,
  faUserPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import SubmitTest from "./SubmitTest";

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);
  const navigate = useNavigate();
  const [showSubmitTestModal, setShowSubmitTestModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  const debouncedFetch = useCallback(
    debounce((query) => {
      setIsLoading(true);
      axios
        .get(`http://127.0.0.1:5000/api/patients/search?query=${query}`)
        .then((response) => {
          setPatients(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching patients:", error);
          setIsLoading(false);
        });
    }, 500),
    []
  );

  useEffect(() => {
    debouncedFetch(searchQuery);
    return () => debouncedFetch.cancel();
  }, [searchQuery, debouncedFetch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleDeletePatient = async (patientId) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await axios.delete(`http://127.0.0.1:5000/api/patients/${patientId}`);
        setPatients(patients.filter((patient) => patient.id !== patientId));
      } catch (error) {
        console.error("Error deleting patient:", error);
      }
    }
  };

  const handleRowClick = (patientId) => {
    navigate(`/patients/${patientId}`);
  };

  const handleTestIconClick = (patientId) => {
    setSelectedPatientId(patientId);
    setShowSubmitTestModal(true);
  };

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-500 flex flex-col items-center justify-center py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-white mb-4">
          Welcome to the Patient Management Dashboard
        </h2>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Manage Patients</h1>
          <button
            onClick={() => navigate("/register-patient")}
            className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-200 ease-in-out transform hover:-translate-y-1"
            title="Register new patient"
          >
            <FontAwesomeIcon icon={faUserPlus} size="lg" />
          </button>
        </div>
        <div className="bg-white p-8 shadow-xl rounded-xl relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute text-gray-400 left-3 top-3"
            title="Search"
          />
          <input
            type="text"
            className="pl-10 pr-3 py-2 w-full text-base font-normal text-gray-700 bg-white bg-clip-padding border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {!isLoading && (
            <>
              <div className="overflow-x-auto mt-6">
                <table className="w-full text-gray-600">
                  <thead className="text-xs text-white uppercase bg-gradient-to-r from-blue-400 to-blue-600">
                    <tr>
                      <th className="py-3 px-6">ID</th>
                      <th className="py-3 px-6">Name</th>
                      <th className="py-3 px-6">Date of Birth</th>
                      <th className="py-3 px-6">Gender</th>
                      <th className="py-3 px-6">Phone</th>
                      <th className="py-3 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPatients.map((patient) => (
                      <tr
                        key={patient.id}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(patient.id)}
                      >
                        <td className="py-4 px-6">{patient.id}</td>
                        <td className="py-4 px-6">{patient.name}</td>
                        <td className="py-4 px-6">{patient.date_of_birth}</td>
                        <td className="py-4 px-6">{patient.gender}</td>
                        <td className="py-4 px-6">{patient.phone}</td>
                        <td className="py-4 px-6 text-right flex justify-end items-center space-x-2">
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="text-blue-500 hover:text-blue-700 cursor-pointer"
                            onClick={(event) => {
                              event.stopPropagation();
                              navigate(`/edit-patient/${patient.id}`);
                            }}
                            title="Edit patient"
                          />
                          <FontAwesomeIcon
                            icon={faVial}
                            className="text-green-500 hover:text-green-700 cursor-pointer"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleTestIconClick(patient.id);
                            }}
                            title="Submit test for patient"
                          />
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDeletePatient(patient.id);
                            }}
                            title="Delete patient"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="py-3 flex justify-center items-center space-x-2">
                {[
                  ...Array(Math.ceil(patients.length / patientsPerPage)).keys(),
                ].map((number) => (
                  <button
                    key={number + 1}
                    onClick={() => paginate(number + 1)}
                    className={`py-2 px-4 rounded-full ${
                      currentPage === number + 1
                        ? "bg-blue-500 text-white"
                        : "bg-white text-blue-500 border border-blue-500 hover:bg-blue-50"
                    }`}
                  >
                    {number + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        {showSubmitTestModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <SubmitTest patientId={selectedPatientId} />
              <button
                onClick={() => setShowSubmitTestModal(false)}
                className="mt-2 bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-full"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePatients;
