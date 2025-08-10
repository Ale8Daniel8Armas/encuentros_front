import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const location = useLocation();
  const passedCart = location.state?.cartItems || [];

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEventos() {
      try {
        const ids = passedCart.map((item) => item.id);
        if (ids.length === 0) {
          setCartItems([]);
          setLoading(false);
          return;
        }

        const responses = await Promise.all(
          ids.map((id) =>
            fetch(`http://localhost:3002/api/eventos/${id}`).then((res) =>
              res.json()
            )
          )
        );

        const mergedItems = responses.map((evento) => {
          const cartItem = passedCart.find((c) => c.id === evento.id);
          return {
            id: evento.id,
            titulo: evento.nombre,
            fecha: evento.fecha,
            zona: evento.zona_name?.[0] || evento.zona || "No asignada",
            tipo: evento.tipo,
            precio: evento.precio || 0,
            quantity: cartItem?.quantity || 1,
          };
        });

        setCartItems(mergedItems);
      } catch (error) {
        console.error("Error cargando eventos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEventos();
  }, [passedCart]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.precio * item.quantity,
    0
  );
  const iva = subtotal * 0.12;
  const total = subtotal + iva;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const usuarioId = localStorage.getItem("usuarioId");
      if (!usuarioId) throw new Error("Usuario no autenticado");

      // Crear una entrada por cada cantidad (si quantity > 1, crear varias)
      for (const item of cartItems) {
        for (let i = 0; i < item.quantity; i++) {
          // Genera un asiento random o asignado (aquí ejemplo simple)
          const asiento = `Asiento-${Math.floor(Math.random() * 1000)}`;

          const body = {
            eventoId: item.id,
            usuarioId,
            asiento,
          };

          const response = await fetch("http://localhost:3002/api/entradas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          if (!response.ok) {
            throw new Error(
              `Error comprando entrada para evento ${item.titulo}`
            );
          }
        }
      }

      localStorage.removeItem("cart");
      navigate("/entradas");
    } catch (error) {
      console.error(error);
      alert("Error al procesar la compra. Intente de nuevo.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Cargando resumen de compra...</p>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center mt-10">
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <p className="text-gray-500 text-lg font-semibold">
            No hay eventos aún adquiridos
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
    <div className="max-w-7xl mx-auto p-6">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2">
        <Link
          to="/homepage"
          className="text-black-600 hover:underline flex items-center gap-1"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          ← Volver
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario pago */}
        <div>
          <h2 className="font-bold mb-4 text-2xl">Datos de pago</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Nombre Titular */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Nombre titular:
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Ingrese el nombre del titular"
              />
            </div>

            {/* Número de tarjeta */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Número de tarjeta <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Ingrese el número de su tarjeta"
              />
            </div>

            {/* Expiry y CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Fecha de Expiración
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="MM / YY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CVV</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="XXX"
                />
              </div>
            </div>

            {/* Nombre en la tarjeta */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Nombre de la tarjeta
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Ingrese el nombre que aparece en la tarjeta"
              />
            </div>

            <button
              type="submit"
              disabled={processing}
              className={`w-full py-2 rounded-lg text-white text-lg ${
                processing ? "bg-gray-400" : "bg-green-900 hover:bg-green-800"
              }`}
            >
              {processing ? "Procesando..." : "Continuar"}
            </button>
          </form>

          {/* Resumen de compra */}
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-3">Resumen de compra</h3>
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA (12%):</span>
                <span>${iva.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen compra */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Resumen</h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-100 border rounded-lg shadow-sm p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold">{item.titulo}</h3>
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
                    Cantidad: {item.quantity}
                  </p>
                </div>
                <div className="text-lg font-bold">
                  ${(item.precio * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
