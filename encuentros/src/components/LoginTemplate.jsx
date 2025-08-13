import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useNavigate, Link } from 'react-router-dom'

// RUTA PARA REALIZAR EL LOGIN
export default function LoginTemplate(){
  const [correo,setCorreo] = useState('')
  const [password,setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(correo, password)   // el backend usa 'correo' y 'password'
      nav('/')                        // redirige al home al iniciar sesión
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="border rounded w-full px-3 py-2"
          placeholder="Correo"
          value={correo}
          onChange={e=>setCorreo(e.target.value)}
          autoComplete="email"
        />
        <input
          type="password"
          className="border rounded w-full px-3 py-2"
          placeholder="Contraseña"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          autoComplete="current-password"
        />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button
          className={`w-full py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-black'}`}
          disabled={loading}
        >
          {loading ? 'Ingresando…' : 'Entrar'}
        </button>
      </form>

      {/* CTA para registro */}
      <div className="mt-4 text-sm text-gray-600">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="text-black underline hover:opacity-80">
          Regístrate
        </Link>
      </div>
    </div>
  )
}
