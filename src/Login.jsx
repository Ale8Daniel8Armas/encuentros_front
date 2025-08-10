import { useState } from "react";
import HeaderNavbar from "./layout/Navbar.jsx";
import Footer from "./layout/Footer.jsx";

{
  /*Componentes de clase necesarios */
}
import LoginForm from "./components/LoginTemplate.jsx";

function Login() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <LoginForm />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Login;
