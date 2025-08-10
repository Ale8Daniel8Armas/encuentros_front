import React, { useEffect, useState } from "react";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await fetch("http://localhost:3001/usuario/me", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUsuario(data);
        } else {
          setUsuario(null);
        }
      } catch (error) {
        console.error("Error al obtener usuario:", error);
        setUsuario(null);
      }
    };

    fetchUsuario();
  }, []);

  return (
    <div className="flex w-full shadow-md bg-red-600 h-16 min-h-[110px]">
      {/* Logo */}
      <div className="bg-white flex items-center justify-center px-10 min-w-[150px]">
        <Link to="/homepage">
          <img
            src="/src/assets/logoE.jpg"
            alt="Logo Encuentros"
            className="h-[100px] w-auto"
          />
        </Link>
      </div>

      {/* Franja amarilla */}
      <div className="w-12 bg-yellow-400"></div>

      {/* Buscador + acciones */}
      <div className="flex items-center justify-between flex-1 px-8 gap-8 min-w-0">
        {/* Barra búsqueda */}
        <div className="flex items-center bg-white text-black rounded-full px-4 py-2 w-full max-w-3xl shadow-sm min-w-0">
          <input
            type="text"
            placeholder="Buscar evento..."
            className="bg-transparent focus:outline-none flex-grow text-base min-w-0"
          />
          <FaSearch className="text-gray-600 text-lg" />
        </div>

        {/* Login, registro o nombre */}
        <div className="flex items-center gap-6 text-white text-lg font-semibold whitespace-nowrap">
          <Link to="/cart" className="cursor-pointer text-xl">
            <FaShoppingCart />
          </Link>
          {usuario ? (
            <span>{usuario.nombres}</span>
          ) : (
            <>
              <Link to="/login" className="cursor-pointer">
                Login
              </Link>
              <Link to="/register" className="cursor-pointer">
                Registro
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
