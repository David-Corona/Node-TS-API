import express, { NextFunction, Request, Response } from 'express';
import { Dialect } from 'sequelize';
import { Sequelize } from "sequelize-typescript";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';

import { ErrorHandler, handleError } from './app/helpers/error';
import routes from './app/routes';

const app = express();
dotenv.config();

// TODO - configure CORS
// app.use(cors()); // this would allow all connections.
var corsOptions = {
    origin: "http://localhost:4200",
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json()); // parse requests of type json (adds req.body)
app.use(cookieParser()); // parse cookies (adds req.cookies)
// app.use(express.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded


// TODO - database.ts
// host: process.env.DB_HOST
const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT as Dialect || 'mysql',
    username: process.env.DB_USER,
    password:  process.env.DB_PASSWORD,
    storage: ":memory:",
    models: [__dirname + "/**/*.model.ts"],
});


sequelize.authenticate().then(async () => {
    console.log('Conectado a la base de datos!');
}).catch((error: any) => {
    console.error('No se ha podido conectar a la base de datos: ', error);
});

app.use('/', routes);

// Error handling - last middleware
const errorHandler = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    handleError(err, res);
};
app.use(errorHandler);


export default app;