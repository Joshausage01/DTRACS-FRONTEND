// src/config.js
const savedApiUrl = localStorage.getItem("API_BASE_URL");

// Default fallback
const defaultApiUrl = process.env.REACT_APP_API_BASE_URL;

const config = {
  API_BASE_URL: (savedApiUrl || defaultApiUrl).trim(),
};

export default config;