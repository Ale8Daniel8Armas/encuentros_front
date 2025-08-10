import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const HistorialEntradas = ({ usuarioId }) => {
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntradas = async () => {
      try {
        const response = await axios.get(`/api/entradas/usuario/${usuarioId}`);
        setEntradas(response.data);
      } catch (error) {
        console.error("Error al obtener el historial de entradas:", error);
      } finally {
        setLoading(false);
      }
    };

    if (usuarioId) {
      fetchEntradas();
    }
  }, [usuarioId]);

  if (loading) {
    return <p className="text-center text-gray-500">Cargando historial...</p>;
  }

  if (entradas.length === 0) {
    return (
      <div className="text-center mt-10">
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <p className="text-gray-500 text-lg font-semibold">
            No hay entradas compradas.
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

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2">
        <Link
          to="/homepage"
          className="text-black-600 hover:underline flex items-center gap-1"
        >
          ← Volver
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-center">
        Historial de Entradas
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entradas.map((entrada) => (
          <div
            key={entrada.id}
            className="bg-white rounded-lg shadow p-4 flex flex-col gap-2"
          >
            <p className="text-lg font-semibold text-blue-600">
              Evento ID: {entrada.evento_id}
            </p>
            <p className="text-sm text-gray-600">Asiento: {entrada.asiento}</p>
            <div className="flex justify-center mt-2">
              <img
                src={entrada.qr_code}
                alt="Código QR"
                className="w-28 h-28 object-contain border p-1 rounded-md"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorialEntradas;
