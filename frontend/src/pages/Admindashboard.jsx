import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // For making HTTP requests

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null); // To show upload status messages
  const [patientId, setPatientId] = useState("");
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/patients");
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle report upload
  const handleUpload = async () => {
    if (!file || !patientId) {
      alert("Please select a patient and a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("name", fileName);
    formData.append("patientId", patientId);

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // Format YYYY-MM-DD

    formData.append("date", formattedDate);

    try {
      await axios.post("http://localhost:5000/api/report/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadStatus({ success: true, message: "File uploaded successfully!" });
    } catch (error) {
      setUploadStatus({ success: false, message: "Error uploading the file." });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 shadow p-6">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
      </header>
      <main className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section: Health Reports */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Report</h2>
          <p className="text-gray-600 mb-6">Upload patient reports here.</p>

          {/* Upload Report Form */}
          <div>
            <input
              type="text"
              placeholder="Report Name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="border p-3 w-full rounded mb-4"
            />

            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="border p-3 w-full rounded mb-4"
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.name} (ID: {patient._id})
                </option>
              ))}
            </select>

            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="border p-3 w-full rounded mb-4"
            />

            <button
              onClick={handleUpload}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Upload Report
            </button>

            {/* Show upload status */}
            {uploadStatus && (
              <div
                className={`mt-4 p-3 rounded ${
                  uploadStatus.success ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
                }`}
              >
                {uploadStatus.message}
              </div>
            )}
          </div>
        </div>

        {/* Section: Appointments */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Appointments</h2>
          <p className="text-gray-600 mb-6">Manage upcoming appointments here.</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            See Upcoming Appointments
          </button>
        </div>

        {/* Navigation to Register Patient */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Patient Management</h2>
          <p className="text-gray-600 mb-6">Register new patients.</p>
          <button
            onClick={() => navigate("/register-patient")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Register Patient
          </button>
        </div>

        {/* Navigation to Register Doctor */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Doctor Management</h2>
          <p className="text-gray-600 mb-6">Register new doctors.</p>
          <button
            onClick={() => navigate("/register-doctor")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Register Doctor
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
