import { MikroORM } from '@mikro-orm/core'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'

export const orm = await MikroORM.init({
    entities: ["dist/**/*.entity.js"],
    entitiesTs: ["src/**/*.entity.ts"],
    dbName: 'veterinaria',
    clientUrl: 'mysql://vet:vet@localhost:3307/veterinaria',
    type: "mysql",
    highlighter: new SqlHighlighter(),
    debug: true,
    schemaGenerator: {
        disableForeignKeys: false,
        createForeignKeyConstraints: true,
        ignoreSchema:[],
    },
})

export const syncSchema = async () => {
    const generator = orm.getSchemaGenerator()
    await generator.updateSchema()
}