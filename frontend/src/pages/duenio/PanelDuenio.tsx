import DuenioFooter from "../../components/layout/DuenioFooter";
import { useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import VerMascotas from "./MascotasDuenio";
import VerPerfil from "./PerfilDuenio"
import HistoriaClinica from "./HistoriaClinica";
import ConsultaDetalle from "./ConsultaDetalle";
import TurnoConsultaDetalle from "./TurnosConsultaDetalle";
import TurnosDuenio from "./TurnosDuenio";
import InicioDuenio from "./InicioDuenio";
import logoVet from "../../assets/logoVet.png";

function PanelDuenio() {
    const nombre = localStorage.getItem("nombrePersona") || "usuario";
    const { pathname } = useLocation();
    const { id_mascota, id_consulta } = useParams();
    const navigate = useNavigate()
    const logOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        localStorage.removeItem("nombrePersona");
        localStorage.removeItem("idPersona");
        navigate("/")
    };

    function renderContenido() {

        if (pathname.includes("/duenio/turnos/consulta/") && id_consulta) {
            return <TurnoConsultaDetalle />;
        }

        if (pathname.includes("/consulta/") && id_consulta) {
            return <ConsultaDetalle />;
        }

        if (pathname.startsWith("/duenio/mascotas/") && id_mascota) {
            return <HistoriaClinica idMascota={id_mascota} />;
        }

        switch (pathname) {
            case "/duenio/mascotas":
                return <VerMascotas />;
            case "/duenio/turnos":
                return <TurnosDuenio />;
            case "/duenio/perfil":
                return <VerPerfil />;
            default:
                return <InicioDuenio nombre={nombre} />;
        }
    }

    return(
        <main className="min-h-screen flex flex-col bg-purple-50 p-8 pb-28 pt-28 lg:pb-8 lg:pl-72">
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
            <div className="flex-1">
                {renderContenido()}
            </div>
            <DuenioFooter />
        </main>
    );
}

export default PanelDuenio;