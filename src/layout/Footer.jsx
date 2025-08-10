import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="footer bg-[#0a0a3c] text-white text-base">
      <div className="border-b border-white/20 flex flex-wrap justify-between items-center px-8 h-40">
        <div className="flex flex-1 items-center justify-between px-6">
          <div className="flex flex-grow justify-center items-center">
            <Link
              to="/entradas"
              className="hover:underline text-2xl whitespace-nowrap"
            >
              Historial de compras
            </Link>
          </div>

          <span className="hidden sm:inline-block h-40 border-r border-white/30" />

          <div className="flex flex-grow justify-center items-center">
            <Link
              to="/stadium"
              className="hover:underline text-2xl whitespace-nowrap"
            >
              Sobre el estadio
            </Link>
          </div>

          <span className="hidden sm:inline-block h-40 border-r border-white/30" />

          <div className="flex flex-grow justify-center items-center">
            <p className="text-2xl whitespace-nowrap">+593 96 790 9623</p>
          </div>

          <span className="hidden sm:inline-block h-40 border-r border-white/30" />

          <div className="flex flex-grow justify-center items-center gap-4">
            <span className="text-2xl whitespace-nowrap">Síguenos!</span>
            <div className="flex items-center gap-3">
              <a href="#" className="hover:text-gray-300 text-2xl">
                <FaFacebookF />
              </a>
              <a href="#" className="hover:text-gray-300 text-2xl">
                <FaTwitter />
              </a>
              <a href="#" className="hover:text-gray-300 text-2xl">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center py-6 text-xl text-white/90">
        @2025. Encuentros. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
