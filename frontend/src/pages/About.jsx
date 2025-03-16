import React from "react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white shadow p-6">
        <h1 className="text-3xl font-bold text-center">About Us</h1>
      </header>
      <main className="p-8 max-w-6xl mx-auto">
        <section className="text-center my-12">
          <h2 className="text-4xl font-semibold text-gray-800 mb-4">
            Welcome to Healthify
          </h2>
          <p className="text-gray-600 text-lg">
            Your trusted partner in connecting patients with healthcare providers
            for a healthier tomorrow.
          </p>
        </section>

        <section className="grid gap-8 md:grid-cols-2 mb-12">
          <div className="bg-white shadow rounded p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600">
              Our mission is to bridge the gap between healthcare providers and
              patients by offering a user-friendly platform for easy navigation
              to nearby hospitals and convenient doctor appointments.
            </p>
          </div>

          <div className="bg-white shadow rounded p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              What We Offer
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Locate nearby hospitals with map-based navigation.</li>
              <li>Book appointments with your preferred doctors online.</li>
              <li>Track your health metrics with features like BMI calculators.</li>
              <li>Access health reports and manage appointments effortlessly.</li>
            </ul>
          </div>
        </section>

        <section className="bg-white shadow rounded p-6 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Why Choose Us?
          </h2>
          <p className="text-gray-600">
            Our platform is designed with simplicity and accessibility in mind.
            Whether you're looking for emergency services or planning your next
            health checkup, we make the process seamless and efficient.
          </p>
        </section>

        <section className="bg-white shadow rounded p-6 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600">
            Have any questions or need support? Feel free to reach out to us!
          </p>
          <div className="mt-4">
            <p className="text-gray-700">
              <strong>Email:</strong> support@healthnavigator.com
            </p>
            <p className="text-gray-700">
              <strong>Phone:</strong> +1-800-HEALTH
            </p>
          </div>
        </section>

        <div className="flex justify-center">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
};

export default About;
