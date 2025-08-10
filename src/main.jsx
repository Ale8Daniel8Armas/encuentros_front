import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";

import HomeTheme from "./Home.jsx";
import LoginTheme from "./Login.jsx";
import RegisterTheme from "./Register.jsx";
import FormTheme from "./Form.jsx";
import StadiumTheme from "./Stadium.jsx";
import CartTheme from "./CartContent.jsx";
import EventTheme from "./Event.jsx";
import ResultsTheme from "./Results.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      {/* Rutas establecidas */}
      <Route path="/homepage" element={<HomeTheme />} />
      <Route path="/register" element={<RegisterTheme />} />
      <Route path="/login" element={<LoginTheme />} />
      <Route path="/form" element={<FormTheme />} />
      <Route path="/stadium" element={<StadiumTheme />} />
      <Route path="/cart" element={<CartTheme />} />
      <Route path="/event/:id" element={<EventTheme />} />
      <Route path="/buscar" element={<ResultsTheme />} />
      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/homepage" replace />} />
    </Routes>
  </BrowserRouter>
);
