import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 p-6 text-center text-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Quick Links</h2>
        <ul className="flex justify-center space-x-6 mt-2">
          <li>
            <a href="/" className="text-gray-600 hover:text-blue-600">
              Home
            </a>
          </li>
          <li>
            <a href="/about" className="text-gray-600 hover:text-blue-600">
              About Us
            </a>
          </li>
          <li>
            <a href="/contact" className="text-gray-600 hover:text-blue-600">
              Contact
            </a>
          </li>
          <li>
            <a href="/privacy-policy" className="text-gray-600 hover:text-blue-600">
              Privacy Policy
            </a>
          </li>
        </ul>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Follow Us</h2>
        <div className="flex justify-center space-x-4 mt-2">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            Facebook
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600"
          >
            Twitter
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 hover:text-pink-700"
          >
            Instagram
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-900"
          >
            LinkedIn
          </a>
        </div>
      </div>
      <p className="text-gray-500">
        © {currentYear} HealthCare App. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
