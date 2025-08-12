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

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarTexto = (texto) => {
    const regex = /^[a-zA-ZÀ-ÿ\s]{2,50}$/; 
    return regex.test(texto);
  };

  const submit = (e) => {
    e.preventDefault();

    if (!form.firstname || !form.lastname || !form.email) {
      return alert("Nombre, apellido y correo son obligatorios.");
    }

    if (!validarTexto(form.firstname)) {
      return alert("El nombre solo debe contener letras y tener entre 2 y 50 caracteres.");
    }

    if (!validarTexto(form.lastname)) {
      return alert("El apellido solo debe contener letras y tener entre 2 y 50 caracteres.");
    }

    if (!validarEmail(form.email)) {
      return alert("Ingrese un correo electrónico válido.");
    }

    if (!form.id && !form.password) {
      return alert("La contraseña es obligatoria para crear un usuario.");
    }

    if (form.password && form.password.length < 8) {
      return alert("La contraseña debe tener al menos 6 caracteres.");
    }

    const payload = {
      firstname: form.firstname.trim(),
      lastname: form.lastname.trim(),
      email: form.email.trim(),
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
