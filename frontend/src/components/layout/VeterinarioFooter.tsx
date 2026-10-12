import { NavLink } from "react-router-dom";
import hogarIcon from "../../assets/icons/hogar.png";
import agendaIcon from "../../assets/icons/agenda.png";
import botiquinIcon from "../../assets/icons/botiquin.png";
import usuarioIcon from "../../assets/icons/usuario.png";

const enlaces = [
  { to: "/veterinario", label: "Inicio", icono: hogarIcon, end: true },
  { to: "/veterinario/turnos", label: "Turnos", icono: agendaIcon },
  { to: "/veterinario/consultas", label: "Consultas", icono: botiquinIcon },
  { to: "/veterinario/perfil", label: "Mi perfil", icono: usuarioIcon },
];

function VeterinarioFooter() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 w-full border-t border-violet-200 bg-white px-4 py-3 shadow-2xl lg:inset-x-auto lg:top-20 lg:left-0 lg:bottom-0 lg:flex lg:w-64 lg:flex-col lg:border-t-0 lg:border-r lg:px-5 lg:py-8 lg:shadow-lg">
      <nav aria-label="Navegación del panel" className="mx-auto flex max-w-xl justify-around gap-2 lg:w-full lg:flex-col lg:gap-3">
        {enlaces.map(({ to, label, icono, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex min-w-16 flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs transition-colors lg:flex-row lg:justify-start lg:gap-3 lg:px-4 lg:py-3 lg:text-sm ${
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

export default VeterinarioFooter;