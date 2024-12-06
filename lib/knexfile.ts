import type { Knex } from 'knex';

interface KnexConfig {
    [key: string]: Knex.Config;
}

const config: KnexConfig = {
    sealdrive: {
        client: 'pg',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        },
        pool: { min: 2, max: 10 }
    },
};

export default config;

