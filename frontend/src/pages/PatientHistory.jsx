import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BACKEND_URL =
  import.meta.env.VITE_APP_BACKEND_URL ?? "http://localhost:5000";

const PatientHistory = () => {
  const { patientId } = useParams();
  const [history, setHistory] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [illness, setIllness] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchHistory() {
      const response = await fetch(`${BACKEND_URL}/api/getHistory/${patientId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      setHistory(json.patientHistory);
    }
    if (patientId) {
      fetchHistory();
    }
  }, [patientId]);

  const handleAddPrescriptionField = () => {
    setPrescriptions([...prescriptions, { medication: "", frequency: "", days: "" }]);
  };

  const handlePrescriptionChange = (index, field, value) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index][field] = value;
    setPrescriptions(updatedPrescriptions);
  };

  const handleSubmitPrescriptions = async () => {
    const currentDate = new Date().toISOString().split("T")[0];
    const response = await fetch(`${BACKEND_URL}/api/patient/addPrescription`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ patientId, illness, medications: prescriptions, date: currentDate }),
    });

    if (response.ok) {
      alert("Prescriptions added successfully");
      setPrescriptions([]);
      setIllness("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold text-gray-700 mb-4">Patient History</h1>
      <div className="bg-white shadow rounded p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Medical History</h2>
        <p className="mt-4 text-gray-600">{history}</p>
      </div>
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-semibold text-gray-800">Add Prescription</h2>
        <input
          type="text"
          placeholder="Illness"
          value={illness}
          onChange={(e) => setIllness(e.target.value)}
          className="border p-2 rounded w-full mt-2"
        />
        {prescriptions.map((prescription, index) => (
          <div key={index} className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Medication Name"
              value={prescription.medication}
              onChange={(e) => handlePrescriptionChange(index, "medication", e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Frequency"
              value={prescription.frequency}
              onChange={(e) => handlePrescriptionChange(index, "frequency", e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              placeholder="Days"
              value={prescription.days}
              onChange={(e) => handlePrescriptionChange(index, "days", e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
        ))}
        <button
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={handleAddPrescriptionField}
        >
          Add Another Medication
        </button>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2"
          onClick={handleSubmitPrescriptions}
        >
          Submit Prescriptions
        </button>
      </div>
      <button
        className="mt-6 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default PatientHistory;
