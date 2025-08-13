import { Routes, Route, NavLink } from 'react-router-dom'
import Eventos from '../pages/dashboard/eventos.jsx'
import Entradas from '../pages/dashboard/entradas.jsx'
import Usuarios from '../pages/dashboard/usuarios.jsx' // NUEVO

export default function AdminRoutes(){
  const linkCls = ({ isActive }) =>
    `block px-2 py-1 rounded-lg hover:bg-black/5 ${isActive ? 'bg-black/5 font-semibold' : ''}`

  return (
    <div className="container mx-auto px-4 py-8 grid md:grid-cols-[220px_1fr] gap-6">
      <aside className="border rounded p-4 space-y-2">
        <div className="font-bold mb-3">Dashboard</div>
        <nav className="flex flex-col gap-2">
          <NavLink to="eventos" className={linkCls}>Eventos</NavLink>
          <NavLink to="entradas" className={linkCls}>Entradas</NavLink>
          <NavLink to="usuarios" className={linkCls}>Usuarios</NavLink>
        </nav>
      </aside>
      <main>
        <Routes>
          <Route path="/" element={<Eventos />} />
          <Route path="eventos" element={<Eventos />} />
          <Route path="entradas" element={<Entradas />} />
          <Route path="usuarios" element={<Usuarios />} />
        </Routes>
      </main>
    </div>
  )
}
