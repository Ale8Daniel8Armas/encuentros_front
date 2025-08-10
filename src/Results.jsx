import { useState } from "react";
import HeaderNavbar from "./layout/Navbar.jsx";
import Footer from "./layout/Footer.jsx";

{
  /*Componentes de clase necesarios */
}

import Events from "./components/SearchResults.jsx";

function Event() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Events />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Event;
