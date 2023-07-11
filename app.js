const express = require('express'); 
const app = express(); // ejecuta el paquete como una funcion y devuelve una app de express
const mysql = require('mysql2');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Enero100190!",
    // database: "DBname"
});
  
connection.connect(function(err) {
    if (err) throw err;
    console.log("Conectado a BBDD");
});

// Middleware
app.use((req, res, next) => {
    console.log("In Middleware");
    next();
});

app.use((req, res, next) => {
    res.send("Hello testing")
});

module.exports = app; // exporta app + middlewares