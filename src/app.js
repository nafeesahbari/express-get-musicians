const express = require("express");
const app = express();
const Musician = require("../models/index")
const { db } = require("../db/connection")
const port = 3000;
const userRouter = require('../routes/musicians');

app.use(express.json()); // Parse JSON request bodies
app.use("/users", userRouter); // Router

module.exports = app;