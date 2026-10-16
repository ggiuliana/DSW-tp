import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


interface MascotaTurno {
    nombre_mascota: string;
    especie: string;
    raza: string;
    sexo: string;
    castrado: boolean;
    fechaNac: string;
}

interface EstudioRealizado {
    id_estudio: number;
    nombre_estudio: string;
    descripcion_estudio: string;
}

interface VeterinarioTurno {
    nombre: string;
    apellido: string;
    matricula: string;
    especialidad: string;
}

interface TurnoConsulta {
    fecha_turno: string;
    hora_turno: string;
    veterinario: VeterinarioTurno;
    mascota: MascotaTurno;
}

interface ConsultaDetalleData {
    id_consulta: number;
    diagnostico: string;
    tratamiento: string;
    peso: number;
    observaciones?: string;
    turno: TurnoConsulta;
    estudios?: EstudioRealizado[];
}

function fechaLegible(fecha: string) {
    return new Date(`${fecha.slice(0, 10)}T00:00:00`).toLocaleDateString("es-AR");
}

function calcularEdad(fechaNacimiento: string, fechaConsulta: string) {
    const fechaAtencion = new Date(`${fechaConsulta.slice(0, 10)}T00:00:00`);
    const nacimiento = new Date(`${fechaNacimiento.slice(0, 10)}T00:00:00`);
    
    let edadAños = fechaAtencion.getFullYear() - nacimiento.getFullYear();
    const mes = fechaAtencion.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && fechaAtencion.getDate() < nacimiento.getDate())) {
        edadAños--;
    }
    
    if (edadAños <= 0) {
        let edadMeses = fechaAtencion.getMonth() - nacimiento.getMonth();
        if (edadMeses < 0) edadMeses += 12;
        
        if (edadMeses === 0) return "Menos de 1 mes";
        return `${edadMeses} ${edadMeses === 1 ? 'mes' : 'meses'}`;
    }
    
    return `${edadAños} ${edadAños === 1 ? 'año' : 'años'}`;
}

function ConsultaDetalle() {
    const { id_mascota, id_consulta } = useParams();
    const navigate = useNavigate();
    
    const [consulta, setConsulta] = useState<ConsultaDetalleData | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelado = false;
        const cargarConsulta = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("La sesión expiró.");

                const response = await fetch(`http://localhost:3000/api/consulta/${id_consulta}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const resultado = await response.json();
                
                if (!response.ok) throw new Error(resultado.message || "Error al cargar la consulta.");
                
                if (!cancelado) setConsulta(resultado.data);
            } catch (err) {
                if (!cancelado) {
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError("Ocurrió un error desconocido.");
                    }
                }
            } finally {
                if (!cancelado) setCargando(false);
            }
        };

        cargarConsulta();
        return () => { cancelado = true; };
    }, [id_consulta]);

    if (cargando) return <p className="text-gray-600 p-6">Cargando detalle de la consulta...</p>;
    
    if (error || !consulta) {
        return (
            <section className="p-6">
                <button type="button" onClick={() => navigate(`/duenio/mascotas/${id_mascota}/historia`)} className="mb-5 text-sm font-semibold text-violet-800 hover:underline">
                    &larr; Volver a la historia clínica
                </button>
                <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error || "No se encontró la consulta."}</p>
            </section>
        );
    }

    const { mascota } = consulta.turno;

    return (
        <section className="space-y-6">
            <header>
                <button 
                    type="button" 
                    onClick={() => navigate(`/duenio/mascotas/${id_mascota}/historia`)} 
                    className="mb-3 text-sm font-semibold text-violet-800 hover:underline"
                >
                    &larr; Volver a la historia clínica
                </button>
                <p className="text-sm font-semibold uppercase text-violet-700">Detalle de Consulta</p>
                <h1 className="mt-1 text-3xl font-plusjakarta-bold text-violet-950">
                    Fecha: {fechaLegible(consulta.turno.fecha_turno)}
                </h1>
            </header>

            <div className="rounded-xl bg-white p-6 shadow-sm max-w-3xl border border-gray-100">
                <div className="space-y-6">
                    
                    <div className="rounded-lg bg-violet-50 p-4 border border-violet-100">
                        <span className="block text-sm font-semibold uppercase text-violet-700 mb-3">Datos del Paciente</span>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <div>
                                <span className="block text-xs uppercase text-gray-500">Nombre</span>
                                <span className="font-semibold text-violet-950">{mascota.nombre_mascota}</span>
                            </div>
                            <div>
                                <span className="block text-xs uppercase text-gray-500">Especie y Raza</span>
                                <span className="font-medium text-gray-900">{mascota.especie} - {mascota.raza}</span>
                            </div>
                            <div>
                                <span className="block text-xs uppercase text-gray-500">Sexo</span>
                                <span className="font-medium text-gray-900">
                                    {mascota.sexo === "M" ? "Macho" : "Hembra"} {mascota.castrado ? "(Castrado/a)" : ""}
                                </span>
                            </div>
                            <div>
                                <span className="block text-xs uppercase text-gray-500">Edad en consulta</span>
                                <span className="font-medium text-gray-900">
                                    {calcularEdad(mascota.fechaNac, consulta.turno.fecha_turno)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-4">
                        <div>
                            <span className="block text-sm font-semibold uppercase text-gray-500">Horario de atención</span>
                            <span className="text-lg font-medium text-gray-900">
                                {consulta.turno.hora_turno.substring(0, 5)} hs
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="block text-sm font-semibold uppercase text-gray-500">Peso Registrado</span>
                            <span className="text-lg font-medium text-gray-900">{consulta.peso} kg</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-4">
                        <div>
                            <span className="block text-sm font-semibold uppercase text-gray-500">Profesional a cargo</span>
                            <div className="mt-1 flex items-center gap-2">
                                <span className="text-lg font-medium text-gray-900">
                                    Vet. {consulta.turno.veterinario.nombre} {consulta.turno.veterinario.apellido}
                                </span>
                                <span className="rounded-md bg-violet-100 px-2 py-1 text-xs font-semibold text-violet-800">
                                    {consulta.turno.veterinario.especialidad}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block text-sm font-semibold uppercase text-gray-500">Matrícula</span>
                            <span className="text-lg font-medium text-gray-900">{consulta.turno.veterinario.matricula}</span>
                        </div>
                    </div>

                    <div>
                        <span className="mb-2 block text-sm font-semibold uppercase text-gray-500">Diagnóstico</span>
                        <p className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-gray-800">{consulta.diagnostico}</p>
                    </div>
                    
                    <div>
                        <span className="mb-2 block text-sm font-semibold uppercase text-gray-500">Tratamiento</span>
                        <p className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-gray-800">{consulta.tratamiento}</p>
                    </div>

                    <div>
                        <span className="mb-2 block text-sm font-semibold uppercase text-gray-500">Estudios Realizados</span>
                        {!consulta.estudios || consulta.estudios.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">No se registraron estudios en esta consulta.</p>
                        ) : (
                            <ul className="grid gap-3 sm:grid-cols-2">
                                {consulta.estudios.map((estudio) => (
                                    <li key={estudio.id_estudio} className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                                        <p className="font-semibold text-violet-900">{estudio.nombre_estudio}</p>
                                        <p className="mt-1 text-sm text-gray-600">{estudio.descripcion_estudio}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {consulta.observaciones && (
                        <div>
                            <span className="mb-2 block text-sm font-semibold uppercase text-gray-500">Observaciones</span>
                            <p className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-gray-800">{consulta.observaciones}</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default ConsultaDetalle;