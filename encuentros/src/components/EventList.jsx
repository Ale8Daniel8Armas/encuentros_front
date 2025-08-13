import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ENDPOINTS } from '../config/api'

// RUTA PARA OBTENER LA LISTA DE EVENTOS CREADOS GET
export default function EventList(){
  const [events, setEvents] = useState([])

  useEffect(() => {
    (async () => {
      const res = await fetch(ENDPOINTS.eventos.list)
      if (res.ok) setEvents(await res.json())
    })()
  }, [])

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map(ev => (
        <Link key={ev.id} to={`/event/${ev.id}`} className="border rounded-lg overflow-hidden hover:shadow">
          <img src={ev.imagen} alt={ev.nombre} className="h-44 w-full object-cover"/>
          <div className="p-4">
            <div className="font-semibold">{ev.nombre}</div>
            <div className="text-sm text-gray-500">{ev.fecha}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
