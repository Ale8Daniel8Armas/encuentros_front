import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import banner1 from "../assets/banner1.jpg";

export default function MainHeader() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([banner1, banner1, banner1]);

  useEffect(() => {
    const fetchEventos = async () => {
      //RUTA DE EVENTOS PARA OBTENER IMAGEN Y MOSTRAR EN EL SLIDER
      try {
        const res = await fetch("http://localhost:3002/eventos");
        if (!res.ok) throw new Error("Error al obtener eventos");
        const eventos = await res.json();

        const eventosConImagen = eventos.filter(
          (e) =>
            e.imagen && typeof e.imagen === "string" && e.imagen.trim() !== ""
        );

        const seleccionados = [];
        const indicesUsados = new Set();
        const maxSeleccion = Math.min(3, eventosConImagen.length);

        while (seleccionados.length < maxSeleccion) {
          const randomIndex = Math.floor(
            Math.random() * eventosConImagen.length
          );
          if (!indicesUsados.has(randomIndex)) {
            indicesUsados.add(randomIndex);
            seleccionados.push(eventosConImagen[randomIndex].imagen);
          }
        }

        while (seleccionados.length < 3) {
          seleccionados.push(banner1);
        }

        setImages(seleccionados);
      } catch (error) {
        setImages([banner1, banner1, banner1]);
        console.error("Error cargando eventos:", error);
      }
    };

    fetchEventos();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex, images]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full max-w-screen-auto mx-auto overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            className="min-w-full object-cover h-[500px] md:h-[600px] lg:h-[600px]"
            alt={`slide-${idx}`}
          />
        ))}
      </div>

      <div
        onClick={goToPrevious}
        className="absolute top-0 left-0 h-full w-[90px] bg-gray-300/70 hover:bg-gray-500/80 cursor-pointer flex items-center justify-center transition-colors duration-300"
      >
        <FaChevronLeft size={30} className="text-white" />
      </div>

      <div
        onClick={goToNext}
        className="absolute top-0 right-0 h-full w-[90px] bg-gray-300/70 hover:bg-gray-500/80 cursor-pointer flex items-center justify-center transition-colors duration-300"
      >
        <FaChevronRight size={30} className="text-white" />
      </div>

      <div className="absolute bottom-0 w-full bg-black py-6 flex justify-center items-center gap-3">
        {images.map((_, idx) => (
          <div
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
              idx === currentIndex ? "bg-yellow-400" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
