import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import imagenDefault from "../assets/imagen-default.png";

const EventContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3002/api/eventos/${id}`)
      .then((res) => res.json())
      .then((data) => setEvento(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10">Cargando evento...</p>;
  }

  if (!evento) {
    return (
      <div className="text-center mt-10">
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <p className="text-gray-500 text-lg font-semibold">
            No hay eventos en el carrito
          </p>
          <Link
            to="/homepage"
            className="text-blue-600 hover:underline flex items-center gap-1 text-base"
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Leer carrito actual o crear array vacío
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Buscar si el evento ya está en el carrito
    const existingItemIndex = cart.findIndex(
      (item) => item.eventId === evento.id
    );

    if (existingItemIndex !== -1) {
      // Si existe, aumentar cantidad
      cart[existingItemIndex].quantity += 1;
    } else {
      // Si no existe, agregar con quantity 1
      cart.push({ eventId: evento.id, quantity: 1 });
    }

    // Guardar carrito actualizado
    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Evento agregado al carrito");
    navigate("/cart");
  };

  return (
    <div className="flex-grow bg-white px-4 py-10">
      {/* Imagen del evento */}
      <div className="flex justify-center mb-8 border-b pb-6">
        <img
          src={evento.imagen || imagenDefault}
          alt={evento.nombre}
          onError={(e) => (e.target.src = imagenDefault)}
          className="h-80 object-contain"
        />
      </div>

      {/* Contenido */}
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Título y descripción */}
        <div>
          <h2 className="text-3xl font-bold mb-2">{evento.nombre}</h2>
          <p className="text-gray-700 font-semibold">Descripción:</p>
          <p className="text-gray-600 mt-1">{evento.descripcion}</p>
        </div>

        {/* Botón de info del estadio */}
        <div>
          <Link to="/stadium">
            <button className="bg-blue-500 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-600 transition">
              Ver info del Estadio
            </button>
          </Link>
        </div>

        {/* Datos del evento */}
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <span className="font-semibold">Fecha:</span>
            <span className="col-span-2">{evento.fecha}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="font-semibold">Tipo de Evento:</span>
            <span className="col-span-2">{evento.tipo}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="font-semibold">Zona Asignada:</span>
            <span className="col-span-2">{evento.zona || "No asignada"}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="font-semibold">Precio:</span>
            <span className="col-span-2">
              {evento.precio ? `$${evento.precio}` : "No disponible"}
            </span>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
          <Link to="/homepage">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-1/2 bg-red-600 text-white py-2 rounded-full hover:bg-red-700 transition-colors"
            >
              Cancelar
            </button>
          </Link>
          <button
            onClick={handleAddToCart}
            className="w-full sm:w-1/2 bg-green-600 text-white py-2 rounded-full hover:bg-green-700 transition-colors"
          >
            Adquirir Entrada
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventContent;
