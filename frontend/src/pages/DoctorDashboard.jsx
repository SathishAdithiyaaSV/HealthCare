import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate, Link } from "react-router-dom";

const BACKEND_URL =
  import.meta.env.VITE_APP_BACKEND_URL ?? 'http://localhost:5000';

const DoctorDashboard = () => {
  const [userLocation, setUserLocation] = useState([37.7749, -122.4194]); // Default: San Francisco
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [clinicLocation, setClinicLocation] = useState([37.7749, -122.4194]);
  const [reports, setReports] = useState([]);

  // Fetch user location and clinic details
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setClinicLocation([latitude, longitude]); // Assuming doctor is in the current location
          // Optionally, fetch nearby clinics or hospitals based on doctor's location
        },
        () => {
          alert("Unable to retrieve your location. Using default location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);

  // Dummy data for appointments and patients
  useEffect(() => {
    // setAppointments([
    //   { id: 1, patientName: "John Doe", date: "2025-01-10", time: "10:00 AM" },
    //   { id: 2, patientName: "Jane Smith", date: "2025-01-12", time: "2:00 PM" },
    // ]);
    setPatients([
      { id: 1, name: "John Doe", age: 35, gender: "Male", condition: "Flu" },
      { id: 2, name: "Jane Smith", age: 28, gender: "Female", condition: "Asthma" },
    ]);
    async function fetchAppointments() {
      const response = await fetch(`${BACKEND_URL}/api/getAppointments`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();
      setAppointments(json.appointments)
    }
    async function fetchReports() {
      const response = await fetch(`${BACKEND_URL}/api/doctor/getReports`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();
      const processedReports = json.reports.map((report) => {
        const blob = new Blob([Uint8Array.from(report.pdf.data)], {
          type: "application/pdf",
        });
        const url = URL.createObjectURL(blob);
        return {
          ...report,
          link: url, // Add the downloadable link to each report
        };
      });

      setReports(processedReports);
    }
    fetchAppointments();
    fetchReports();
  }, []);

  const navigate = useNavigate();

  const handleJoinCall = (appointmentId) => {
    navigate(`/meeting-room/${appointmentId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow p-4">
        <h1 className="text-2xl font-bold text-gray-700">Doctor Dashboard</h1>
      </header>
      <main className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section: Patient Information */}
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold text-gray-800">Patient Information</h2>
          <p className="text-gray-600 mt-2">View your patients' medical details.</p>
          <table className="mt-6 w-full table-auto border-collapse border border-gray-300 text-gray-700">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Patient Id</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Report Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2"><Link to={`/patient/${report.patientId}`}>{report.patientId}</Link></td>
                  <td className="border border-gray-300 px-4 py-2">{report.date}</td>
                  <td className="border border-gray-300 px-4 py-2">{report.name}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <a
                      href={report.link}
                      download={`${report.type}-${report.date}.pdf`}
                      className="text-blue-500 hover:underline"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section: Appointments */}
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold text-gray-800">Appointments</h2>
          <p className="text-gray-600 mt-2">Manage your upcoming appointments.</p>
          <table className="mt-4 w-full table-auto border-collapse border border-gray-300 text-gray-700">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Patient Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2"><Link to={`/patient/${appointment.patientId}`} >{appointment.patientName}</Link></td>
                  <td className="border border-gray-300 px-4 py-2">{appointment.date}</td>
                  <td className="border border-gray-300 px-4 py-2">{appointment.time}</td>
                  <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleJoinCall(appointment._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Join
                  </button>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};


export default DoctorDashboard;