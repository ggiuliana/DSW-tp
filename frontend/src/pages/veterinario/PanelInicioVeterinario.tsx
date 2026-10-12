import type { ConsultaVeterinario, TurnoVeterinario } from "../../types/veterinario.js";
import ListaTurnosVeterinario from "./ListaTurnosVeterinario";

interface PanelInicioVeterinarioProps {
  nombre: string;
  turnos: TurnoVeterinario[];
  consultas: ConsultaVeterinario[];
  onVerAgenda: () => void;
}

function PanelInicioVeterinario({ nombre, turnos, consultas, onVerAgenda }: PanelInicioVeterinarioProps) {
  const ahora = new Date().getTime();
  const confirmadosProximos = turnos.filter((turno) =>
    turno.estado_turno.toLowerCase() === "confirmado" &&
    new Date(`${turno.fecha_turno.slice(0, 10)}T${turno.hora_turno.slice(0, 5)}:00`).getTime() >= ahora
  );
  const hoy = new Date().toLocaleDateString("en-CA");
  const turnosHoy = confirmadosProximos.filter((turno) => turno.fecha_turno.slice(0, 10) === hoy);

  return (
    <section className="space-y-8">
      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-violet-700">Panel profesional</p>
        <h1 className="font-plusjakarta text-3xl text-violet-950">Hola, {nombre}</h1>
        <p className="mt-2 text-gray-600">Tu agenda y actividad clínica en un solo lugar.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Resumen titulo="Turnos confirmados próximos" valor={confirmadosProximos.length} />
        <Resumen titulo="Confirmados hoy" valor={turnosHoy.length} />
        <Resumen titulo="Consultas registradas" valor={consultas.length} />
      </div>
      <section className="border-t border-violet-200 pt-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-violet-950">Próximos turnos</h2>
          <button type="button" onClick={onVerAgenda} className="text-sm font-semibold text-violet-800 hover:underline">Ver agenda</button>
        </div>
        {confirmadosProximos.length
          ? <ListaTurnosVeterinario turnos={confirmadosProximos.slice(0, 4)} consultas={consultas} />
          : <p className="bg-white p-6 text-gray-600">No tienes próximos turnos confirmados.</p>}
      </section>
    </section>
  );
}

function Resumen({ titulo, valor }: { titulo: string; valor: number }) {
  return (
    <div className="border-l-4 border-violet-700 bg-white px-5 py-4 shadow-sm">
      <p className="text-sm text-gray-600">{titulo}</p>
      <p className="mt-1 text-3xl font-semibold text-violet-950">{valor}</p>
    </div>
  );
}

export default PanelInicioVeterinario;