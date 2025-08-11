// src/pages/UsuariosD.jsx
import React, { useEffect, useState } from "react";
import {
  Card, CardHeader, CardBody, Typography, Avatar, Chip, Button, Dialog, DialogHeader,
  DialogBody, DialogFooter, Input
} from "@material-tailwind/react";
import { usersApi } from "../api/users";
import UserForm from "../components/UserForm"; 

export function UsuariosD() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null); 

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await usersApi.list();
      setUsers(res.data);
    } catch (err) {
      console.error("Error al listar usuarios:", err);
      // opcional: mostrar toast/error UI
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateClick = () => {
    setEditingUser(null);
    setOpenForm(true);
  };

  const handleEditClick = (u) => {
    setEditingUser(u);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await usersApi.remove(id);
      setUsers((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.error("Error eliminando usuario:", err);
      alert("No se pudo eliminar el usuario. Revisa permisos o consola.");
    }
  };

  const handleFormSubmit = async (payload, isEdit) => {
    try {
      if (isEdit) {
        await usersApi.update(payload.id, payload);
      } else {
        await usersApi.create(payload);
      }
      setOpenForm(false);
      fetchUsers();
    } catch (err) {
      console.error("Error guardando usuario:", err);
      alert("Error guardando usuario. Ver consola.");
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <div className="flex justify-between items-center">
        <Typography variant="h4" color="blue-gray">Gestión de Usuarios</Typography>
        <Button color="green" onClick={handleCreateClick}>Nuevo usuario</Button>
      </div>

      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-4 p-6">
          <Typography variant="h6" color="white">Lista de usuarios</Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
          <table className="w-full table-auto">
            <thead>
              <tr>
                {["Nombre", "Email", "Rol", "Creado", "Acciones"].map((th) => (
                  <th key={th} className="border-b py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">{th}</Typography>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-4">Cargando...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="p-4">No hay usuarios</td></tr>
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <Avatar variant="circular" size="sm">{u.firstname?.[0] || "U"}</Avatar>
                      <div>
                        <Typography variant="small" className="font-semibold">{u.firstname} {u.lastname}</Typography>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5"><Typography className="text-xs">{u.email}</Typography></td>
                  <td className="py-3 px-5">
                    <Chip value={u.role || "user"} size="sm" className="py-0.5" />
                  </td>
                  <td className="py-3 px-5"><Typography className="text-xs">{new Date(u.created_at).toLocaleString()}</Typography></td>
                  <td className="py-3 px-5">
                    <div className="flex gap-2">
                      <Button size="sm" color="blue" onClick={() => handleEditClick(u)}>Editar</Button>
                      <Button size="sm" color="red" onClick={() => handleDelete(u.id)}>Eliminar</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

    <Dialog open={openForm} handler={() => setOpenForm(!openForm)} size="lg" className="max-w-3xl">
  <DialogHeader>{editingUser ? "Editar usuario" : "Nuevo usuario"}</DialogHeader>
  <DialogBody className="overflow-y-auto max-h-[70vh]">
    <UserForm
      user={editingUser}
      onSubmit={handleFormSubmit}
      onCancel={() => setOpenForm(false)}
    />
  </DialogBody>
</Dialog>

    </div>
  );
}

export default UsuariosD;
