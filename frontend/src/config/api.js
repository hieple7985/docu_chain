const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  
  // Users
  USERS: `${API_BASE_URL}/users`,
  PROFILE: `${API_BASE_URL}/users/profile`,
  
  // Documents
  DOCUMENTS: `${API_BASE_URL}/documents`,
  DOCUMENT_UPLOAD: `${API_BASE_URL}/documents/upload`,
  DOCUMENT_OPTIMIZE: `${API_BASE_URL}/documents/optimize`,
  DOCUMENT_SPLIT: `${API_BASE_URL}/documents/split`,
  DOCUMENT_EXTRACT_TEXT: `${API_BASE_URL}/documents/extract-text`,
  DOCUMENT_PROTECT: `${API_BASE_URL}/documents/protect`,
  DOCUMENT_SIGN: `${API_BASE_URL}/documents/sign`,
};

export default API_BASE_URL;
