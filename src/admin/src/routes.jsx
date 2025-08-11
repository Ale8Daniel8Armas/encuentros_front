import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  BellIcon,
  QrCodeIcon,
  TicketIcon,
  CalendarDaysIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notificaciones, Asistencia, EntradasD, EventosD, UsuariosD } from "@/pages/dashboard";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <CalendarDaysIcon {...icon} />,
        name: "eventos",
        path: "/eventos",
        element: <EventosD />,
      },
      {
        icon: <UsersIcon {...icon} />,
        name: "usuarios",
        path: "/usuarios",
        element: <UsuariosD />,
      },
      {
        icon: <TicketIcon {...icon} />,
        name: "entradas",
        path: "/entradas",
        element: <EntradasD />,
      },
      {
        icon: <QrCodeIcon {...icon} />,
        name: "asistencia",
        path: "/asistencia",
        element: <Asistencia />,
      },
      {
        icon: <BellIcon {...icon} />,
        name: "notificaciones",
        path: "/notificaciones",
        element: <Notificaciones />,
      },
    ],
  },
];

export default routes;
