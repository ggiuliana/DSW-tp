import { useEffect, useState, useCallback } from "react";

export interface Veterinario {
  id_persona?: number;
  nombre: string;
  apellido: string;
  telefono: string;
  mail: string;
  dni: string;
  direccion: string;
  matricula: string;
  especialidad: string;
}

const API_URL = "http://localhost:3000/api/veterinario";

export default function GestionVeterinarios() {
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [vetSeleccionado, setVetSeleccionado] = useState<Veterinario | null>(null);
  const [formData, setFormData] = useState<Veterinario>({
    nombre: "",
    apellido: "",
    telefono: "",
    mail: "",
    dni: "",
    direccion: "",
    matricula: "",
    especialidad: "",
  });

  const token = localStorage.getItem("token");

  const cargarVeterinarios = useCallback(async () => {
    try {
      setCargando(true);
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al cargar veterinarios");
      setVeterinarios(data.data);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setCargando(false);
    }
  }, [token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarVeterinarios();
  }, [cargarVeterinarios]);

  const abrirModal = (vet?: Veterinario) => {
    if (vet) {
      setVetSeleccionado(vet);
      setFormData(vet);
    } else {
      setVetSeleccionado(null);
      setFormData({
        nombre: "",
        apellido: "",
        telefono: "",
        mail: "",
        dni: "",
        direccion: "",
        matricula: "",
        especialidad: "",
      });
    }
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setVetSeleccionado(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const guardarVeterinario = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const esEdicion = Boolean(vetSeleccionado?.id_persona);
      const url = esEdicion ? `${API_URL}/${vetSeleccionado?.id_persona}` : API_URL;
      const method = esEdicion ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error al procesar la solicitud");
      cerrarModal();
      cargarVeterinarios();
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  const eliminarVeterinario = async (id?: number) => {
    if (!id || !confirm("¿Seguro que deseas eliminar este veterinario?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al eliminar veterinario");
      cargarVeterinarios();
    } catch (err: unknown) {
      alert((err as Error).message);
    }
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
              {vetSeleccionado ? "Editar Veterinario" : "Registrar Veterinario"}
            </h2>

            <form onSubmit={guardarVeterinario} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <label className="block text-gray-600 font-medium mb-1">Nombre</label>
                <input
                  required
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 border-violet-200 focus:outline-violet-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">Apellido</label>
                <input
                  required
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 border-violet-200 focus:outline-violet-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">DNI</label>
                <input
                  required
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 border-violet-200 focus:outline-violet-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">Teléfono</label>
                <input
                  required
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
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
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 border-violet-200 focus:outline-violet-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-gray-600 font-medium mb-1">Dirección</label>
                <input
                  required
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 border-violet-200 focus:outline-violet-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">Matrícula</label>
                <input
                  required
                  name="matricula"
                  value={formData.matricula}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 border-violet-200 focus:outline-violet-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">Especialidad</label>
                <input
                  required
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleChange}
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
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-semibold"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}