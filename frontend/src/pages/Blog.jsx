import React, { useEffect, useState } from "react";
import axios from "axios";

const HealthBlog = () => {
  // Static Blogs
  const staticBlogs = [
    {
      id: 1,
      title: "5 Simple Tips to Stay Healthy",
      description:
        "Learn how to manage your health with simple daily routines like drinking water, staying active, and eating balanced meals.",
      imageUrl: "https://picsum.photos/400/200?random=1",
    },
    {
      id: 2,
      title: "Why Sleep Is Crucial for Your Health",
      description:
        "A good night's sleep helps boost your immune system, memory, and overall mental well-being.",
      imageUrl: "https://picsum.photos/400/200?random=2",
    },
    {
      id: 3,
      title: "The Importance of Staying Hydrated",
      description:
        "Staying hydrated improves energy levels, skin health, and digestion. Make water your daily companion.",
      imageUrl: "https://picsum.photos/400/200?random=3",
    },
  ];

  // State for Dynamic Blogs
  const [dynamicBlogs, setDynamicBlogs] = useState([]);

  // Function to Fetch Blogs Using Gemini API
  const fetchDynamicBlogs = async () => {
    try {
      const API_KEY =import.meta.env.VITE_GEMINI_API_KEY; // Replace with your Gemini API key
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: "Generate 10 short blog posts on maintaining health habits. Each blog post should include a title, a short description, and an actionable tip. Use plain text without any bold or italic characters.Also the title need not be labeled",
                },
              ],
            },
          ],
        }
      );

      const generatedText =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Parse the response into blog posts
      const blogsArray = generatedText
        .split("\n\n") // Split the blogs
        .filter((blog) => blog) // Remove empty lines
        .map((blog, index) => ({
          id: `dynamic-${index + 1}`,
          title: blog.split("\n")[0] || "Health Blog",
          description:
            blog.split("\n")[1] ||
            "This is a dynamically generated health blog description.",
          imageUrl: `https://picsum.photos/400/200?random=${index + 4}`, // Placeholder image
        }));

      setDynamicBlogs(blogsArray);
    } catch (error) {
      console.error("Error fetching dynamic blogs:", error);
    }
  };

  // Fetch dynamic blogs on page load
  useEffect(() => {
    fetchDynamicBlogs();
  }, []);

  return (
    <div className="container mx-auto p-8">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        Health Management Blogs
      </h1>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Static Blogs */}
        {staticBlogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition"
          >
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {blog.title}
              </h2>
              <p className="text-gray-600 text-sm">{blog.description}</p>
            </div>
          </div>
        ))}

        {/* Dynamically Generated Blogs */}
        {dynamicBlogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition"
          >
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {blog.title}
              </h2>
              <p className="text-gray-600 text-sm">{blog.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthBlog;
