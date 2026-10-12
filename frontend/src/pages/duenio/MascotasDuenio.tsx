import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { useMascotasDatos } from "../../hooks/useMascotasDatos";
import type { Mascota, VacunaFormulario, MascotaFormData } from "../../types"
import { formatearFechaParaInput } from "../../utils/formatearFechaParaInput.js";



function VerMascotas() {
    const navigate = useNavigate();
    
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [pasoFormulario, setPasoFormulario] = useState<1 | 2>(1);
    const [mascotaEnEdicion, setMascotaEnEdicion] = useState<Mascota | null>(null);
    const [mascotaParaVacunas, setMascotaParaVacunas] = useState<Mascota | null>(null);
    const [mascotaAEliminar, setMascotaAEliminar] = useState<Mascota | null>(null);
    const [vacunasFormulario, setVacunasFormulario] = useState<VacunaFormulario[]>([]);

    const { 
        mascotas, 
        tiposVacuna, 
        cargando, 
        cargandoTipos, 
        error, 
        setError,
        guardarDatosMascota, 
        guardarVacunas,
        eliminarMascota  
    } = useMascotasDatos(mostrarFormulario, pasoFormulario);

    const { register, handleSubmit, reset, control } = useForm<MascotaFormData>();
    const fechaNacSeleccionada = useWatch({ control, name: "fechaNac" });

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

    if (cargando) return <p>Cargando mascotas...</p>;

    const ahora = new Date();
    const fechaMaxima = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, "0")}-${String(ahora.getDate()).padStart(2, "0")}`;

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

    const confirmarEliminacion = async () => {
        await eliminarMascota(mascotaAEliminar, () => {
            setMascotaAEliminar(null);
            cerrarFormulario();
        });
    };

    const onSubmitPaso1 = async (data: MascotaFormData) => {
        await guardarDatosMascota(data, mascotaEnEdicion, (mascotaGuardada) => {
            setMascotaParaVacunas(mascotaGuardada);
            setVacunasFormulario((mascotaEnEdicion?.vacunas ?? []).map((vacuna, indice) => ({
                clave: Date.now() + indice,
                id_tipo_vacuna: String(vacuna.tipo_vacuna.id_tipo_vacuna),
                fecha_aplicacion: formatearFechaParaInput(vacuna.fecha_aplicacion),
            })));
            setPasoFormulario(2);
        });
    };

    const onSubmitPaso2 = async () => {
        if (!mascotaParaVacunas) return;
        
        await guardarVacunas(mascotaParaVacunas, vacunasFormulario, () => {
            cerrarFormulario();
        });
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
                            ? handleSubmit(onSubmitPaso1) 
                            : (event) => { event.preventDefault(); void onSubmitPaso2(); }
                        }
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
                                onClick={confirmarEliminacion}
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
