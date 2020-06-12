const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const app = express();
dotenv.config();
const routes = require("../../Routes");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", routes);

module.exports = app;
