import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


interface DuenioTurno {
    nombre: string;
    apellido: string;
    telefono: string;
    mail: string;
    dni: string;
}

interface MascotaTurno {
    id_mascota: number;
    nombre_mascota: string;
    especie: string;
    raza: string;
    duenio: DuenioTurno;
}

interface VeterinarioTurno {
    nombre: string;
    apellido: string;
    especialidad: string;
}

interface TurnoAdminDetalle {
    id_turno: number;
    fecha_turno: string;
    hora_turno: string;
    estado_turno: string;
    observaciones_turno?: string;
    veterinario: VeterinarioTurno;
    mascota?: MascotaTurno;
}

function TurnoDetalleAdmin() {
    const { id_turno } = useParams();
    const navigate = useNavigate();
    const [turno, setTurno] = useState<TurnoAdminDetalle | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelado = false;
        const cargarTurno = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("La sesión expiró.");

                const response = await fetch(`http://localhost:3000/api/turno/${id_turno}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const resultado = await response.json();
                
                if (!response.ok) throw new Error(resultado.message || "Error al cargar el turno.");
                if (!cancelado) setTurno(resultado.data);
            } catch (err) {
                if (!cancelado) setError(err instanceof Error ? err.message : "Ocurrió un error.");
            } finally {
                if (!cancelado) setCargando(false);
            }
        };
        cargarTurno();
        return () => { cancelado = true; };
    }, [id_turno]);

    if (cargando) return <div className="p-8 text-center text-gray-500">Cargando detalles del turno...</div>;
    if (error || !turno) {
        return (
            <div className="p-6">
                <button onClick={() => navigate(-1)} className="mb-4 text-sm font-semibold text-violet-700 hover:underline">&larr; Volver</button>
                <div className="bg-red-50 text-red-600 p-4 rounded-xl">{error || "Turno no encontrado"}</div>
            </div>
        );
    }

    const formatFecha = (iso: string) => new Date(iso).toLocaleDateString("es-AR");

    return (
        <div className="flex flex-col gap-6 max-w-4xl">
            <header>
                <button 
                    onClick={() => navigate('/administrador/turnos')} 
                    className="mb-3 text-sm font-semibold text-violet-700 hover:underline"
                >
                    &larr; Volver a la agenda
                </button>
                <h2 className="text-3xl font-bold text-violet-900 italic tracking-tight font-plusjakarta">
                    Detalle del Turno #{turno.id_turno}
                </h2>
                <div className="mt-2 flex gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                        turno.estado_turno === 'Confirmado' ? 'bg-emerald-100 text-emerald-800' :
                        turno.estado_turno === 'Resuelto' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                        Estado: {turno.estado_turno}
                    </span>
                </div>
            </header>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-violet-100 space-y-4">
                    <h3 className="text-lg font-semibold text-violet-900 border-b border-gray-100 pb-2">Información de la cita</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="block text-xs font-semibold text-gray-500 uppercase">Fecha</span>
                            <span className="font-medium text-gray-900">{formatFecha(turno.fecha_turno)}</span>
                        </div>
                        <div>
                            <span className="block text-xs font-semibold text-gray-500 uppercase">Hora</span>
                            <span className="font-medium text-gray-900">{turno.hora_turno.slice(0, 5)} hs</span>
                        </div>
                        <div className="col-span-2">
                            <span className="block text-xs font-semibold text-gray-500 uppercase">Profesional asignado</span>
                            <span className="font-medium text-gray-900">Dr/a. {turno.veterinario.nombre} {turno.veterinario.apellido}</span>
                            <span className="ml-2 text-sm text-gray-500">({turno.veterinario.especialidad})</span>
                        </div>
                        {turno.observaciones_turno && (
                            <div className="col-span-2 mt-2">
                                <span className="block text-xs font-semibold text-gray-500 uppercase">Observaciones del turno</span>
                                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-1">{turno.observaciones_turno}</p>
                            </div>
                        )}
                    </div>
                </div>

                {turno.mascota ? (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-violet-100 space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-violet-900 border-b border-gray-100 pb-2 mb-4">Datos del Paciente</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-xs font-semibold text-gray-500 uppercase">Nombre</span>
                                    <span className="font-semibold text-violet-950">{turno.mascota.nombre_mascota}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-semibold text-gray-500 uppercase">Especie y Raza</span>
                                    <span className="font-medium text-gray-900">{turno.mascota.especie} - {turno.mascota.raza}</span>
                                </div>
                            </div>
                        </div>

                        {turno.mascota.duenio && (
                            <div>
                                <h3 className="text-lg font-semibold text-violet-900 border-b border-gray-100 pb-2 mb-4">Contacto del Dueño</h3>
                                <div className="grid gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="block text-xs font-semibold text-gray-500 uppercase">Nombre completo</span>
                                            <span className="font-medium text-gray-900">{turno.mascota.duenio.nombre} {turno.mascota.duenio.apellido}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs font-semibold text-gray-500 uppercase">DNI</span>
                                            <span className="font-medium text-gray-900">{turno.mascota.duenio.dni}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="block text-xs font-semibold text-gray-500 uppercase">Teléfono</span>
                                            <span className="font-medium text-gray-900">{turno.mascota.duenio.telefono}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-semibold text-gray-500 uppercase">Correo electrónico</span>
                                        <a href={`mailto:${turno.mascota.duenio.mail}`} className="font-medium text-violet-700 hover:underline break-all">{turno.mascota.duenio.mail}</a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-center justify-center">
                        <p className="text-amber-800 font-medium">Este turno está pendiente y no tiene paciente asignado.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TurnoDetalleAdmin;