import { useState } from "react";
import HeaderNavbar from "./layout/Navbar.jsx";
import Footer from "./layout/Footer.jsx";

{
  /*Componentes de clase necesarios */
}

import EventInfo from "./components/EventContent.jsx";

function Event() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <HeaderNavbar />
        <main className="flex-grow">
          <EventInfo />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Event;
