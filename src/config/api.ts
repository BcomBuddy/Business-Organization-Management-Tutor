// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Check if we're in production (Netlify) or development
const isProduction = import.meta.env.PROD;

export const API_ENDPOINTS = {
  CHAT_STREAM: isProduction 
    ? `/.netlify/functions/chat-stream` 
    : `${API_BASE_URL}/api/chat/stream`,
  CHAT: isProduction 
    ? `/.netlify/functions/chat` 
    : `${API_BASE_URL}/api/chat`,
  HEALTH: isProduction 
    ? `/.netlify/functions/health` 
    : `${API_BASE_URL}/api/health`,
  TEST: isProduction 
    ? `/.netlify/functions/chat` 
    : `${API_BASE_URL}/api/test`,
};

export default API_ENDPOINTS;


