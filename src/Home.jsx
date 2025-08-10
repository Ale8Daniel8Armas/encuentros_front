import { useState } from "react";
import HeaderNavbar from "./layout/Navbar.jsx";
import Footer from "./layout/Footer.jsx";

{
  /*Componentes de clase necesarios */
}
import MainHeader from "./components/MainHeader.jsx";
import FilterSearch from "./components/FilterSearch.jsx";
import EventList from "./components/EventList.jsx";

function Home() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <HeaderNavbar />
        <main className="flex-grow">
          <MainHeader />
          <div className="container mx-auto px-4 py-12 flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900">
              Bienvenido a Encuentros
            </h1>
            <p className="text-gray-600 max-w-xl">
              ¡Explora los mejores eventos programados!
            </p>
          </div>
          <FilterSearch />
          <EventList />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Home;
