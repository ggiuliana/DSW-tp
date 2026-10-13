import { Link } from "react-router-dom";
import { useTurnosDuenio } from "../../hooks/useTurnosDuenio";
import { fechaLegible } from "../../utils/fechaLegible";

function TurnosDuenio() {
  const {
    mascotas,
    propios,
    cargando,
    error,
    confirmacion,
    especialidades,
    especialidadSeleccionada,
    veterinariosEspecialidad,
    veterinarioSeleccionado,
    diasDisponibles,
    fechaSeleccionada,
    mesVisible,
    turnosDiaSeleccionado,
    cargandoDisponibilidad,
    turnoSeleccionado,
    mascotaSeleccionada,
    reservando,
    calendarioAbierto,
    cambiarEspecialidad,
    cambiarVeterinario,
    cambiarMes,
    seleccionarFecha,
    abrirConfirmacionTurno,
    cerrarConfirmacionTurno,
    setMascotaSeleccionada,
    confirmarTurno,
    sacarOtroTurno,
  } = useTurnosDuenio();

  if (cargando) return <p className="text-gray-600">Cargando turnos...</p>;

  const primerDiaMes = new Date(mesVisible.anio, mesVisible.mes, 1);
  const diasDelMes = new Date(mesVisible.anio, mesVisible.mes + 1, 0).getDate();
  const espaciosAntesDelMes = (primerDiaMes.getDay() + 6) % 7;
  const celdasCalendario = Array.from({ length: 42 }, (_, indice) => {
    const dia = indice - espaciosAntesDelMes + 1;
    if (dia < 1 || dia > diasDelMes) return null;
    const fecha = `${mesVisible.anio}-${String(mesVisible.mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    return { dia, fecha };
  });
  const fechaHoy = new Date();
  const hoy = `${fechaHoy.getFullYear()}-${String(fechaHoy.getMonth() + 1).padStart(2, "0")}-${String(fechaHoy.getDate()).padStart(2, "0")}`;
  const nombreMes = primerDiaMes.toLocaleDateString("es-AR", { month: "long", year: "numeric" });

  return (
    <section className="space-y-8">
      <div>
        <h1 className="font-plusjakarta text-3xl text-violet-950">Mis turnos</h1>
        <p className="mt-2 text-gray-600">Selecciona especialidad, profesional y horario.</p>
      </div>
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

      {confirmacion ? (
        <div role="status" className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800">
          <p className="font-semibold">{confirmacion}</p>
          <button type="button" onClick={sacarOtroTurno} className="rounded-md border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100">Sacar otro turno</button>
        </div>
      ) : (
        <section className="space-y-6 border-t border-violet-200 pt-6">
          {!mascotas.length && <p className="bg-white p-5 text-gray-700">Primero agrega una mascota para poder sacar un turno. <Link to="/duenio/mascotas" className="font-semibold text-violet-800 underline">Ir a mis mascotas</Link></p>}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-gray-700">
              Especialidad
              <select value={especialidadSeleccionada} onChange={(event) => cambiarEspecialidad(event.target.value)} className="mt-1 w-full rounded-md border border-violet-200 bg-white px-3 py-2 text-violet-950">
                <option value="">Selecciona una especialidad</option>
                {especialidades.map((especialidad) => <option key={especialidad} value={especialidad}>{especialidad}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Veterinario
              <select value={veterinarioSeleccionado ?? ""} onChange={(event) => cambiarVeterinario(event.target.value)} disabled={!especialidadSeleccionada} className="mt-1 w-full rounded-md border border-violet-200 bg-white px-3 py-2 text-violet-950 disabled:bg-gray-50 disabled:text-gray-400">
                <option value="">Selecciona un veterinario</option>
                {veterinariosEspecialidad.map((veterinario) => <option key={veterinario.id_persona} value={veterinario.id_persona}>Dr./Dra. {veterinario.nombre} {veterinario.apellido}</option>)}
              </select>
            </label>
          </div>

          {veterinarioSeleccionado && calendarioAbierto && (
            <section className="space-y-5 border-t border-violet-100 pt-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold capitalize text-violet-950">{nombreMes}</h2>
                <div className="flex gap-2">
                  <button type="button" aria-label="Mes anterior" onClick={() => cambiarMes(-1)} className="grid size-10 place-items-center rounded-md border border-violet-200 bg-white text-lg text-violet-900 hover:bg-violet-50">‹</button>
                  <button type="button" aria-label="Mes siguiente" onClick={() => cambiarMes(1)} className="grid size-10 place-items-center rounded-md border border-violet-200 bg-white text-lg text-violet-900 hover:bg-violet-50">›</button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((dia) => <div key={dia} className="py-2 text-xs font-semibold text-gray-500">{dia}</div>)}
                {celdasCalendario.map((celda, indice) => {
                  if (!celda) return <div key={`vacio-${indice}`} aria-hidden="true" className="aspect-square" />;
                  const disponible = diasDisponibles.has(celda.fecha);
                  const seleccionado = fechaSeleccionada === celda.fecha;
                  const pasado = celda.fecha < hoy;
                  return (
                    <button
                      key={celda.fecha}
                      type="button"
                      disabled={pasado}
                      aria-pressed={seleccionado}
                      aria-label={`${fechaLegible(celda.fecha)}${disponible ? ", con horarios disponibles" : ", sin horarios disponibles"}`}
                      onClick={() => seleccionarFecha(celda.fecha)}
                      className={`aspect-square rounded-md text-sm transition-colors ${disponible ? "bg-violet-100 font-semibold text-violet-950 hover:bg-violet-200" : "bg-white text-gray-700 hover:bg-gray-50"} ${seleccionado ? "ring-2 ring-violet-700 ring-inset" : ""} ${pasado ? "cursor-not-allowed opacity-40" : ""}`}
                    >{celda.dia}</button>
                  );
                })}
              </div>

              <section aria-live="polite" className="space-y-3">
                <h3 className="text-lg font-semibold text-violet-950">Horarios del {fechaLegible(fechaSeleccionada)}</h3>
                {cargandoDisponibilidad ? <p className="bg-white p-5 text-gray-600">Cargando disponibilidad...</p>
                  : turnosDiaSeleccionado.length ? (
                    <div className="flex flex-wrap gap-2">
                      {turnosDiaSeleccionado.map((turno) => <button key={turno.id_turno} type="button" onClick={() => abrirConfirmacionTurno(turno)} className="min-w-20 rounded-md border border-violet-300 bg-white px-4 py-3 text-sm font-semibold text-violet-900 hover:bg-violet-100">{turno.hora_turno.slice(0, 5)}</button>)}
                    </div>
                  ) : <p className="bg-white p-5 text-gray-600">No hay horarios pendientes para este día.</p>}
              </section>
            </section>
          )}
        </section>
      )}

      {turnoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="titulo-confirmar-turno" className="w-full max-w-md space-y-5 rounded-lg bg-white p-6 shadow-2xl">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-violet-700">Confirmar horario</p>
              <h2 id="titulo-confirmar-turno" className="mt-1 text-xl font-semibold text-violet-950">{fechaLegible(turnoSeleccionado.fecha_turno)} · {turnoSeleccionado.hora_turno.slice(0, 5)}</h2>
            </div>
            <label className="block text-sm font-medium text-gray-700">
              Mascota
              <select value={mascotaSeleccionada} onChange={(event) => setMascotaSeleccionada(event.target.value)} className="mt-1 w-full rounded-md border border-violet-200 bg-white px-3 py-2 text-violet-950">
                <option value="">Selecciona una mascota</option>
                {mascotas.map((mascota) => <option key={mascota.id_mascota} value={mascota.id_mascota}>{mascota.nombre_mascota} · {mascota.especie}</option>)}
              </select>
            </label>
            <div className="flex justify-end gap-3">
              <button type="button" disabled={reservando} onClick={cerrarConfirmacionTurno} className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button type="button" disabled={!mascotaSeleccionada || reservando} onClick={() => void confirmarTurno()} className="rounded-md bg-violet-800 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-950 disabled:cursor-not-allowed disabled:opacity-60">{reservando ? "Confirmando..." : "Confirmar turno"}</button>
            </div>
          </section>
        </div>
      )}

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