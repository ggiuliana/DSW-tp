import { Link } from "react-router-dom";
import { useTurnosDuenio } from "../../hooks/useTurnosDuenio";
import { fechaLegible } from "../../utils/fechaLegible";

function TurnosDuenio() {
  const { 
        mascotas, pendientes, propios, cargando, error, 
        mascotaPorTurno, cambiarMascotaSeleccionada, 
        sacarTurno, turnoEnProceso 
    } = useTurnosDuenio();

    if (cargando) return <p className="text-gray-600">Cargando turnos...</p>;
  return (
    <section className="space-y-8">
      <div>
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
              <label className="sr-only" htmlFor={`mascota-turno-${turno.id_turno}`}>MascotaTurno para el turno</label>
              <select value={mascotaPorTurno[turno.id_turno] || ""} 
                onChange={(e) => cambiarMascotaSeleccionada(turno.id_turno, e.target.value)} className="rounded-md border border-violet-200 bg-white px-3 py-2 text-sm text-violet-950">
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