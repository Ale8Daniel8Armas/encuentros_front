import { useState } from "react";
import HeaderNavbar from "./layout/Navbar.jsx";
import Footer from "./layout/Footer.jsx";

{
  /*Componentes de clase necesarios */
}
import FormPayment from "./components/FormPayment.jsx";

function Form() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <FormPayment />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Form;
