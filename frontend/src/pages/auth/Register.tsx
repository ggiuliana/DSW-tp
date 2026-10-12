import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ingresarIcon from "../../assets/icons/ingresar.png";
import type { RegisterFormData } from "../../types/auth.js";
import { useRegister } from "../../hooks/useRegister";

function Register(){
    const navigate = useNavigate();
    const { error, registrar } = useRegister();

    const {
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors, isSubmitting }
    } = useForm<RegisterFormData>();

    const contrasenia = useWatch({
        control,
        name: "contrasenia",
        defaultValue: ""
    });
    
    const onSubmit = async (data: RegisterFormData) => {
        const fieldError = await registrar(data);
        if (fieldError) {
            setError(fieldError.field, { type: "server", message: fieldError.message });
        }
    };

    return(

        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
            <button
                onClick={() => navigate("/login")}
                    className="self-start mb-4 text-left bg-purple-950 hover:bg-violet-900 text-white px-4 py-2 rounded-full font-plusjakarta2"
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
                        Registro de usuario
                    </h2>
                </div>

                <p className="mt-3 font-plusjakarta2 text-gray-600">
                    Empieza a tener tus registros y pedir citas.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
                    {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
                    
                    <input
                        type="nombre"
                        placeholder="Nombre"
                        {...register("nombre", {
                        required: {
                            value: true,
                            message: "El nombre es obligatorio."
                        }
                        })}
                        className="border-2 bg-violet-50 border-gray-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-500 font-plusjakarta"
                    />
                        {errors.nombre && 
                            <span>{errors.nombre.message as string}</span>
                        }
                    <input
                        type="apelido"
                        placeholder="Apellido"
                        {...register("apellido", {
                        required: {
                            value: true,
                            message: "El nombre es obligatorio."
                        }
                        })}
                        className="border-2 bg-violet-50 border-gray-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-500 font-plusjakarta"
                    />
                        {errors.apellido && 
                            <span>{errors.apellido.message as string}</span>
                        }
                    <input
                        type="telefono"
                        placeholder="Telefono"
                        {...register("telefono", {
                        required: {
                            value: true,
                            message: "El telefono es obligatorio."
                        }
                        })}
                        className="border-2 bg-violet-50 border-gray-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-500 font-plusjakarta"
                    />
                        {errors.telefono && 
                            <span>{errors.telefono.message as string}</span>
                        }
                    <input
                        type="email"
                        placeholder="Mail"
                        {...register("mail", {
                        required: {
                            value: true,
                            message: "El mail es obligatorio."
                        },
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "El mail debe tener un formato válido, por ejemplo mail@mail.com."
                        }
                        })}
                        className="border-2 bg-violet-50 border-gray-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-500 font-plusjakarta"
                    />
                        {errors.mail && 
                            <span>{errors.mail.message as string}</span>
                        }
                    <input
                        type="dni"
                        placeholder="Dni"
                        {...register("dni", {
                        required: {
                            value: true,
                            message: "El DNI es obligatorio."
                        }
                        })}
                        className="border-2 bg-violet-50 border-gray-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-500 font-plusjakarta"
                    />
                        {errors.dni && 
                            <span>{errors.dni.message as string}</span>
                        }
                    <input
                        type="direccion"
                        placeholder="Direccion"
                        {...register("direccion", {
                        required: {
                            value: true,
                            message: "La dirección es obligatoria."
                        }
                        })}
                        className="border-2 bg-violet-50 border-gray-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-500 font-plusjakarta"
                    />
                        {errors.direccion && 
                            <span>{errors.direccion.message as string}</span>
                        }
                    <input
                        type="user"
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
                    <input
                        type="password"
                        placeholder="Confirmar contraseña"
                        {...register("confirmarContrasenia", {
                            required: {
                                value: true,
                                message: "Debes confirmar la contraseña."
                            },
                            validate: (valor) =>
                                valor === contrasenia || "Las contraseñas no coinciden."
                        })}
                        className="border-2 bg-violet-50 border-gray-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-500 font-plusjakarta"
                    />
                    {errors.confirmarContrasenia &&
                        <span>{errors.confirmarContrasenia.message as string}</span>
                    }
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-full bg-purple-950 px-4 py-2 font-plusjakarta2 text-violet-200 hover:bg-violet-900 disabled:cursor-wait disabled:opacity-60"
                        >
                            {isSubmitting ? "Registrando..." : "Registrarme"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;