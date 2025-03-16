import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Toast notifications
import "react-toastify/dist/ReactToastify.css"; // Toastify styles
import sideimage from "../assets/top_service.png";

const BACKEND_URL =
  import.meta.env.VITE_APP_BACKEND_URL ?? 'http://localhost:5000';

const LoginForm = () => {
  const [signState, setSignState] = useState("Sign In");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient"); // New state for user role
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userAuth = async (event) => {
    event.preventDefault(); // Prevent form default behavior
    setLoading(true); // Set loading state

    try {
      if (signState === "Sign In") {
        // Handle login
        const response = await fetch(`${BACKEND_URL}/api/${role}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const json = await response.json();
        if (json.token) {
          localStorage.setItem("jwtToken", json.token);
          toast.success("Login successful!");
          navigate(role === "doctor" ? "/doctor-dashboard" : (role === "patient" ? "/patient-dashboard" : "/admin-dashboard"));
        } else if (json.error) {
          toast.error("Error: " + json.error);
        } else if (json.message) {
          toast.success("Message: " + json.message);
        }
        //navigate(role === "doctor" ? "/doctor-dashboard" : "/dashboard");
      } else {
        // Handle signup
        const response = await fetch(`${BACKEND_URL}/api/admin/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        });

        const json = await response.json();
        setSignState("Sign In")
        toast.success("Signup successful!");
      }
    } catch (error) {
      // Handle errors
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false); // Reset loading state
    }
  };
  return (
    <>
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded flex mt-10">
        {/* Side Image */}
        <div className="hidden md:block w-1/2">
          <img
            src={sideimage}
            alt="Side Illustration"
            className="w-full h-full object-cover rounded-l"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {signState}
          </h2>
          <form onSubmit={userAuth}>
            {signState === "Sign Up" && (
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
                required
              />
            </div>

            {signState === "Sign In" && (
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">
                  Are you a doctor or patient?
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-500 text-white px-6 py-2 rounded w-full ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
              }`}
            >
              {loading ? "Processing..." : signState}
            </button>
          </form>
          <div className="mt-4 text-center">
            <p>
              {signState === "Sign In"
                ? "Don't have an account?"
                : "Already have an account?"}
              <button
                type="button"
                onClick={() =>
                  setSignState(signState === "Sign In" ? "Sign Up" : "Sign In")
                }
                className="text-blue-500 hover:underline ml-2"
              >
                {signState === "Sign In" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* ToastContainer */}
      <ToastContainer />
    </>
  );
};

export default LoginForm;
