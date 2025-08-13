import { useEffect, useState } from 'react'
import { useAuth } from '../../../../contexts/AuthContext.jsx'
import { ENDPOINTS } from '../../../../config/api'

// RUTA PARA CARGAR ASISTENCIAS
//RUTA PARA CREAR ASISTENCIA (CREAR METODO EN EL BACKEND SI HACE FALTA)
export default function Asistencia(){
  const { authFetch } = useAuth()
  const [items,setItems] = useState([])
  const [form,setForm] = useState({ usuarioId:'', eventoId:'', estado:'ASISTIO' })

  useEffect(() => {
    (async () => {
      const res = await authFetch(ENDPOINTS.asistencia.list)
      if (res.ok) setItems(await res.json())
    })()
  }, [])

  const crear = async (e) => {
    e.preventDefault()
    const res = await authFetch(ENDPOINTS.asistencia.create, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(form)
    })
    if (res.ok){
      const nuevo = await res.json()
      setItems(prev=>[nuevo,...prev])
    } else {
      alert('Error creando asistencia')
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Asistencias</h2>
      <form onSubmit={crear} className="flex gap-2 mb-4">
        <input className="border rounded px-2 py-1" placeholder="Usuario ID" value={form.usuarioId} onChange={e=>setForm({...form,usuarioId:e.target.value})}/>
        <input className="border rounded px-2 py-1" placeholder="Evento ID" value={form.eventoId} onChange={e=>setForm({...form,eventoId:e.target.value})}/>
        <select className="border rounded px-2 py-1" value={form.estado} onChange={e=>setForm({...form,estado:e.target.value})}>
          <option>ASISTIO</option><option>NO_ASISTIO</option>
        </select>
        <button className="px-3 py-1 rounded bg-black text-white">Crear</button>
      </form>
      <div className="space-y-2">
        {items.map(a => (
          <div key={a.id} className="border rounded p-2">
            <div className="text-sm text-gray-600">Usuario {a.usuarioId} • Evento {a.eventoId}</div>
            <div className="font-semibold">{a.estado}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
