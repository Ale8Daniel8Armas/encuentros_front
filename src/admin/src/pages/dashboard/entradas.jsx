import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Tooltip,
} from "@material-tailwind/react";

export function EntradasD() {
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEntradas = async () => {

    //RUTA PARA OBTENER ENTRADAS
    try {
      const res = await fetch("http://localhost:3000/entradas"); 
      const data = await res.json();
      setEntradas(data);
    } catch (error) {
      console.error("❌ Error al obtener entradas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntradas();
  }, []);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Gestión de Entradas 
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {loading ? (
            <Typography className="text-center py-4">Cargando...</Typography>
          ) : entradas.length === 0 ? (
            <Typography className="text-center py-4">
              No hay entradas registradas.
            </Typography>
          ) : (
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["ID", "Evento", "Usuario", "Asiento", "QR"].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entradas.map((entrada, key) => {
                  const className = `py-3 px-5 ${
                    key === entradas.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={entrada.id}>
                      <td className={className}>{entrada.id}</td>
                      <td className={className}>{entrada.evento_id}</td>
                      <td className={className}>{entrada.usuario_id}</td>
                      <td className={className}>{entrada.asiento}</td>
                      <td className={className}>
                        <Tooltip content="Ver código QR">
                          <Avatar
                            src={entrada.qr_code}
                            alt="QR"
                            size="sm"
                            variant="rounded"
                            className="cursor-pointer"
                            onClick={() =>
                              window.open(entrada.qr_code, "_blank")
                            }
                          />
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default EntradasD;
