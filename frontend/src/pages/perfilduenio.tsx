import { useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useNavigate } from "react-router-dom"

interface Duenio {
    id_persona: number
    nombre: string
    apellido: string
    telefono: string
    mail: string
    dni: string
    direccion: string
}

interface Usuario {
    id_usuario: number
    nombre_usuario: string
    contrasenia: string
    estado: string
    fechaAlta: Date
    persona: Duenio
}

type DuenioFormData = Omit<Duenio, "id_persona">
type PasswordFormData = {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

function VerPerfil(){

    const [cargando, setCargando] = useState(true)
    const [duenio, setDuenio] = useState<Duenio | null>(null)
    const [usuario] = useState<Usuario | null>(() => {
        const usuarioGuardado = localStorage.getItem("usuario")
        return usuarioGuardado ? JSON.parse(usuarioGuardado) as Usuario : null
    })
    const [error, setError] = useState("")
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
    const [mostrarCambioContrasenia, setMostrarCambioContrasenia] = useState(false)
    const navigate = useNavigate()
    const { register, handleSubmit, reset, formState: { errors } } = useForm<DuenioFormData>();
    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        reset: resetPassword,
        control: passwordControl,
        formState: { errors: passwordErrors },
    } = useForm<PasswordFormData>();
    const nuevaContrasenia = useWatch({ control: passwordControl, name: "newPassword" });

    useEffect(() => {
        const cargarDuenio = async () => {
            const idDuenio = localStorage.getItem("idPersona")

            if (!idDuenio) {
                throw new Error("No se encontró el dueño de la sesión")
            }

            const response = await fetch(`http://localhost:3000/api/duenio/${idDuenio}`, {
                method: "GET",
            })
            const resultado = await response.json()

            if (!response.ok) {
                throw new Error(resultado.message || "No se pudo cargar la información")
            }

            setDuenio(resultado.data)
        }



        cargarDuenio()
            .catch((err: Error) => setError(err.message))
            .finally(() => setCargando(false))
    }, [])

    if (cargando) return <p>Cargando perfil...</p>
    if (error) return <p>{error}</p>
    if (!duenio) return <p>No se encontró la información del dueño.</p>

    const cerrarFormulario = () => {
        setMostrarFormulario(false);
    };

    const abrirFormulario = () => {
        reset({
            nombre: duenio.nombre,
            apellido: duenio.apellido,
            telefono: duenio.telefono,
            mail: duenio.mail,
            dni: duenio.dni,
            direccion: duenio.direccion,
        });
        setMostrarFormulario(true);
    };

    const guardarDuenio = async (data: DuenioFormData) => {
        const idDuenio = localStorage.getItem("idPersona")
        if (!idDuenio) {
                throw new Error("No se encontró el dueño de la sesión")
            }
        const response = await fetch(`http://localhost:3000/api/duenio/${idDuenio}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({...data}),
        });
        const resultado = await response.json()
        if (!response.ok) throw new Error(resultado.message);
        setDuenio(resultado.data as Duenio);
        setMostrarFormulario(false)
    } 

    const eliminarCuenta = async () => {
        const usuarioGuardado = localStorage.getItem("usuario")
        const token = localStorage.getItem("token")
        const idUsuario = usuarioGuardado ? (JSON.parse(usuarioGuardado) as Usuario).id_usuario : null

        if (!token || !idUsuario) {
            setError("No se encontró la sesión del usuario")
            return
        }

        const response = await fetch(`http://localhost:3000/api/usuario/cuenta/${idUsuario}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })
        const resultado = await response.json()
        if (!response.ok) {
            setError(resultado.message || "No se pudo eliminar la cuenta")
            return
        }

        localStorage.removeItem("token")
        localStorage.removeItem("usuario")
        localStorage.removeItem("nombrePersona")
        localStorage.removeItem("idPersona")
        navigate("/")
    }

    const abrirCambioContrasenia = () => {
        resetPassword()
        setMostrarCambioContrasenia(true)
    }

    const cambiarContrasenia = async (data: PasswordFormData) => {
        const usuarioGuardado = localStorage.getItem("usuario")
        const token = localStorage.getItem("token")
        const idUsuario = usuarioGuardado ? (JSON.parse(usuarioGuardado) as Usuario).id_usuario : null

        if (!token || !idUsuario) {
            setError("No se encontró la sesión del usuario")
            return
        }

        const response = await fetch(`http://localhost:3000/api/usuario/cuenta/${idUsuario}/contrasenia`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            }),
        })
        const resultado = await response.json()
        if (!response.ok) {
            setError(resultado.message || "No se pudo cambiar la contraseña")
            return
        }

        setMostrarCambioContrasenia(false)
        resetPassword()
    }

    return(
        <section>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-violet-700">Cuenta personal</p>
                    <h1 className="text-3xl text-black font-plusjakarta-bold">Mi perfil</h1>
                </div>
                <button
                    type="button"
                    onClick={abrirFormulario}
                    className="rounded-lg bg-violet-800 px-5 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-violet-950 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                >
                    Modificar datos
                </button>
            </div>
            <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-lg">
                <div className="flex items-center gap-4 border-b border-violet-100 bg-violet-50/70 px-6 py-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-800 text-xl font-bold text-white shadow-sm">
                        {duenio.nombre.charAt(0)}{duenio.apellido.charAt(0)}
                    </div>
                    <div>
                        {usuario && (
                            <p className="mb-1 text-sm font-semibold text-violet-700">@{usuario.nombre_usuario}</p>
                        )}
                        <h2 className="text-xl font-semibold text-violet-950">{duenio.nombre} {duenio.apellido}</h2>
                        <p className="text-sm text-gray-500">Información de contacto</p>
                    </div>
                </div>
                <div className="grid gap-px bg-violet-100 sm:grid-cols-2">
                    <div className="bg-white px-6 py-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Teléfono</p>
                        <p className="mt-1 text-gray-800">{duenio.telefono}</p>
                    </div>
                    <div className="bg-white px-6 py-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Correo electrónico</p>
                        <p className="mt-1 wrap-break-word text-gray-800">{duenio.mail}</p>
                    </div>
                    <div className="bg-white px-6 py-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">DNI</p>
                        <p className="mt-1 text-gray-800">{duenio.dni}</p>
                    </div>
                    <div className="bg-white px-6 py-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Dirección</p>
                        <p className="mt-1 text-gray-800">{duenio.direccion}</p>
                    </div>
                    <div className="bg-white px-6 py-5 sm:col-span-2">
                        <button
                            type="button"
                            onClick={abrirCambioContrasenia}
                            className="rounded-lg border border-violet-200 px-4 py-2 text-sm font-semibold text-violet-800 transition-colors hover:bg-violet-50"
                        >
                            Cambiar contraseña
                        </button>
                    </div>
                </div>
            </div>
            <button
                type="button"
                onClick={() => setMostrarConfirmacion(true)}
                className="mt-6 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
            >
                Eliminar cuenta
            </button>
            {mostrarFormulario && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <form
                        onSubmit={handleSubmit(guardarDuenio)}
                        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-violet-950">
                                Modificar datos
                            </h2>
                            <button
                                type="button"
                                onClick={cerrarFormulario}
                                aria-label="Cerrar formulario"
                                className="rounded-full px-3 py-1 text-xl text-gray-500 hover:bg-violet-50 hover:text-violet-800"
                            >
                                ×
                            </button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <input {...register("nombre", { required: true })} placeholder="Nombre" className="rounded-lg border border-gray-300 px-3 py-2" />
                            <input {...register("apellido", { required: true })} placeholder="Apellido" className="rounded-lg border border-gray-300 px-3 py-2" />
                            <input {...register("telefono", { required: true })} placeholder="Telefono" className="rounded-lg border border-gray-300 px-3 py-2" />
                            <input
                                {...register("mail", {
                                    required: "El mail es obligatorio.",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "El mail debe tener un formato válido, por ejemplo mail@mail.com.",
                                    },
                                })}
                                type="email"
                                placeholder="Mail"
                                className="rounded-lg border border-gray-300 px-3 py-2"
                            />
                            {errors.mail && <p className="text-sm text-red-600 sm:col-span-2">{errors.mail.message}</p>}
                            <input {...register("dni", { required: true })} placeholder="Dni" className="rounded-lg border border-gray-300 px-3 py-2" />
                            <input {...register("direccion", { required: true })} placeholder="Direccion" className="rounded-lg border border-gray-300 px-3 py-2" /> 
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button type="submit" className="rounded-lg bg-violet-800 px-4 py-2 font-semibold text-white hover:bg-violet-950">
                                Guardar cambios
                            </button>
                        </div>
                    </form>
                </div>
            )}
            {mostrarConfirmacion && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="titulo-eliminar-cuenta"
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                    >
                        <h2 id="titulo-eliminar-cuenta" className="text-2xl font-semibold text-violet-950">Eliminar cuenta</h2>
                        <p className="mt-3 text-gray-600">
                            ¿Seguro que deseas eliminar tu usuario y todos los datos del dueño?
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setMostrarConfirmacion(false)}
                                className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={eliminarCuenta}
                                className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                            >
                                Eliminar cuenta
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {mostrarCambioContrasenia && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <form
                        onSubmit={handlePasswordSubmit(cambiarContrasenia)}
                        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-violet-950">Cambiar contraseña</h2>
                            <button
                                type="button"
                                onClick={() => setMostrarCambioContrasenia(false)}
                                aria-label="Cerrar formulario"
                                className="rounded-full px-3 py-1 text-xl text-gray-500 hover:bg-violet-50 hover:text-violet-800"
                            >
                                ×
                            </button>
                        </div>
                        <div className="flex flex-col gap-4">
                            <input
                                {...registerPassword("currentPassword", { required: "Ingresa tu contraseña actual" })}
                                type="password"
                                placeholder="Contraseña actual"
                                className="rounded-lg border border-gray-300 px-3 py-2"
                            />
                            <input
                                {...registerPassword("newPassword", { required: "Ingresa una nueva contraseña", minLength: { value: 6, message: "Debe tener al menos 6 caracteres" } })}
                                type="password"
                                placeholder="Nueva contraseña"
                                className="rounded-lg border border-gray-300 px-3 py-2"
                            />
                            <input
                                {...registerPassword("confirmPassword", {
                                    required: "Confirma tu nueva contraseña",
                                    validate: (value) => value === nuevaContrasenia || "Las contraseñas no coinciden",
                                })}
                                type="password"
                                placeholder="Confirmar nueva contraseña"
                                className="rounded-lg border border-gray-300 px-3 py-2"
                            />
                        </div>
                        {passwordErrors.currentPassword && <p className="mt-2 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>}
                        {passwordErrors.newPassword && <p className="mt-2 text-sm text-red-600">{passwordErrors.newPassword.message}</p>}
                        {passwordErrors.confirmPassword && <p className="mt-2 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setMostrarCambioContrasenia(false)}
                                className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
                            >
                                Cancelar
                            </button>
                            <button type="submit" className="rounded-lg bg-violet-800 px-4 py-2 font-semibold text-white hover:bg-violet-950">
                                Guardar contraseña
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
}

export default VerPerfil;