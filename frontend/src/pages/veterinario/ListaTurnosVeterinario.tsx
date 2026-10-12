import type { ConsultaVeterinario, TurnoVeterinario } from "../../types/veterinario.js";
import { fechaLegible } from "../../utils/fechaLegible.js";

interface ListaTurnosVeterinarioProps {
  turnos: TurnoVeterinario[];
  consultas: ConsultaVeterinario[];
  onBorrar?: (turno: TurnoVeterinario) => void;
}

function ListaTurnosVeterinario({ turnos, consultas, onBorrar }: ListaTurnosVeterinarioProps) {
  const consultaPorTurno = new Set(consultas.map((consulta) => consulta.turno?.id_turno));

  return (
    <div className="divide-y divide-violet-100 bg-white shadow-sm">
      {turnos.map((turno) => (
        <article key={turno.id_turno} className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="font-semibold text-violet-950">
              {turno.mascota?.nombre_mascota || "Mascota sin asignar"}
              <span className="font-normal text-gray-500">{turno.mascota?.especie ? ` · ${turno.mascota.especie}` : ""}</span>
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {fechaLegible(turno.fecha_turno)} · {turno.hora_turno.slice(0, 5)}
            </p>
            {turno.observaciones_turno && <p className="mt-1 text-sm text-gray-500">{turno.observaciones_turno}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {consultaPorTurno.has(turno.id_turno) && <span className="text-xs font-semibold text-emerald-700">Consulta registrada</span>}
            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-800">{turno.estado_turno}</span>
            {onBorrar && turno.estado_turno.toLowerCase() === "pendiente" && !turno.mascota && (
              <button
                type="button"
                onClick={() => { if (window.confirm("¿Borrar este espacio disponible?")) onBorrar(turno); }}
                className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
              >
                Borrar
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

export default ListaTurnosVeterinario;