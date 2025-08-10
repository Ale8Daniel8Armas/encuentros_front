import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-white">
      <div className="absolute top-1/2 left-1/2 w-[350px] h-[600px] bg-blue-900 rotate-[20deg] shadow-xl z-0 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-[350px] h-[600px] bg-red-500 rotate-[60deg] shadow-xl z-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-[350px] h-[600px] bg-yellow-300 rotate-[140deg] shadow-xl z-10 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-[350px] h-[600px] bg-red-500 rotate-[160deg] shadow-xl z-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-[350px] h-[600px] bg-yellow-300 rotate-[220deg] shadow-xl z-40 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-[350px] h-[600px] bg-blue-900 rotate-[300deg] shadow-xl z-30 -translate-x-1/2 -translate-y-1/2"></div>

      <div className="relative z-50 bg-white px-10 py-8 shadow-md rounded-md w-[500px] border border-gray-300">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">REGISTRO</h2>
        </div>

        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm mb-1">Nombres completos:</label>
            <input
              type="text"
              className="w-full border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Apellidos completos:</label>
            <input
              type="text"
              className="w-full border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Correo:</label>
            <input
              type="email"
              className="w-full border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Contraseña:</label>
            <input
              type="password"
              className="w-full border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Repetir Contraseña:</label>
            <input
              type="password"
              className="w-full border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-between gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/homepage")}
              className="flex-1 bg-red-600 text-white py-3 px-6 rounded-full hover:bg-red-700 transition-colors font-medium text-sm sm:text-base"
            >
              Cancelar
            </button>

            <button
              type="submit"
              onClick={() => navigate("/login")}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-full hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
