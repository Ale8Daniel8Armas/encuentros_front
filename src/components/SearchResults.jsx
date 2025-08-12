import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import imagenDefault from "../assets/imagen-default.png";

const SearchResults = () => {
  const location = useLocation();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  const params = new URLSearchParams(location.search);
  const tipo = params.get("tipo");
  const fecha = params.get("fecha");

  useEffect(() => {
    const fetchEventos = async () => {
      setLoading(true);
      //RUTA DE OBTENCIÓN DE EVENTOS FILTRADOS EL GET CON LA LISTA ENTERA
      try {
        let url = "http://localhost:3002/eventos?";
        if (tipo) url += `tipo=${encodeURIComponent(tipo)}&`;
        if (fecha) url += `fecha=${encodeURIComponent(fecha)}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Error al cargar eventos");

        const data = await res.json();
        setEventos(data);
      } catch (error) {
        console.error(error);
        setEventos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, [tipo, fecha]);

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto mt-5">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2">
        <Link
          to="/homepage"
          className="text-black-600 hover:underline flex items-center gap-1"
        >
          ← Volver
        </Link>
      </div>

      {/* Título */}
      <h2 className="text-2xl font-bold mb-6">Eventos encontrados</h2>

      {/* Cargando */}
      {loading && <p className="text-center">Cargando eventos...</p>}

      {/* Sin resultados */}
      {!loading && eventos.length === 0 && (
        <p className="text-center text-gray-500">Aún no hay eventos creados</p>
      )}

      {/* Lista de eventos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {eventos.map((evento) => (
          <div
            key={evento.id}
            className="border rounded-lg shadow-sm overflow-hidden bg-white"
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
                {evento.tipo || "Sin tipo definido"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
