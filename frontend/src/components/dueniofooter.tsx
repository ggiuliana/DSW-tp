import { NavLink } from "react-router-dom";

const enlaces = [
  { to: "/duenio", label: "Inicio", icono: "./icons/ingresar.png", end: true },
  { to: "/duenio/mascotas", label: "Mascotas", icono: "./icons/botiquin.png" },
  { to: "/duenio/turnos", label: "Turnos", icono: "./icons/jeringuilla.png" },
  { to: "/duenio/perfil", label: "Perfil", icono: "./icons/escudo.png" },
];

function DuenioFooter() {
  return (
    <footer className="mt-auto rounded-2xl border-violet-200 bg-white px-4 py-3 shadow-2xl">
      <nav aria-label="Navegación del panel" className="mx-auto flex max-w-xl justify-around gap-2">
        {enlaces.map(({ to, label, icono, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex min-w-16 flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs transition-colors ${
                isActive
                  ? "bg-violet-100 font-semibold text-violet-800"
                  : "text-gray-600 hover:bg-violet-50 hover:text-violet-700"
              }`
            }
          >
            <img src={icono} alt="" aria-hidden="true" className="h-6 w-6 object-contain" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </footer>
  );
}

export default DuenioFooter;
