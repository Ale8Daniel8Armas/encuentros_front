import { useState } from "react";
import HeaderNavbar from "./layout/Navbar.jsx";
import Footer from "./layout/Footer.jsx";

import RegisterForm from "./components/RegisterTemplate.jsx";

{
  /*Componentes de clase necesarios */
}

function Register() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <RegisterForm />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Register;
