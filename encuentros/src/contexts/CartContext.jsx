import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartCtx = createContext(null)
const LS_KEY = 'enc_cart' // carrito persistido en localStorage

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) || '[]')
    } catch {
      return []
    }
  })

  // Persistir cambios
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items))
  }, [items])

  /**
   * Agrega una línea al carrito.
   * line: { key?, eventId, nombre, imagen, fecha, zonaNombre, precio, qty? }
   * Si existe misma (eventId+zonaNombre), suma cantidades.
   */
  const add = (line) => {
    setItems((prev) => {
      const key = line.key || `${line.eventId}__${line.zonaNombre}`
      const idx = prev.findIndex((i) => i.key === key)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: next[idx].qty + (line.qty || 1) }
        return next
      }
      return [{ ...line, key, qty: line.qty || 1 }, ...prev]
    })
  }

  const removeIndex = (idx) => {
    setItems((prev) => {
      const next = [...prev]
      next.splice(idx, 1)
      return next
    })
  }

  const setQty = (idx, qty) => {
    const q = Math.max(1, Number(qty) || 1)
    setItems((prev) => {
      const next = [...prev]
      if (!next[idx]) return prev
      next[idx] = { ...next[idx], qty: q }
      return next
    })
  }

  const clear = () => setItems([])

  const itemsCount = useMemo(
    () => items.reduce((a, b) => a + b.qty, 0),
    [items]
  )

  const total = useMemo(
    () => items.reduce((a, b) => a + (Number(b.precio) || 0) * b.qty, 0),
    [items]
  )

  const value = { items, add, removeIndex, setQty, clear, itemsCount, total }

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartCtx)
  if (!ctx) {
    throw new Error('useCart debe usarse dentro de <CartProvider>')
  }
  return ctx
}
