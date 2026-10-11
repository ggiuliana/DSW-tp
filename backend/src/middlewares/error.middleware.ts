import { ErrorRequestHandler, RequestHandler } from 'express'

type ErrorDefinition = {
  status: number
  message: string
}

const errorDefinitions: Record<string, ErrorDefinition> = {
  USERNAME_ALREADY_REGISTERED: { status: 409, message: 'El nombre de usuario ya está tomado' },
  MAIL_ALREADY_REGISTERED: { status: 409, message: 'El mail ya está registrado' },
  PERSONA_ALREADY_HAS_USER: { status: 409, message: 'La persona ya tiene un usuario' },
  PERSONA_NOT_FOUND: { status: 404, message: 'No se encontró la persona' },
  ROLE_NOT_FOUND: { status: 404, message: 'No se encontró el rol' },
  INVALID_PERSONA_TYPE: { status: 400, message: 'El tipo de persona no es válido' },
  USER_NOT_FOUND: { status: 404, message: 'No se encontró el usuario' },
  INVALID_PASSWORD: { status: 401, message: 'La contraseña es incorrecta' },
  INVALID_CURRENT_PASSWORD: { status: 401, message: 'La contraseña actual es incorrecta' },
  INVALID_EMAIL_FORMAT: { status: 400, message: 'El mail debe tener un formato válido, por ejemplo mail@mail.com' },
  DUENIO_NOT_FOUND: { status: 404, message: 'No se encontró el duenio' },
  ESTUDIO_NOT_FOUND: { status: 404, message: 'No se encontró el estudio' },
  PROVEEDOR_NOT_FOUND: { status: 404, message: 'No se encontró el proveedor' },
  MEDICAMENTO_NOT_FOUND: { status: 404, message: 'No se encontró el medicamento' },
  TURNO_NOT_FOUND: { status: 404, message: 'No se encontró el turno' },
  CONSULTA_NOT_FOUND: { status: 404, message: 'No se encontró la consulta' },
  TIPO_VACUNA_NOT_FOUND: { status: 404, message: 'No se encontró el tipo de vacuna' },
  MASCOTA_NOT_FOUND: { status: 404, message: 'No se encontró la mascota' },
  VETERINARIO_NOT_FOUND: { status: 404, message: 'No se encontró el veterinario' },
  TURNO_INVALID_DATE: { status: 400, message: 'La fecha del turno no es válida' },
  TURNO_INVALID_WEEKDAY: { status: 400, message: 'Solo se pueden crear turnos de lunes a sábado' },
  TURNO_INVALID_TIME: { status: 400, message: 'El horario debe estar entre las 09:00 y las 19:00, en intervalos de 45 minutos' },
  TURNO_MINIMUM_INTERVAL: { status: 409, message: 'Debe haber al menos 45 minutos entre turnos del mismo día' },
  TURNO_NOT_AVAILABLE: { status: 409, message: 'Solo se pueden borrar turnos pendientes que no tengan una mascota asignada' },
  TURNO_NOT_PENDING: { status: 409, message: 'El turno ya no está disponible para otorgar' },
  TURNO_OWNER_PROFILE_NOT_FOUND: { status: 404, message: 'No se encontró el perfil del dueño autenticado' },
  MASCOTA_NOT_OWNED: { status: 403, message: 'Solo puedes sacar turnos para tus propias mascotas' },
  TURNOS_USE_BOOKING_ROUTE: { status: 403, message: 'Usa la acción de sacar turno para asignar una mascota' },
  TURNOS_OWNER_ONLY: { status: 403, message: 'Solo un dueño puede sacar un turno' },
  TURNOS_STATUS_FORBIDDEN: { status: 403, message: 'El veterinario no puede modificar el estado de los turnos' },
  CONSULTA_TURNO_NOT_CONFIRMED: { status: 409, message: 'Solo se pueden registrar consultas para turnos confirmados' },
  REQUIRED_PASSWORDS: { status: 400, message: 'La contraseña actual y la nueva son requeridas' },
  REQUIRED_LOGIN: { status: 400, message: 'Usuario y contraseña son requeridos' },
}

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ message: 'Resource not found' })
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (res.headersSent) return

  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({ message: 'El cuerpo de la solicitud no es un JSON válido' })
    return
  }

  const code = error instanceof Error ? error.message : ''
  const definition = errorDefinitions[code]
  if (definition) {
    res.status(definition.status).json({ message: definition.message })
    return
  }

  console.error(error)
  res.status(500).json({ message: 'Error interno del servidor' })
}