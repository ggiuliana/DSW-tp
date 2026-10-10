import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface Mascota {
    id_mascota: number;
    nombre_mascota: string;
    especie: string;
    raza: string;
    castrado: boolean;
    sexo: string;
    fechaNac: string;
    vacunas?: VacunaAplicada[];
}

interface VacunaAplicada {
    tipo_vacuna: TipoVacuna;
    fecha_aplicacion: string;
}

interface TipoVacuna {
    id_tipo_vacuna: number;
    nombre_tipo_vacuna: string;
    descripcion_tipo_vacuna: string;
}

interface VacunaFormulario {
    clave: number;
    id_tipo_vacuna: string;
    fecha_aplicacion: string;
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
    const navigate = useNavigate();
    const [mascotas, setMascotas] = useState<Mascota[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mascotaEnEdicion, setMascotaEnEdicion] = useState<Mascota | null>(null);
    const [mascotaParaVacunas, setMascotaParaVacunas] = useState<Mascota | null>(null);
    const [mascotaAEliminar, setMascotaAEliminar] = useState<Mascota | null>(null);
    const [pasoFormulario, setPasoFormulario] = useState<1 | 2>(1);
    const [tiposVacuna, setTiposVacuna] = useState<TipoVacuna[]>([]);
    const [vacunasFormulario, setVacunasFormulario] = useState<VacunaFormulario[]>([]);
    const [cargandoTipos, setCargandoTipos] = useState(false);
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
        if (!mostrarFormulario || pasoFormulario !== 2) return;

        let cancelado = false;
        const cargarTiposVacuna = async () => {
            setCargandoTipos(true);
            const token = localStorage.getItem("token");
            if (!token) throw new Error("La sesión expiró. Inicia sesión nuevamente.");

            const response = await fetch("http://localhost:3000/api/tipo_vacuna", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const resultado = await response.json();
            if (!response.ok) throw new Error(resultado.message || "No se pudieron cargar los tipos de vacuna.");
            if (!cancelado) setTiposVacuna(resultado.data as TipoVacuna[]);
        };

        cargarTiposVacuna()
            .catch((err: Error) => {
                if (!cancelado) setError(err.message);
            })
            .finally(() => {
                if (!cancelado) setCargandoTipos(false);
            });

        return () => { cancelado = true; };
    }, [mostrarFormulario, pasoFormulario]);

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

    const ahora = new Date();
    const fechaMaxima = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, "0")}-${String(ahora.getDate()).padStart(2, "0")}`;

    const cerrarFormulario = () => {
        setMostrarFormulario(false);
        setMascotaEnEdicion(null);
        setMascotaParaVacunas(null);
        setPasoFormulario(1);
        setVacunasFormulario([]);
        reset();
    };

    const abrirFormularioEdicion = (mascota: Mascota) => {
        setMascotaEnEdicion(mascota);
        setMostrarFormulario(true);
    };

    const abrirFormularioAgregar = () => {
        setError("");
        setMascotaEnEdicion(null);
        setMascotaParaVacunas(null);
        setPasoFormulario(1);
        setVacunasFormulario([]);
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

    const guardarDatosMascota = async (data: MascotaFormData) => {
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

        const mascotaGuardada = resultado.data as Mascota;
        setMascotas((actuales) => editando
            ? actuales.map((mascota) => mascota.id_mascota === mascotaGuardada.id_mascota ? mascotaGuardada : mascota)
            : [...actuales, mascotaGuardada]);
        setMascotaParaVacunas(mascotaGuardada);
        setVacunasFormulario((mascotaEnEdicion?.vacunas ?? []).map((vacuna, indice) => ({
            clave: Date.now() + indice,
            id_tipo_vacuna: String(vacuna.tipo_vacuna.id_tipo_vacuna),
            fecha_aplicacion: formatearFechaParaInput(vacuna.fecha_aplicacion),
        })));
        setError("");
        setPasoFormulario(2);
    };

    const guardarVacunas = async () => {
        if (!mascotaParaVacunas) return;
        const incompleta = vacunasFormulario.some((vacuna) =>
            Boolean(vacuna.id_tipo_vacuna) !== Boolean(vacuna.fecha_aplicacion)
        );
        if (incompleta) {
            setError("Completa el tipo y la fecha de cada vacuna o elimina la fila vacía.");
            return;
        }

        const vacunas = vacunasFormulario
            .filter((vacuna) => vacuna.id_tipo_vacuna && vacuna.fecha_aplicacion)
            .map((vacuna) => ({
                id_tipo_vacuna: Number(vacuna.id_tipo_vacuna),
                fecha_aplicacion: vacuna.fecha_aplicacion,
            }));
        const response = await fetch(`http://localhost:3000/api/mascota/${mascotaParaVacunas.id_mascota}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ vacunas }),
        });
        const resultado = await response.json();
        if (!response.ok) {
            setError(resultado.message || "No se pudieron guardar las vacunas.");
            return;
        }

        const mascotaActualizada: Mascota = {
            ...mascotaParaVacunas,
            vacunas: vacunas.map((vacuna) => ({
                tipo_vacuna: tiposVacuna.find((tipo) => tipo.id_tipo_vacuna === vacuna.id_tipo_vacuna)!,
                fecha_aplicacion: vacuna.fecha_aplicacion,
            })),
        };
        setMascotas((actuales) => actuales.map((mascota) =>
            mascota.id_mascota === mascotaActualizada.id_mascota ? mascotaActualizada : mascota
        ));
        cerrarFormulario();
    };

    const agregarFilaVacuna = () => {
        setVacunasFormulario((actuales) => [...actuales, {
            clave: Date.now() + Math.random(),
            id_tipo_vacuna: "",
            fecha_aplicacion: "",
        }]);
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
            {error && <p role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
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
                                <button
                                    type="button"
                                    onClick={() => navigate(`/duenio/mascotas/${mascota.id_mascota}/historia`)}
                                    className="rounded-lg border border-violet-200 px-4 py-2 text-sm font-semibold text-violet-800 transition-colors hover:bg-violet-50"
                                >
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
                        onSubmit={pasoFormulario === 1
                            ? handleSubmit(guardarDatosMascota)
                            : (event) => { event.preventDefault(); void guardarVacunas(); }}
                        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-violet-950">
                                {pasoFormulario === 1
                                    ? (mascotaEnEdicion ? "Editar mascota" : "Agregar mascota")
                                    : `Vacunas de ${mascotaParaVacunas?.nombre_mascota}`}
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

                        {pasoFormulario === 1 ? <div className="grid gap-4 sm:grid-cols-2">
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
                        </div> : (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">Registra las vacunas ya aplicadas. Puedes terminar sin agregar ninguna.</p>
                                {cargandoTipos ? <p className="text-sm text-gray-600">Cargando tipos de vacuna...</p> : null}
                                {!cargandoTipos && tiposVacuna.length === 0 ? (
                                    <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">No hay tipos de vacuna disponibles.</p>
                                ) : null}
                                {vacunasFormulario.map((vacuna) => (
                                    <div key={vacuna.clave} className="grid gap-2 rounded-md border border-gray-200 p-3 sm:grid-cols-[1fr_1fr_auto]">
                                        <select
                                            aria-label="Tipo de vacuna"
                                            value={vacuna.id_tipo_vacuna}
                                            onChange={(event) => setVacunasFormulario((actuales) => actuales.map((actual) =>
                                                actual.clave === vacuna.clave ? { ...actual, id_tipo_vacuna: event.target.value } : actual
                                            ))}
                                            className="min-w-0 rounded-md border border-gray-300 px-3 py-2"
                                        >
                                            <option value="">Seleccionar vacuna</option>
                                            {tiposVacuna.map((tipo) => (
                                                <option key={tipo.id_tipo_vacuna} value={tipo.id_tipo_vacuna}>
                                                    {tipo.nombre_tipo_vacuna}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            aria-label="Fecha de aplicación"
                                            type="date"
                                            max={fechaMaxima}
                                            value={vacuna.fecha_aplicacion}
                                            onChange={(event) => setVacunasFormulario((actuales) => actuales.map((actual) =>
                                                actual.clave === vacuna.clave ? { ...actual, fecha_aplicacion: event.target.value } : actual
                                            ))}
                                            className="rounded-md border border-gray-300 px-3 py-2"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setVacunasFormulario((actuales) => actuales.filter((actual) => actual.clave !== vacuna.clave))}
                                            aria-label="Quitar vacuna"
                                            className="rounded-md px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                                        >
                                            Quitar
                                        </button>
                                        {vacuna.id_tipo_vacuna && (
                                            <p className="text-xs text-gray-500 sm:col-span-2">
                                                {tiposVacuna.find((tipo) => String(tipo.id_tipo_vacuna) === vacuna.id_tipo_vacuna)?.descripcion_tipo_vacuna}
                                            </p>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={agregarFilaVacuna}
                                    disabled={tiposVacuna.length === 0 || cargandoTipos}
                                    className="rounded-md border border-violet-200 px-4 py-2 text-sm font-semibold text-violet-800 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Agregar vacuna
                                </button>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            {pasoFormulario === 1 && mascotaEnEdicion && (
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
                                {pasoFormulario === 1 ? "Continuar a vacunas" : "Guardar vacunas y terminar"}
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
