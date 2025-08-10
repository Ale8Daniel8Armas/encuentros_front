import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-white">
      <div className="absolute top-1/2 left-1/2 w-64 h-[550px] bg-blue-900 rotate-[20deg] shadow-xl z-0 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-[550px] bg-red-500 rotate-[60deg] shadow-xl z-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-[550px] bg-yellow-300 rotate-[140deg] shadow-xl z-10 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-[550px] bg-red-500 rotate-[160deg] shadow-xl z-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-[550px] bg-yellow-300 rotate-[220deg] shadow-xl z-40 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-[550px] bg-blue-900 rotate-[300deg] shadow-xl z-30 -translate-x-1/2 -translate-y-1/2"></div>

      <div className="relative z-50 bg-white px-28 py-16 shadow-md rounded-md w-100 border border-gray-300">
        <div className="text-center mb-6">
          <div className="text-3xl">👤</div>
          <h2 className="text-xl font-bold">LOGIN</h2>
        </div>
        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm mb-1">Nombre de usuario:</label>
            <input
              type="text"
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

          <button
            type="submit"
            className="bg-red-600 text-white py-2 rounded-full hover:bg-red-700 transition-colors"
          >
            Ingresar
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="underline">
            regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
