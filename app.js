//app.js
const express = require("express");
const { swaggerUi, swaggerDocs } = require('./swagger');


require("dotenv").config();
require("./config/database");

const apiRoutes = require("./routes/api");
const webRoutes = require("./routes/web");


const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
});


app.use(express.json());
app.use(express.static("public"));
app.use("/", webRoutes);
app.use("/api", apiRoutes);

module.exports = app;
