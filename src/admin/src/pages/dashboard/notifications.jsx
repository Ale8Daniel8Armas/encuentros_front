import React, { useEffect, useState } from "react";
import {
  Typography,
  Alert,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);

  //RUTA PARA CARGAR NOTIFICACIONES EN EL DASHBOARD
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3003");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotificaciones((prev) => [data, ...prev]);
    };
    return () => ws.close();
  }, []);

  return (
    <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8">
      <Card>
        <CardHeader color="transparent" floated={false} shadow={false} className="m-0 p-4">
          <Typography variant="h5" color="blue-gray">
            Notificaciones en tiempo real
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 p-4">
          {notificaciones.length === 0 && (
            <Typography color="gray">No hay notificaciones aún.</Typography>
          )}
          {notificaciones.map((n, idx) => (
            <Alert
              key={idx}
              color={n.tipo || "blue"}
              icon={<InformationCircleIcon strokeWidth={2} className="h-6 w-6" />}
            >
              {n.mensaje}
            </Alert>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}

export default Notificaciones;
