import { useAuth } from '../../../contexts/AuthContext.jsx'
import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedAdmin({ children }) {
  const { user } = useAuth()
  const loc = useLocation()

  // Soporta 'role' o 'rol' según como lo guardes en AuthContext
  const role = user?.role ?? user?.rol
  const allowed = !!user && (role === 'ADMIN' || role === 'ORGANIZADOR')

  if (allowed) return children
  if (user) return <Navigate to="/403" replace />
  return <Navigate to="/login" state={{ from: loc }} replace />
}
