import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppointmentForm from './components/AppointmentForm';
import Hero from "./pages/Hero";
import LoginForm from "./pages/Login";
import PatientDashboard from "./pages/PatientDashboard";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import { ToastContainer } from "react-toastify";
import HealthBlog from "./pages/HealthBlog";
import Blog from "./pages/Blog";
import Chatbot from "./components/Chatbot";
import ScheduleAppointment from "./pages/Appointment";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/Admindashboard";
import RegisterPatient from "./pages/RegisterPatient";
import RegisterDoctor from "./pages/RegisterDoctor";
import PatientHistory from "./pages/PatientHistory";
import About from "./pages/About";
import LandingPage from "./pages/LandingPage";
import MeetingRoom from "./pages/MeetingRoom";

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <div className="flex-grow">
          <Routes>       
            <Route path="/" element={<LandingPage />} />     
            <Route path="/news" element={<HealthBlog />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/hero" element={<Hero />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/scheduleappointment" element={<ScheduleAppointment />} />
            <Route path="/schedule-appointment" element={<AppointmentForm />} />
            <Route path="/register-patient" element={<RegisterPatient />} />
            <Route path="/register-doctor" element={<RegisterDoctor />} />
            <Route path="/patient/:patientId" element={<PatientHistory />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/meeting-room/*" element={<MeetingRoom />} />
          </Routes>
        </div>

        {/* Chatbot */}
        <Chatbot />

        {/* Footer */}
        <ToastContainer />
        <Footer />
      </div>
    </Router>
  );
};

export default App;