import type { ConsultaVeterinario, TurnoVeterinario } from "../../types/veterinario.js";
import { useTurnosVeterinario } from "../../hooks/useTurnosVeterinario";
import ListaTurnosVeterinario from "./ListaTurnosVeterinario";

interface TurnosVeterinarioProps {
  turnos: TurnoVeterinario[];
  consultas: ConsultaVeterinario[];
  onCrear: (fecha: string, hora: string) => Promise<void>;
  onBorrar: (turno: TurnoVeterinario) => void;
}

function TurnosVeterinario({ turnos, consultas, onCrear, onBorrar }: TurnosVeterinarioProps) {
  const { fecha, setFecha, hora, setHora, creando, crear } = useTurnosVeterinario(onCrear);
  const ahora = new Date();
  const fechaMinima = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, "0")}-${String(ahora.getDate()).padStart(2, "0")}`;
  const horarios = Array.from({ length: 14 }, (_, index) => {
    const minutos = 9 * 60 + index * 45;
    return `${String(Math.floor(minutos / 60)).padStart(2, "0")}:${String(minutos % 60).padStart(2, "0")}`;
  });

  return (
    <section>
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-violet-700">Agenda clínica</p>
      <h1 className="mb-6 font-plusjakarta text-3xl text-violet-950">Disponibilidad y turnos</h1>
      <form onSubmit={crear} className="mb-6 flex flex-col gap-4 border-l-4 border-violet-700 bg-white p-5 shadow-sm sm:flex-row sm:items-end">
        <label className="flex-1 text-sm font-medium text-gray-700">Fecha<input type="date" required min={fechaMinima} value={fecha} onChange={(event) => setFecha(event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
        <label className="text-sm font-medium text-gray-700">Horario<select value={hora} onChange={(event) => setHora(event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 sm:w-36">{horarios.map((horario) => <option key={horario} value={horario}>{horario}</option>)}</select></label>
        <button type="submit" disabled={creando || !fecha} className="rounded-md bg-violet-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-950 disabled:cursor-not-allowed disabled:opacity-60">{creando ? "Creando..." : "Agregar disponibilidad"}</button>
      </form>
      <h2 className="mb-3 text-lg font-semibold text-violet-950">Turnos de la agenda</h2>
      {turnos.length
        ? <ListaTurnosVeterinario turnos={turnos} consultas={consultas} onBorrar={onBorrar} />
        : <p className="bg-white p-6 text-gray-600">No hay turnos ni espacios disponibles.</p>}
    </section>
  );
}

export default TurnosVeterinario;