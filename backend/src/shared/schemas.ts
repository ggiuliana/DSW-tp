import { z } from 'zod'

const requiredText = z.string().trim().min(1)

const personFields = {
  nombre: requiredText,
  apellido: requiredText,
  telefono: requiredText,
  mail: z.string().trim().email(),
  dni: requiredText,
  direccion: requiredText,
}

const nonEmptyPatch = <T extends z.ZodType>(schema: T) =>
  schema.refine((value) => Object.keys(value as object).length > 0, 'Debe enviar al menos un campo')

export const idParams = (key: string) => z.object({
  [key]: z.coerce.number().int().positive(),
})

export const duenioSchema = z.object(personFields)
export const duenioPatchSchema = nonEmptyPatch(duenioSchema.partial())

const mascotaFields = {
  nombre_mascota: requiredText.max(50),
  especie: requiredText.max(30),
  raza: requiredText.max(30),
  castrado: z.boolean(),
  sexo: requiredText.max(1),
  fechaNac: z.string().refine((value) => !Number.isNaN(Date.parse(value)), 'Fecha inválida').transform((value) => new Date(value)),
}

export const mascotaSchema = z.object(mascotaFields)
export const mascotaPatchSchema = nonEmptyPatch(mascotaSchema.partial())

const proveedorFields = {
  nombre_proveedor: requiredText.max(30),
  cuit: requiredText.max(30),
  telefono_proveedor: requiredText,
  mail_proveedor: z.string().trim().email().max(50),
  razon_social: requiredText.max(100),
  direccion_proveedor: requiredText.max(100),
}

export const proveedorSchema = z.object(proveedorFields)
export const proveedorPatchSchema = nonEmptyPatch(proveedorSchema.partial())

const estudioFields = {
  nombre_estudio: requiredText.max(30),
  descripcion_estudio: requiredText.max(200),
  precio_estudio: z.coerce.number().finite().nonnegative(),
}

export const estudioSchema = z.object(estudioFields)
export const estudioPatchSchema = nonEmptyPatch(estudioSchema.partial())

const medicamentoFields = {
  nombre_medicamento: requiredText.max(30),
  cantidad_restante: z.coerce.number().finite().nonnegative(),
  cantidad_minima: z.coerce.number().finite().nonnegative(),
  id_proveedor: z.coerce.number().int().positive(),
}

export const medicamentoSchema = z.object(medicamentoFields)
export const medicamentoPatchSchema = nonEmptyPatch(medicamentoSchema.partial())

const veterinarioFields = {
  ...personFields,
  matricula: requiredText,
  especialidad: requiredText,
}

export const veterinarioSchema = z.object(veterinarioFields)
export const veterinarioPatchSchema = nonEmptyPatch(z.object(veterinarioFields).partial())

const usuarioFields = {
  nombre_usuario: requiredText,
  contrasenia: requiredText,
  estado: requiredText,
}

export const usuarioSchema = z.object(usuarioFields)
export const usuarioPatchSchema = nonEmptyPatch(z.object(usuarioFields).partial())

export const loginSchema = z.object({
  nombre_usuario: requiredText,
  contrasenia: requiredText,
})

export const cambioContraseniaSchema = z.object({
  currentPassword: requiredText,
  newPassword: requiredText,
})

export const registroDuenioSchema = z.object({
  ...personFields,
  nombre_usuario: requiredText,
  contrasenia: requiredText,
})

export const registroVeterinarioSchema = z.object({
  ...personFields,
  nombre_usuario: requiredText,
  contrasenia: requiredText,
  matricula: requiredText,
  especialidad: requiredText,
})