// require('dotenv').config();
import { config } from 'dotenv';
config();

interface DatabaseConfig {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: string;
    // use_env_variable?: string;
  }

const databaseConfig: { [key: string]: DatabaseConfig } = {
    development: {
        username: process.env.DB_USER || '',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || '',
        host: process.env.DB_HOST || '',
        dialect: process.env.DB_DIALECT || ''
    },
    // test: {
    //     username: process.env.DB_USER,
    //     password: process.env.DB_PASSWORD,
    //     database: process.env.DB_NAME,
    //     host: process.env.DB_HOST,
    //     dialect: process.env.DB_DIALECT
    // },
    // production: {
    //     username: process.env.DB_USER,
    //     password: process.env.DB_PASSWORD,
    //     database: process.env.DB_NAME,
    //     host: process.env.DB_HOST,
    //     dialect: process.env.DB_DIALECT
    // }
}; 

export { databaseConfig, DatabaseConfig };