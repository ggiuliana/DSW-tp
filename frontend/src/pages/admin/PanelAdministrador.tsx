import { useLocation, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/layout/AdminSidebar";
import GestionVeterinarios from "./GestionVeterinarios";
import GestionTiposVacuna from "./GestionTipoVacunas";
import InicioAdministrador from "./InicioAdministrador";
import TurnosAdministrador from "./TurnosAdministrador";
import logoVet from "../../assets/logoVet.png";
import GestionEstudios from "./GestionEstudios";

export default function PanelAdministrador() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("nombrePersona");
    localStorage.removeItem("idPersona");
    navigate("/");
  };

  const renderContenido = () => {
    switch (pathname) {
      case "/administrador/veterinarios":
        return <GestionVeterinarios />;
      case "/administrador/estudios":
        return <GestionEstudios />;
      case "/administrador/tipos-vacuna":
        return <GestionTiposVacuna />;
      case "/administrador/turnos":
        return <TurnosAdministrador />;
      default:
        return <InicioAdministrador />;
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-purple-50 p-8 pb-28 pt-28 lg:pb-8 lg:pl-80">
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
          onClick={logOut}
          className="flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 transition-all hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-500 lg:px-4 lg:text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 lg:h-4 lg:w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span className="hidden whitespace-nowrap sm:inline">Cerrar sesión</span>
        </button>
      </header>
      <AdminSidebar />
      <div className="flex-1">{renderContenido()}</div>
    </main>
  );
}