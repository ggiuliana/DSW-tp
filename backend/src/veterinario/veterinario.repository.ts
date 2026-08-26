import { Veterinario } from './veterinario.entity.js'
import { Persona } from '../persona/persona.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em
type VeterinarioCreateData = Pick<Veterinario, 'nombre' | 'apellido' | 'telefono' | 'mail' | 'dni' | 'direccion' | 'matricula' | 'especialidad'>

export class VeterinarioRepository {
  findAll() {
    return em.find(Veterinario, {})
  }

  findById(id: number) {
    return em.findOne(Veterinario, { id_persona: id })
  }

  findByMail(mail: string) {
    return em.findOne(Veterinario, { mail })
  }

  findPersonaByMail(mail: string) {
    return em.findOne(Persona, { mail })
  }

  create(data: VeterinarioCreateData) {
    const veterinario = new Veterinario()
    Object.assign(veterinario, data)
    em.persist(veterinario)
    return veterinario
  }

  async save(veterinario: Veterinario) {
    await em.flush()
    return veterinario
  }

  async remove(veterinario: Veterinario) {
    await em.removeAndFlush(veterinario)
    return veterinario
  }
}

export const veterinarioRepository = new VeterinarioRepository()
