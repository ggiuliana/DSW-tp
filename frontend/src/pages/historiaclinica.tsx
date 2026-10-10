import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface VacunaAplicada {
    tipo_vacuna: {
        id_tipo_vacuna: number;
        nombre_tipo_vacuna: string;
        descripcion_tipo_vacuna: string;
    };
    fecha_aplicacion: string;
}

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

function fechaLegible(fecha: string) {
    return new Date(`${fecha.slice(0, 10)}T00:00:00`).toLocaleDateString("es-AR");
}

function HistoriaClinica({ idMascota }: { idMascota: string }) {
    const navigate = useNavigate();
    const [mascota, setMascota] = useState<Mascota | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelado = false;
        const cargarMascota = async () => {
            const idDuenio = localStorage.getItem("idPersona");
            if (!idDuenio) throw new Error("No se encontró el dueño de la sesión.");

            const response = await fetch(`http://localhost:3000/api/mascota/duenio/${idDuenio}`);
            const resultado = await response.json();
            if (!response.ok) throw new Error(resultado.message || "No se pudo cargar la historia clínica.");

            const encontrada = (resultado.data as Mascota[]).find((item) => item.id_mascota === Number(idMascota));
            if (!encontrada) throw new Error("No se encontró la mascota en esta cuenta.");
            if (!cancelado) setMascota(encontrada);
        };

        cargarMascota()
            .catch((err: Error) => {
                if (!cancelado) setError(err.message);
            })
            .finally(() => {
                if (!cancelado) setCargando(false);
            });

        return () => { cancelado = true; };
    }, [idMascota]);

    if (cargando) return <p className="text-gray-600">Cargando historia clínica...</p>;
    if (error || !mascota) {
        return (
            <section>
                <button type="button" onClick={() => navigate("/duenio/mascotas")} className="mb-5 text-sm font-semibold text-violet-800 hover:underline">
                    Volver a mascotas
                </button>
                <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error || "No se encontró la mascota."}</p>
            </section>
        );
    }

    return (
        <section className="space-y-6">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <button type="button" onClick={() => navigate("/duenio/mascotas")} className="mb-3 text-sm font-semibold text-violet-800 hover:underline">
                        Volver a mascotas
                    </button>
                    <p className="text-sm font-semibold uppercase text-violet-700">Historia clínica</p>
                    <h1 className="mt-1 text-3xl font-plusjakarta-bold text-violet-950">{mascota.nombre_mascota}</h1>
                </div>
                <button type="button" onClick={() => navigate("/duenio/mascotas")} className="rounded-md border border-violet-200 px-4 py-2 text-sm font-semibold text-violet-800 hover:bg-violet-50">
                    Cerrar historia
                </button>
            </header>

            <div className="grid gap-6 lg:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.3fr)]">
                <aside className="space-y-4">
                    <div className="flex aspect-[4/3] items-center justify-center rounded-lg border border-violet-200 bg-white text-violet-700">
                        <div className="flex flex-col items-center gap-2">
                            <img src="/icons/pata.png" alt="" className="h-12 w-12 object-contain" />
                            <span className="text-sm">Imagen de {mascota.nombre_mascota}</span>
                        </div>
                    </div>
                    <section className="rounded-lg bg-white p-5 shadow-sm">
                        <h2 className="text-lg font-semibold text-violet-950">Datos del animal</h2>
                        <dl className="mt-4 space-y-3">
                            <div><dt className="text-xs uppercase text-gray-500">Especie</dt><dd className="font-medium">{mascota.especie}</dd></div>
                            <div><dt className="text-xs uppercase text-gray-500">Raza</dt><dd className="font-medium">{mascota.raza}</dd></div>
                            <div><dt className="text-xs uppercase text-gray-500">Sexo</dt><dd className="font-medium">{mascota.sexo === "M" ? "Macho" : "Hembra"}</dd></div>
                            <div><dt className="text-xs uppercase text-gray-500">Castración</dt><dd className="font-medium">{mascota.castrado ? "Castrado/a" : "No castrado/a"}</dd></div>
                            <div><dt className="text-xs uppercase text-gray-500">Fecha de nacimiento</dt><dd className="font-medium">{fechaLegible(mascota.fechaNac)}</dd></div>
                        </dl>
                    </section>
                </aside>

                <div className="space-y-6">
                    <section className="rounded-lg bg-white p-5 shadow-sm">
                        <h2 className="text-xl font-semibold text-violet-950">Vacunas colocadas</h2>
                        {!mascota.vacunas?.length ? (
                            <p className="mt-4 text-sm text-gray-600">No hay vacunas registradas para esta mascota.</p>
                        ) : (
                            <ul className="mt-3 divide-y divide-gray-100">
                                {[...mascota.vacunas]
                                    .sort((a, b) => b.fecha_aplicacion.localeCompare(a.fecha_aplicacion))
                                    .map((vacuna, indice) => (
                                        <li key={`${vacuna.tipo_vacuna.id_tipo_vacuna}-${vacuna.fecha_aplicacion}-${indice}`} className="flex flex-wrap justify-between gap-2 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{vacuna.tipo_vacuna.nombre_tipo_vacuna}</p>
                                                <p className="mt-1 text-sm text-gray-500">{vacuna.tipo_vacuna.descripcion_tipo_vacuna}</p>
                                            </div>
                                            <time className="text-sm text-gray-600">{fechaLegible(vacuna.fecha_aplicacion)}</time>
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </section>

                    <section className="min-h-40 rounded-lg border border-dashed border-gray-300 bg-white p-5">
                        <h2 className="text-xl font-semibold text-violet-950">Consultas</h2>
                        <p className="mt-3 text-sm text-gray-500">El historial de consultas se incorporará aquí.</p>
                    </section>
                </div>
            </div>
        </section>
    );
}

export default HistoriaClinica;