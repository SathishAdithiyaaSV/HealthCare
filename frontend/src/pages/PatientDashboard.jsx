import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL =
  import.meta.env.VITE_APP_BACKEND_URL ?? "http://localhost:5000";

const PatientDashboard = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your lab results are now available." },
    {
      id: 2,
      message:
        "Your appointment with Dr. Smith is confirmed for Jan 25th at 3:00 PM.",
    },
  ]);

  const [prescriptions, setPrescriptions] = useState({});

  const [appointments, setAppointments] = useState([
    { id: 1, doctor: "Dr. Smith", date: "Jan 25, 2025", time: "3:00 PM" },
    { id: 2, doctor: "Dr. Taylor", date: "Feb 2, 2025", time: "11:00 AM" },
  ]);

  const [healthMetrics, setHealthMetrics] = useState({
    bloodPressure: "120/80 mmHg",
    glucose: "90 mg/dL",
    weight: "70 kg",
    heartRate: "72 bpm",
  });

  const navigate = useNavigate();

  const handleJoinCall = (appointmentId) => {
    navigate(`/meeting-room/${appointmentId}`);
  };

  useEffect(() => {
    async function fetchPrescription() {
      const response = await fetch(
        `${BACKEND_URL}/api/patient/getPrescriptions`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const json = await response.json();

      setPrescriptions(json.prescriptions);
      console.log(json);
    }

    async function fetchAppointments() {
      const response = await fetch(`${BACKEND_URL}/api/patient/appointments`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();

      setAppointments(json.appointments);
    }

    async function fetchProfile(){
      const response = await fetch(`${BACKEND_URL}/api/patient`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      console.log(json);
      setHealthMetrics(json);
    }

    fetchProfile();
    fetchPrescription();
    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow p-4">
        <h1 className="text-2xl font-bold text-gray-700">Patient Dashboard</h1>
      </header>
      <main className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notifications */}
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
          <ul className="mt-4 text-gray-600">
            {notifications.map((notification) => (
              <li key={notification.id} className="border-b py-2">
                {notification.message}
              </li>
            ))}
          </ul>
        </div>

        {/* Health Metrics */}
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Health Metrics
          </h2>
          <div className="mt-4 text-gray-700">
            <p>
              <strong>Blood Pressure:</strong> {healthMetrics.bloodPressure}
            </p>
            <p>
              <strong>Glucose Level:</strong> {healthMetrics.glucose}
            </p>
            <p>
              <strong>Weight:</strong> {healthMetrics.weight}
            </p>
            <p>
              <strong>Heart Rate:</strong> {healthMetrics.heartRate}
            </p>
          </div>
        </div>

        {/* Prescriptions */}
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold text-gray-800">Prescriptions</h2>
          <table className="mt-4 w-full table-auto border-collapse border border-gray-300 text-gray-700">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Medication
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Frequency
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  No of days
                </th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.length > 0 &&
                prescriptions[0].medications &&
                prescriptions[0].medications.map((medication, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {medication.medication}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {medication.frequency}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {medication.days}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Appointments */}
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Upcoming Appointments
          </h2>
          <ul className="mt-4 text-gray-600">
            {appointments.map((appointment) => (
              <li key={appointment.id} className="border-b py-2">
                <strong>Doctor:</strong> {appointment.doctorName} <br />
                <strong>Date:</strong> {appointment.date} <br />
                <strong>Time:</strong> {appointment.time} <br />
                <strong>Status:</strong> {appointment.status}
                <button
                  onClick={() => handleJoinCall(appointment._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Join
                </button>
              </li>
            ))}
          </ul>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => navigate("/scheduleappointment")}
          >
            Schedule New Appointment
          </button>
        </div>

        {/* Reports Section */}
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Health Reports
          </h2>
          <p className="text-gray-600 mt-2">
            Access your lab results and detailed health history.
          </p>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => navigate("/reports")}
          >
            View Reports
          </button>
        </div>

        {/* Settings Section */}
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Account Settings
          </h2>
          <p className="text-gray-600 mt-2">
            Manage your account details and preferences.
          </p>
          <button
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={() => navigate("/settings")}
          >
            Go to Settings
          </button>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
