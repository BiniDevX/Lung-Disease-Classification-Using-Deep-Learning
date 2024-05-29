import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import DiseasesCovered from "./components/DiseasesCovered";
import ManagePatients from "./components/ManagePatients/ManagePatients";
import EditPatient from "./components/ManagePatients/EditPatient";
import PatientDetails from "./components/ManagePatients/PatientDetails";
import TestResults from "./components/ManagePatients/TestResults";
import SubmitTest from "./components/ManagePatients/SubmitTest";
import RegisterPatient from "./components/ManagePatients/RegisterPatient";
import NotFound from "./components/NotFound";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diseases" element={<DiseasesCovered />} />
          <Route path="/login" element={<Login />} />
          <Route path="/manage-patients" element={<ManagePatients />} />
          <Route path="/edit-patient/:patientId" element={<EditPatient />} />
          <Route path="/patients/:patientId" element={<PatientDetails />} />
          <Route path="/test/:testId" element={<TestResults />} />
          <Route path="/submit-test" element={<SubmitTest />} />
          <Route path="/register-patient" element={<RegisterPatient />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
