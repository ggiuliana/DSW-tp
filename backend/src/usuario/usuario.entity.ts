import {Entity, PrimaryKey, Property, OneToOne, ManyToOne} from "@mikro-orm/core"
import {Persona} from "../persona/persona.entity.js"
import {Rol} from "../rol/rol.entity.js"

@Entity()
export class Usuario {

    @PrimaryKey({autoincrement: true})
    id_usuario?: number

    @Property({ unique: true })
    nombre_usuario!: string
    
    @Property()
    contrasenia!: string

    @Property()
    estado!: string

    @Property({ onCreate: () => new Date() })
    fecha_alta?: Date

    @OneToOne(() => Persona, {nullable: true, onDelete: 'cascade'})
    persona?: Persona

    @ManyToOne(() => Rol, {nullable: true, onDelete: "set null"})
    rol?: Rol;
}