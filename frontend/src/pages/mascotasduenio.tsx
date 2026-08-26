import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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
function VerMascotas() {
    const [mascotas, setMascotas] = useState<Mascota[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const { register, handleSubmit, reset } = useForm<MascotaFormData>();

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

    if (cargando) return <p>Cargando mascotas...</p>;
    if (error) return <p>{error}</p>;

    const ahora = new Date();
    const fechaMaxima = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, "0")}-${String(ahora.getDate()).padStart(2, "0")}`;

    const cerrarFormulario = () => {
        setMostrarFormulario(false);
        reset();
    };

    const agregarMascota = async (data: MascotaFormData) => {
        const idDuenio = localStorage.getItem("idPersona");
        if (!idDuenio) return;

        const response = await fetch(`http://localhost:3000/api/mascota/duenio/${idDuenio}`, {
            method: "POST",
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

        setMascotas((actuales) => [...actuales, resultado.data]);
        cerrarFormulario();
    };

    return (
        <section>
            <h1 className="text-3xl text-black">Mis mascotas</h1>
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
                                <button className="rounded-lg bg-violet-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-950">
                                    Editar
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
            <button
                type="button"
                onClick={() => setMostrarFormulario(true)}
                className="mt-6 rounded-lg bg-violet-800 px-5 py-3 text-sm font-semibold text-white shadow transition-colors hover:bg-violet-950 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
            >
                Agregar mascota
            </button>

            {mostrarFormulario && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <form
                        onSubmit={handleSubmit(agregarMascota)}
                        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-violet-950">Agregar mascota</h2>
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
                            <select {...register("sexo", { required: true })} className="rounded-lg border border-gray-300 px-3 py-2">
                                <option value="">Sexo</option>
                                <option value="M">Macho</option>
                                <option value="H">Hembra</option>
                            </select>
                            <input {...register("fechaNac", { required: true, max: fechaMaxima })} type="date" max={fechaMaxima} className="rounded-lg border border-gray-300 px-3 py-2" />
                            <label className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2">
                                <input {...register("castrado")} type="checkbox" />
                                Castrado/a
                            </label>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button type="button" onClick={cerrarFormulario} className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100">
                                Cancelar
                            </button>
                            <button type="submit" className="rounded-lg bg-violet-800 px-4 py-2 font-semibold text-white hover:bg-violet-950">
                                Guardar mascota
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
}

export default VerMascotas;
