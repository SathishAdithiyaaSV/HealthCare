import React from "react";

const AppointmentScheduler = () => {
  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded p-8 mt-10">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Schedule an Appointment</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Doctor's Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Preferred Date</label>
          <input
            type="date"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 w-full"
        >
          Schedule Appointment
        </button>
      </form>
    </div>
  );
};

export default AppointmentScheduler;
