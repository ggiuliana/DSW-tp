import { useEstudios } from "../../hooks/useEstudio";

export default function GestionEstudios() {
  const {
    estudios,
    cargando,
    guardando,
    error,
    modalAbierto,
    formData,
    setFormData,
    abrirModal,
    cerrarModal,
    guardarEstudio,
    borrarEstudio,
  } = useEstudios();

  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-violet-900 italic tracking-tight font-plusjakarta">
            Estudios Médicos
          </h2>
          <p className="text-gray-500 mt-1">Gestión del catálogo de estudios y sus precios</p>
        </div>
        <button
          onClick={() => abrirModal()}
          className="bg-violet-700 hover:bg-violet-800 text-white px-6 py-2 rounded-xl font-medium transition-colors shadow-sm"
        >
          + Nuevo Estudio
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl">{error}</div>}

      {/* Listado */}
      <div className="bg-white rounded-2xl shadow-sm border border-violet-100 overflow-hidden">
        {cargando ? (
          <div className="p-8 text-center text-gray-500">Cargando estudios...</div>
        ) : estudios.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No hay estudios registrados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-violet-100 text-violet-900 bg-violet-50/50 text-sm">
                  <th className="p-4">Estudio</th>
                  <th className="p-4">Descripción</th>
                  <th className="p-4">Precio</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-violet-50 text-sm">
                {estudios.map((estudio) => (
                  <tr key={estudio.id_estudio} className="hover:bg-violet-50/30 transition">
                    <td className="p-4 font-semibold text-gray-800">{estudio.nombre_estudio}</td>
                    <td className="p-4 text-gray-600 max-w-xs truncate" title={estudio.descripcion_estudio}>
                      {estudio.descripcion_estudio}
                    </td>
                    <td className="p-4 text-emerald-600 font-bold">
                      ${Number(estudio.precio_estudio).toLocaleString('es-AR')}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => abrirModal(estudio)}
                          className="px-3 py-1 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => borrarEstudio(estudio.id_estudio)}
                          className="px-3 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Creación/Edición */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-violet-900 mb-6 font-plusjakarta">
              {formData.nombre_estudio ? "Editar Estudio" : "Nuevo Estudio"}
            </h3>
            
            <form onSubmit={guardarEstudio} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Estudio (Máx 30 carácteres)</label>
                <input
                  type="text"
                  maxLength={30}
                  required
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                  value={formData.nombre_estudio}
                  onChange={(e) => setFormData({ ...formData, nombre_estudio: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (Máx 200 carácteres)</label>
                <textarea
                  required
                  maxLength={200}
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all resize-none"
                  value={formData.descripcion_estudio}
                  onChange={(e) => setFormData({ ...formData, descripcion_estudio: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                  value={formData.precio_estudio}
                  onChange={(e) => setFormData({ ...formData, precio_estudio: Number(e.target.value) })}
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={cerrarModal}
                  disabled={guardando}
                  className="px-6 py-2 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="bg-violet-700 hover:bg-violet-800 text-white px-6 py-2 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {guardando ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}