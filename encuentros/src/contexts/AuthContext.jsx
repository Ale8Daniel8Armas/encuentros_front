import { createContext, useContext, useEffect, useState } from 'react'
import { ENDPOINTS } from '../config/api'
import { useLocalStorage } from '../hooks/useLocalStorage'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useLocalStorage('enc_token', null)
  const [user, setUser] = useLocalStorage('enc_user', null)

  useEffect(() => {
    // Aquí podrías validar token si es necesario
  }, [token])

  // Backend espera { correo, password } y responde { token, id, nombre, correo, rol }
  const login = async (correo, password) => {
    const res = await fetch(ENDPOINTS.auth.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, password })
    })
    const raw = await res.text()
    let data = {}
    try { data = raw ? JSON.parse(raw) : {} } catch {}

    if (!res.ok) {
      const msg = data?.message || data?.error || `Login failed (${res.status})`
      throw new Error(msg)
    }

    setToken(data.token || null)
    setUser({
      id: data.id, nombre: data.nombre, correo: data.correo, role: data.rol
    })
  }

    const register = async (payload) => {
    // Tolerante a diferentes nombres de campo en el form
    const body = {
        nombre: payload?.nombre ?? payload?.name ?? '',
        correo: payload?.correo ?? payload?.email ?? '',
        password: payload?.password ?? '',
        rol: payload?.rol || 'ASISTENTE',
    }

    const res = await fetch(ENDPOINTS.auth.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })

    // Intentamos leer el mensaje del backend
    const raw = await res.text()
    let data = {}
    try { data = raw ? JSON.parse(raw) : {} } catch {}

    if (!res.ok) {
        const msg = data?.message || data?.error || `Register failed (${res.status})`
        throw new Error(msg)
    }
    return data
    }


  const logout = () => { setToken(null); setUser(null) }

  const authFetch = (url, opts = {}) => {
    return fetch(url, {
      ...opts,
      headers: {
        ...(opts.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })
  }

  return (
    <AuthCtx.Provider value={{ token, user, login, register, logout, authFetch }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
