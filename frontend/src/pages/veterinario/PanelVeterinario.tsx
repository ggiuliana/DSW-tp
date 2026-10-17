import { useLocation, useNavigate } from "react-router-dom";
import VeterinarioFooter from "../../components/layout/VeterinarioFooter";
import logoVet from "../../assets/logoVet.png";
import PanelInicioVeterinario from "./PanelInicioVeterinario";
import TurnosVeterinario from "./TurnosVeterinario";
import ConsultasVeterinario from "./ConsultasVeterinario";
import PerfilVeterinario from "./PerfilVeterinario";
import { usePanelVeterinario } from "../../hooks/usePanelVeterinario";

function PanelVeterinario() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const cerrarSesion = () => {
    ["token", "usuario", "nombrePersona", "idPersona"].forEach((key) => localStorage.removeItem(key));
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-purple-50 px-5 pb-28 pt-28 lg:pl-72 lg:pr-10 lg:pb-10">
      <header className="fixed inset-x-0 top-0 z-50 flex h-20 items-center justify-between bg-white px-4 py-2 shadow-md">
        <div className="flex items-center">
          <img 
            src={logoVet} 
            alt="Logo de la veterinaria" 
            className="h-12 w-auto rounded-full object-contain md:h-14 lg:h-16" 
          />
        </div>
        <button
          type="button"
          onClick={cerrarSesion}
          className="flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 transition-all hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-500 lg:px-4 lg:text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 lg:h-4 lg:w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span className="hidden whitespace-nowrap sm:inline">Cerrar sesión</span>
        </button>
      </header>
      <div className="mx-auto w-full max-w-6xl">
        <ContenidoPanelVeterinario pathname={pathname} />
      </div>
      <VeterinarioFooter />
    </main>
  );
}

function ContenidoPanelVeterinario({ pathname }: { pathname: string }) {
  if (pathname === "/veterinario/perfil") return <PerfilVeterinario />;
  if (pathname === "/veterinario") {
    return <PanelInicioVeterinario nombre={localStorage.getItem("nombrePersona") || "Profesional"} />;
  }
  return <AgendaVeterinario pathname={pathname} />;
}

function AgendaVeterinario({ pathname }: { pathname: string }) {
  const { nombre, turnos, consultas, cargando, error, crearTurnoDisponible, borrarTurnoDisponible, guardarConsulta } = usePanelVeterinario();

  if (cargando) return <p className="text-gray-600">Cargando agenda...</p>;

  return (
    <>
      {error && <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
      {pathname === "/veterinario/consultas"
        ? <ConsultasVeterinario turnos={turnos} consultas={consultas} onGuardar={guardarConsulta} />
        : pathname === "/veterinario/turnos"
          ? <TurnosVeterinario turnos={turnos} consultas={consultas} onCrear={crearTurnoDisponible} onBorrar={borrarTurnoDisponible} />
          : <PanelInicioVeterinario nombre={nombre} />}
    </>
  );
}

export default PanelVeterinario;