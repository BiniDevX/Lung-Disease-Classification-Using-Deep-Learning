import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCalendarDay,
  faVenusMars,
  faPhone,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

const RegisterPatient = () => {
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    address: "",
    countryCode: "+86",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails({ ...patientDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Concatenate country code with phone number
    const fullPhoneNumber = patientDetails.countryCode + patientDetails.phone;

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/patients/new",
        {
          ...patientDetails,
          phone: fullPhoneNumber, // Send the full phone number including the country code
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      alert("Patient registered successfully!");
      navigate("/manage-patients"); // Redirect to manage patients page
      setPatientDetails({
        name: "",
        dateOfBirth: "",
        gender: "",
        phone: "",
        address: "",
        countryCode: "+86",
      }); // Clear form after successful registration
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError("Phone number already registered.");
      } else {
        setError("Failed to register the patient. Please try again.");
      }
      console.error("Error during patient registration:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-6 py-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-xl p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Register New Patient
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FontAwesomeIcon
              icon={faUser}
              className="absolute top-3 left-3 text-gray-400"
            />
            <input
              type="text"
              name="name"
              value={patientDetails.name}
              onChange={handleInputChange}
              placeholder="Patient Name"
              className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="relative">
            <FontAwesomeIcon
              icon={faCalendarDay}
              className="absolute top-3 left-3 text-gray-400"
            />
            <input
              type="date"
              name="dateOfBirth"
              value={patientDetails.dateOfBirth}
              onChange={handleInputChange}
              className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="relative">
            <FontAwesomeIcon
              icon={faVenusMars}
              className="absolute top-3 left-3 text-gray-400"
            />
            <select
              name="gender"
              value={patientDetails.gender}
              onChange={handleInputChange}
              className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="relative flex gap-1 items-center">
            <FontAwesomeIcon
              icon={faPhone}
              className="absolute top-3 left-3 text-gray-400"
            />
            <select
              name="countryCode"
              value={patientDetails.countryCode}
              onChange={handleInputChange}
              className="pl-10 pr-3 py-2 border border-r-0 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="+86">+86</option>
              <option value="+1">+251</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
              <option value="+91">+91</option>
              <option value="+49">+49</option>
              <option value="+61">+61</option>
            </select>
            <input
              type="text"
              name="phone"
              value={patientDetails.phone}
              onChange={handleInputChange}
              placeholder="Phone Number"
              className="flex-grow p-2 border border-gray-300 rounded-r-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="relative">
            <FontAwesomeIcon
              icon={faHome}
              className="absolute top-3 left-3 text-gray-400"
            />
            <input
              type="text"
              name="address"
              value={patientDetails.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register Patient"}
          </button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default RegisterPatient;
