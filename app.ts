// import { RequestHandler } from "express";

import express from 'express';
import { Dialect } from 'sequelize';
import { Sequelize } from "sequelize-typescript";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';

import { handleError } from './app/helpers/error';
import routes from './app/routes';

// const express = require('express'); 
// const Sequelize = require("sequelize");
// // const dbConfig = require("./config/config.json"); // TODO
// const cors = require("cors");
// require('dotenv').config(); // Guardar/cargar variables/credenciales del entorno
// var cookieParser = require('cookie-parser');
// const { handleError } = require('./app/helpers/error')

// // const usuariosRoutes = require("./app/routes/user/usuarios.routes");
// // const authRoutes = require("./app/routes/user/auth.routes");
// const routes = require('./app/routes');

const app = express();
dotenv.config();

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


// TODO - database.ts
const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT as Dialect || 'mysql',
    username: process.env.DB_USER,
    password:  process.env.DB_PASSWORD,
    storage: ":memory:",
    models: [__dirname + "/**/*.model.ts"],
  });
// const sequelize = new Sequelize(
//     process.env.DB_NAME || '',
//     process.env.DB_USER || '',
//     process.env.DB_PASSWORD || '',
//     {
//         host: process.env.DB_HOST || '',
//         dialect: process.env.DB_DIALECT as Dialect || 'mysql',
//     }   
// );

sequelize.authenticate().then(async () => {
    console.log('Conectado a la base de datos!');
}).catch((error: any) => {
    console.error('No se ha podido conectar a la base de datos: ', error);
});

// app.use("/api/usuarios", usuariosRoutes);
// app.use("/api/auth", authRoutes);
app.use('/', routes);

// Error handling - last middleware
const errorHandler: any = (err: any, req: any, res: any, next: any) => { // TODO
    handleError(err, res);
};
app.use(errorHandler);
// app.use((err, req, res, next) => {
//     handleError(err, res);
// });


// module.exports = app;
export default app;