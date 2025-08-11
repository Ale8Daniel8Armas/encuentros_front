import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";

export function Asistencia() {
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Formulario
  const [eventoId, setEventoId] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [puerta, setPuerta] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch asistencias
  const fetchAsistencias = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3004/asistencias");
      if (!res.ok) throw new Error("Error al cargar asistencias");
      const data = await res.json();
      setAsistencias(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsistencias();
  }, []);

  // Registrar asistencia manual
  const handleRegistrar = async (e) => {
    e.preventDefault();
    if (!eventoId || !usuarioId || !puerta) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setFormLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3004/asistencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventoId, usuarioId, puerta }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al registrar asistencia");
      }

      const nuevaAsistencia = await res.json();
      setAsistencias([nuevaAsistencia, ...asistencias]);
      setSuccessMsg("Asistencia registrada con éxito");
      setEventoId("");
      setUsuarioId("");
      setPuerta("");
    } catch (e) {
      setError(e.message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12 max-w-7xl mx-auto">
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-6 p-6">
          <Typography variant="h5" color="white">
            Registro Manual de Asistencia
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleRegistrar} className="flex flex-col gap-4 max-w-md">
            <Input
              label="ID Evento"
              value={eventoId}
              onChange={(e) => setEventoId(e.target.value)}
              required
            />
            <Input
              label="ID Usuario"
              value={usuarioId}
              onChange={(e) => setUsuarioId(e.target.value)}
              required
            />
            <Input
              label="Puerta"
              value={puerta}
              onChange={(e) => setPuerta(e.target.value)}
              required
            />
            <Button type="submit" disabled={formLoading} color="blue">
              {formLoading ? "Registrando..." : "Registrar Asistencia"}
            </Button>
            {error && (
              <Typography color="red" variant="small" className="mt-2">
                {error}
              </Typography>
            )}
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader variant="gradient" color="gray" className="p-6">
          <Typography variant="h6" color="white">
            Listado de Asistencias
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto">
          {loading ? (
            <Typography>Cargando asistencias...</Typography>
          ) : asistencias.length === 0 ? (
            <Typography>No hay asistencias registradas.</Typography>
          ) : (
            <table className="w-full min-w-[640px] table-auto border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  {["Evento ID", "Usuario ID", "Puerta", "Fecha y Hora"].map((h) => (
                    <th
                      key={h}
                      className="border border-gray-300 py-2 px-4 text-left text-sm font-semibold text-gray-700"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {asistencias.map(({ evento_id, usuario_id, puerta, fecha_hora }, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border border-gray-300 py-2 px-4">{evento_id}</td>
                    <td className="border border-gray-300 py-2 px-4">{usuario_id}</td>
                    <td className="border border-gray-300 py-2 px-4">{puerta}</td>
                    <td className="border border-gray-300 py-2 px-4">
                      {new Date(fecha_hora).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default Asistencia;
