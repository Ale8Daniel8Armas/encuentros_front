import React from "react";
{
  /* imagenes */
}
import EstadioImagen from "../assets/estadio_font_one.jpg";
import ConciertoImagen from "../assets/estadio_font_two.jpeg";

const StadiumInfo = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white text-black">
      <h1 className="text-4xl font-bold text-center mb-4">
        Estadio Olímpico Atahualpa
      </h1>
      <p className="text-justify mb-6 text-2xl">
        El Estadio Olímpico Atahualpa es un escenario deportivo ubicado en la
        Avenida 6 de Diciembre y Naciones Unidas, en el sector de El Batán, al
        norte de la ciudad de Quito, a 2783 m s. n. m.
      </p>

      <div className="bg-black text-white text-center py-2 font-semibold mb-4 text-3xl">
        Encuentros
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <img
          src={EstadioImagen}
          alt="Estadio Olímpico img"
          className="w-full h-auto object-cover rounded"
        />
        <div className="mt-10">
          <p className="text-justify text-2xl">
            En este estadio se realizan múltiples eventos de diversas índoles,
            en las cuales se destacan los encuentros deportivos, conciertos y
            aquellos de índole civil.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mt-10">
          <p className="text-justify text-2xl">
            La plataforma “Encuentros” maneja una estructura de organización
            para la ocupación de puestos por zonas dentro del estadio y se
            encarga de gestionar la venta de entradas.
          </p>
        </div>
        <img
          src={ConciertoImagen}
          alt="Concierto en Quito img"
          className="w-full h-auto object-cover rounded"
        />
      </div>
    </div>
  );
};

export default StadiumInfo;
