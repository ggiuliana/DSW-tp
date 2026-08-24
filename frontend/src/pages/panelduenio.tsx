import DuenioFooter from "../components/dueniofooter";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function PanelDuenio() {
    const nombre = localStorage.getItem("nombrePersona") || "usuario";
    const { pathname } = useLocation();

    const navigate = useNavigate()
    const logOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("nombrePersona");
        navigate("/")
    };

    function renderContenido() {
        switch (pathname) {
            case "/duenio/mascotas":
                return <h1 className="text-3xl text-black">Mis mascotas</h1>;
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
        <main className="min-h-screen flex flex-col bg-purple-50 p-8 pt-28">
            <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-3 py-2 h-20 flex items-center">  
                <img src="logoVet.png" alt="logo de veterinaria" className="w-auto absolute left-1/2 -translate-x-1/2 h-full lg:left-1/12 rounded-full"></img>
                <h3 onClick={logOut}>Cerrar Sesión</h3>
            </header>
            <div>
                {renderContenido()}
            </div>
            <DuenioFooter />
        </main>
    );

}

export default PanelDuenio;