import { Input, Button } from "@material-tailwind/react";
import { useState } from "react";

export default function ZonasPreciosForm({ evento, setEvento }) {
  const zonasBase = [
    "PALCO",
    "TRIBUNA SUR",
    "TRIBUNA NORTE",
    "GENERAL SUR",
    "GENERAL NORTE",
    "PREFERENCIA"
  ];

  const [zonas, setZonas] = useState(
    zonasBase.map((zona) => ({ nombre: zona, precio: "" }))
  );

  const handlePrecioChange = (index, value) => {
    const nuevasZonas = [...zonas];
    nuevasZonas[index].precio = value;
    setZonas(nuevasZonas);

    // Actualizar en el evento
    setEvento({
      ...evento,
      zona_name: nuevasZonas.map((z) => z.nombre),
      precio: nuevasZonas.map((z) => Number(z.precio))
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="font-bold text-center">ZONA</div>
      <div className="font-bold text-center">PRECIO</div>

      {zonas.map((zona, index) => (
        <>
          <div className="flex items-center justify-center border p-2" key={`zona-${index}`}>
            {zona.nombre}
          </div>
          <div className="flex items-center justify-center border p-2" key={`precio-${index}`}>
            <Input
              type="number"
              placeholder="Ingresar..."
              value={zona.precio}
              onChange={(e) => handlePrecioChange(index, e.target.value)}
              className="text-center"
            />
          </div>
        </>
      ))}
    </div>
  );
}
