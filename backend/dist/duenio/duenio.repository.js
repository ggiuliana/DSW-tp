import { pool } from '../shared/db/conn.mysql.js';
export class DuenioRepository {
    async findAll() {
        const [duenios] = await pool.query('select * from duenio');
        return duenios;
    }
    async findOne(item) {
        const id = item.id;
        const [duenios] = await pool.query('select * from duenio where id_duenio = ?', [id]);
        if (duenios.length === 0) {
            return undefined;
        }
        return duenios[0];
    }
    async add(duenioInput) {
        const { id_duenio, ...duenioRow } = duenioInput;
        const [result] = await pool.query('insert into duenio set ?', [duenioRow]);
        duenioInput.id_duenio = result.insertId;
        return duenioInput;
    }
    async update(id, duenioInput) {
        const duenioId = id;
        const { id_duenio, ...duenioRow } = duenioInput;
        await pool.query('update duenio set ? where id_duenio = ?', [duenioRow, duenioId]);
        return await this.findOne({ id });
    }
    async patch(id, duenoInput) {
        const { id_duenio, ...duenioRow } = duenoInput;
        const patchData = Object.fromEntries(Object.entries(duenioRow).filter(([_, value]) => value !== undefined));
        if (Object.keys(patchData).length === 0) {
            return await this.findOne({ id });
        }
        await pool.query('update duenio set ? where id_duenio = ?', [patchData, id]);
        return await this.findOne({ id });
    }
    async delete(item) {
        try {
            const duenioToDelete = await this.findOne(item);
            const duenioId = item.id;
            await pool.query('delete from duenio where id_duenio = ?', [duenioId]);
            return duenioToDelete;
        }
        catch (error) {
            throw new Error('unable to delete duenio');
        }
    }
}
//# sourceMappingURL=duenio.repository.js.map