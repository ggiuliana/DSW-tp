import { NavLink } from "react-router-dom";
import hogarIcon from "../../assets/icons/hogar.png";
import veterinarioIcon from "../../assets/icons/veterinario.png";
import estudioIcon from "../../assets/icons/genetica.png";
import vacunaIcon from "../../assets/icons/vacuna.png";
import agendaIcon from "../../assets/icons/agenda.png";

export default function AdminSidebar() {
  const itemClass = ({ isActive }: { isActive: boolean }) =>
    `flex transition-colors rounded-xl ` +

    `flex-col items-center justify-center gap-1 p-2 flex-1 ` +
    
    `lg:flex-row lg:justify-start lg:items-center lg:gap-3 lg:px-4 lg:py-3 lg:flex-none lg:w-[240px] ` +
    (isActive
      ? "bg-violet-100 text-violet-900 font-semibold"
      : "text-gray-500 hover:text-violet-800 lg:text-gray-600 lg:hover:bg-violet-50");

  return (
    <aside
      className={`
        fixed z-30 bg-white flex 
        /* Celular */
        bottom-0 left-0 w-full h-[76px] flex-row shadow-[0_-4px_24px_rgba(0,0,0,0.05)]
        /* Escritorio */
        lg:top-0 lg:h-screen lg:w-72 lg:flex-col lg:shadow-[4px_0_24px_rgba(0,0,0,0.03)] lg:pt-20
      `}
    >
      <nav className="flex flex-row w-full h-full px-2 items-center justify-around lg:flex-col lg:items-center lg:h-auto lg:justify-start lg:gap-2 lg:px-6 lg:pt-6">
        
        <NavLink to="/administrador" end className={itemClass}>
          <img src={hogarIcon} alt="Inicio" className="w-6 h-6 lg:w-7 lg:h-7 object-contain" />
          <span className="text-[11px] lg:text-[1.05rem]">Inicio</span>
        </NavLink>

        <NavLink to="/administrador/veterinarios" className={itemClass}>
          <img src={veterinarioIcon} alt="Veterinarios" className="w-6 h-6 lg:w-7 lg:h-7 object-contain" />
          <span className="text-[11px] lg:text-[1.05rem]">Veterinarios</span>
        </NavLink>

        <NavLink to="/administrador/estudios" className={itemClass}>
          <img 
            src={estudioIcon}
            alt="Estudios" 
            className="w-6 h-6 lg:w-7 lg:h-7 object-contain" 
            style={{ filter: "brightness(0) saturate(100%) invert(29%) sepia(50%) saturate(3193%) hue-rotate(256deg) brightness(89%) contrast(92%)" }}
          />
          <span className="text-[11px] lg:text-[1.05rem]">Estudios</span>
        </NavLink>

        <NavLink to="/administrador/tipos-vacuna" className={itemClass}>
          <img src={vacunaIcon} alt="Tipos de Vacuna" className="w-6 h-6 lg:w-7 lg:h-7 object-contain" />
          <span className="text-[11px] lg:text-[1.05rem]">
            <span className="lg:hidden">Vacunas</span>
            <span className="hidden lg:inline">Tipos de Vacuna</span>
          </span>
        </NavLink>

        <NavLink to="/administrador/turnos" className={itemClass}>
          <img src={agendaIcon} alt="Turnos" className="w-6 h-6 lg:w-7 lg:h-7 object-contain" />
          <span className="text-[11px] lg:text-[1.05rem]">Turnos</span>
        </NavLink>

      </nav>
    </aside>
  );
}