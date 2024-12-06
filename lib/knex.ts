import knex from 'knex';
import config from './knexfile';

const sealdrive = knex(config.sealdrive);


const dbMap = { sealdrive };

export const getDb = (dbName: string) => {
    return dbMap[dbName as keyof typeof dbMap];
}

