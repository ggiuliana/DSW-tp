import DuenioFooter from "../components/dueniofooter";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import VerMascotas from "./mascotasduenio";

function PanelDuenio() {
    const nombre = localStorage.getItem("nombrePersona") || "usuario";
    const { pathname } = useLocation();

    const navigate = useNavigate()
    const logOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("nombrePersona");
        localStorage.removeItem("idPersona");
        navigate("/")
    };

    function renderContenido() {
        switch (pathname) {
            case "/duenio/mascotas":
                return <VerMascotas />;
            case "/duenio/turnos":
                return <h1 className="text-3xl text-black">Mis turnos</h1>;
            case "/duenio/perfil":
                return <h1 className="text-3xl text-black">Mi perfil</h1>;
            default:
                return (
                <div className="flex flex-col gap-7">
                    <h1 className="font-plusjakarta text-3xl text-black">
                        Hola, {nombre}
                    </h1>
                    <div className="bg-white py-10">
                        No hay turnos próximos
                    </div>
                </div>
                );
        }
    }

    return(
        <main className="min-h-screen flex flex-col bg-purple-50 p-8 pt-28 lg:pl-72">
            <header className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center bg-white px-4 py-2 shadow-md">
                <img src="/logoVet.png" alt="Logo de la veterinaria" className="absolute left-1/2 h-14 w-auto -translate-x-1/2 rounded-full object-contain"></img>
                <button
                    type="button"
                    onClick={logOut}
                    className="ml-auto rounded-lg border border-violet-200 px-3 py-2 text-sm font-semibold text-violet-800 transition-colors hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                >
                    Cerrar sesión
                </button>
            </header>
            <div>
                {renderContenido()}
            </div>
            <DuenioFooter />
        </main>
    );

}

export default PanelDuenio;