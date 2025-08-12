import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select, Option, Input, Button, Textarea
} from "@material-tailwind/react";
import { EllipsisVerticalIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

import ZonasPreciosForm from "../components/ZonasPrecioForm";

//RUTA PARA CREAR EVENTOS
const API_URL = "http://localhost:3002/eventos"; 

export function EventosD() {
  const [eventos, setEventos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [nuevoEvento, setNuevoEvento] = useState({
    nombre: "",
    descripcion: "",
    fecha: "",
    tipo: "",
    zona_id: Math.floor(Math.random() * 9000) + 1000,
    zona_name: "",
    quantity: 0,
    imagen: "",
    precio: "",
    estado: "activo",
  });

  const fetchEventos = async () => {

    //OBTENER EVENTOS
    try {
      const { data } = await axios.get(API_URL);
      setEventos(data);
    } catch (error) {
      console.error("Error obteniendo eventos", error);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

const handleCrearEvento = async () => {
  if (!nuevoEvento.nombre.trim()) {
    return alert("El nombre del evento es obligatorio");
  }
  if (!nuevoEvento.descripcion.trim()) {
    return alert("La descripción es obligatoria");
  }
  if (!nuevoEvento.fecha) {
    return alert("La fecha es obligatoria");
  }

  const fechaEvento = new Date(nuevoEvento.fecha);
  if (fechaEvento < new Date()) {
    return alert("La fecha del evento debe ser futura");
  }

  if (!nuevoEvento.tipo.trim()) {
    return alert("Selecciona un tipo de evento");
  }

  if (isNaN(nuevoEvento.quantity) || nuevoEvento.quantity <= 0) {
    return alert("La cantidad de entradas debe ser un número positivo");
  }

  if (!nuevoEvento.precio || isNaN(parseFloat(nuevoEvento.precio)) || parseFloat(nuevoEvento.precio) <= 0) {
    return alert("El precio debe ser un número positivo");
  }

  //CREAR EVENTO
  try {
    const body = {
      ...nuevoEvento,
    };
    await axios.post(API_URL, body);
    alert("Evento creado exitosamente");
    setOpenModal(false);
    fetchEventos();
  } catch (error) {
    console.error("Error creando evento", error);
    alert("Ocurrió un error al crear el evento");
  }
};

//ELIMINAR EVENTO (CREAR METODO DE SER NECESARIO)
  const handleEliminarEvento = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este evento?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchEventos();
      } catch (error) {
        console.error("Error eliminando evento", error);
      }
    }
  };

  //subir imagen con cloudinary
const handleUpload = async (file) => {
  if (!file) return;

  const formData = new FormData();
  formData.append("imagen", file);

  // RUTA PARA SUBIR IMAGEN CLOUDINARY
  try {
    const res = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok && data.url) {
      setNuevoEvento((prev) => ({ ...prev, imagen: data.url }));
    } else {
      console.error("Error subiendo imagen:", data.error || "Desconocido");
    }
  } catch (error) {
    console.error("Error al subir imagen", error);
  }
};

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <div className="flex justify-between items-center">
        <Typography variant="h4" color="blue-gray">
          Gestión de Eventos
        </Typography>
        <Button
          className="flex items-center gap-2 bg-blue-600"
          onClick={() => setOpenModal(true)}
        >
          <PlusIcon className="h-5 w-5" />
          Nuevo Evento
        </Button>
      </div>

      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Lista de Eventos
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
                  "Imagen",
                  "Nombre",
                  "Tipo",
                  "Fecha",
                  "Precio",
                  "Entradas",
                  "",
                ].map((el) => (
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
              {eventos.map((evento, key) => {
                const className = `py-3 px-5 ${
                  key === eventos.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                }`;
                return (
                  <tr key={evento.id}>
                    <td className={className}>
                      <Avatar
                        src={evento.imagen}
                        alt={evento.nombre}
                        size="sm"
                        variant="rounded"
                      />
                    </td>
                    <td className={className}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold"
                      >
                        {evento.nombre}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {evento.tipo}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {new Date(evento.fecha).toLocaleString()}
                      </Typography>
                    </td>
                    <td className={className}>
                      ${evento.precio.join(", ")}
                    </td>
                    <td className={className}>{evento.quantity}</td>
                    <td className={className}>
                      <TrashIcon
                        className="h-5 w-5 text-red-500 cursor-pointer"
                        onClick={() => handleEliminarEvento(evento.id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Modal Crear Evento */}
      <Dialog open={openModal} handler={() => setOpenModal(!openModal)}>
        <div className="max-h-[80vh] overflow-y-auto p-4">
        <DialogHeader>Crear nuevo evento</DialogHeader>
        <DialogBody divider className="flex flex-col gap-4">
          <Input
            label="Nombre"
            value={nuevoEvento.nombre}
            onChange={(e) =>
              setNuevoEvento({ ...nuevoEvento, nombre: e.target.value })
            }
          />
          <Textarea
            label="Descripción"
            value={nuevoEvento.descripcion}
            onChange={(e) =>
              setNuevoEvento({ ...nuevoEvento, descripcion: e.target.value })
            }
          />
          <Input
            type="datetime-local"
            label="Fecha"
            value={nuevoEvento.fecha}
            onChange={(e) =>
              setNuevoEvento({ ...nuevoEvento, fecha: e.target.value })
            }
          />

          <div className="mb-4">
          <Select
            label="Tipo"
            value={nuevoEvento.tipo}
            onChange={(val) => setNuevoEvento({ ...nuevoEvento, zona_name: val })}
          >
          <Option value="Deportivo">Encuentro Deportivo</Option>
          <Option value="Musical">Concierto/Musical</Option>
          <Option value="Civico">Cívico/Cultural</Option>
          </Select>
          </div>

          <ZonasPreciosForm nuevoEvento={nuevoEvento} setNuevoEvento={setNuevoEvento} />

          <Input
            type="number"
            label="Cantidad"
            value={nuevoEvento.quantity}
            onChange={(e) =>
              setNuevoEvento({ ...nuevoEvento, quantity: parseInt(e.target.value) })
            }
          />
          <input
        type="file"
        accept="image/*"
        onChange={(e) => handleUpload(e.target.files[0])}
      />

      {nuevoEvento.imagen && (
        <img
          src={nuevoEvento.imagen}
          alt="Vista previa"
          className="mt-4 w-40 rounded-lg shadow"
        />
      )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpenModal(false)}
            className="mr-1"
          >
            Cancelar
          </Button>
          <Button variant="gradient" color="green" onClick={handleCrearEvento}>
            Guardar
          </Button>
        </DialogFooter>
        </div>
      </Dialog>
    </div>
  );
}

export default EventosD;
