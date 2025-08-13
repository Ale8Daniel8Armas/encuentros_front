import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useNavigate, Link } from 'react-router-dom'

/* RUTA DE USUARIOS PARA EL REGISTRO */
export default function RegisterTemplate(){
  const { register } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    password: '',
    confirm: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.nombre.trim() || !form.correo.trim() || !form.password.trim()) {
      setError('Completa todos los campos'); return
    }
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden'); return
    }
    setLoading(true)
    try {
      // Importante: el backend espera { nombre, correo, password, rol }
      await register({
        nombre: form.nombre,
        correo: form.correo,
        password: form.password,
        rol: 'ASISTENTE', // por defecto TODOS clientes/asistentes
      })
      nav('/login')
    } catch (err) {
      setError(err.message || 'No se pudo registrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Crear cuenta</h2>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="border rounded w-full px-3 py-2"
          placeholder="Nombre"
          value={form.nombre}
          onChange={e=>setForm({...form,nombre:e.target.value})}
          autoComplete="name"
        />
        <input
          className="border rounded w-full px-3 py-2"
          placeholder="Correo"
          value={form.correo}
          onChange={e=>setForm({...form,correo:e.target.value})}
          autoComplete="email"
        />
        <input
          type="password"
          className="border rounded w-full px-3 py-2"
          placeholder="Contraseña"
          value={form.password}
          onChange={e=>setForm({...form,password:e.target.value})}
          autoComplete="new-password"
        />
        <input
          type="password"
          className="border rounded w-full px-3 py-2"
          placeholder="Confirmar contraseña"
          value={form.confirm}
          onChange={e=>setForm({...form,confirm:e.target.value})}
          autoComplete="new-password"
        />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button
          className={`w-full py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-black'}`}
          disabled={loading}
        >
          {loading ? 'Creando…' : 'Registrarme'}
        </button>
      </form>

      <div className="mt-4 text-sm text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-black underline hover:opacity-80">
          Inicia sesión
        </Link>
      </div>
    </div>
  )
}
