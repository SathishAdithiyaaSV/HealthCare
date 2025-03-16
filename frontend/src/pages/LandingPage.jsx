import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LandingPage = () => {
  const [userLocation, setUserLocation] = useState([37.7749, -122.4194]); 
  const [hospitals, setHospitals] = useState([]);

  // Fetch user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          fetchNearbyHospitals(latitude, longitude); 
        },
        () => {
          alert("Unable to retrieve your location. Using default location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);

  // Function to fetch nearby hospitals
  const fetchNearbyHospitals = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=hospitals&limit=10&addressdetails=1&viewbox=${
          lng - 0.1
        },${lat + 0.1},${lng + 0.1},${lat - 0.1}`
      );

      const data = await response.json();
      const hospitals = data.map((hospital) => ({
        name: hospital.display_name,
        lat: parseFloat(hospital.lat),
        lng: parseFloat(hospital.lon),
        phone:`080 ${Math.floor(2000 + Math.random() * 8000)} ${Math.floor(1000 + Math.random() * 9000)}`, // Placeholder for phone number
      }));

      setHospitals(hospitals);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">


      {/* Search Section */}
      <div className="flex flex-col items-center mt-16">
        <h2 className="text-xl font-semibold text-gray-800">Search Facilities</h2>
        <div className="mt-4 flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded-l p-2 w-80"
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded-r hover:bg-green-600">
            Search
          </button>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-16 w-11/12 max-w-4xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Nearby Hospitals</h2>
        <MapContainer
          center={userLocation}
          zoom={13}
          className="w-full h-96"
          key={userLocation}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <UpdateMapCenter center={userLocation} />
          <Marker position={userLocation}>
            <Popup>
              <strong>Your Location</strong>
            </Popup>
          </Marker>
          {hospitals.map((hospital, index) => (
            <Marker key={index} position={[hospital.lat, hospital.lng]}>
              <Popup>
                <strong>{hospital.name}</strong>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Hospital List */}
        <table className="mt-6 w-full table-auto border-collapse border border-gray-300 text-gray-700">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
            </tr>
          </thead>
          <tbody>
            {hospitals.map((hospital, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{hospital.name}</td>
                <td className="border border-gray-300 px-4 py-2">{hospital.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Custom Component to Dynamically Update Map Center
const UpdateMapCenter = ({ center }) => {
  const map = useMap();
  map.setView(center);
  return null;
};

export default LandingPage;
