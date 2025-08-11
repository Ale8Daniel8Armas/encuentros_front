import axios from "axios";

const API_BASE = "http://localhost:3001";

function getAuthHeaders() {
  const token = localStorage.getItem("token"); 
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const usersApi = {
  list: () => axios.get(`${API_BASE}/users`, { headers: getAuthHeaders() }),
  get: (id) => axios.get(`${API_BASE}/users/${id}`, { headers: getAuthHeaders() }),
  create: (payload) => axios.post(`${API_BASE}/register`, payload, { headers: getAuthHeaders() }),
  update: (id, payload) => axios.put(`${API_BASE}/users/${id}`, payload, { headers: getAuthHeaders() }),
  remove: (id) => axios.delete(`${API_BASE}/users/${id}`, { headers: getAuthHeaders() }),
  login: (credentials) => axios.post(`${API_BASE}/login`, credentials),
};
