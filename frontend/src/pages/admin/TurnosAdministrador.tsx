import { useTurnosAdministrador } from "../../hooks/useTurnosAdmin.ts";
import type { TurnoAdmin } from "../../services/adminService";
import type { VeterinarioAdmin } from "../../types/admin";
import agendaIcon from "../../assets/icons/agenda.png";
import { useNavigate } from "react-router-dom";

export default function TurnosAdministrador() {
  const navigate = useNavigate();
  const {
    turnosFiltrados,
    veterinarios,
    cargando,
    error,
    filtroVet, setFiltroVet,
    filtroEstado, setFiltroEstado,
    fechaDesde, setFechaDesde,
    fechaHasta, setFechaHasta,
    limpiarFiltros
  } = useTurnosAdministrador();

  const formatearFecha = (fechaIso: string) => {
    const fecha = new Date(fechaIso);
    return fecha.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const colorEstado = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "confirmado": return "bg-emerald-100 text-emerald-800";
      case "pendiente": return "bg-amber-100 text-amber-800";
    //case "cancelado": return "bg-red-100 text-red-800";
      case "resuelto": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera */}
      <div>
        <h2 className="text-3xl font-bold text-violet-900 italic tracking-tight font-plusjakarta">
          Agenda y Turnos
        </h2>
        <p className="text-gray-500 mt-1">Supervisión general de todos los turnos programados</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl">{error}</div>}

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-violet-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div className="w-full">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Veterinario</label>
          <select 
            value={filtroVet} 
            onChange={(e) => setFiltroVet(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all text-sm"
          >
            <option value="">Todos los Veterinarios</option>
            {veterinarios.map((vet: VeterinarioAdmin) => (
              <option key={vet.id_persona} value={vet.id_persona}>
                Dr/a. {vet.nombre} {vet.apellido}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Estado</label>
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all text-sm"
          >
            <option value="">Cualquier Estado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Confirmado">Confirmado</option>
            <option value="Resuelto">Resuelto</option>
            {/*<option value="Cancelado">Cancelado</option>*/}
          </select>
        </div>

        <div className="w-full">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Desde</label>
          <input 
            type="date" 
            value={fechaDesde} 
            onChange={(e) => setFechaDesde(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all text-sm text-gray-700"
          />
        </div>

        <div className="w-full">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Hasta</label>
          <input 
            type="date" 
            value={fechaHasta} 
            onChange={(e) => setFechaHasta(e.target.value)}
            min={fechaDesde}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all text-sm text-gray-700"
          />
        </div>

        <button 
          onClick={limpiarFiltros}
          className="w-full px-6 py-2 text-sm font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-xl transition h-[42px] whitespace-nowrap"
        >
          Limpiar Filtros
        </button>
      </div>

      {/* Listado */}
      <div className="bg-white rounded-2xl shadow-sm border border-violet-100 overflow-hidden">
        {cargando ? (
          <div className="p-8 text-center text-gray-500">Cargando turnos...</div>
       ) : turnosFiltrados.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <img 
              src={agendaIcon} 
              alt="Sin turnos" 
              className="w-16 h-16 mb-4 opacity-60 drop-shadow-sm" 
            />
            <h3 className="text-lg font-semibold text-gray-700">No se encontraron turnos</h3>
            <p className="text-gray-500 text-sm mt-1">Prueba cambiando los filtros o revisa otro mes.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-violet-100 text-violet-900 bg-violet-50/50 text-sm">
                  <th className="p-4 font-semibold">Fecha y Hora</th>
                  <th className="p-4 font-semibold">Paciente</th>
                  <th className="p-4 font-semibold">Veterinario</th>
                  <th className="p-4 font-semibold">Estado</th>
                  <th className="p-4 font-semibold">Observaciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-violet-50 text-sm">
                {turnosFiltrados.map((turno: TurnoAdmin) => (
                  <tr key={turno.id_turno} className="hover:bg-violet-50/30 transition">
                    <td className="p-4">
                      <div className="font-semibold text-gray-800">{formatearFecha(turno.fecha_turno)}</div>
                      <div className="text-violet-600 font-medium text-xs mt-0.5">{turno.hora_turno.slice(0, 5)} hs</div>
                    </td>
                    <td className="p-4">
                      {turno.mascota ? (
                        <div className="flex flex-col items-start gap-1">
                          <span className="font-medium text-gray-900">{turno.mascota.nombre_mascota}</span>
                          <button 
                            onClick={() => navigate(`/administrador/turnos/detalle/${turno.id_turno}`)}
                            className="text-xs font-semibold text-violet-700 hover:text-violet-900 bg-violet-50 hover:bg-violet-100 px-2 py-0.5 rounded transition-colors"
                          >
                            Ver dueño &rarr;
                          </button>
                        </div>
                      ) : (
                        <span className="font-medium text-gray-400 italic">Sin Asignar</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-600">
                      Dr/a. {turno.veterinario?.nombre} {turno.veterinario?.apellido}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${colorEstado(turno.estado_turno)}`}>
                        {turno.estado_turno}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 max-w-xs truncate" title={turno.observaciones_turno}>
                      {turno.observaciones_turno || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}