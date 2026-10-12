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
      <header className="fixed inset-x-0 top-0 z-50 flex h-20 items-center bg-white px-4 py-2 shadow-md">
        <img src={logoVet} alt="Logo de la veterinaria" className="absolute left-1/2 h-14 w-auto -translate-x-1/2 rounded-full object-contain" />
        <button type="button" onClick={cerrarSesion} className="ml-auto rounded-lg border border-violet-200 px-3 py-2 text-sm font-semibold text-violet-800 transition-colors hover:bg-violet-50">Cerrar sesión</button>
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