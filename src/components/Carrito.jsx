import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Obtenemos el carrito desde localStorage, o un arreglo vacío si no existe
  const getCartFromStorage = () => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  };

  useEffect(() => {
    const cart = getCartFromStorage();

    fetch("http://localhost:3002/api/eventos")
      .then((res) => res.json())
      .then((events) => {
        const items = cart.map(({ eventId, quantity }) => {
          const event = events.find((e) => e.id === eventId);
          return {
            id: eventId,
            titulo: event?.nombre || "Evento desconocido",
            fecha: event?.fecha || "-",
            zona: event?.zona_name ? event.zona_name[0] : "No asignada",
            tipo: event?.tipo || "Desconocido",
            precio: event?.precio ? event.precio[0] : 0,
            quantity,
          };
        });
        setCartItems(items);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    const updatedCart = getCartFromStorage().filter(
      (item) => item.eventId !== id
    );
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  if (loading) {
    return <p className="text-center mt-10">Cargando carrito...</p>;
  }

  if (cartItems.length === 0) {
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

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.precio * item.quantity,
    0
  );

  const handleComprar = () => {
    // Navega a la página de pago pasando el carrito como state
    navigate("/form", { state: { cartItems } });
  };

  return (
    <div className="flex-grow bg-white px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2">
          <Link
            to="/homepage"
            className="text-black-600 hover:underline flex items-center gap-1"
          >
            ← Volver
          </Link>
        </div>
        <h2 className="text-3xl font-bold mb-6 text-center">
          🛒 Historial de Adquisiciones
        </h2>

        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg shadow-sm p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold">{item.titulo}</h3>
                <p className="text-sm text-gray-600">
                  <strong>Fecha:</strong> {item.fecha}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Zona:</strong> {item.zona}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Tipo:</strong> {item.tipo}
                </p>
                <p className="text-sm text-gray-600 font-semibold">
                  Precio: ${item.precio.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Cantidad:</strong> {item.quantity}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-full transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-right font-bold text-lg">
          Subtotal: ${subtotal.toFixed(2)}
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
          <Link to="/homepage">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-1/2 bg-blue-500 text-white py-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              Seguir Comprando
            </button>
          </Link>
          <div>
            {/* listado de items */}

            {cartItems.length > 0 && (
              <button
                onClick={handleComprar}
                className="bg-green-600 text-white px-6 py-3 rounded-lg"
              >
                Comprar Entradas
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
