import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !form.nombres.trim() ||
      !form.apellidos.trim() ||
      !form.email.trim() ||
      !form.password.trim()
    ) {
      return alert("Todos los campos son obligatorios");
    }

    const nameRegex = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/;
    if (!nameRegex.test(form.nombres) || !nameRegex.test(form.apellidos)) {
      return alert(
        "Los nombres y apellidos solo pueden contener letras y espacios"
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return alert("Por favor ingresa un correo válido");
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      return alert(
        "La contraseña debe tener mínimo 8 caracteres, incluyendo mayúscula, minúscula, número y un carácter especial"
      );
    }

    if (form.password !== form.repeatPassword) {
      return alert("Las contraseñas no coinciden");
    }

    {
      /* RUTA DE USUARIOS PARA EL REGISTRO */
    }
    try {
      await axios.post("http://localhost:3001/register", {
        nombres: form.nombres.trim(),
        apellidos: form.apellidos.trim(),
        email: form.email.trim(),
        password: form.password,
        role: "cliente",
      });

      alert("Registro exitoso, ahora inicia sesión");
      navigate("/login");
    } catch (err) {
      alert(
        "Error en el registro: " + (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-white">
      {/* Fondos rotados */}
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

        <form className="flex flex-col gap-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm mb-1">Nombres completos:</label>
            <input
              type="text"
              name="nombres"
              value={form.nombres}
              onChange={handleChange}
              required
              className="w-full border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Apellidos completos:</label>
            <input
              type="text"
              name="apellidos"
              value={form.apellidos}
              onChange={handleChange}
              required
              className="w-full border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Correo:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Contraseña:</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Repetir Contraseña:</label>
            <input
              type="password"
              name="repeatPassword"
              value={form.repeatPassword}
              onChange={handleChange}
              required
              className="w-full border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
