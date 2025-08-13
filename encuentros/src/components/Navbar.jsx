import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, LogOut, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useCart } from '../contexts/CartContext.jsx'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { itemsCount } = useCart()
  const [q, setQ] = useState('')
  const nav = useNavigate()

  const go = (e) => {
    e.preventDefault()
    nav(`/search?q=${encodeURIComponent(q)}`)
  }

  const isAdminRole = user?.role === 'ADMIN' || user?.role === 'ORGANIZADOR'

  const onLogout = () => {
    logout()
    nav('/') // vuelve al home al salir
  }

  return (
    <header className="sticky top-0 z-40 shadow-md border-b-4 border-red-600 bg-amber-500 text-red-900">
      <div className="container mx-auto px-4 py-3 flex gap-3 items-center">
        {/* Brand */}
        <Link
          to="/"
          className="font-extrabold text-2xl tracking-wide hover:opacity-90"
        >
          ENCUENTROS
        </Link>

        {/* Buscador */}
        <form onSubmit={go} className="ml-auto flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="bg-white/95 text-gray-800 placeholder:text-gray-400 border border-red-600/40 focus:border-red-700 focus:ring-2 focus:ring-red-600/30 rounded-full px-4 py-2 w-56 md:w-72"
            placeholder="Buscar eventos..."
          />
          <button
            className="inline-flex items-center gap-1 rounded-full px-3 py-2 bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-600/40"
            aria-label="Buscar"
          >
            <Search size={18} />
          </button>
        </form>

        {/* Carrito */}
        <Link
          to="/cart"
          className="relative ml-2 inline-flex items-center justify-center rounded-full p-2 hover:bg-red-600/10"
          aria-label="Carrito"
          title="Carrito"
        >
          <ShoppingCart />
          {itemsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-700 text-amber-100 text-[11px] leading-none rounded-full px-1.5 py-0.5">
              {itemsCount}
            </span>
          )}
        </Link>

        {/* Links sesión */}
        {user ? (
          <div className="flex items-center">
            <Link
              to="/my-tickets"
              className="ml-2 rounded-full px-3 py-2 hover:bg-red-600/10"
            >
              Mis entradas
            </Link>
            {isAdminRole && (
              <Link
                to="/admin"
                className="ml-2 rounded-full px-3 py-2 hover:bg-red-600/10"
              >
                Admin
              </Link>
            )}
            <button
              className="ml-2 inline-flex items-center gap-1 rounded-full px-3 py-2 border border-red-700 text-red-800 hover:bg-red-700 hover:text-white focus:ring-2 focus:ring-red-600/30"
              onClick={onLogout}
            >
              <LogOut size={18} /> Salir
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="ml-2 inline-flex items-center gap-1 rounded-full px-3 py-2 bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-600/40"
          >
            <User size={18} /> Entrar
          </Link>
        )}
      </div>
    </header>
  )
}
