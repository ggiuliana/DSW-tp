import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import { personaRouter } from './persona/persona.routes.js'
import { mascotaRouter } from './mascota/mascota.routes.js'
import { duenioRouter } from './duenio/duenio.routes.js'
import { usuarioRouter } from './usuario/usuario.routes.js'
import { veterinarioRouter } from './veterinario/veterinario.routes.js'
import { orm, syncSchema } from './shared/db/orm.js'
import { DatabaseSeeder } from './seeders/DatabaseSeeder.js'
import { RequestContext } from '@mikro-orm/core'

const app = express()

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json())

app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})

app.use('/api/persona', personaRouter)
app.use('/api/mascota', mascotaRouter)
app.use('/api/duenio', duenioRouter)
app.use('/api/usuario', usuarioRouter)
app.use('/api/veterinario', veterinarioRouter)

app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' })
})

await syncSchema()
await orm.getSeeder().seed(DatabaseSeeder)

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})