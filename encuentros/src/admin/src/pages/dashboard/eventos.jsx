// Ruta sugerida: src/admin/src/pages/dashboard/eventos.jsx
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../../../contexts/AuthContext.jsx'
import { ENDPOINTS } from '../../../../config/api'
import { uploadImage } from '../../../../imagenes/uploader'

// Tipos de evento (se mantiene igual)
const TIPOS_EVENTO = [
  'Concierto',
  'Deporte',
  'Teatro',
  'Conferencia',
  'Festival',
  'Stand-up',
  'Exposición',
  'Otro',
]

// Zonas fijas del Estadio Olímpico Atahualpa (ÚNICAS PERMITIDAS)
const ATAHUALPA_ZONES = [
  'General Norte',
  'General Sur',
  'Preferencia',
  'Tribuna',
  'Palco',
]

function numberize(v) {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

// Mapea precios de un evento previo a las zonas fijas del Atahualpa
function mapPricesToAtahualpa(evZonaNames = [], evPrices = []) {
  const pricesByName = new Map()
  evZonaNames.forEach((name, idx) => {
    pricesByName.set(String(name).trim(), String(evPrices?.[idx] ?? '0'))
  })
  return ATAHUALPA_ZONES.map((zone) => pricesByName.get(zone) ?? '0')
}

export default function Eventos() {
  const { authFetch } = useAuth()
  const [events, setEvents] = useState([])
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null) // null = creando, number = editando

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    fecha: '', // yyyy-MM-dd
    tipoPreset: 'Concierto',
    tipoCustom: '',
    // ZONAS FIJAS
    zona_name: [...ATAHUALPA_ZONES],
    quantity: 0,
    imagen: '',
    // Un precio por cada zona fija
    precio: Array(ATAHUALPA_ZONES.length).fill('0'),
    estado: 'activo',
  })

  const displayTipo =
    form.tipoPreset === 'Otro' ? form.tipoCustom || 'otro' : form.tipoPreset

  const canSubmit = useMemo(() => {
    if (!form.nombre?.trim()) return false
    if (!form.descripcion?.trim()) return false
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.fecha)) return false
    if (form.tipoPreset === 'Otro') {
      if (!form.tipoCustom.trim()) return false
    } else {
      if (!form.tipoPreset.trim()) return false
    }
    if (!form.imagen?.trim() && !file) return false
    // Zonas y precios deben coincidir exactamente con las fijas
    if (!Array.isArray(form.zona_name) || !Array.isArray(form.precio)) return false
    if (form.zona_name.length !== ATAHUALPA_ZONES.length) return false
    if (form.zona_name.some((z, i) => z !== ATAHUALPA_ZONES[i])) return false
    if (form.precio.length !== ATAHUALPA_ZONES.length) return false
    if (form.precio.some((p) => isNaN(Number(p)) || Number(p) < 0)) return false
    return true
  }, [form, file])

  const load = async () => {
    const res = await fetch(ENDPOINTS.eventos.list)
    if (res.ok) setEvents(await res.json())
  }
  useEffect(() => {
    load()
  }, [])

  // Garantiza que siempre tengamos exactamente las zonas del Atahualpa y sus precios
  useEffect(() => {
    setForm((f) => {
      const zona_name = [...ATAHUALPA_ZONES]
      const precio = (f.precio?.length === ATAHUALPA_ZONES.length)
        ? f.precio.map(String)
        : Array(ATAHUALPA_ZONES.length).fill('0')
      return { ...f, zona_name, precio }
    })
    // solo al montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resetForm = () => {
    setForm({
      nombre: '',
      descripcion: '',
      fecha: '',
      tipoPreset: 'Concierto',
      tipoCustom: '',
      zona_name: [...ATAHUALPA_ZONES],
      quantity: 0,
      imagen: '',
      precio: Array(ATAHUALPA_ZONES.length).fill('0'),
      estado: 'activo',
    })
    setFile(null)
    setEditingId(null)
    setError('')
  }

  const fillFromEvent = (ev) => {
    const precios = mapPricesToAtahualpa(ev.zona_name, ev.precio)
    setForm({
      nombre: ev.nombre || '',
      descripcion: ev.descripcion || '',
      fecha: ev.fecha || '',
      tipoPreset: TIPOS_EVENTO.includes(ev.tipo) ? ev.tipo : 'Otro',
      tipoCustom: TIPOS_EVENTO.includes(ev.tipo) ? '' : ev.tipo || '',
      zona_name: [...ATAHUALPA_ZONES], // Fijas
      quantity: ev.quantity ?? 0,
      imagen: ev.imagen || '',
      precio: precios.map(String),
      estado: ev.estado || 'activo',
    })
    setFile(null)
  }

  const subirImagen = async () => {
    if (!file) return form.imagen || ''
    const { url } = await uploadImage(file) // Cloudinary u otro
    return url
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!canSubmit) {
      setError('Completa todos los campos obligatorios y revisa los precios.')
      return
    }
    setSaving(true)
    try {
      const url = await subirImagen()
      const body = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        fecha: form.fecha,
        tipo: form.tipoPreset === 'Otro' ? form.tipoCustom.trim() : form.tipoPreset,
        zona_id: 0, // fijo
        zona_name: [...ATAHUALPA_ZONES],
        quantity: Number(form.quantity || 0),
        imagen: url || form.imagen,
        precio: form.precio.map(numberize),
        estado: form.estado,
      }

      let res
      if (editingId != null) {
        res = await authFetch(ENDPOINTS.eventos.update(editingId), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      } else {
        res = await authFetch(ENDPOINTS.eventos.create, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      }
      if (!res.ok) {
        const t = await res.text()
        throw new Error(t || 'Error guardando evento')
      }
      await load()
      resetForm()
      alert(editingId != null ? 'Evento actualizado' : 'Evento creado')
    } catch (err) {
      console.error(err)
      setError(err.message || 'No se pudo guardar el evento')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (ev) => {
    setEditingId(ev.id)
    fillFromEvent(ev)
  }

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar evento?')) return
    const res = await authFetch(ENDPOINTS.eventos.delete(id), { method: 'DELETE' })
    if (res.ok) setEvents((prev) => prev.filter((e) => e.id !== id))
    else alert('No se pudo eliminar')
  }

  const Preview = (
    <div className="border rounded-2xl overflow-hidden shadow-sm">
      {file || form.imagen ? (
        <div className="aspect-[16/9] w-full bg-gray-100">
          <img
            src={file ? URL.createObjectURL(file) : form.imagen}
            className="h-full w-full object-cover"
            alt="Previsualización"
          />
        </div>
      ) : (
        <div className="aspect-[16/9] w-full bg-gray-100 grid place-items-center text-gray-400">
          Sin imagen
        </div>
      )}
      <div className="p-4">
        <div className="font-semibold break-words">
          {form.nombre || 'Nombre del evento'}
        </div>
        <div className="text-sm text-gray-600">
          {(form.fecha || 'yyyy-mm-dd')} • {displayTipo}
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold break-words">
          {editingId != null ? 'Editar evento' : 'Crear evento'}
        </h2>
        {editingId != null && (
          <button
            onClick={resetForm}
            className="text-sm px-3 py-1.5 border rounded-lg hover:bg-black/5"
          >
            Cancelar edición
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={submit} className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="border rounded-2xl p-5 shadow-sm">
            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="min-w-0">
                  <label className="text-xs text-gray-600">Nombre</label>
                  <input
                    className="border rounded px-3 py-2 w-full text-base"
                    placeholder="Concierto..."
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  />
                </div>
                <div className="min-w-0">
                  <label className="text-xs text-gray-600 block">Tipo</label>
                  <div className="grid grid-cols-1 gap-2">
                    <select
                      className="border rounded px-3 py-2 text-base"
                      value={form.tipoPreset}
                      onChange={(e) => setForm({ ...form, tipoPreset: e.target.value })}
                    >
                      {TIPOS_EVENTO.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    {form.tipoPreset === 'Otro' && (
                      <input
                        className="border rounded px-3 py-2 text-base"
                        placeholder="Especifica el tipo"
                        value={form.tipoCustom}
                        onChange={(e) =>
                          setForm({ ...form, tipoCustom: e.target.value })
                        }
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-600">Fecha</label>
                  <input
                    type="date"
                    className="border rounded px-3 py-2 w-full text-base"
                    value={form.fecha}
                    onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Aforo total (quantity)</label>
                  <input
                    type="number"
                    min="0"
                    className="border rounded px-3 py-2 w-full text-base"
                    placeholder="0"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-600">Descripción</label>
                <textarea
                  className="border rounded px-3 py-2 w-full text-base resize-y leading-relaxed"
                  rows={4}
                  placeholder="Detalles del evento..."
                  value={form.descripcion}
                  onChange={(e) =>
                    setForm({ ...form, descripcion: e.target.value })
                  }
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="min-w-0">
                  <label className="text-xs text-gray-600">URL imagen (opcional)</label>
                  <input
                    type="url"
                    className="border rounded px-3 py-2 w-full text-base"
                    placeholder="https://..."
                    value={form.imagen}
                    onChange={(e) => setForm({ ...form, imagen: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Subir imagen</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="block w-full text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 items-center">
                <label className="text-xs text-gray-600">Estado</label>
                <select
                  className="border rounded px-3 py-2 text-base"
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value })}
                >
                  <option value="activo">activo</option>
                  <option value="inactivo">inactivo</option>
                </select>
              </div>

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <div className="flex gap-2 flex-wrap">
                <button
                  disabled={!canSubmit || saving}
                  className={`px-4 py-2 rounded-lg text-white ${
                    !canSubmit || saving ? 'bg-gray-400' : 'bg-black'
                  }`}
                >
                  {saving
                    ? 'Guardando…'
                    : editingId != null
                    ? 'Actualizar evento'
                    : 'Crear evento'}
                </button>
                {editingId != null && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 rounded-lg border hover:bg-black/5"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Zonas y precios (solo Atahualpa, no editable en nombres) */}
        <div className="space-y-4">
          {Preview}

          <div className="border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <div className="font-semibold">Zonas y precios — Estadio Olímpico Atahualpa</div>
                <div className="text-xs text-gray-500">
                  Zonas fijas: {ATAHUALPA_ZONES.length} (no editables)
                </div>
              </div>
            </div>

            {/* Tarjetas responsivas sin overflow */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {form.zona_name.map((z, i) => (
                <div key={z} className="border rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Zona</div>
                  <div className="font-medium break-words">{z}</div>

                  <label className="text-xs text-gray-500 mt-3 block">
                    Precio (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    inputMode="decimal"
                    className="border rounded px-3 py-2 text-base w-full"
                    placeholder="0.00"
                    value={form.precio[i]}
                    onChange={(e) => {
                      const pr = [...form.precio]
                      pr[i] = e.target.value
                      setForm({ ...form, precio: pr })
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="text-xs text-gray-500 mt-3">
              * El sistema usa <b>zona_id = 0</b>. Solo se permiten las zonas oficiales del
              Estadio Olímpico Atahualpa.
            </div>
          </div>
        </div>
      </form>

      {/* Lista de eventos */}
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="border rounded-2xl p-3 flex gap-3 items-center shadow-sm"
          >
            <div className="h-16 w-24 shrink-0 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={ev.imagen}
                className="h-full w-full object-cover"
                alt={ev.nombre}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold truncate">{ev.nombre}</div>
              <div className="text-sm text-gray-600 truncate">
                {ev.fecha} • {ev.tipo}
              </div>
              <div className="text-xs text-gray-500 mt-1">Estado: {ev.estado}</div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                className="px-2 py-1 border rounded-lg hover:bg-black/5"
                onClick={() => startEdit(ev)}
              >
                Editar
              </button>
              <button
                className="text-red-600 px-2 py-1 border rounded-lg hover:bg-red-50"
                onClick={() => eliminar(ev.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
