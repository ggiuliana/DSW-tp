import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Mascota {
  id_mascota: number;
  nombre_mascota: string;
  especie: string;
}

interface Turno {
  id_turno: number;
  fecha_turno: string;
  hora_turno: string;
  estado_turno: string;
  observaciones_turno?: string;
  mascota?: Mascota;
  veterinario?: { nombre: string; apellido: string };
}

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:3000/api${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const resultado = await response.json() as { data?: T; message?: string };
  if (!response.ok) throw new Error(resultado.message || "No se pudo completar la solicitud.");
  return resultado.data as T;
}

function fechaLegible(fecha: string) {
  return new Date(`${fecha.slice(0, 10)}T00:00:00`).toLocaleDateString("es-AR", { dateStyle: "long" });
}

function TurnosDuenio() {
  const idPersona = localStorage.getItem("idPersona");
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [mascotaPorTurno, setMascotaPorTurno] = useState<Record<number, string>>({});
  const [cargando, setCargando] = useState(true);
  const [turnoEnProceso, setTurnoEnProceso] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;
    const cargar = async () => {
      try {
        if (!idPersona) throw new Error("No se encontró el perfil asociado a esta sesión.");
        const [turnosCargados, mascotasCargadas] = await Promise.all([
          api<Turno[]>("/turno/duenio"),
          api<Mascota[]>(`/mascota/duenio/${idPersona}`),
        ]);
        if (!activo) return;
        setTurnos(turnosCargados);
        setMascotas(mascotasCargadas);
        setMascotaPorTurno(Object.fromEntries(turnosCargados.map((turno) => [turno.id_turno, String(mascotasCargadas[0]?.id_mascota ?? "")])));
      } catch (err) {
        if (activo) setError(err instanceof Error ? err.message : "No se pudieron cargar los turnos.");
      } finally {
        if (activo) setCargando(false);
      }
    };
    void cargar();
    return () => { activo = false; };
  }, [idPersona]);

  const sacarTurno = async (turno: Turno) => {
    const idMascota = mascotaPorTurno[turno.id_turno];
    if (!idMascota) {
      setError("Selecciona una mascota para sacar el turno.");
      return;
    }
    setError("");
    setTurnoEnProceso(turno.id_turno);
    try {
      const turnoOtorgado = await api<Turno>(`/turno/${turno.id_turno}/otorgar`, {
        method: "PATCH",
        body: JSON.stringify({ id_mascota: Number(idMascota) }),
      });
      setTurnos((actuales) => actuales.map((actual) => actual.id_turno === turno.id_turno ? turnoOtorgado : actual));
      const turnosActualizados = await api<Turno[]>("/turno/duenio", { cache: "no-store" });
      setTurnos(turnosActualizados);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo sacar el turno.");
    } finally {
      setTurnoEnProceso(null);
    }
  };

  const pendientes = turnos
    .filter((turno) => turno.estado_turno.toLowerCase() === "pendiente" && !turno.mascota)
    .sort((a, b) => `${a.fecha_turno}T${a.hora_turno}`.localeCompare(`${b.fecha_turno}T${b.hora_turno}`));
  const propios = turnos
    .filter((turno) => mascotas.some((mascota) => mascota.id_mascota === turno.mascota?.id_mascota))
    .sort((a, b) => `${a.fecha_turno}T${a.hora_turno}`.localeCompare(`${b.fecha_turno}T${b.hora_turno}`));

  if (cargando) return <p className="text-gray-600">Cargando turnos...</p>;

  return (
    <section className="space-y-8">
      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-violet-700">Agenda veterinaria</p>
        <h1 className="font-plusjakarta text-3xl text-violet-950">Mis turnos</h1>
        <p className="mt-2 text-gray-600">Elige un horario pendiente y asígnalo a una de tus mascotas.</p>
      </div>
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

      <section>
        <h2 className="mb-3 text-xl font-semibold text-violet-950">Horarios pendientes</h2>
        {!mascotas.length ? <p className="bg-white p-5 text-gray-700">Primero agrega una mascota para poder sacar un turno. <Link to="/duenio/mascotas" className="font-semibold text-violet-800 underline">Ir a mis mascotas</Link></p> : null}
        {pendientes.length ? <div className="divide-y divide-violet-100 bg-white shadow-sm">
          {pendientes.map((turno) => <article key={turno.id_turno} className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-violet-950">{fechaLegible(turno.fecha_turno)} · {turno.hora_turno.slice(0, 5)}</p>
              {turno.veterinario && <p className="mt-1 text-sm text-gray-600">Dr./Dra. {turno.veterinario.nombre} {turno.veterinario.apellido}</p>}
              {turno.observaciones_turno && <p className="mt-1 text-sm text-gray-500">{turno.observaciones_turno}</p>}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="sr-only" htmlFor={`mascota-turno-${turno.id_turno}`}>Mascota para el turno</label>
              <select id={`mascota-turno-${turno.id_turno}`} value={mascotaPorTurno[turno.id_turno] ?? ""} onChange={(event) => setMascotaPorTurno((actual) => ({ ...actual, [turno.id_turno]: event.target.value }))} className="rounded-md border border-violet-200 bg-white px-3 py-2 text-sm text-violet-950">
                <option value="">Selecciona una mascota</option>
                {mascotas.map((mascota) => <option key={mascota.id_mascota} value={mascota.id_mascota}>{mascota.nombre_mascota} · {mascota.especie}</option>)}
              </select>
              <button type="button" disabled={!mascotas.length || turnoEnProceso !== null} onClick={() => void sacarTurno(turno)} className="rounded-md bg-violet-800 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-950 disabled:cursor-not-allowed disabled:opacity-60">
                {turnoEnProceso === turno.id_turno ? "Asignando..." : "Sacar turno"}
              </button>
            </div>
          </article>)}
        </div> : <p className="bg-white p-5 text-gray-600">No hay horarios pendientes por el momento.</p>}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-violet-950">Turnos de mis mascotas</h2>
        {propios.length ? <div className="divide-y divide-violet-100 bg-white shadow-sm">
          {propios.map((turno) => <article key={turno.id_turno} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="font-semibold text-violet-950">{turno.mascota?.nombre_mascota}</p><p className="text-sm text-gray-600">{fechaLegible(turno.fecha_turno)} · {turno.hora_turno.slice(0, 5)}</p></div>
            <span className="w-fit rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-800">{turno.estado_turno}</span>
          </article>)}
        </div> : <p className="bg-white p-5 text-gray-600">Todavía no tienes turnos asignados a tus mascotas.</p>}
      </section>
    </section>
  );
}

export default TurnosDuenio;