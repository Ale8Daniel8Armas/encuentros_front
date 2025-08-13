// Punto único para rutas del backend. En dev, Vite proxy /api -> http://localhost:8080
export const API_BASE = '/api';

export const ENDPOINTS = {
  auth: {
    login: `${API_BASE}/auth/login`,        // backend real
    register: `${API_BASE}/auth/register`,  // backend real
  },
  eventos: {
    list: `${API_BASE}/eventos`,            // GET lista
    byId: (id) => `${API_BASE}/eventos/${id}`, // GET detalle
    create: `${API_BASE}/eventos`,          // POST crear
    update: (id) => `${API_BASE}/eventos/${id}`, // PUT actualizar
    delete: (id) => `${API_BASE}/eventos/${id}`, // DELETE eliminar
  },
  entradas: {
    list: `${API_BASE}/entradas`,           // GET todas (para Admin)
    create: `${API_BASE}/entradas`,         // POST { eventoId, zonaNombre }
    usar: `${API_BASE}/entradas/usar`,      // PUT { codigoQR }
  },
  // Eliminado: notifications, users, asistencia, search del backend (no existen).
};
