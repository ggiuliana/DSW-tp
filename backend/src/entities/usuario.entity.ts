import {Entity, PrimaryKey, Property, OneToOne, ManyToOne} from "@mikro-orm/core"
import {Persona} from "./persona.entity.js"
import {Grupo_Permiso} from "./grupo_permiso.entity.js"

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

    @ManyToOne(() => Grupo_Permiso, {nullable: true, onDelete: "set null"})
    grupo?: Grupo_Permiso;
}