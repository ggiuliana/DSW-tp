import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import VeterinarioFooter from "../components/veterinariofooter";

const API_URL = "http://localhost:3000/api";

interface Mascota {
  id_mascota: number;
  nombre_mascota: string;
  especie: string;
}

interface Turno {
  id_turno: number;
  fecha_turno: string;
  hora_turno: string;
  estado_turno: string;
  observaciones_turno?: string;
  mascota?: Mascota;
  veterinario?: { id_persona: number };
}

interface Consulta {
  id_consulta: number;
  diagnostico: string;
  tratamiento: string;
  peso: number;
  observaciones?: string;
  turno: Turno;
}

interface Veterinario {
  id_persona: number;
  nombre: string;
  apellido: string;
  telefono: string;
  mail: string;
  dni: string;
  direccion: string;
  matricula: string;
  especialidad: string;
}

interface Usuario {
  id_usuario: number;
  nombre_usuario: string;
}

interface ConsultaForm {
  diagnostico: string;
  tratamiento: string;
  peso: number;
  observaciones: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const result = await response.json() as { data?: T; message?: string };
  if (!response.ok) throw new Error(result.message || "No se pudo completar la solicitud.");
  return result.data as T;
}

function fechaLegible(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-AR", { dateStyle: "long" });
}

function PanelVeterinario() {
  const nombre = localStorage.getItem("nombrePersona") || "Profesional";
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;
    const cargar = async () => {
      try {
        const idPersona = Number(localStorage.getItem("idPersona"));
        if (!idPersona) throw new Error("No se encontró el perfil asociado a esta sesión.");
        const [todosLosTurnos, todasLasConsultas] = await Promise.all([
          api<Turno[]>("/turno"),
          api<Consulta[]>("/consulta"),
        ]);
        if (!activo) return;
        const propios = todosLosTurnos.filter((turno) => turno.veterinario?.id_persona === idPersona);
        const idsTurno = new Set(propios.map((turno) => turno.id_turno));
        setTurnos(propios.sort((a, b) => `${a.fecha_turno}T${a.hora_turno}`.localeCompare(`${b.fecha_turno}T${b.hora_turno}`)));
        setConsultas(todasLasConsultas.filter((consulta) => idsTurno.has(consulta.turno?.id_turno)));
      } catch (err) {
        if (activo) setError(err instanceof Error ? err.message : "No se pudieron cargar los datos.");
      } finally {
        if (activo) setCargando(false);
      }
    };
    void cargar();
    return () => { activo = false; };
  }, []);

  const cerrarSesion = () => {
    ["token", "usuario", "nombrePersona", "idPersona"].forEach((key) => localStorage.removeItem(key));
    navigate("/");
  };

  const crearTurnoDisponible = async (fecha_turno: string, hora_turno: string) => {
    setError("");
    try {
      const id_veterinario = Number(localStorage.getItem("idPersona"));
      const turno = await api<Turno>("/turno", {
        method: "POST",
        body: JSON.stringify({ fecha_turno, hora_turno, estado_turno: "Pendiente", id_veterinario }),
      });
      setTurnos((actuales) => [...actuales, turno].sort((a, b) => `${a.fecha_turno}T${a.hora_turno}`.localeCompare(`${b.fecha_turno}T${b.hora_turno}`)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el turno disponible.");
      throw err;
    }
  };

  const borrarTurnoDisponible = async (turno: Turno) => {
    setError("");
    try {
      await api(`/turno/${turno.id_turno}`, { method: "DELETE" });
      setTurnos((actuales) => actuales.filter((item) => item.id_turno !== turno.id_turno));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo borrar el turno disponible.");
    }
  };

  const actualizarConsulta = (consulta: Consulta) => {
    setConsultas((actuales) => {
      const existe = actuales.some((item) => item.id_consulta === consulta.id_consulta);
      return existe ? actuales.map((item) => item.id_consulta === consulta.id_consulta ? consulta : item) : [...actuales, consulta];
    });
  };

  const renderContenido = () => {
    if (cargando) return <p className="text-gray-600">Cargando agenda...</p>;
    if (pathname === "/veterinario/perfil") return <PerfilVeterinario />;
    if (pathname === "/veterinario/consultas") return <ConsultasView turnos={turnos} consultas={consultas} onGuardar={actualizarConsulta} />;
    if (pathname === "/veterinario/turnos") return <TurnosView turnos={turnos} consultas={consultas} onCrear={crearTurnoDisponible} onBorrar={borrarTurnoDisponible} />;
    const ahora = Date.now();
    const confirmadosProximos = turnos.filter((turno) =>
      turno.estado_turno.toLowerCase() === "confirmado" &&
      new Date(`${turno.fecha_turno.slice(0, 10)}T${turno.hora_turno.slice(0, 5)}:00`).getTime() >= ahora
    );
    const hoy = new Date().toLocaleDateString("en-CA");
    const turnosHoy = confirmadosProximos.filter((turno) => turno.fecha_turno.slice(0, 10) === hoy);
    return (
      <section className="space-y-8">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-violet-700">Panel profesional</p>
          <h1 className="font-plusjakarta text-3xl text-violet-950">Hola, {nombre}</h1>
          <p className="mt-2 text-gray-600">Tu agenda y actividad clínica en un solo lugar.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Resumen titulo="Turnos confirmados próximos" valor={confirmadosProximos.length} />
          <Resumen titulo="Confirmados hoy" valor={turnosHoy.length} />
          <Resumen titulo="Consultas registradas" valor={consultas.length} />
        </div>
        <section className="border-t border-violet-200 pt-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-violet-950">Próximos turnos</h2>
            <button type="button" onClick={() => navigate("/veterinario/turnos")} className="text-sm font-semibold text-violet-800 hover:underline">Ver agenda</button>
          </div>
          {confirmadosProximos.length ? <ListaTurnos turnos={confirmadosProximos.slice(0, 4)} consultas={consultas} /> : <p className="bg-white p-6 text-gray-600">No tienes próximos turnos confirmados.</p>}
        </section>
      </section>
    );
  };

  return (
    <main className="min-h-screen bg-purple-50 px-5 pb-28 pt-28 lg:pl-72 lg:pr-10 lg:pb-10">
      <header className="fixed inset-x-0 top-0 z-50 flex h-20 items-center bg-white px-4 py-2 shadow-md">
        <img src="/logoVet.png" alt="Logo de la veterinaria" className="absolute left-1/2 h-14 w-auto -translate-x-1/2 rounded-full object-contain" />
        <button type="button" onClick={cerrarSesion} className="ml-auto rounded-lg border border-violet-200 px-3 py-2 text-sm font-semibold text-violet-800 transition-colors hover:bg-violet-50">Cerrar sesión</button>
      </header>
      <div className="mx-auto w-full max-w-6xl">
        {error && <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
        {renderContenido()}
      </div>
      <VeterinarioFooter />
    </main>
  );
}

function Resumen({ titulo, valor }: { titulo: string; valor: number }) {
  return <div className="border-l-4 border-violet-700 bg-white px-5 py-4 shadow-sm"><p className="text-sm text-gray-600">{titulo}</p><p className="mt-1 text-3xl font-semibold text-violet-950">{valor}</p></div>;
}

function TurnosView({ turnos, consultas, onCrear, onBorrar }: { turnos: Turno[]; consultas: Consulta[]; onCrear: (fecha: string, hora: string) => Promise<void>; onBorrar: (turno: Turno) => void }) {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("09:00");
  const [creando, setCreando] = useState(false);
  const horarios = Array.from({ length: 14 }, (_, index) => {
    const minutos = 9 * 60 + index * 45;
    return `${String(Math.floor(minutos / 60)).padStart(2, "0")}:${String(minutos % 60).padStart(2, "0")}`;
  });

  const crear = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreando(true);
    try {
      await onCrear(fecha, hora);
      setFecha("");
    } catch {
      return;
    } finally {
      setCreando(false);
    }
  };

  return (
    <section>
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-violet-700">Agenda clínica</p>
      <h1 className="mb-6 font-plusjakarta text-3xl text-violet-950">Disponibilidad y turnos</h1>
      <form onSubmit={crear} className="mb-6 flex flex-col gap-4 border-l-4 border-violet-700 bg-white p-5 shadow-sm sm:flex-row sm:items-end">
        <label className="flex-1 text-sm font-medium text-gray-700">Fecha<input type="date" required value={fecha} onChange={(event) => setFecha(event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
        <label className="text-sm font-medium text-gray-700">Horario<select value={hora} onChange={(event) => setHora(event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 sm:w-36">{horarios.map((horario) => <option key={horario} value={horario}>{horario}</option>)}</select></label>
        <button type="submit" disabled={creando || !fecha} className="rounded-md bg-violet-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-950 disabled:cursor-not-allowed disabled:opacity-60">{creando ? "Creando..." : "Agregar disponibilidad"}</button>
      </form>
      <h2 className="mb-3 text-lg font-semibold text-violet-950">Turnos de la agenda</h2>
      {turnos.length ? <ListaTurnos turnos={turnos} consultas={consultas} onBorrar={onBorrar} /> : <p className="bg-white p-6 text-gray-600">No hay turnos ni espacios disponibles.</p>}
    </section>
  );
}

function ListaTurnos({ turnos, consultas, onBorrar }: { turnos: Turno[]; consultas: Consulta[]; onBorrar?: (turno: Turno) => void }) {
  const consultaPorTurno = new Set(consultas.map((consulta) => consulta.turno?.id_turno));
  return (
    <div className="divide-y divide-violet-100 bg-white shadow-sm">
      {turnos.map((turno) => (
        <article key={turno.id_turno} className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="font-semibold text-violet-950">{turno.mascota?.nombre_mascota || "Mascota sin asignar"}<span className="font-normal text-gray-500">{turno.mascota?.especie ? ` · ${turno.mascota.especie}` : ""}</span></p>
            <p className="mt-1 text-sm text-gray-600">{fechaLegible(turno.fecha_turno)} · {turno.hora_turno.slice(0, 5)}</p>
            {turno.observaciones_turno && <p className="mt-1 text-sm text-gray-500">{turno.observaciones_turno}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {consultaPorTurno.has(turno.id_turno) && <span className="text-xs font-semibold text-emerald-700">Consulta registrada</span>}
            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-800">{turno.estado_turno}</span>
            {onBorrar && turno.estado_turno.toLowerCase() === "pendiente" && !turno.mascota && <button type="button" onClick={() => { if (window.confirm("¿Borrar este espacio disponible?")) onBorrar(turno); }} className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">Borrar</button>}
          </div>
        </article>
      ))}
    </div>
  );
}

function ConsultasView({ turnos, consultas, onGuardar }: { turnos: Turno[]; consultas: Consulta[]; onGuardar: (consulta: Consulta) => void }) {
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<number | null>(null);
  const [consultaSeleccionada, setConsultaSeleccionada] = useState<Consulta | null>(null);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ConsultaForm>();
  const turnosConfirmados = turnos.filter((turno) => turno.estado_turno.toLowerCase() === "confirmado");

  const abrirFormulario = (turno: Turno, consulta?: Consulta) => {
    setTurnoSeleccionado(turno.id_turno);
    setConsultaSeleccionada(consulta ?? null);
    setError("");
    reset(consulta ? {
      diagnostico: consulta.diagnostico,
      tratamiento: consulta.tratamiento,
      peso: consulta.peso,
      observaciones: consulta.observaciones || "",
    } : { diagnostico: "", tratamiento: "", peso: undefined, observaciones: "" });
  };

  const guardar = async (data: ConsultaForm) => {
    if (turnoSeleccionado === null) return;
    setGuardando(true);
    setError("");
    try {
      const body = JSON.stringify({ ...data, peso: Number(data.peso), id_turno: turnoSeleccionado });
      const resultado = await api<Consulta>(consultaSeleccionada ? `/consulta/${consultaSeleccionada.id_consulta}` : "/consulta", {
        method: consultaSeleccionada ? "PUT" : "POST",
        body,
      });
      const datos = JSON.parse(body) as Omit<Consulta, "id_consulta" | "turno">;
      const fallback: Consulta = { ...datos, id_consulta: consultaSeleccionada?.id_consulta ?? 0, turno: turnos.find((turno) => turno.id_turno === turnoSeleccionado)! };
      onGuardar({ ...fallback, ...resultado, turno: resultado?.turno ?? fallback.turno });
      setTurnoSeleccionado(null);
      setConsultaSeleccionada(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la consulta.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <section>
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-violet-700">Atención clínica</p>
      <h1 className="mb-6 font-plusjakarta text-3xl text-violet-950">Consultas</h1>
      {error && <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
      <div className="divide-y divide-violet-100 bg-white shadow-sm">
        {turnosConfirmados.map((turno) => {
          const consulta = consultas.find((item) => item.turno?.id_turno === turno.id_turno);
          return <article key={turno.id_turno} className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between">
            <div><p className="font-semibold text-violet-950">{turno.mascota?.nombre_mascota || "Mascota sin asignar"}</p><p className="mt-1 text-sm text-gray-600">{fechaLegible(turno.fecha_turno)} · {turno.hora_turno.slice(0, 5)} · {turno.estado_turno}</p>{consulta && <p className="mt-2 text-sm text-gray-700">{consulta.diagnostico}</p>}</div>
            <button type="button" onClick={() => abrirFormulario(turno, consulta)} className="rounded-md border border-violet-300 px-4 py-2 text-sm font-semibold text-violet-800 hover:bg-violet-50">{consulta ? "Editar consulta" : "Registrar consulta"}</button>
          </article>;
        })}
        {!turnosConfirmados.length && <p className="p-6 text-gray-600">No hay turnos confirmados para registrar consultas.</p>}
      </div>
      {turnoSeleccionado !== null && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
        <form onSubmit={handleSubmit(guardar)} className="my-auto w-full max-w-xl space-y-4 bg-white p-6 shadow-2xl">
          <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-wide text-violet-700">Historia clínica</p><h2 className="mt-1 text-xl font-semibold text-violet-950">{consultaSeleccionada ? "Editar consulta" : "Nueva consulta"}</h2></div><button type="button" aria-label="Cerrar" onClick={() => setTurnoSeleccionado(null)} className="px-2 text-2xl text-gray-500 hover:text-violet-800">×</button></div>
          <label className="block text-sm font-medium text-gray-700">Diagnóstico<input {...register("diagnostico", { required: "El diagnóstico es obligatorio.", maxLength: 100 })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
          {errors.diagnostico && <p className="text-sm text-red-700">{errors.diagnostico.message}</p>}
          <label className="block text-sm font-medium text-gray-700">Tratamiento<input {...register("tratamiento", { required: "El tratamiento es obligatorio.", maxLength: 200 })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
          {errors.tratamiento && <p className="text-sm text-red-700">{errors.tratamiento.message}</p>}
          <label className="block text-sm font-medium text-gray-700">Peso (kg)<input type="number" min="0.01" step="0.01" {...register("peso", { required: "El peso es obligatorio.", valueAsNumber: true, min: { value: 0.01, message: "El peso debe ser mayor a cero." } })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
          {errors.peso && <p className="text-sm text-red-700">{errors.peso.message}</p>}
          <label className="block text-sm font-medium text-gray-700">Observaciones<textarea maxLength={200} {...register("observaciones")} rows={3} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
          <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setTurnoSeleccionado(null)} className="rounded-md border border-gray-300 px-4 py-2 text-sm">Cancelar</button><button type="submit" disabled={guardando} className="rounded-md bg-violet-800 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-950 disabled:opacity-60">{guardando ? "Guardando..." : "Guardar consulta"}</button></div>
        </form>
      </div>}
    </section>
  );
}

function PerfilVeterinario() {
  const [perfil, setPerfil] = useState<Veterinario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null") as Usuario | null;
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<PasswordForm>();

  useEffect(() => {
    const idPersona = localStorage.getItem("idPersona");
    if (!idPersona) {
      setError("No se encontró el perfil asociado a esta sesión.");
      setCargando(false);
      return;
    }
    void api<Veterinario>(`/veterinario/${idPersona}`).then(setPerfil).catch((err: Error) => setError(err.message)).finally(() => setCargando(false));
  }, []);

  const cambiarContrasenia = async (data: PasswordForm) => {
    setError("");
    setMensaje("");
    try {
      await api(`/usuario/cuenta/${usuario?.id_usuario}/contrasenia`, {
        method: "PATCH",
        body: JSON.stringify({ currentPassword: data.currentPassword, newPassword: data.newPassword }),
      });
      setMensaje("La contraseña se actualizó correctamente.");
      setMostrarFormulario(false);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cambiar la contraseña.");
    }
  };

  if (cargando) return <p className="text-gray-600">Cargando perfil...</p>;
  if (!perfil) return <p role="alert" className="text-red-800">{error || "No se encontró el perfil."}</p>;
  const campos: [string, string][] = [["Teléfono", perfil.telefono], ["Correo electrónico", perfil.mail], ["DNI", perfil.dni], ["Dirección", perfil.direccion], ["Matrícula", perfil.matricula], ["Especialidad", perfil.especialidad]];

  return <section>
    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-violet-700">Cuenta profesional</p>
    <h1 className="mb-6 font-plusjakarta text-3xl text-violet-950">Mi perfil</h1>
    {error && <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
    {mensaje && <p role="status" className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{mensaje}</p>}
    <section className="bg-white shadow-sm">
      <div className="border-b border-violet-100 bg-violet-50 px-6 py-5"><p className="text-sm font-semibold text-violet-700">@{usuario?.nombre_usuario}</p><h2 className="mt-1 text-xl font-semibold text-violet-950">{perfil.nombre} {perfil.apellido}</h2><p className="mt-1 text-sm text-gray-600">Información personal de solo lectura</p></div>
      <dl className="grid gap-px bg-violet-100 sm:grid-cols-2">{campos.map(([etiqueta, valor]) => <div key={etiqueta} className="bg-white px-6 py-4"><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{etiqueta}</dt><dd className="mt-1 break-words text-gray-900">{valor}</dd></div>)}</dl>
      <div className="px-6 py-5"><button type="button" onClick={() => { reset(); setError(""); setMensaje(""); setMostrarFormulario((actual) => !actual); }} className="rounded-md border border-violet-300 px-4 py-2 text-sm font-semibold text-violet-800 hover:bg-violet-50">{mostrarFormulario ? "Cancelar" : "Cambiar contraseña"}</button></div>
    </section>
    {mostrarFormulario && <form onSubmit={handleSubmit(cambiarContrasenia)} className="mt-5 max-w-xl space-y-4 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-violet-950">Nueva contraseña</h2>
      <label className="block text-sm font-medium text-gray-700">Contraseña actual<input type="password" autoComplete="current-password" {...register("currentPassword", { required: "Ingresa tu contraseña actual." })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
      {errors.currentPassword && <p className="text-sm text-red-700">{errors.currentPassword.message}</p>}
      <label className="block text-sm font-medium text-gray-700">Contraseña nueva<input type="password" autoComplete="new-password" {...register("newPassword", { required: "Ingresa la nueva contraseña.", minLength: { value: 8, message: "Debe tener al menos 8 caracteres." } })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
      {errors.newPassword && <p className="text-sm text-red-700">{errors.newPassword.message}</p>}
      <label className="block text-sm font-medium text-gray-700">Repetir contraseña nueva<input type="password" autoComplete="new-password" {...register("confirmPassword", { required: "Confirma la nueva contraseña.", validate: (valor) => valor === watch("newPassword") || "Las contraseñas no coinciden." })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
      {errors.confirmPassword && <p className="text-sm text-red-700">{errors.confirmPassword.message}</p>}
      <button type="submit" disabled={isSubmitting} className="rounded-md bg-violet-800 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-950 disabled:opacity-60">{isSubmitting ? "Actualizando..." : "Actualizar contraseña"}</button>
    </form>}
  </section>;
}

export default PanelVeterinario;