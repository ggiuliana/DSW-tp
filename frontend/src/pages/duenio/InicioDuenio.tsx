import { useTurnosDuenio } from "../../hooks/useTurnosDuenio";
import { fechaLegible } from "../../utils/fechaLegible.js";

function InicioDuenio({ nombre }: { nombre: string }) {
  const { turnoMasProximo, restoTurnosProximos, diasHastaProximo, cargando, error } = useTurnosDuenio(false);

  if (cargando) return <p className="text-gray-600">Cargando tus próximos turnos...</p>;

  return (
    <section className="space-y-8">
      <header>
        <h1 className="font-plusjakarta text-3xl text-violet-950">Hola, {nombre}</h1>
        <p className="mt-2 text-gray-600">Tus próximos turnos y consultas.</p>
      </header>
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-violet-950">Tu siguiente turno</h2>
        {turnoMasProximo ? (
          <article className="border-l-4 border-violet-700 bg-white px-5 py-4 shadow-sm">
            <p className="text-sm font-semibold text-violet-800">Dentro de {diasHastaProximo} {diasHastaProximo === 1 ? "día" : "días"}:</p>
            <p className="mt-2 font-semibold text-violet-950">{turnoMasProximo.mascota?.nombre_mascota}</p>
            <p className="mt-1 text-sm text-gray-600">{fechaLegible(turnoMasProximo.fecha_turno)} · {turnoMasProximo.hora_turno.slice(0, 5)}</p>
            {turnoMasProximo.veterinario && <p className="mt-1 text-sm text-gray-600">Dr./Dra. {turnoMasProximo.veterinario.nombre} {turnoMasProximo.veterinario.apellido}</p>}
          </article>
        ) : <p className="bg-white p-5 text-gray-600">No tienes próximos turnos confirmados.</p>}
      </section>

      <section className="space-y-3 border-t border-violet-200 pt-6">
        <h2 className="text-xl font-semibold text-violet-950">Turnos próximos</h2>
        {restoTurnosProximos.length ? (
          <div className="divide-y divide-violet-100 bg-white">
            {restoTurnosProximos.map((turno) => (
              <article key={turno.id_turno} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="font-semibold text-violet-950">{turno.mascota?.nombre_mascota}</p>
                  <p className="text-sm text-gray-600">{fechaLegible(turno.fecha_turno)} · {turno.hora_turno.slice(0, 5)}</p>
                </div>
                {turno.veterinario && <p className="text-sm text-gray-600">Dr./Dra. {turno.veterinario.nombre} {turno.veterinario.apellido}</p>}
              </article>
            ))}
          </div>
        ) : <p className="bg-white p-5 text-gray-600">No hay más turnos próximos.</p>}
      </section>
    </section>
  );
}

export default InicioDuenio;