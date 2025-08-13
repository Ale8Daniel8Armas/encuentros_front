import { useEffect, useState } from 'react'
import { useAuth } from '../../../../contexts/AuthContext.jsx'
import { ENDPOINTS } from '../../../../config/api'

//RUTA PARA OBTENER ENTRADAS
export default function Entradas(){
  const { authFetch } = useAuth()
  const [items,setItems] = useState([])

  useEffect(() => {
    (async () => {
      const res = await authFetch(ENDPOINTS.entradas.list)
      if (res.ok) setItems(await res.json())
    })()
  }, [])

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Entradas</h2>
      <div className="space-y-2">
        {items.map(t => (
          <div key={t.id} className="border rounded p-2 flex justify-between">
            <div>
              <div className="font-semibold">{t.eventoTitulo}</div>
              <div className="text-sm text-gray-600">Usuario {t.usuarioId} • {t.cantidad} boleto(s)</div>
            </div>
            <div className="text-sm">{new Date(t.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
