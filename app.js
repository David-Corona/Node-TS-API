const express = require('express'); 
const Sequelize = require("sequelize");
// const dbConfig = require("./config/config.json"); // TODO
const cors = require("cors");
require('dotenv').config(); // Guardar/cargar variables/credenciales del entorno
var cookieParser = require('cookie-parser');

const usuariosRoutes = require("./routes/usuarios.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

// TODO - configurar CORS
// app.use(cors()); // esto permite todas las conexiones.
var corsOptions = {
    origin: "http://localhost:4200",
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json()); // parse requests de tipo json (añade req.body)
app.use(cookieParser()); // parse cookies (añade req.cookies)
// parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
    }   
);

sequelize.authenticate().then(async () => {
    console.log('Conectado a la base de datos!');
}).catch((error) => {
    console.error('No se ha podido conectar a la base de datos: ', error);
});

app.use("/api/usuarios", usuariosRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;