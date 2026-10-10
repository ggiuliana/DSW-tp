import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import { mascotaRouter } from './routers/mascota.routes.js'
import { duenioRouter } from './routers/duenio.routes.js'
import { usuarioRouter } from './routers/usuario.routes.js'
import { proveedorRouter } from './routers/proveedor.routes.js'
import { veterinarioRouter } from './routers/veterinario.routes.js'
import { estudioRouter } from './routers/estudio.routes.js'
import { medicamentoRouter } from './routers/medicamento.routes.js'
import { tipoVacunaRouter } from './routers/tipo_vacuna.routes.js'
import { turnoRouter } from './routers/turno.routes.js'
import { consultaRouter } from './routers/consulta.routes.js'
import { orm, syncSchema } from './configs/db/orm.js'
import { DatabaseSeeder } from './seeders/DatabaseSeeder.js'
import { RequestContext } from '@mikro-orm/core'
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js'

const app = express()

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json())

app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})

app.use('/api/mascota', mascotaRouter)
app.use('/api/duenio', duenioRouter)
app.use('/api/usuario', usuarioRouter)
app.use('/api/veterinario', veterinarioRouter)
app.use('/api/estudio', estudioRouter)
app.use('/api/proveedor', proveedorRouter)
app.use('/api/medicamento', medicamentoRouter)
app.use('/api/tipo_vacuna', tipoVacunaRouter)
app.use('api/turno', turnoRouter)
app.use('/api/consulta', consultaRouter)

app.use(notFoundHandler)
app.use(errorHandler)

await syncSchema()
await orm.getSeeder().seed(DatabaseSeeder)

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})