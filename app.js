const express = require('express'); 
const app = express(); // ejecuta el paquete como una funcion y devuelve una app de express
// const mysql = require('mysql2');
const Sequelize = require("sequelize");
// const bodyParser = require("body-parser");
const dbConfig = require("./config/config.json");
const cors = require("cors");

const usuariosRoutes = require("./routes/usuarios.routes");

app.use(cors()); // TODO, esto permite todas las conexiones.
// var corsOptions = {
//     origin: "https://localhost:3000"
// };
// app.use(cors(corsOptions));


// app.use(bodyParser.json()); //mean 
// parse requests of content-type - application/json
// app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));


// TODO: Mover datos a config > dbconfig + implementar ENVs
const sequelize = new Sequelize(
    'juego',
    'root',
    'Enero100190!',
    {
        host: 'localhost',
        dialect: 'mysql'
    }
);

sequelize.authenticate().then(() => {
    console.log('Conectado a la base de datos!');
}).catch((error) => {
    console.error('No se ha podido conectar a la base de datos: ', error);
});
  

// Middleware
app.use((req, res, next) => {
    console.log("In Middleware");
    next();
});

// app.use((req, res, next) => {
//     res.send("Hello testing")
// });

app.use("/api/usuarios", usuariosRoutes);

module.exports = app; // exporta app + middlewares