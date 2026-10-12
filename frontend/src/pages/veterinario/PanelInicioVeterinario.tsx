import { useCalendarioVeterinario } from "../../hooks/useCalendarioVeterinario";
import { fechaLegible } from "../../utils/fechaLegible.js";
import ListaTurnosVeterinario from "./ListaTurnosVeterinario";

function PanelInicioVeterinario({ nombre }: { nombre: string }) {
  const {
    hoy,
    anio,
    mes,
    fechaSeleccionada,
    turnosHoy,
    turnosFechaSeleccionada,
    diasConTurnos,
    cargandoHoy,
    cargandoMes,
    error,
    seleccionarFecha,
    cambiarMes,
  } = useCalendarioVeterinario();

  const primerDia = new Date(anio, mes, 1);
  const desplazamientoInicial = (primerDia.getDay() + 6) % 7;
  const diasDelMes = new Date(anio, mes + 1, 0).getDate();
  const celdas = Array.from({ length: 42 }, (_, indice) => {
    const dia = indice - desplazamientoInicial + 1;
    if (dia < 1 || dia > diasDelMes) return null;
    const fecha = `${anio}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    return { dia, fecha };
  });
  const nombreMes = primerDia.toLocaleDateString("es-AR", { month: "long", year: "numeric" });

  return (
    <section className="space-y-8">
      <header>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-violet-700">Panel profesional</p>
        <h1 className="font-plusjakarta text-3xl text-violet-950">Hola, {nombre}</h1>
        <p className="mt-2 text-gray-600">Tu agenda clínica.</p>
      </header>

      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

      <section aria-labelledby="turnos-hoy-titulo" className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="turnos-hoy-titulo" className="text-xl font-semibold text-violet-950">Turnos confirmados de hoy</h2>
          <time className="text-sm text-gray-600" dateTime={hoy}>{fechaLegible(hoy)}</time>
        </div>
        {cargandoHoy ? <p className="bg-white p-5 text-gray-600">Cargando turnos de hoy...</p>
          : turnosHoy.length
            ? <ListaTurnosVeterinario turnos={turnosHoy} />
            : <p className="bg-white p-5 text-gray-600">No tienes turnos confirmados pendientes para hoy.</p>}
      </section>

      <section aria-labelledby="calendario-titulo" className="border-t border-violet-200 pt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-violet-700">Agenda</p>
            <h2 id="calendario-titulo" className="mt-1 text-xl font-semibold capitalize text-violet-950">{nombreMes}</h2>
          </div>
          <div className="flex gap-2">
            <button type="button" aria-label="Mes anterior" onClick={() => cambiarMes(-1)} className="grid size-10 place-items-center rounded-md border border-violet-200 bg-white text-lg text-violet-900 hover:bg-violet-50">‹</button>
            <button type="button" aria-label="Mes siguiente" onClick={() => cambiarMes(1)} className="grid size-10 place-items-center rounded-md border border-violet-200 bg-white text-lg text-violet-900 hover:bg-violet-50">›</button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((dia) => (
            <div key={dia} className="py-2 text-xs font-semibold text-gray-500">{dia}</div>
          ))}
          {celdas.map((celda, indice) => {
            if (!celda) return <div key={`vacio-${indice}`} aria-hidden="true" className="aspect-square" />;
            const tieneTurnos = diasConTurnos.has(celda.fecha);
            const seleccionado = fechaSeleccionada === celda.fecha;
            const esHoy = hoy === celda.fecha;
            return (
              <button
                key={celda.fecha}
                type="button"
                aria-pressed={seleccionado}
                aria-label={`${fechaLegible(celda.fecha)}${tieneTurnos ? ", tiene turnos confirmados" : ", sin turnos confirmados"}`}
                onClick={() => seleccionarFecha(celda.fecha)}
                className={`aspect-square rounded-md text-sm transition-colors ${
                  tieneTurnos
                    ? "bg-violet-100 font-semibold text-violet-950 hover:bg-violet-200"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } ${seleccionado ? "ring-2 ring-violet-700 ring-inset" : ""} ${esHoy ? "underline decoration-violet-500 decoration-2 underline-offset-4" : ""}`}
              >
                {celda.dia}
              </button>
            );
          })}
        </div>

        <section aria-live="polite" className="mt-6 space-y-3">
          <h3 className="text-lg font-semibold text-violet-950">Turnos del {fechaLegible(fechaSeleccionada)}</h3>
          {cargandoMes ? <p className="bg-white p-5 text-gray-600">Cargando calendario...</p>
            : turnosFechaSeleccionada.length
              ? <ListaTurnosVeterinario turnos={turnosFechaSeleccionada} />
              : <p className="bg-white p-5 text-gray-600">No hay turnos confirmados para este día.</p>}
        </section>
      </section>
    </section>
  );
}

export default PanelInicioVeterinario;