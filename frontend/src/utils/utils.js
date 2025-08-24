export const BACKEND_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/v1` 
  : "http://localhost:5000/api/v1";

