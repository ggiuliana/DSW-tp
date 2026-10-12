function InicioAdministrador() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-plusjakarta text-3xl text-violet-950">Panel de Control</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
          <h2 className="text-sm text-gray-500">Gestión</h2>
          <p className="mt-1 text-lg font-bold text-violet-900">Veterinarios y Personal</p>
        </div>
        <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
          <h2 className="text-sm text-gray-500">Configuración</h2>
          <p className="mt-1 text-lg font-bold text-violet-900">Estudios y Vacunas</p>
        </div>
      </div>
    </div>
  );
}

export default InicioAdministrador;