import React from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function Home() {
  const eventos = [
    { id: 1, nombre: "Concierto Rock", fecha: "2025-09-01", entradas: 250, asistencias: 200 },
    { id: 2, nombre: "Feria Tecnológica", fecha: "2025-09-15", entradas: 400, asistencias: 350 },
    { id: 3, nombre: "Obra de Teatro", fecha: "2025-09-20", entradas: 150, asistencias: 140 },
  ];

  const totalEventos = eventos.length;
  const totalEntradas = eventos.reduce((acc, e) => acc + e.entradas, 0);
  const totalAsistencias = eventos.reduce((acc, e) => acc + e.asistencias, 0);

  const chartData = {
    labels: eventos.map((e) => e.nombre),
    datasets: [
      {
        label: "Entradas Vendidas",
        data: eventos.map((e) => e.entradas),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Asistencias",
        data: eventos.map((e) => e.asistencias),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" }, title: { display: true, text: "Entradas y Asistencias por Evento" } },
  };

  return (
    <div className="mt-8">
      {/* Cards resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-4">
          <Typography variant="h5">Eventos Activos</Typography>
          <Typography variant="h3" color="blue">{totalEventos}</Typography>
        </Card>
        <Card className="p-4">
          <Typography variant="h5">Entradas Vendidas</Typography>
          <Typography variant="h3" color="green">{totalEntradas}</Typography>
        </Card>
        <Card className="p-4">
          <Typography variant="h5">Asistencias Registradas</Typography>
          <Typography variant="h3" color="purple">{totalAsistencias}</Typography>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <Typography variant="h6">Resumen Visual</Typography>
        </CardHeader>
        <CardBody>
          <Chart type="bar" data={chartData} options={chartOptions} />
        </CardBody>
      </Card>

      {/* Tabla últimos eventos */}
      <Card>
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <Typography variant="h6">Últimos Eventos Creados</Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-2 border-b">Evento</th>
                <th className="p-2 border-b">Fecha</th>
                <th className="p-2 border-b">Entradas</th>
                <th className="p-2 border-b">Asistencias</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((evento) => (
                <tr key={evento.id}>
                  <td className="p-2 border-b">{evento.nombre}</td>
                  <td className="p-2 border-b">{evento.fecha}</td>
                  <td className="p-2 border-b">{evento.entradas}</td>
                  <td className="p-2 border-b">{evento.asistencias}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Home;
