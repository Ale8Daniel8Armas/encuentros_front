import { useState } from "react";
import HeaderNavbar from "./layout/Navbar.jsx";
import Footer from "./layout/Footer.jsx";

{
  /*Componentes de clase necesarios */
}

import StadiumHeader from "./components/StadiumHeader.jsx";
import StadiumInfo from "./components/StadiumInfo.jsx";
import StadiumOrganigram from "./components/StadiumOrganigram.jsx";

function Stadium() {
  return (
    <>
      <div classname="flex flex-col min-h-screen">
        <HeaderNavbar />
        <main classname="flex-grow">
          <StadiumHeader />
          <StadiumInfo />
          <StadiumOrganigram />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Stadium;
