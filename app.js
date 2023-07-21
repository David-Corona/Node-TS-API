const express = require('express'); 
const app = express(); // ejecuta el paquete como una funcion y devuelve una app de express
// const mysql = require('mysql2'); // TODO: necesario teniendo sequelize?
const Sequelize = require("sequelize");
// const dbConfig = require("./config/config.json"); // TODO
const cors = require("cors");
require('dotenv').config(); // Guardar/cargar variables/credenciales del entorno

const usuariosRoutes = require("./routes/usuarios.routes");
const authRoutes = require("./routes/auth.routes");

app.use(cors()); // TODO, esto permite todas las conexiones.
// var corsOptions = {
//     origin: "https://localhost:3000"
// };
// app.use(cors(corsOptions));

app.use(express.json()); // parse requests de tipo json
// parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));

// TODO: Implementar distintos ENVs
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT
    }
);

sequelize.authenticate().then(() => {
    console.log('Conectado a la base de datos!');
}).catch((error) => {
    console.error('No se ha podido conectar a la base de datos: ', error);
});
  
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;