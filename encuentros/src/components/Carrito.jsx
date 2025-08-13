import { useCart } from '../contexts/CartContext.jsx'
import { Link, useNavigate } from 'react-router-dom'

export default function Carrito(){
  const { items, removeIndex, setQty, clear, total } = useCart()
  const nav = useNavigate()

  const goPay = () => {
    if (!items.length) return
    nav('/pay')
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-4">Carrito</h2>

      {items.length === 0 ? (
        <div className="border rounded-2xl p-6 text-gray-700">
          Tu carrito está vacío.{' '}
          <Link className="underline" to="/">Explorar eventos</Link>
        </div>
      ) : (
        <>
          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            {/* Lista */}
            <div className="space-y-3">
              {items.map((it, idx) => (
                <div key={it.key ?? idx} className="border rounded-2xl p-3 flex items-center gap-3">
                  <div className="h-16 w-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {it.imagen ? (
                      <img src={it.imagen} className="h-full w-full object-cover" alt={it.nombre}/>
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate">{it.nombre}</div>
                    <div className="text-sm text-gray-600 truncate">
                      {it.fecha} • Zona {it.zonaNombre}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <label className="text-xs text-gray-500">Cantidad</label>
                      <input
                        type="number" min="1"
                        className="border rounded px-2 py-1 w-20"
                        value={it.qty}
                        onChange={e=>setQty(idx, e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold">${(Number(it.precio)||0).toFixed(2)}</div>
                    <button
                      className="text-red-600 text-sm mt-2 underline"
                      onClick={()=>removeIndex(idx)}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen */}
            <aside className="border rounded-2xl p-4 h-fit">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Resumen</div>
                <div className="text-sm text-gray-500">{items.reduce((a,b)=>a+b.qty,0)} entradas</div>
              </div>
              <div className="mt-3 flex items-center justify-between text-lg">
                <span>Total</span>
                <span className="font-bold">${total.toFixed(2)}</span>
              </div>
              <button
                onClick={goPay}
                className="mt-4 w-full px-4 py-2 rounded-lg bg-black text-white"
              >
                Proceder al pago
              </button>
              <button
                onClick={clear}
                className="mt-2 w-full px-4 py-2 rounded-lg border hover:bg-black/5"
              >
                Vaciar carrito
              </button>
              <div className="text-xs text-gray-500 mt-3">
                * El pago creará una entrada por cada unidad (zona seleccionada).
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  )
}
