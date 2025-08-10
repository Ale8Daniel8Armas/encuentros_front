import PlanoImagen from "/src/assets/Esquema_estadio.jpg";
import { useLocation, Link } from "react-router-dom";

const StadiumOrganigram = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white text-black">
      <div className="bg-black text-white text-center py-2 font-semibold mb-4 text-3xl">
        Mapa de zonas para eventos
      </div>

      <div className="flex justify-center mb-6">
        <img
          src={PlanoImagen}
          alt="img de mapa de zonas del estadio"
          className="w-full h-90 object-cover"
        />
      </div>

      <div className="bg-yellow-300 text-white text-center py-2 font-semibold mb-4 text-3xl">
        Zonas
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-10 mb-6">
        <ul className="list-disc pl-6 space-y-2 text-xl">
          <li>Palco: Zonas A, B, C, D y E</li>
          <li>Tribuna Norte: Zonas parte alta y parte baja</li>
          <li>Tribuna Sur: Zonas parte alta y parte baja</li>
        </ul>
        <ul className="list-disc pl-6 space-y-2 text-xl">
          <li>General Norte: Zonas A, B, C y D </li>
          <li>General Sur: Zonas A, B, C y D</li>
          <li>Preferencia: Zonas A, B, C y D</li>
        </ul>
      </div>

      <div className="flex justify-center mt-10 mb-10">
        <Link to="/homepage">
          <button className="bg-blue-500 text-white text-2xl px-4 py-2 rounded-full hover:bg-blue-600 transition text-center">
            Ver Eventos
          </button>
        </Link>
      </div>
    </div>
  );
};

export default StadiumOrganigram;
