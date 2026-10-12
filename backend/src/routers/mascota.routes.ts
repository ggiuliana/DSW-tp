import { Router } from 'express'
import { findAll, findOne, findByDuenio, add, update, patch, remove } from '../controllers/mascota.controler.js'
import { validate, validateParams } from '../middlewares/validation.js'
import { verificarToken } from '../middlewares/auth.middleware.js'
import { idParams, mascotaPatchSchema, mascotaSchema } from '../configs/schemas.js'

export const mascotaRouter = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Mascota:
 *       type: object
 *       required:
 *         - nombre_mascota
 *         - especie
 *         - raza
 *         - castrado
 *         - sexo
 *         - fechaNac
 *       properties:
 *         nombre_mascota:
 *           type: string
 *           maxLength: 50
 *           description: Nombre de la mascota
 *           example: "Firulais"
 *         especie:
 *           type: string
 *           maxLength: 30
 *           description: Especie (ej. Perro, Gato)
 *           example: "Perro"
 *         raza:
 *           type: string
 *           maxLength: 30
 *           description: Raza de la mascota
 *           example: "Mestizo"
 *         castrado:
 *           type: boolean
 *           description: Indica si la mascota está castrada
 *           example: true
 *         sexo:
 *           type: string
 *           maxLength: 1
 *           description: Sexo de la mascota (ej. M o H)
 *           example: "M"
 *         fechaNac:
 *           type: string
 *           format: date
 *           description: Fecha de nacimiento válida
 *           example: "2022-04-15"
 *         vacunas:
 *           type: array
 *           description: Lista de vacunas aplicadas (Opcional)
 *           items:
 *             type: object
 *             required:
 *               - id_tipo_vacuna
 *               - fecha_aplicacion
 *             properties:
 *               id_tipo_vacuna:
 *                 type: integer
 *                 minimum: 1
 *                 description: ID numérico positivo del tipo de vacuna
 *                 example: 3
 *               fecha_aplicacion:
 *                 type: string
 *                 format: date
 *                 description: Fecha de aplicación (ISO)
 *                 example: "2023-08-20"
 */
/**
 * @swagger
 * /api/mascota:
 *   get:
 *     summary: Obtiene la lista de todas las mascotas
 *     tags: [Mascotas]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mascotas devuelta exitosamente
 */
mascotaRouter.get('/', verificarToken(['mascotas:Leer']), findAll)
/**
 * @swagger
 * /api/mascota/{id_mascota}:
 *   get:
 *     summary: Obtiene una mascota por su ID
 *     tags: [Mascotas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_mascota
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mascota encontrada
 *       401:
 *         description: Token requerido o inválido
 */
mascotaRouter.get('/:id_mascota', verificarToken(['mascotas:Leer']), validateParams(idParams('id_mascota')), findOne)
/**
 * @swagger
 * /api/mascota/duenio/{id_duenio}:
 *   get:
 *     summary: Obtiene las mascotas de un dueño
 *     tags: [Mascotas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_duenio
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mascotas del dueño encontradas
 *       401:
 *         description: Token requerido o inválido
 */
mascotaRouter.get('/duenio/:id_duenio', verificarToken(['mascotas:Leer']), validateParams(idParams('id_duenio')), findByDuenio)
mascotaRouter.post('/duenio/:id_duenio', verificarToken(['mascotas:Agregar']), validateParams(idParams('id_duenio')), validate(mascotaSchema), add)
mascotaRouter.put('/:id_mascota', verificarToken(['mascotas:Actualizar']), validateParams(idParams('id_mascota')), validate(mascotaSchema), update)
mascotaRouter.patch('/:id_mascota', verificarToken(['mascotas:Actualizar']), validateParams(idParams('id_mascota')), validate(mascotaPatchSchema), patch)
mascotaRouter.delete('/:id_mascota', verificarToken(['mascotas:Eliminar']), validateParams(idParams('id_mascota')), remove)