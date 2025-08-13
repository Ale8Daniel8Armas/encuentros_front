import { useEffect, useMemo, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { ENDPOINTS } from '../config/api'
import { useAuth } from '../contexts/AuthContext.jsx'
import { Link } from 'react-router-dom'

// Helpers de claves
const LEGACY_KEY = 'enc_entries' // antiguo formato global

const userKeyOf = (user) => {
  if (!user) return null
  return String(user.id ?? user.correo ?? '').trim() || null
}
const keyFor = (idOrMail) => idOrMail ? `enc_entries:${idOrMail}` : null
const storageKeyFor = (user) => keyFor(userKeyOf(user))

// Utilidades de localStorage seguras
const readLS = (k) => {
  try { return k ? JSON.parse(localStorage.getItem(k) || '[]') : [] } catch { return [] }
}
const writeLS = (k, v) => { if (!k) return; localStorage.setItem(k, JSON.stringify(v ?? [])) }

// Deduplicación
const entryKey = (t) => {
  // Preferimos codigoQR si existe; si no, id; si no, un fallback temporal
  return String(t?.codigoQR ?? t?.id ?? `${t?.eventoId ?? 'ev'}-${t?.zonaNombre ?? 'z'}-${t?.__ts ?? Date.now()}`)
}
const dedupe = (arr) => {
  const m = new Map()
  for (const t of arr) {
    if (!t) continue
    const k = entryKey(t)
    // preferimos el que tenga estado más "fuerte" (ej. USADA > EMITIDA)
    const prev = m.get(k)
    if (!prev) { m.set(k, t); continue }
    const score = s => (s === 'USADA' ? 2 : 1)
    m.set(k, (score(t.estado) >= score(prev?.estado)) ? t : prev)
  }
  return Array.from(m.values())
}

export default function HistorialEntradas(){
  const { user, authFetch } = useAuth()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  const mainKey = useMemo(() => storageKeyFor(user), [user])
  const idKey = useMemo(() => keyFor(String(user?.id ?? '').trim() || null), [user?.id])
  const mailKey = useMemo(() => keyFor(String(user?.correo ?? '').trim() || null), [user?.correo])

  // Carga y MIGRACIÓN automática desde todas las posibles claves
  useEffect(() => {
    setLoading(true)
    // sin sesión, no listamos (el render de abajo ya mostrará CTA)
    if (!user) { setTickets([]); setLoading(false); return }

    const parts = [
      readLS(mainKey),     // clave principal actual
      idKey !== mainKey ? readLS(idKey) : [],           // alternativa por ID
      mailKey !== mainKey ? readLS(mailKey) : [],       // alternativa por correo
      readLS(LEGACY_KEY),  // legacy global
    ]

    const merged = dedupe([].concat(...parts))
      .map(t => ({ estado: 'EMITIDA', ...t })) // default estado si faltaba
      .sort((a,b) => (b.__ts ?? 0) - (a.__ts ?? 0))

    // si tenemos merged y difiere de lo guardado en la clave principal, persistimos
    const currentMain = readLS(mainKey)
    const changed = JSON.stringify(currentMain) !== JSON.stringify(merged)
    if (mainKey && merged.length && changed) writeLS(mainKey, merged)

    setTickets(merged)
    setLoading(false)
  }, [user, mainKey, idKey, mailKey])

  const usar = async (codigoQR) => {
    const res = await authFetch(ENDPOINTS.entradas.usar, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ codigoQR })
    })
    if (res.ok) {
      alert('Entrada validada (usada)')
      setTickets(prev => {
        const next = prev.map(t => t.codigoQR === codigoQR ? { ...t, estado: 'USADA' } : t)
        writeLS(mainKey, next)
        return next
      })
    } else {
      alert('No se pudo validar')
    }
  }

  const limpiar = () => {
    if (!confirm('¿Borrar tus entradas locales de este usuario?')) return
    if (mainKey) localStorage.removeItem(mainKey)
    setTickets([])
  }

  // Render
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-10">
        Necesitas iniciar sesión para ver tus entradas.{' '}
        <Link to="/login" className="underline">Ir a login</Link>
      </div>
    )
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-10">Cargando entradas…</div>
  }

  if (!tickets.length) {
    // Mensaje útil: ya intentamos migrar desde legacy y claves alternativas
    return (
      <div className="container mx-auto px-4 py-10">
        No encontramos compras locales para <b>{user.correo ?? user.nombre}</b>.
        <div className="text-xs text-gray-500 mt-2">
          * Se revisaron: <code>{mainKey}</code>, <code>{idKey}</code>, <code>{mailKey}</code> y <code>{LEGACY_KEY}</code>.
          Realiza una compra nueva para este usuario y aparecerá aquí.
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mis entradas</h2>
        <button onClick={limpiar} className="text-sm px-3 py-1.5 border rounded hover:bg-black/5">
          Limpiar locales
        </button>
      </div>

      {tickets.map(t => (
        <div key={t.id ?? t.codigoQR ?? t.__ts}
             className="border rounded p-3 grid md:grid-cols-[1fr_auto] gap-4 items-center">
          <div className="min-w-0">
            <div className="font-semibold truncate">
              Evento #{t.eventoId ?? '-'} • Zona {t.zonaNombre ?? '-'}
            </div>
            <div className="text-sm text-gray-600">
              Estado: {t.estado ?? 'EMITIDA'}{t.precio != null && <> • Precio: ${t.precio}</>}
            </div>
            {t.codigoQR && <div className="text-xs break-all mt-1">QR: {t.codigoQR}</div>}
          </div>
          <div className="flex items-center gap-3">
            {t.codigoQR
              ? <QRCodeCanvas value={String(t.codigoQR)} size={120} />
              : <div className="w-[120px] h-[120px] grid place-items-center bg-gray-50 text-xs text-gray-400 rounded">Sin QR</div>
            }
            <button
              onClick={()=>usar(t.codigoQR)}
              className="px-3 py-1 rounded border disabled:opacity-50"
              disabled={t.estado === 'USADA' || !t.codigoQR}
              title={!t.codigoQR ? 'Esta entrada no tiene QR local' : ''}
            >
              {t.estado === 'USADA' ? 'Ya usada' : 'Validar (usar)'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
