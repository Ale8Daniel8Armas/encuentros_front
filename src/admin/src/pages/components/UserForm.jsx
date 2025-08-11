import React, { useEffect, useState } from "react";
import { Input, Button, Select, Option } from "@material-tailwind/react";

export default function UserForm({ user, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    id: null,
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "user",
  });

  useEffect(() => {
    if (user) {
      setForm({
        id: user.id,
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        password: "", 
        role: user.role || "user",
      });
    } else {
      setForm({
        id: null,
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        role: "user",
      });
    }
  }, [user]);

  const handleChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    // validaciones básicas
    if (!form.firstname || !form.lastname || !form.email) {
      return alert("Nombre, apellido y correo son obligatorios.");
    }
    // Si es creación, password obligatorio
    if (!form.id && !form.password) {
      return alert("La contraseña es obligatoria para crear un usuario.");
    }

    // Payload limpio (no mandar password vacío al editar)
    const payload = {
      firstname: form.firstname,
      lastname: form.lastname,
      email: form.email,
      role: form.role,
    };
    if (form.password) payload.password = form.password;
    if (form.id) payload.id = form.id;

    onSubmit(payload, !!form.id);
  };

  return (
  <div className="max-w-5xl w-full mx-auto bg-white p-10 rounded-xl shadow-lg">
    <form onSubmit={submit} className="flex flex-col gap-10">
      <div className="grid grid-cols-2 gap-6">
        <Input
          label="Nombre"
          value={form.firstname}
          onChange={(e) => handleChange("firstname", e.target.value)}
        />
        <Input
          label="Apellido"
          value={form.lastname}
          onChange={(e) => handleChange("lastname", e.target.value)}
        />
      </div>

      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />

      <Input
        label={form.id ? "Cambiar contraseña (opcional)" : "Contraseña"}
        type="password"
        value={form.password}
        onChange={(e) => handleChange("password", e.target.value)}
      />

      <Select
        label="Rol"
        value={form.role}
        onChange={(val) => handleChange("role", val)}
      >
        <Option value="user">Usuario</Option>
        <Option value="admin">Admin</Option>
      </Select>

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" color="red" variant="text" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" color="green">
          {form.id ? "Guardar cambios" : "Crear usuario"}
        </Button>
      </div>
    </form>
  </div>
);
}
