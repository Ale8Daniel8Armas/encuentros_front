import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { ENDPOINTS } from '../config/api'

// /* RUTA DE USUARIOS PARA EL REGISTRO */
export default function RegisterTemplate(){
  const { login } = useAuth()
  const [form, setForm] = useState({ nombre:'', correo:'', password:'', confirm:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.nombre.trim() || !form.correo.trim() || !form.password) {
      setError('Completa todos los campos'); return
    }
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden'); return
    }
    setLoading(true)
    try {
      const res = await fetch(ENDPOINTS.auth.register, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          correo: form.correo,
          password: form.password,
          rol: 'ASISTENTE' // por defecto todos son asistentes
        })
      })
      const data = await res.json().catch(()=> ({}))
      if (!res.ok) throw new Error(data?.message || data || 'No se pudo registrar')
      // Auto-login para comodidad
      await login(form.correo, form.password)
      alert('Registro exitoso')
    } catch (err) {
      setError(err.message || 'Error de registro')
    } finally { setLoading(false) }
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Crear cuenta</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="border rounded px-3 py-2 w-full" placeholder="Nombre"
               value={form.nombre} onChange={e=>setForm({...form, nombre:e.target.value})}/>
        <input type="email" className="border rounded px-3 py-2 w-full" placeholder="Correo"
               value={form.correo} onChange={e=>setForm({...form, correo:e.target.value})}/>
        <input type="password" className="border rounded px-3 py-2 w-full" placeholder="Contraseña"
               value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
        <input type="password" className="border rounded px-3 py-2 w-full" placeholder="Confirmar contraseña"
               value={form.confirm} onChange={e=>setForm({...form, confirm:e.target.value})}/>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button disabled={loading} className={`px-4 py-2 rounded text-white ${loading?'bg-gray-400':'bg-black'}`}>
          {loading ? 'Creando…' : 'Registrarme'}
        </button>
      </form>
      <div className="text-xs text-gray-500 mt-3">
        * El backend requiere {`{ nombre, correo, password, rol }`} y emite JWT. :contentReference[oaicite:2]{index=2}
      </div>
    </div>
  )
}
