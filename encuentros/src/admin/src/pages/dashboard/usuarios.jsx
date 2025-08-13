import { useState } from 'react'
import { ENDPOINTS } from '../../../../config/api'
import { useAuth } from '../../../../contexts/AuthContext.jsx'

const ROLES = ['ADMIN', 'ORGANIZADOR', 'ASISTENTE']

export default function Usuarios() {
  const { token } = useAuth() // opcional
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    password: '',
    rol: 'ASISTENTE',
  })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState([]) // lista local de los creados en esta sesión

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.nombre.trim() || !form.correo.trim() || !form.password.trim()) {
      setError('Completa todos los campos')
      return
    }

    setCreating(true)
    try {
      const res = await fetch(ENDPOINTS.auth.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || 'No se pudo crear el usuario')

      // guarda local para mostrar en tabla (el backend no expone /usuarios list)
      setCreated((prev) => [
        { id: data.id, nombre: data.nombre, correo: data.correo, rol: data.rol },
        ...prev,
      ])

      // reset
      setForm({ nombre: '', correo: '', password: '', rol: 'ASISTENTE' })
      alert('Usuario creado')
    } catch (err) {
      setError(err.message || 'Error creando usuario')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Usuarios</h2>

      <form onSubmit={submit} className="grid md:grid-cols-2 gap-3">
        <input
          className="border rounded px-2 py-1"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />
        <input
          type="email"
          className="border rounded px-2 py-1"
          placeholder="Correo"
          value={form.correo}
          onChange={(e) => setForm({ ...form, correo: e.target.value })}
        />
        <input
          type="password"
          className="border rounded px-2 py-1"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select
          className="border rounded px-2 py-1"
          value={form.rol}
          onChange={(e) => setForm({ ...form, rol: e.target.value })}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {error && (
          <div className="text-red-600 text-sm md:col-span-2">{error}</div>
        )}

        <button
          disabled={creating}
          className={`px-3 py-2 rounded text-white md:col-span-2 ${
            creating ? 'bg-gray-400' : 'bg-black'
          }`}
        >
          {creating ? 'Creando…' : 'Crear usuario'}
        </button>
      </form>

      <div>
        <div className="font-semibold mb-2">Últimos creados (local):</div>
        <div className="space-y-2">
          {created.map((u, index) => (
            <div
              key={u.id ?? `${u.correo}-${index}`}
              className="border rounded p-3 flex items-center justify-between"
            >
              <div>
                <div className="font-semibold">{u.nombre}</div>
                <div className="text-sm text-gray-600">{u.correo}</div>
              </div>
              <span className="px-2 py-1 rounded bg-gray-100 text-xs">
                {u.rol}
              </span>
            </div>
          ))}
          {created.length === 0 && (
            <div className="text-sm text-gray-500">
              Aún no has creado usuarios en esta sesión.
            </div>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          * El backend no expone endpoint para listar usuarios; esta tabla es
          solo de sesión.
        </div>
      </div>
    </div>
  )
}
