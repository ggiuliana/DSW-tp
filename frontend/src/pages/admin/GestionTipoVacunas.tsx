import { useGestionTiposVacuna } from "../../hooks/useGestionTiposVacuna";

export default function GestionTiposVacuna() {
  const {
    tipos,
    cargando,
    guardando,
    error,
    modalAbierto,
    tipoEnEdicion,
    formData,
    setFormData,
    abrirModal,
    cerrarModal,
    guardarTipo,
    borrarTipo,
  } = useGestionTiposVacuna();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await guardarTipo();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este tipo de vacuna?")) return;
    await borrarTipo(id);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-violet-900 italic tracking-tight">
            Tipos de Vacuna
          </h2>
          <p className="text-gray-500 mt-1">Gestión del catálogo de vacunas disponibles</p>
        </div>
        <button
          onClick={() => abrirModal()}
          className="bg-violet-700 hover:bg-violet-800 text-white px-6 py-2 rounded-xl font-medium transition-colors shadow-sm"
        >
          + Nuevo Tipo
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl">{error}</div>}

      {/* Listado */}
      <div className="bg-white rounded-2xl shadow-sm border border-violet-100 overflow-hidden">
        {cargando ? (
          <div className="p-8 text-center text-gray-500">Cargando tipos de vacuna...</div>
        ) : tipos.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No hay tipos de vacuna registrados.</div>
        ) : (
          <div className="divide-y divide-violet-100">
            {tipos.map((tipo) => (
              <div key={tipo.id_tipo_vacuna} className="p-6 flex justify-between items-center hover:bg-violet-50/50 transition-colors">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{tipo.nombre_tipo_vacuna}</h3>
                  <p className="text-gray-500 mt-1 text-sm">{tipo.descripcion_tipo_vacuna}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => abrirModal(tipo)}
                    className="px-4 py-2 text-sm font-medium text-violet-700 bg-violet-100 rounded-lg hover:bg-violet-200 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(tipo.id_tipo_vacuna)}
                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Creación/Edición */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-violet-900 mb-6">
              {tipoEnEdicion ? "Editar Vacuna" : "Nuevo Tipo de Vacuna"}
            </h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Vacuna (Máx 30 carácteres)</label>
                <input
                  type="text"
                  maxLength={30}
                  required
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                  value={formData.nombre_tipo_vacuna}
                  onChange={(e) => setFormData({ ...formData, nombre_tipo_vacuna: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (Opcional)</label>
                <textarea
                  maxLength={200}
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all resize-none"
                  value={formData.descripcion_tipo_vacuna}
                  onChange={(e) => setFormData({ ...formData, descripcion_tipo_vacuna: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="px-6 py-2 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="bg-violet-700 hover:bg-violet-800 text-white px-6 py-2 rounded-xl font-medium transition-colors"
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