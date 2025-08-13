import { useEffect, useState } from 'react'
import { useCart } from '../contexts/CartContext.jsx'
import { ENDPOINTS } from '../config/api'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function FormPayment(){
  const { items, clear } = useCart()
  const { user, authFetch } = useAuth()
  const [events, setEvents] = useState([])

  /* RUTA DE OBTENER EVENTOS PARA LA COMPRA*/
  useEffect(() => {
    (async () => {
      const res = await fetch(ENDPOINTS.eventos.list)
      if (res.ok) setEvents(await res.json())
    })()
  }, [])

  const comprar = async () => {
    // Construye payload de entradas a crear
    const payload = items.map(it => ({
      eventoId: it.event.id,
      cantidad: it.qty
    }))

    /* RUTA PARA CREAR ENTRADA */
    const res = await authFetch(ENDPOINTS.entradas.create, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ items: payload, userId: user?.id })
    })

    if (res.ok) {
      clear()
      alert('Compra realizada!')
    } else {
      alert('Error al comprar')
    }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-4">Pago</h2>
      <div className="mb-4">Total de ítems: {items.length}</div>
      <button onClick={comprar} className="px-4 py-2 rounded bg-black text-white">Pagar</button>
    </div>
  )
}
