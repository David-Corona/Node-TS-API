// import { config } from 'dotenv';
// config();
// import dotenv from "dotenv";
// import { Dialect } from "sequelize";
// dotenv.config()
require('dotenv').config();

// interface DatabaseConfig {
//     username: string;
//     password: string;
//     database: string;
//     host: string;
//     dialect: string;
//     // use_env_variable?: string;
//   }

const config = { //: { [key: string]: DatabaseConfig }
    development: {
        username: process.env.DB_USER || '',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || '',
        host: process.env.DB_HOST || '',
        dialect: process.env.DB_DIALECT || 'mysql'
    }

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

// module.exports = { databaseConfig };
// export { databaseConfig };
// export { databaseConfig, DatabaseConfig };
// export default databaseConfig;
module.exports = config;