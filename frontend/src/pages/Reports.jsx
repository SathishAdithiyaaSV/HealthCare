import React, { useState, useEffect } from "react";

const BACKEND_URL =
  import.meta.env.VITE_APP_BACKEND_URL ?? 'http://localhost:5000';

const Reports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${BACKEND_URL}/api/getReports`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();
      console.log(json.reports)

      // Process the buffer to create a Blob URL
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

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow p-4">
        <h1 className="text-2xl font-bold text-gray-700">Health Reports</h1>
      </header>
      <main className="p-8">
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold text-gray-800">Your Reports</h2>
          <p className="text-gray-600 mt-2">
            Below is the list of your medical reports. Click the download button to save the report.
          </p>
          <table className="mt-6 w-full table-auto border-collapse border border-gray-300 text-gray-700">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Report Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
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
      </main>
    </div>
  );
};

export default Reports;
