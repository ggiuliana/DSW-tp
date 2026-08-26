import { EntityManager } from '@mikro-orm/core'
import { orm } from '../shared/db/orm.js'
import { Duenio } from '../duenio/duenio.entity.js'
import { Persona } from '../persona/persona.entity.js'
import { Rol } from '../rol/rol.entity.js'
import { Veterinario } from '../veterinario/veterinario.entity.js'
import { Usuario } from './usuario.entity.js'

const em = orm.em

type UsuarioCreateData = Pick<Usuario, 'nombre_usuario' | 'contrasenia' | 'estado' | 'persona' | 'rol'>
type DuenioCreateData = Pick<Duenio, 'nombre' | 'apellido' | 'telefono' | 'mail' | 'dni' | 'direccion'>
type VeterinarioCreateData = Pick<Veterinario, 'nombre' | 'apellido' | 'telefono' | 'mail' | 'dni' | 'direccion' | 'matricula' | 'especialidad'>

export class UsuarioRepository {
  findAll() {
    return em.find(Usuario, {})
  }

  findById(id: number) {
    return em.findOne(Usuario, { id_usuario: id })
  }

  findByNombre(nombre_usuario: string) {
    return em.findOne(Usuario, { nombre_usuario }, { populate: ['rol', 'persona'] })
  }

  findPersonaByMail(mail: string) {
    return em.findOne(Persona, { mail })
  }

  findByPersona(persona: Persona) {
    return em.findOne(Usuario, { persona })
  }

  findPersonaById(id: number) {
    return em.findOne(Persona, { id_persona: id })
  }

  findRolByNombre(nombre_rol: string) {
    return em.findOne(Rol, { nombre_rol })
  }

  create(data: UsuarioCreateData) {
    const usuario = em.create(Usuario, data)
    em.persist(usuario)
    return usuario
  }

  createDuenio(data: DuenioCreateData, manager: EntityManager = em) {
    return manager.create(Duenio, data)
  }

  async save(usuario: Usuario) {
    await em.flush()
    return usuario
  }

  async remove(usuario: Usuario) {
    await em.removeAndFlush(usuario)
    return usuario
  }

  async registerDuenio(
    duenioData: DuenioCreateData,
    usuarioData: Pick<Usuario, 'nombre_usuario' | 'contrasenia' | 'estado'>,
    rol: Rol,
  ) {
    return em.transactional(async (transactionEm) => {
      const persona = transactionEm.create(Duenio, duenioData)
      const usuario = transactionEm.create(Usuario, {
        ...usuarioData,
        persona,
        rol,
      })
      await transactionEm.flush()
      return usuario
    })
  }

  async registerVeterinario(
    veterinarioData: VeterinarioCreateData,
    usuarioData: Pick<Usuario, 'nombre_usuario' | 'contrasenia' | 'estado'>,
    rol: Rol,
  ) {
    return em.transactional(async (transactionEm) => {
      const persona = transactionEm.create(Veterinario, veterinarioData)
      const usuario = transactionEm.create(Usuario, {
        ...usuarioData,
        persona,
        rol,
      })
      await transactionEm.flush()
      return usuario
    })
  }
}

export const usuarioRepository = new UsuarioRepository()
