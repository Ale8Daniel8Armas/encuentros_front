import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import estadioFondo from "../assets/estadio.jpg";

const FilterSearch = () => {
  const navigate = useNavigate();
  const [tipoEvento, setTipoEvento] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (tipoEvento) params.append("tipo", tipoEvento);
    if (fechaInicio) params.append("fecha", fechaInicio);

    navigate(`/buscar?${params.toString()}`);
  };

  return (
    <div
      className="w-full h-[300px] bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${estadioFondo})`,
      }}
    >
      <div className="flex gap-10 flex-wrap justify-center">
        <select
          value={tipoEvento}
          onChange={(e) => setTipoEvento(e.target.value)}
          className="bg-black text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-800 transition-all duration-300"
        >
          <option value="">Tipo de evento</option>
          <option value="deportivo">Encuentro deportivo</option>
          <option value="musical">Musical</option>
          <option value="civico-cultural">Cívico-cultural</option>
        </select>

        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="bg-black text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-800 transition-all duration-300"
        />

        <button
          onClick={handleSearch}
          className="bg-red-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-red-700 transition-all duration-300"
        >
          Encontrar Eventos
        </button>
      </div>
    </div>
  );
};

export default FilterSearch;
