import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "../src/layouts";

function App() {
  return (
    <Routes>
      <Route path="home" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="home" replace />} />
    </Routes>
  );
}

export default App;
