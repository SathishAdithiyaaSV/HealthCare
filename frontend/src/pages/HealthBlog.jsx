import React, { useEffect, useState } from "react";
import axios from "axios";

const HealthBlog = () => {
  const [articles, setArticles] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const getRandomPlaceholderImage = () => {
    const randomId = Math.floor(Math.random() * 1000); 
    return `https://picsum.photos/400/200?random=${randomId}`;
  };

  // Fetch health articles using NewsAPI
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const API_KEY = import.meta.env.VITE_NEWS_API_KEY; 
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines?category=health&country=us&apiKey=${API_KEY}`
        );
        setArticles(response.data.articles); 
        setLoading(false);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to fetch articles. Please try again.");
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Filter out articles with missing content (image, title, description)
  const validArticles = articles.filter(
    article => article.title && article.urlToImage && article.description
  );

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Health Related News</h1>
      {loading && <p className="text-gray-600">Loading articles...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {validArticles.map((article, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition"
          >
            <img
              src={article.urlToImage || getRandomPlaceholderImage()}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {article.title}
              </h2>
              <p className="text-gray-600 text-sm">
                {article.description || "No description available."}
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                Read More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthBlog;
