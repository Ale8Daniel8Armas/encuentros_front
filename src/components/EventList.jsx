import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import imagenDefault from "../assets/imagen-default.png";

const EventList = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    fetch("http://localhost:3002/api/eventos")
      .then((res) => res.json())
      .then((data) => setEventos(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && eventos.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500 text-lg font-semibold">
          Aún no hay eventos creados
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-10xl mx-auto mt-5">
      <div className="mb-4">
        <span className="bg-yellow-400 text-black px-6 py-3 font-semibold rounded">
          Eventos Destacados
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 mt-10">
        {eventos.slice(0, visibleCount).map((evento) => (
          <Link
            to={`/event/${evento.id}`}
            key={evento.id}
            className="border rounded-lg shadow-sm overflow-hidden bg-white hover:shadow-md transition"
          >
            <img
              src={evento.imagen || imagenDefault}
              alt={evento.nombre}
              onError={(e) => (e.target.src = imagenDefault)}
              className="w-full h-40 object-cover"
            />

            <div className="p-4">
              <h3 className="font-semibold text-gray-800">{evento.nombre}</h3>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <span className="mr-1">📅</span>
                <span>{evento.fecha}</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {evento.descripcion}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {visibleCount < eventos.length && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setVisibleCount(visibleCount + 6)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            Ver más
          </button>
        </div>
      )}
    </div>
  );
};

export default EventList;
