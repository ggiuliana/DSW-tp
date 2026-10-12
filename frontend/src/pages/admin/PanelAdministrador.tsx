import { useLocation, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/layout/AdminSidebar";
import GestionVeterinarios from "./GestionVeterinarios";
import GestionTiposVacuna from "./GestionTipoVacunas";
import InicioAdministrador from "./InicioAdministrador";
import EstudiosAdministrador from "./EstudiosAdministrador";
import TurnosAdministrador from "./TurnosAdministrador";
import logoVet from "../../assets/logoVet.png";

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
        return <EstudiosAdministrador />;
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
      <header className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center bg-white px-4 py-2 shadow-md">
        <img
          src={logoVet}
          alt="Logo de la veterinaria"
          className="absolute left-1/2 h-14 w-auto -translate-x-1/2 rounded-full object-contain"
        />
        <button
          type="button"
          onClick={logOut}
          className="ml-auto rounded-lg border border-violet-200 px-3 py-2 text-sm font-semibold text-violet-800 transition-colors hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          Cerrar sesión
        </button>
      </header>
      <AdminSidebar />
      <div className="flex-1">{renderContenido()}</div>
    </main>
  );
}