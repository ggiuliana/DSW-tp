import { Duenio } from './duenio.entity.js';
import { orm } from '../shared/db/orm.js';
const em = orm.em;
async function findAll(req, res) {
    try {
        const duenios = await em.find(Duenio, {});
        res.status(200).json({ message: "Duenios found", data: duenios });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
async function findOne(req, res) {
    try {
        const duenio = await em.findOne(Duenio, { id_duenio: parseInt(req.params.id_duenio) });
        if (!duenio) {
            return res.status(404).json({ message: "Duenio not found" });
        }
        res.status(200).json({ message: "Duenio found", data: duenio });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
async function add(req, res) {
    const { nombre_duenio, apellido_duenio, telefono_duenio, mail_duenio, dni, direccion } = req.body;
    const duenio = em.create(Duenio, {
        nombre_duenio,
        apellido_duenio,
        telefono_duenio,
        mail_duenio,
        dni,
        direccion
    });
    await em.flush();
    res.status(201).json({ message: "Duenio created", data: duenio });
}
async function update(req, res) {
    const { nombre_duenio, apellido_duenio, telefono_duenio, mail_duenio, dni, direccion } = req.body;
    const duenio = await em.findOne(Duenio, { id_duenio: parseInt(req.params.id_duenio) });
    if (!duenio) {
        return res.status(404).json({ message: "Duenio not found" });
    }
    em.assign(duenio, {
        nombre_duenio,
        apellido_duenio,
        telefono_duenio,
        mail_duenio,
        dni,
        direccion
    });
    await em.flush();
    res.status(200).json({ message: "Duenio updated", data: duenio });
}
async function patch(req, res) {
    const duenio = await em.findOne(Duenio, { id_duenio: parseInt(req.params.id_duenio) });
    if (!duenio) {
        return res.status(404).json({ message: "Duenio not found" });
    }
    em.assign(duenio, req.body);
    await em.flush();
    res.status(200).json({ message: "Duenio patched", data: duenio });
}
async function remove(req, res) {
    const duenio = await em.findOne(Duenio, { id_duenio: parseInt(req.params.id_duenio) });
    if (!duenio) {
        return res.status(404).json({ message: "Duenio not found" });
    }
    await em.remove(duenio);
    await em.flush();
    res.status(200).json({ message: "Duenio removed", data: duenio });
}
export { findAll, findOne, add, update, patch, remove };
//# sourceMappingURL=duenio.controler.js.map