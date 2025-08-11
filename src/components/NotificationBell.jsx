import React, { useState, useEffect } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import {
  Alert,
  Dialog,
  DialogHeader,
  DialogBody,
} from "@material-tailwind/react";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [latestNotification, setLatestNotification] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3003");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications((prev) => [data, ...prev]);
      setLatestNotification(data);
      setOpenDialog(true);
    };
    return () => ws.close();
  }, []);

  return (
    <div className="relative">
      {/* Icono de campana */}
      <button
        onClick={() => setOpenDialog(true)}
        className="relative p-2 rounded-full hover:bg-gray-200"
      >
        <BellIcon className="h-6 w-6 text-white" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Modal de notificación más reciente */}
      <Dialog open={openDialog} handler={setOpenDialog}>
        <DialogHeader>Notificación</DialogHeader>
        <DialogBody>
          {latestNotification && (
            <Alert color={latestNotification.tipo || "blue"}>
              {latestNotification.mensaje}
            </Alert>
          )}
          {notifications.length > 1 && (
            <div className="mt-4 space-y-2">
              {notifications.slice(1).map((n, idx) => (
                <Alert key={idx} color={n.tipo || "blue"}>
                  {n.mensaje}
                </Alert>
              ))}
            </div>
          )}
        </DialogBody>
      </Dialog>
    </div>
  );
}
