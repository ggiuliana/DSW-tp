import { Controller, useForm } from "react-hook-form";
import type { ConsultaForm, ConsultaVeterinario, TurnoVeterinario } from "../../types/veterinario.js";
import { useConsultasVeterinario } from "../../hooks/useConsultasVeterinario";
import { fechaLegible } from "../../utils/fechaLegible.js";

interface ConsultasVeterinarioProps {
  turnos: TurnoVeterinario[];
  consultas: ConsultaVeterinario[];
  onGuardar: (idTurno: number, data: ConsultaForm, consulta: ConsultaVeterinario | null) => Promise<ConsultaVeterinario>;
}

function ConsultasVeterinario({ turnos, consultas, onGuardar }: ConsultasVeterinarioProps) {
  const {
    turnoSeleccionado,
    consultaSeleccionada,
    turnosConfirmados,
    estudios,
    cargandoEstudios,
    error,
    guardando,
    abrirFormulario,
    cerrarFormulario,
    guardar: guardarConsulta,
  } = useConsultasVeterinario(turnos, onGuardar);
  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<ConsultaForm>({
    defaultValues: { diagnostico: "", tratamiento: "", peso: undefined, observaciones: "", id_estudios: [] },
  });

  const seleccionarConsulta = (turno: TurnoVeterinario, consulta?: ConsultaVeterinario) => {
    abrirFormulario(turno, consulta);
    reset(consulta ? {
      diagnostico: consulta.diagnostico,
      tratamiento: consulta.tratamiento,
      peso: consulta.peso,
      observaciones: consulta.observaciones || "",
      id_estudios: consulta.estudios?.map((estudio) => estudio.id_estudio) ?? [],
    } : { diagnostico: "", tratamiento: "", peso: undefined, observaciones: "", id_estudios: [] });
  };

  const cerrarConsulta = () => {
    cerrarFormulario();
    reset();
  };

  const guardar = async (data: ConsultaForm) => {
    if (await guardarConsulta(data)) reset();
  };

  return (
    <section>
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-violet-700">Atención clínica</p>
      <h1 className="mb-6 font-plusjakarta text-3xl text-violet-950">Consultas</h1>
      {error && <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
      <div className="divide-y divide-violet-100 bg-white shadow-sm">
        {turnosConfirmados.map((turno) => {
          const consulta = consultas.find((item) => item.turno?.id_turno === turno.id_turno);
          return (
            <article key={turno.id_turno} className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-violet-950">{turno.mascota?.nombre_mascota || "Mascota sin asignar"}</p>
                <p className="mt-1 text-sm text-gray-600">{fechaLegible(turno.fecha_turno)} · {turno.hora_turno.slice(0, 5)} · {turno.estado_turno}</p>
                {consulta && <p className="mt-2 text-sm text-gray-700">{consulta.diagnostico}</p>}
                {consulta?.estudios?.length ? (
                  <p className="mt-1 text-sm text-violet-700">Estudios: {consulta.estudios.map((estudio) => estudio.nombre_estudio).join(", ")}</p>
                ) : null}
              </div>
              <button type="button" onClick={() => seleccionarConsulta(turno, consulta)} className="rounded-md border border-violet-300 px-4 py-2 text-sm font-semibold text-violet-800 hover:bg-violet-50">{consulta ? "Editar consulta" : "Registrar consulta"}</button>
            </article>
          );
        })}
        {!turnosConfirmados.length && <p className="p-6 text-gray-600">No hay turnos confirmados para registrar consultas.</p>}
      </div>
      {turnoSeleccionado !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <form onSubmit={handleSubmit(guardar)} className="my-auto w-full max-w-xl space-y-4 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-sm font-semibold uppercase tracking-wide text-violet-700">Historia clínica</p><h2 className="mt-1 text-xl font-semibold text-violet-950">{consultaSeleccionada ? "Editar consulta" : "Nueva consulta"}</h2></div>
              <button type="button" aria-label="Cerrar" onClick={cerrarConsulta} className="px-2 text-2xl text-gray-500 hover:text-violet-800">×</button>
            </div>
            <label className="block text-sm font-medium text-gray-700">Diagnóstico<input {...register("diagnostico", { required: "El diagnóstico es obligatorio.", maxLength: 100 })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
            {errors.diagnostico && <p className="text-sm text-red-700">{errors.diagnostico.message}</p>}
            <label className="block text-sm font-medium text-gray-700">Tratamiento<input {...register("tratamiento", { required: "El tratamiento es obligatorio.", maxLength: 200 })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
            {errors.tratamiento && <p className="text-sm text-red-700">{errors.tratamiento.message}</p>}
            <label className="block text-sm font-medium text-gray-700">Peso (kg)<input type="number" min="0.01" step="0.01" {...register("peso", { required: "El peso es obligatorio.", valueAsNumber: true, min: { value: 0.01, message: "El peso debe ser mayor a cero." } })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
            {errors.peso && <p className="text-sm text-red-700">{errors.peso.message}</p>}
            <label className="block text-sm font-medium text-gray-700">Observaciones<textarea maxLength={200} {...register("observaciones")} rows={3} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
            <fieldset className="space-y-3 border-t border-violet-100 pt-4">
              <legend className="text-sm font-semibold text-violet-950">Estudios realizados</legend>
              {cargandoEstudios ? <p className="text-sm text-gray-500">Cargando estudios...</p>
                : estudios.length ? (
                  <Controller
                    control={control}
                    name="id_estudios"
                    render={({ field }) => {
                      const seleccionados = field.value ?? [];
                      const total = estudios.reduce((suma, estudio) => seleccionados.includes(estudio.id_estudio) ? suma + Number(estudio.precio_estudio) : suma, 0);
                      return (
                        <div className="space-y-3">
                          <div className="divide-y divide-violet-100 rounded-md border border-violet-100">
                            {estudios.map((estudio) => (
                              <label key={estudio.id_estudio} className="flex cursor-pointer items-start gap-3 p-3 hover:bg-violet-50/60">
                                <input
                                  type="checkbox"
                                  name={field.name}
                                  ref={field.ref}
                                  checked={seleccionados.includes(estudio.id_estudio)}
                                  onBlur={field.onBlur}
                                  onChange={(event) => field.onChange(event.target.checked
                                    ? [...seleccionados, estudio.id_estudio]
                                    : seleccionados.filter((id) => id !== estudio.id_estudio))}
                                  className="mt-1 accent-violet-700"
                                />
                                <span className="min-w-0 flex-1">
                                  <span className="flex flex-wrap justify-between gap-2 text-sm font-medium text-violet-950">
                                    <span>{estudio.nombre_estudio}</span>
                                    <span>${Number(estudio.precio_estudio).toFixed(2)}</span>
                                  </span>
                                  <span className="mt-1 block text-xs text-gray-600">{estudio.descripcion_estudio}</span>
                                </span>
                              </label>
                            ))}
                          </div>
                          <p className="text-right text-sm font-semibold text-violet-900">Total de estudios: ${total.toFixed(2)}</p>
                        </div>
                      );
                    }}
                  />
                ) : <p className="text-sm text-gray-500">No hay estudios disponibles.</p>}
            </fieldset>
            <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={cerrarConsulta} className="rounded-md border border-gray-300 px-4 py-2 text-sm">Cancelar</button><button type="submit" disabled={guardando} className="rounded-md bg-violet-800 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-950 disabled:opacity-60">{guardando ? "Guardando..." : "Guardar consulta"}</button></div>
          </form>
        </div>
      )}
    </section>
  );
}

export default ConsultasVeterinario;