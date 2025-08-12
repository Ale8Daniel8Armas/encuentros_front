import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    // RUTA PARA REALIZAR EL LOGIN
    try {
      const res = await axios.post("http://localhost:3001/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user?.role?.toLowerCase();
      if (role === "admin" || role === "administrador") {
        navigate("/dashboardhome");
      } else {
        navigate("/homepage");
      }
    } catch (err) {
      alert(
        "Error en el login: " + (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-white">
      {/* Fondos rotados */}
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
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm mb-1">Nombre de usuario:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
