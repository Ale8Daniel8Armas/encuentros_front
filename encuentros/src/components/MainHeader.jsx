import { useEffect, useState } from 'react'
import { ENDPOINTS } from '../config/api'

//RUTA DE EVENTOS PARA OBTENER IMAGEN Y MOSTRAR EN EL SLIDER
export default function MainHeader(){
  const [slides, setSlides] = useState([])

  useEffect(() => {
    (async () => {
      const res = await fetch(ENDPOINTS.eventos.list) // GET eventos
      if (res.ok) {
        const data = await res.json()
        setSlides((data || []).slice(0,5))
      }
    })()
  }, [])

  return (
    <section className="w-full bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Próximos eventos</h2>
            <p className="text-gray-600">Compra tus entradas en segundos.</p>
          </div>
          <div className="overflow-x-auto flex gap-4">
            {slides.map(ev => (
              <img key={ev.id} src={ev.imagen} alt={ev.nombre}
                   className="h-40 rounded shadow min-w-64 object-cover"/>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
