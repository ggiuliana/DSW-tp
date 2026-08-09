import { defineConfig } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { SeedManager } from '@mikro-orm/seeder';


export default defineConfig({
    entities: ['./dist/**/*.entity.js'],
    entitiesTs: ['./src/**/*.entity.ts'],

    dbName: 'veterinaria',
    clientUrl: 'mysql://vet:vet@localhost:3307/veterinaria',

    type: 'mysql',

    highlighter: new SqlHighlighter(),

    debug: true,

    schemaGenerator: {
        disableForeignKeys: false,
        createForeignKeyConstraints: true,
        ignoreSchema: [],
    },

    extensions: [
        SeedManager,
    ],

    seeder: {
        path: './dist/seeders',
        pathTs: './src/seeders',
    },
});