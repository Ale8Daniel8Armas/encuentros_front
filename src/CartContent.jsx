import { useState } from "react";
import HeaderNavbar from "./layout/Navbar.jsx";
import Footer from "./layout/Footer.jsx";

{
  /*Componentes de clase necesarios */
}
import CartTemplate from "./components/Carrito.jsx";

function CartContent() {
  return (
    <>
      <HeaderNavbar />
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <CartTemplate />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default CartContent;
