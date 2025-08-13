import { useEffect, useState } from 'react'
import { ENDPOINTS } from '../../../../config/api'

//RUTA PARA CARGAR NOTIFICACIONES EN EL DASHBOARD
export default function Notifications(){
  const [items,setItems] = useState([])

  useEffect(() => {
    (async () => {
      const res = await fetch(ENDPOINTS.notifications.list)
      if (res.ok) setItems(await res.json())
    })()
  }, [])

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Notificaciones</h2>
      <div className="space-y-2">
        {items.map(n => (
          <div key={n.id} className="border rounded p-2">
            <div className="font-semibold">{n.titulo}</div>
            <div className="text-sm text-gray-600">{n.mensaje}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
