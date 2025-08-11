import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import "../src/admin/public/css/tailwind.css";

// Páginas públicas
import HomeTheme from "./Home.jsx";
import LoginTheme from "./Login.jsx";
import RegisterTheme from "./Register.jsx";
import FormTheme from "./Form.jsx";
import StadiumTheme from "./Stadium.jsx";
import CartTheme from "./CartContent.jsx";
import EventTheme from "./Event.jsx";
import ResultsTheme from "./Results.jsx";
import EntradasTheme from "./Entradas.jsx";

// Dashboard
import AdminLayout from "../src/admin/src/layouts/Admin.jsx";
import adminRoutes from "../src/admin/src/routes.jsx";

// Contextos del dashboard
import { ThemeProvider } from "@material-tailwind/react";
import { MaterialTailwindControllerProvider } from "../src/admin/src/context";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      {/* Rutas públicas */}
      <Route path="/homepage" element={<HomeTheme />} />
      <Route path="/register" element={<RegisterTheme />} />
      <Route path="/login" element={<LoginTheme />} />
      <Route path="/form" element={<FormTheme />} />
      <Route path="/stadium" element={<StadiumTheme />} />
      <Route path="/cart" element={<CartTheme />} />
      <Route path="/event/:id" element={<EventTheme />} />
      <Route path="/buscar" element={<ResultsTheme />} />
      <Route path="/entradas" element={<EntradasTheme />} />

      {/* Dashboard */}
      <Route
        path="/dashboard/*"
        element={
          <ThemeProvider>
            <MaterialTailwindControllerProvider>
              <AdminLayout routes={adminRoutes} />
            </MaterialTailwindControllerProvider>
          </ThemeProvider>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/homepage" replace />} />
    </Routes>
  </BrowserRouter>
);
