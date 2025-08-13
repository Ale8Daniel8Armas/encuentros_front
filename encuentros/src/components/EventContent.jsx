import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ENDPOINTS } from '../config/api'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useCart } from '../contexts/CartContext.jsx'
import { CalendarDays, Tag, Share2, Copy, Users, Ticket } from 'lucide-react'

// Helpers para guardar compras por usuario
const userKeyOf = (user) => {
  if (!user) return null
  // prioriza id; si no hay, usa correo
  return String(user.id ?? user.correo ?? '').trim() || null
}
const storageKeyFor = (user) => {
  const uk = userKeyOf(user)
  return uk ? `enc_entries:${uk}` : null
}
const formatPrice = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n.toFixed(2) : '0.00'
}
const formatDateLong = (iso) => {
  try {
    const d = new Date(`${iso}T00:00:00`)
    return new Intl.DateTimeFormat('es-EC', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }).format(d)
  } catch { return iso }
}
const daysUntil = (iso) => {
  if (!iso) return null
  const today = new Date(); today.setHours(0,0,0,0)
  const d = new Date(`${iso}T00:00:00`)
  const diff = Math.ceil((d - today) / (1000*60*60*24))
  return diff
}

export default function EventContent(){
  const { id } = useParams()
  const [ev, setEv] = useState(null)
  const [zona, setZona] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { authFetch, user } = useAuth()
  const { add } = useCart()

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(ENDPOINTS.eventos.byId(id))
        if (!res.ok) throw new Error(`No se pudo cargar el evento (${res.status})`)
        const data = await res.json()
        if (!alive) return
        setEv(data)
        setZona(data?.zona_name?.[0] || '')
      } catch (err) {
        if (!alive) return
        setError(err.message || 'Error cargando el evento')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [id])

  const selectedPrice = useMemo(() => {
    if (!ev || !Array.isArray(ev.zona_name)) return '0.00'
    const idx = ev.zona_name.findIndex((z) => z === zona)
    return formatPrice(idx >= 0 ? ev.precio?.[idx] : 0)
  }, [ev, zona])

  const minPrice = useMemo(() => {
    const arr = (ev?.precio ?? []).map(Number).filter(Number.isFinite)
    return arr.length ? formatPrice(Math.min(...arr)) : '0.00'
  }, [ev])

  const diffDays = useMemo(() => daysUntil(ev?.fecha), [ev?.fecha])
  const isActive = (ev?.estado ?? 'activo') === 'activo' && (diffDays == null || diffDays >= 0)

  const comprar = async () => {
    if (!user) return alert('Inicia sesión para comprar')
    if (!zona) return alert('Selecciona una zona')
    if (!isActive) return alert('Entradas no disponibles para este evento')

    try {
      const res = await authFetch(ENDPOINTS.entradas.create, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ eventoId: Number(id), zonaNombre: zona })
      })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(t || 'No se pudo crear la entrada')
      }
      const entrada = await res.json()

      // Guardar por usuario en localStorage
      const key = storageKeyFor(user)
      if (!key) return alert('No se pudo asociar la compra al usuario actual')
      const enriched = { ...entrada, __ts: Date.now() }
      const prev = JSON.parse(localStorage.getItem(key) || '[]')
      localStorage.setItem(key, JSON.stringify([enriched, ...prev]))

      alert('¡Entrada creada!')
    } catch (err) {
      alert(err.message || 'Error creando la entrada')
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert('Enlace copiado')
    } catch {}
  }

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: ev?.nombre || 'Evento',
          text: `Mira este evento: ${ev?.nombre}`,
          url: window.location.href
        })
      } else {
        await copyLink()
      }
    } catch {}
  }

    const addToCart = () => {
    if (!ev || !zona) return alert('Selecciona una zona')
    const idx = (ev.zona_name || []).findIndex(z => z === zona)
    const price = Number(ev.precio?.[idx] ?? 0)
    add({
        eventId: Number(ev.id),
        nombre: ev.nombre,
        imagen: ev.imagen,
        fecha: ev.fecha,
        zonaNombre: zona,
        precio: price,
        qty: 1,
    })
    alert('Agregado al carrito')
    }

  const downloadICS = () => {
    if (!ev?.fecha) return
    const dt = String(ev.fecha).replaceAll('-', '')
    const now = new Date()
    const pad = (n) => String(n).padStart(2,'0')
    const stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth()+1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Encuentros//ES',
      'BEGIN:VEVENT',
      `UID:${(ev.id ?? Date.now())}@encuentros`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${dt}`,
      `SUMMARY:${(ev.nombre || '').replace(/\r?\n/g,' ')}`,
      `DESCRIPTION:${(ev.descripcion || '').replace(/\r?\n/g,'\\n')}`,
      `URL:${window.location.href}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n')
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${ev.nombre || 'evento'}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <div className="container mx-auto px-4 py-10">Cargando...</div>
  if (error) return <div className="container mx-auto px-4 py-10 text-red-600">{error}</div>
  if (!ev) return <div className="container mx-auto px-4 py-10">Evento no encontrado.</div>

  const zonas = ev.zona_name ?? []
  const precios = ev.precio ?? []

  return (
    <div className="container mx-auto px-4 py-10 grid xl:grid-cols-[1.25fr_0.75fr] gap-8">
      {/* Hero + descripción */}
      <div className="space-y-6">
        <div className="relative border rounded-2xl overflow-hidden">
          {/* Imagen hero con overlay sutil */}
          <div className="aspect-[16/9] bg-gray-100 relative">
            {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
            <img src={ev.imagen} className="h-full w-full object-cover" alt="Imagen del evento" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            {/* Badges en la imagen */}
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
              <span className="px-2 py-1 rounded bg-white/90 text-xs">
                <Tag className="inline mr-1" size={14} /> {ev.tipo}
              </span>
              <span className={`px-2 py-1 rounded text-xs ${isActive ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-gray-800'}`}>
                {isActive ? 'Activo' : 'No disponible'}
              </span>
            </div>
          </div>

          {/* Encabezado bonito */}
          <div className="p-5">
            <h1 className="text-3xl font-bold leading-tight break-words">{ev.nombre}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-gray-700">
              <span className="inline-flex items-center gap-1">
                <CalendarDays size={18}/> {formatDateLong(ev.fecha)}
              </span>
              <span className="text-gray-400">•</span>
              <span className="inline-flex items-center gap-1">
                <Users size={18}/> Aforo: {ev.quantity ?? 0}
              </span>
              <span className="text-gray-400">•</span>
              <span className="inline-flex items-center gap-1">
                <Ticket size={18}/> Zonas: {zonas.length}
              </span>
              <span className="text-gray-400">•</span>
              <span>Desde <b>${minPrice}</b></span>
              {typeof diffDays === 'number' && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm">
                    {diffDays > 1 && `Faltan ${diffDays} días`}
                    {diffDays === 1 && 'Mañana'}
                    {diffDays === 0 && 'Hoy'}
                    {diffDays < 0 && `Finalizado`}
                  </span>
                </>
              )}
            </div>

            {/* Acciones rápidas */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={share} className="px-3 py-1.5 rounded border hover:bg-black/5 flex items-center gap-2 text-sm">
                <Share2 size={16}/> Compartir
              </button>
              <button onClick={copyLink} className="px-3 py-1.5 rounded border hover:bg-black/5 flex items-center gap-2 text-sm">
                <Copy size={16}/> Copiar enlace
              </button>
              <button onClick={downloadICS} className="px-3 py-1.5 rounded border hover:bg-black/5 text-sm">
                Agregar al calendario (.ics)
              </button>
            </div>
          </div>
        </div>

        {/* Descripción amplia */}
        <div className="border rounded-2xl p-5">
          <h2 className="text-lg font-semibold mb-2">Descripción</h2>
          <p className="whitespace-pre-line leading-relaxed text-gray-800">{ev.descripcion}</p>
        </div>

        {/* Resumen de zonas en chips (rápido de leer) */}
        {!!zonas.length && (
          <div className="border rounded-2xl p-5">
            <h3 className="text-lg font-semibold mb-3">Zonas disponibles</h3>
            <div className="flex flex-wrap gap-2">
              {zonas.map((z, i) => (
                <span key={`${z}-${i}`} className="px-2 py-1 rounded bg-gray-100 text-sm">
                  {z} {Number.isFinite(Number(precios[i])) && `• $${formatPrice(precios[i])}`}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tarjeta de compra (sticky en desktop) */}
      <div className="space-y-4 lg:sticky lg:top-6 h-fit">
        <div className="border rounded-2xl p-5">
          <div className="font-semibold mb-3 text-lg">Comprar entrada</div>

          {/* Encabezados desktop */}
          <div className="hidden md:grid md:grid-cols-[1fr_160px] gap-3 text-[11px] uppercase tracking-wide text-gray-500 px-1 mb-1">
            <div>Zona</div><div>Precio</div>
          </div>

          {/* Lista de zonas con scroll si hay muchas */}
          <div role="radiogroup" aria-label="Zonas disponibles" className="space-y-2 max-h-80 overflow-auto pr-1">
            {zonas.map((z, i) => (
              <label
                key={`${z}-${i}`}
                className="grid grid-cols-1 md:grid-cols-[1fr_160px] gap-3 items-center rounded-lg px-3 py-3 hover:bg-black/5 border border-transparent hover:border-gray-200"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <input
                    type="radio"
                    name="zona"
                    className="mt-1 shrink-0"
                    checked={zona === z}
                    onChange={() => setZona(z)}
                    aria-label={`Zona ${z}`}
                  />
                  <span className="break-words leading-6 text-base">{z}</span>
                </div>
                <div className="text-base md:text-right font-medium">
                  ${formatPrice(precios?.[i])}
                </div>
              </label>
            ))}
            {!zonas.length && (
              <div className="text-sm text-gray-500 px-1">No hay zonas definidas para este evento.</div>
            )}
          </div>

          {/* Resumen y acción */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-gray-700">
              {zona ? (
                <>
                  <span className="font-medium">Seleccionado:</span>{' '}
                  <span className="inline-block px-2 py-1 rounded bg-gray-100">{zona}</span>{' '}
                  <span className="text-gray-500">•</span>{' '}
                  <span className="font-medium">${selectedPrice}</span>
                </>
              ) : (
                <span className="text-gray-500">Elige una zona para continuar</span>
              )}
            </div>

            <button
              onClick={comprar}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-white disabled:opacity-50
                         bg-black"
              disabled={!zona || !isActive}
              title={!isActive ? 'Entradas no disponibles para este evento' : ''}
            >
              Comprar entrada
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          * Precios por zona definidos por el organizador. Cantidad total: {ev.quantity}.<br />
          * Si el evento está inactivo o ya pasó, la compra se deshabilita.
        </div>
      </div>
    </div>
  )
}
