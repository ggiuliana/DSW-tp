import { useState } from "react";
import { useForm } from "react-hook-form";
import type { PasswordVeterinarioForm } from "../../types/veterinario.js";
import { usePerfilVeterinario } from "../../hooks/usePerfilVeterinario";

function PerfilVeterinario() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const { perfil, cargando, error, mensaje, usuario, cambiarContrasenia, limpiarMensajes } = usePerfilVeterinario();
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<PasswordVeterinarioForm>();

  const guardarContrasenia = async (data: PasswordVeterinarioForm) => {
    if (await cambiarContrasenia(data)) {
      setMostrarFormulario(false);
      reset();
    }
  };

  if (cargando) return <p className="text-gray-600">Cargando perfil...</p>;
  if (!perfil) return <p role="alert" className="text-red-800">{error || "No se encontró el perfil."}</p>;
  const campos: [string, string][] = [["Teléfono", perfil.telefono], ["Correo electrónico", perfil.mail], ["DNI", perfil.dni], ["Dirección", perfil.direccion], ["Matrícula", perfil.matricula], ["Especialidad", perfil.especialidad]];

  return (
    <section>
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-violet-700">Cuenta profesional</p>
      <h1 className="mb-6 font-plusjakarta text-3xl text-violet-950">Mi perfil</h1>
      {error && <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
      {mensaje && <p role="status" className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{mensaje}</p>}
      <section className="bg-white shadow-sm">
        <div className="border-b border-violet-100 bg-violet-50 px-6 py-5"><p className="text-sm font-semibold text-violet-700">@{usuario?.nombre_usuario}</p><h2 className="mt-1 text-xl font-semibold text-violet-950">{perfil.nombre} {perfil.apellido}</h2><p className="mt-1 text-sm text-gray-600">Información personal de solo lectura</p></div>
        <dl className="grid gap-px bg-violet-100 sm:grid-cols-2">{campos.map(([etiqueta, valor]) => <div key={etiqueta} className="bg-white px-6 py-4"><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{etiqueta}</dt><dd className="mt-1 break-words text-gray-900">{valor}</dd></div>)}</dl>
        <div className="px-6 py-5"><button type="button" onClick={() => { reset(); limpiarMensajes(); setMostrarFormulario((actual) => !actual); }} className="rounded-md border border-violet-300 px-4 py-2 text-sm font-semibold text-violet-800 hover:bg-violet-50">{mostrarFormulario ? "Cancelar" : "Cambiar contraseña"}</button></div>
      </section>
      {mostrarFormulario && <form onSubmit={handleSubmit(guardarContrasenia)} className="mt-5 max-w-xl space-y-4 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-violet-950">Nueva contraseña</h2>
        <label className="block text-sm font-medium text-gray-700">Contraseña actual<input type="password" autoComplete="current-password" {...register("currentPassword", { required: "Ingresa tu contraseña actual." })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
        {errors.currentPassword && <p className="text-sm text-red-700">{errors.currentPassword.message}</p>}
        <label className="block text-sm font-medium text-gray-700">Contraseña nueva<input type="password" autoComplete="new-password" {...register("newPassword", { required: "Ingresa la nueva contraseña.", minLength: { value: 8, message: "Debe tener al menos 8 caracteres." } })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
        {errors.newPassword && <p className="text-sm text-red-700">{errors.newPassword.message}</p>}
        <label className="block text-sm font-medium text-gray-700">Repetir contraseña nueva<input type="password" autoComplete="new-password" {...register("confirmPassword", { required: "Confirma la nueva contraseña.", validate: (valor) => valor === watch("newPassword") || "Las contraseñas no coinciden." })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
        {errors.confirmPassword && <p className="text-sm text-red-700">{errors.confirmPassword.message}</p>}
        <button type="submit" disabled={isSubmitting} className="rounded-md bg-violet-800 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-950 disabled:opacity-60">{isSubmitting ? "Actualizando..." : "Actualizar contraseña"}</button>
      </form>}
    </section>
  );
}

export default PerfilVeterinario;