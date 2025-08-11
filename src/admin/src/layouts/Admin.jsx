import { Routes, Route, Navigate } from "react-router-dom";
import { routes } from "../routes";
import DashboardLayout from "./dashboard";

export default function AdminLayout() {
  return (
    <DashboardLayout>
      <Routes>
        {routes[0].pages.map(({ path, element }, key) => (
          <Route key={key} path={path.replace(/^\//, "")} element={element} />
        ))}
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
