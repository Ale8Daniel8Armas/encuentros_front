import { Link } from 'react-router-dom'

export default function NotAuthorized(){
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-2">403 • No autorizado</h1>
      <p className="text-gray-600 mb-6">No tienes permisos para ver esta sección.</p>
      <Link to="/" className="px-4 py-2 rounded bg-black text-white">Ir al inicio</Link>
    </div>
  )
}
