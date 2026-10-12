import { useGestionVeterinarios } from "../../hooks/useGestionVeterinarios";

export default function GestionVeterinarios() {
  const {
    veterinarios,
    cargando,
    guardando,
    error,
    modalAbierto,
    veterinarioEnEdicion,
    formData,
    abrirModal,
    cerrarModal,
    actualizarCampo,
    guardarVeterinario: guardarVeterinarioHook,
    borrarVeterinario,
  } = useGestionVeterinarios();

  const guardarVeterinario = async (e: React.FormEvent) => {
    e.preventDefault();
    await guardarVeterinarioHook();
  };

  const eliminarVeterinario = async (id?: number) => {
    if (!id || !confirm("¿Seguro que deseas eliminar este veterinario?")) return;
    await borrarVeterinario(id);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-violet-950 font-plusjakarta">Veterinarios</h1>
          <p className="text-sm text-gray-500">Gestión y administración del personal médico</p>
        </div>
        <button
          onClick={() => abrirModal()}
          className="self-start sm:self-auto bg-violet-600 hover:bg-violet-700 text-white font-semibold px-4 py-2 rounded-xl transition shadow"
        >
          + Nuevo Veterinario
        </button>
      </div>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded-xl">{error}</div>}

      {cargando ? (
        <p className="text-gray-500">Cargando veterinarios...</p>
      ) : veterinarios.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center text-gray-500">
          No hay veterinarios registrados en el sistema.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-violet-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-violet-100 text-violet-900 bg-violet-50/50 text-sm">
                <th className="p-4">Nombre y Apellido</th>
                <th className="p-4">Matrícula</th>
                <th className="p-4">Especialidad</th>
                <th className="p-4">Contacto</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-violet-50 text-sm">
              {veterinarios.map((vet) => (
                <tr key={vet.id_persona} className="hover:bg-violet-50/30 transition">
                  <td className="p-4 font-medium text-gray-900">
                    {vet.nombre} {vet.apellido}
                    <span className="block text-xs text-gray-400">DNI: {vet.dni}</span>
                  </td>
                  <td className="p-4 text-gray-600">{vet.matricula}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-violet-100 text-violet-800 rounded-md text-xs font-medium">
                      {vet.especialidad}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">
                    <div>{vet.mail}</div>
                    <div className="text-xs text-gray-400">{vet.telefono}</div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => abrirModal(vet)}
                        className="px-3 py-1 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarVeterinario(vet.id_persona)}
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

      {/* Modal Alta / Modificación */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-violet-950 font-plusjakarta">
              {veterinarioEnEdicion ? "Editar Veterinario" : "Registrar Veterinario"}
            </h2>

            <form onSubmit={guardarVeterinario} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <label className="block text-gray-600 font-medium mb-1">Nombre</label>
                <input
                  required
                  name="nombre"
                  value={formData.nombre}
                  onChange={(event) => actualizarCampo("nombre", event.target.value)}
                  className="w-full border rounded-lg p-2 border-violet-200 focus:outline-violet-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">Apellido</label>
                <input
                  required
                  name="apellido"
                  value={formData.apellido}
                  onChange={(event) => actualizarCampo("apellido", event.target.value)}
                  className="w-full border rounded-lg p-2 border-violet-200 focus:outline-violet-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">DNI</label>
                <input
                  required
                  name="dni"
                  value={formData.dni}
                  onChange={(event) => actualizarCampo("dni", event.target.value)}
                  className="w-full border rounded-lg p-2 border-violet-200 focus:outline-violet-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">Teléfono</label>
                <input
                  required
                  name="telefono"
                  value={formData.telefono}
                  onChange={(event) => actualizarCampo("telefono", event.target.value)}
                  className="w-full border rounded-lg p-2 border-violet-200 focus:outline-violet-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-gray-600 font-medium mb-1">Email</label>
                <input
                  type="email"
                  required
                  name="mail"
                  value={formData.mail}
                  onChange={(event) => actualizarCampo("mail", event.target.value)}
                  className="w-full border rounded-lg p-2 border-violet-200 focus:outline-violet-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-gray-600 font-medium mb-1">Dirección</label>
                <input
                  required
                  name="direccion"
                  value={formData.direccion}
                  onChange={(event) => actualizarCampo("direccion", event.target.value)}
                  className="w-full border rounded-lg p-2 border-violet-200 focus:outline-violet-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">Matrícula</label>
                <input
                  required
                  name="matricula"
                  value={formData.matricula}
                  onChange={(event) => actualizarCampo("matricula", event.target.value)}
                  className="w-full border rounded-lg p-2 border-violet-200 focus:outline-violet-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">Especialidad</label>
                <input
                  required
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={(event) => actualizarCampo("especialidad", event.target.value)}
                  className="w-full border rounded-lg p-2 border-violet-200 focus:outline-violet-500"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-semibold"
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