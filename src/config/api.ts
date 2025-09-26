// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const API_ENDPOINTS = {
  CHAT_STREAM: `${API_BASE_URL}/api/chat/stream`,
  CHAT: `${API_BASE_URL}/api/chat`,
  HEALTH: `${API_BASE_URL}/api/health`,
  TEST: `${API_BASE_URL}/api/test`,
};

export default API_ENDPOINTS;


