import { useLocation, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/adminsidebar";
import GestionVeterinarios from "./gestionveterinarios";
import GestionTiposVacuna from "./gestiontipovacunas";

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

  function renderContenido() {
    switch (pathname) {
      case "/administrador/veterinarios":
        return <GestionVeterinarios />;
      case "/administrador/estudios":
        return <h1 className="text-3xl text-violet-950 font-plusjakarta">Estudios</h1>;
      case "/administrador/tipos-vacuna":
        return <GestionTiposVacuna />;
      case "/administrador/turnos":
        return <h1 className="text-3xl text-violet-950 font-plusjakarta">Agenda y Turnos</h1>;
      default:
        return (
          <div className="flex flex-col gap-6">
            <h1 className="font-plusjakarta text-3xl text-violet-950">
              Panel de Control
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-violet-100">
                <h3 className="text-gray-500 text-sm">Gestión</h3>
                <p className="text-lg font-bold text-violet-900 mt-1">Veterinarios y Personal</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-violet-100">
                <h3 className="text-gray-500 text-sm">Configuración</h3>
                <p className="text-lg font-bold text-violet-900 mt-1">Estudios y Vacunas</p>
              </div>
            </div>
          </div>
        );
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-purple-50 p-8 pb-28 pt-28 lg:pb-8 lg:pl-80">
      <header className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center bg-white px-4 py-2 shadow-md">
        <img
          src="/logoVet.png"
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