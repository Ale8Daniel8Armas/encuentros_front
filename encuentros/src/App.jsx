import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Main from './main/Main.jsx'
import EventContent from './components/EventContent.jsx'
import LoginTemplate from './components/LoginTemplate.jsx'
import RegisterTemplate from './components/RegisterTemplate.jsx'
import Carrito from './components/Carrito.jsx'
import SearchResults from './components/SearchResults.jsx'
import FormPayment from './components/FormPayment.jsx'
import HistorialEntradas from './components/HistorialEntradas.jsx'
import AdminRoutes from './admin/src/routes/index.jsx'
import { useAuth } from './contexts/AuthContext.jsx'

import ProtectedAdmin from './admin/src/routes/ProtectedAdmin.jsx'
import NotAuthorized from './pages/NotAuthorized.jsx'

export default function App() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          {/* FRONT ROUTES (ENCUENTROS>src>main) */}
          <Route path="/" element={<Main />} />
          <Route path="/event/:id" element={<EventContent />} />
          <Route path="/login" element={<LoginTemplate />} />
          <Route path="/register" element={<RegisterTemplate />} />
          <Route path="/cart" element={<Carrito />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/pay" element={<FormPayment />} />
          <Route
            path="/my-tickets"
            element={user ? <HistorialEntradas /> : <Navigate to="/login" replace />}
          />

          {/* ADMIN ROUTES (ENCUENTROS>src>admin>src>routes) */}
          <Route
            path="/admin/*"
            element={
              <ProtectedAdmin>
                <AdminRoutes />
              </ProtectedAdmin>
            }
          />

          {/* Página de no autorizado */}
          <Route path="/403" element={<NotAuthorized />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}
