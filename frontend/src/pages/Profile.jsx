import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify"; // Toast notifications
import "react-toastify/dist/ReactToastify.css"; // Toastify styles

const BACKEND_URL =
  import.meta.env.VITE_APP_BACKEND_URL ?? "http://localhost:5000";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
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
      setName(json.name);
      setEmail(json.email);
    }
    fetchProfile();
  }, [])
  async function handleUpdateProfile(e){
    e.preventDefault();
    const response = await fetch(`${BACKEND_URL}/api/patient/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
      }),
    });
    const json = await response.json();
    console.log(json);
    toast.success(json.message);
  }
  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded p-8 mt-10">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Profile</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          onClick={handleUpdateProfile}
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 w-full"
        >
          Update Profile
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Profile;
