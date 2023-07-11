const express = require('express'); 
const app = express(); // ejecuta el paquete como una funcion y devuelve una app de express

// Middleware
app.use((req, res, next) => {
    console.log("Testing Middleware");
    next();
});

app.use((req, res, next) => {
    res.send("Hello testing")
});

module.exports = app; // exporta app + middlewares