import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ingresarIcon from "../../assets/icons/ingresar.png";
import type { LoginFormData } from "../../types/auth.js";
import { useLogin } from "../../hooks/useLogin";

function Login(){
    const navigate = useNavigate();
    const { error: errorEnvio, iniciarSesion } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginFormData>();

    const onSubmit = async (data: LoginFormData) => {
        await iniciarSesion(data);
    };
    
    return(

        <div className="relative min-h-screen flex items-center justify-center px-4">
            <button
                onClick={() => navigate("/")}
                className="absolute top-4 left-4 bg-purple-950 hover:bg-violet-900 text-white px-4 py-2 rounded-full font-plusjakarta2"
            >
                ← Volver
            </button>
            <div className="w-full max-w-md bg-white shadow-xl rounded-xl border-2 border-gray-300 p-4">
                <div className="flex items-center gap-3">
                    <img
                        src={ingresarIcon}
                        alt="logo de veterinaria"
                        className="w-8 h-8"
                    />
                    <h2 className="text-xl font-plusjakarta text-purple-950">
                        Inicio de sesión
                    </h2>
                </div>

                <p className="mt-3 font-plusjakarta2 text-gray-600">
                    Accede a registros médicos y próximas citas.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
                    {errorEnvio && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{errorEnvio}</p>}
                    <input
                        type="text"
                        autoComplete="username"
                        placeholder="Nombre de usuario"
                        {...register("nombre_usuario", {
                        required: {
                            value: true,
                            message: "El usuario es obligatorio."
                        }
                        })}
                        className="border-2 bg-violet-50 border-gray-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-500 font-plusjakarta"
                    />
                        {errors.nombre_usuario && 
                            <span>{errors.nombre_usuario.message as string}</span>
                        }
                    <input
                        type="password"
                        autoComplete="current-password"
                        placeholder="Contraseña"
                        {...register("contrasenia", {
                        required: {
                            value: true,
                            message: "La contraseña es obligatoria."
                        }
                        })}
                        className="border-2 bg-violet-50 border-gray-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-500 font-plusjakarta"
                    />
                        {errors.contrasenia && 
                            <span>{errors.contrasenia.message as string}</span>
                        }
                    
                    <div className="flex flex-col gap-2 text-sm mt-2">
                        <a href="#" className="text-purple-950 hover:underline font-plusjakarta2">
                            ¿Olvidaste tu contraseña?
                        </a>
                        <a onClick={() => navigate("/register")} className="text-purple-950 hover:underline font-plusjakarta2">
                            ¿Eres nuevo? Regístrate
                        </a>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-full bg-purple-950 px-4 py-2 font-plusjakarta2 text-violet-200 hover:bg-violet-900 disabled:cursor-wait disabled:opacity-60"
                        >
                            {isSubmitting ? "Ingresando..." : "Ingresar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;