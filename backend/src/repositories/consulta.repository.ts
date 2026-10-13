import { Consulta } from '../entities/consulta.entity.js'
import { orm } from '../configs/db/orm.js'

const em = orm.em;
type ConsultaCreateData = Pick<Consulta,  'diagnostico' | 'tratamiento' | 'peso' | 'observaciones' | 'turno'>;


export class ConsultaRepository {
    findAll(){
        return em.find(Consulta, {}, { populate: ['estudios', 'medicamentosUsados', 'medicamentosUsados.medicamento', 'turno', 'turno.mascota', 'turno.veterinario'] });
    }

    findById(id: number){
        return em.findOne(Consulta, { id_consulta: id }, { populate: ['estudios', 'medicamentosUsados', 'medicamentosUsados.medicamento', 'turno', 'turno.mascota', 'turno.veterinario'] });
    }

    findByDuenioId(idDuenio: number) {
        return em.find(Consulta, {
            turno: { mascota: { duenio: { id_persona: idDuenio } } },
        }, { populate: ['estudios', 'turno', 'turno.mascota', 'turno.veterinario'] });
    }

    add(data: ConsultaCreateData){
        const consulta = new Consulta();
        Object.assign(consulta, data);
        em.persist(consulta);
        return consulta;
    }

    async save(consulta: Consulta){
        await em.flush();
        return consulta;
    }

    async remove(consulta: Consulta){
        await em.removeAndFlush(consulta);
        return consulta;
    }
};

export const consultaRepository = new ConsultaRepository(); 

