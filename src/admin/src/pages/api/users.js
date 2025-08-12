import axios from "axios";

//RUTA PARA GESTIONAR USUARIOS

const API_BASE = "http://localhost:3001";

function getAuthHeaders() {
  const token = localStorage.getItem("token"); 
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const usersApi = {
  list: () => axios.get(`${API_BASE}/usuarios`, { headers: getAuthHeaders() }),
  get: (id) => axios.get(`${API_BASE}/usuarios/${id}`, { headers: getAuthHeaders() }),
  create: (payload) => axios.post(`${API_BASE}/register`, payload, { headers: getAuthHeaders() }),
  update: (id, payload) => axios.put(`${API_BASE}/usuarios/${id}`, payload, { headers: getAuthHeaders() }),
  remove: (id) => axios.delete(`${API_BASE}/usuarios/${id}`, { headers: getAuthHeaders() }),
  login: (credentials) => axios.post(`${API_BASE}/login`, credentials),
};
