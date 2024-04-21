import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes, Dialect } from 'sequelize';
import { databaseConfig } from '../../database'; // Assuming you have a database.ts with DatabaseConfig interface exported
import { ModelStatic } from 'sequelize/types';

const env = process.env.NODE_ENV || 'development';
const config = databaseConfig[env];
const basename = path.basename(__filename);

// const config: any = require('../../database'); // :DatabaseConfig
const db: any = {};

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const process = require('process');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require('../../database.ts')[env]; 
// const db = {};

let sequelize: Sequelize;;
// if (config.use_env_variable) {
//   // sequelize = new Sequelize(process.env[config.use_env_variable], config);
//   const uri = process.env[config.use_env_variable];
//   if (!uri) {
//     throw new Error(`Environment variable ${config.use_env_variable} is not set.`);
//   }
//   sequelize = new Sequelize(uri, { dialect: config.dialect });
// } else {
  sequelize = new Sequelize(
    config.database, 
    config.username, 
    config.password, 
    {
      host: 'localhost',
      dialect: config.dialect as Dialect
    }
  );
// }

// Importa todos los modelos => => db.Usuario = require("./Usuario.ts")(sequelize, Sequelize);
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.ts' &&
      file.indexOf('.test.ts') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes) ; //as ModelStatic<any>
    // const model = require(path.join(__dirname, file)).default(sequelize, DataTypes); // Using default import
    // const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model; //putting model into array
  });

// Añade todas las relaciones
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// module.exports = db;
export default db;