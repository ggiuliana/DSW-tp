import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

interface Mascota {
    id_mascota: number;
    nombre_mascota: string;
    especie: string;
    raza: string;
    castrado: boolean;
    sexo: string;
    fechaNac: Date
}

type MascotaFormData = Omit<Mascota, "id_mascota" | "fechaNac"> & {
    fechaNac: string;
};

function formatearFechaParaInput(fechaNac: Mascota["fechaNac"]) {
    const fechaTexto = String(fechaNac).trim();
    const fechaISO = fechaTexto.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
    if (fechaISO) return fechaISO;

    const fechaLatina = fechaTexto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (fechaLatina) return `${fechaLatina[3]}-${fechaLatina[2]}-${fechaLatina[1]}`;

    const fecha = new Date(fechaNac);
    if (Number.isNaN(fecha.getTime())) return "";
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
}

function VerMascotas() {
    const [mascotas, setMascotas] = useState<Mascota[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mascotaEnEdicion, setMascotaEnEdicion] = useState<Mascota | null>(null);
    const [mascotaAEliminar, setMascotaAEliminar] = useState<Mascota | null>(null);
    const { register, handleSubmit, reset, control } = useForm<MascotaFormData>();
    const fechaNacSeleccionada = useWatch({ control, name: "fechaNac" });

    useEffect(() => {
        const cargarMascotas = async () => {
            const idDuenio = localStorage.getItem("idPersona");

            if (!idDuenio) {
                throw new Error("No se encontró el dueño de la sesión");
            }

            const response = await fetch(`http://localhost:3000/api/mascota/duenio/${idDuenio}`);
            const resultado = await response.json();
            if (!response.ok) throw new Error(resultado.message);
            return resultado.data as Mascota[];
        };

        cargarMascotas()
            .then((resultado) => {
                setMascotas(resultado);
            })
            .catch((err: Error) => setError(err.message))
            .finally(() => setCargando(false));
    }, []);

    useEffect(() => {
        if (!mascotaEnEdicion) return;

        reset({
            nombre_mascota: mascotaEnEdicion.nombre_mascota,
            especie: mascotaEnEdicion.especie,
            raza: mascotaEnEdicion.raza,
            castrado: mascotaEnEdicion.castrado,
            sexo: mascotaEnEdicion.sexo,
            fechaNac: formatearFechaParaInput(mascotaEnEdicion.fechaNac),
        });
    }, [mascotaEnEdicion, reset]);

    if (cargando) return <p>Cargando mascotas...</p>;
    if (error) return <p>{error}</p>;

    const ahora = new Date();
    const fechaMaxima = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, "0")}-${String(ahora.getDate()).padStart(2, "0")}`;

    const cerrarFormulario = () => {
        setMostrarFormulario(false);
        setMascotaEnEdicion(null);
        reset();
    };

    const abrirFormularioEdicion = (mascota: Mascota) => {
        setMascotaEnEdicion(mascota);
        setMostrarFormulario(true);
    };

    const abrirFormularioAgregar = () => {
        setMascotaEnEdicion(null);
        reset({
            nombre_mascota: "",
            especie: "",
            raza: "",
            castrado: false,
            sexo: "",
            fechaNac: "",
        });
        setMostrarFormulario(true);
    };

    const guardarMascota = async (data: MascotaFormData) => {
        const idDuenio = localStorage.getItem("idPersona");
        if (!idDuenio) return;

        const editando = mascotaEnEdicion !== null;
        const url = editando
            ? `http://localhost:3000/api/mascota/${mascotaEnEdicion.id_mascota}`
            : `http://localhost:3000/api/mascota/duenio/${idDuenio}`;
        const response = await fetch(url, {
            method: editando ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...data,
                fechaNac: `${data.fechaNac} 00:00:00`,
            }),
        });
        const resultado = await response.json();
        if (!response.ok) {
            setError(resultado.message);
            return;
        }

        setMascotas((actuales) => editando
            ? actuales.map((mascota) => mascota.id_mascota === resultado.data.id_mascota ? resultado.data : mascota)
            : [...actuales, resultado.data]);
        cerrarFormulario();
    };

    const solicitarEliminacion = (mascota: Mascota) => {
        setMascotaAEliminar(mascota);
    };

    const eliminarMascota = async () => {
        if (!mascotaAEliminar) return;

        const mascota = mascotaAEliminar;
        const response = await fetch(`http://localhost:3000/api/mascota/${mascota.id_mascota}`, {
            method: "DELETE",
        });
        const resultado = await response.json();
        if (!response.ok) {
            setError(resultado.message);
            return;
        }

        setMascotas((actuales) => actuales.filter((actual) => actual.id_mascota !== mascota.id_mascota));
        setMascotaAEliminar(null);
        cerrarFormulario();
    };

    return (
        <section>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-3xl text-black font-plusjakarta-bold">Mis mascotas</h1>
                <button
                    type="button"
                    onClick={abrirFormularioAgregar}
                    className="rounded-lg bg-violet-800 px-5 py-3 text-sm font-semibold text-white shadow transition-colors hover:bg-violet-950 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                >
                    Agregar mascota
                </button>
            </div>
            {mascotas.length === 0 ? (
                <p className="mt-4 text-gray-600">No tienes mascotas registradas.</p>
            ) : (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {mascotas.map((mascota) => (
                        <article key={mascota.id_mascota} className="flex flex-col rounded-xl bg-white p-5 shadow">
                            <h2 className="text-xl font-plusjakarta">{mascota.nombre_mascota}</h2>
                            <p>{mascota.especie} - {mascota.raza}</p>
                            <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-4">
                                <button className="rounded-lg border border-violet-200 px-4 py-2 text-sm font-semibold text-violet-800 transition-colors hover:bg-violet-50">
                                    Ver historia clínica
                                </button>
                                <button
                                    type="button"
                                    onClick={() => abrirFormularioEdicion(mascota)}
                                    className="rounded-lg bg-violet-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-950"
                                >
                                    Editar
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
            {mostrarFormulario && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <form
                        onSubmit={handleSubmit(guardarMascota)}
                        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-violet-950">
                                {mascotaEnEdicion ? "Editar mascota" : "Agregar mascota"}
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
                            <input {...register("nombre_mascota", { required: true })} placeholder="Nombre" className="rounded-lg border border-gray-300 px-3 py-2" />
                            <input {...register("especie", { required: true })} placeholder="Especie" className="rounded-lg border border-gray-300 px-3 py-2" />
                            <input {...register("raza", { required: true })} placeholder="Raza" className="rounded-lg border border-gray-300 px-3 py-2" />
                            <div className="relative">
                                <select
                                    {...register("sexo", { required: true })}
                                    className="w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 pr-10"
                                >
                                    <option value="">Sexo</option>
                                    <option value="M">Macho</option>
                                    <option value="F">Hembra</option>
                                </select>
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border-b-2 border-r-2 border-gray-500"
                                />
                            </div>
                            <div className="relative">
                                {!fechaNacSeleccionada && (
                                    <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-400">
                                        Fecha de nacimiento
                                    </span>
                                )}
                                <input
                                    {...register("fechaNac", { required: true, max: fechaMaxima })}
                                    type="date"
                                    max={fechaMaxima}
                                    aria-label="Fecha de nacimiento"
                                    onClick={(event) => event.currentTarget.showPicker?.()}
                                    className={`w-full rounded-lg border border-gray-300 px-3 py-2 ${!fechaNacSeleccionada ? "fecha-nacimiento-vacia text-transparent" : "text-gray-900"}`}
                                />
                            </div>
                            <label className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2">
                                <input {...register("castrado")} type="checkbox" />
                                Castrado/a
                            </label>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            {mascotaEnEdicion && (
                                <button
                                    type="button"
                                    onClick={() => solicitarEliminacion(mascotaEnEdicion)}
                                    className="mr-auto rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
                                >
                                    Eliminar mascota
                                </button>
                            )}
                            <button type="button" onClick={cerrarFormulario} className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100">
                                Cancelar
                            </button>
                            <button type="submit" className="rounded-lg bg-violet-800 px-4 py-2 font-semibold text-white hover:bg-violet-950">
                                {mascotaEnEdicion ? "Guardar cambios" : "Guardar mascota"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {mascotaAEliminar && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="titulo-confirmar-eliminacion"
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                    >
                        <h2 id="titulo-confirmar-eliminacion" className="text-2xl font-semibold text-violet-950">
                            Eliminar mascota
                        </h2>
                        <p className="mt-3 text-gray-600">
                            ¿Seguro que deseas eliminar a {mascotaAEliminar.nombre_mascota}?
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setMascotaAEliminar(null)}
                                className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={eliminarMascota}
                                className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                            >
                                Eliminar mascota
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default VerMascotas;
