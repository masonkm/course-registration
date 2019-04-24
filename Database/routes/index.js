// Author: Kenneth Mason

const studentRoutes = require("./students");
const courseRoutes = require("./courses");
const express = require("express");
const app = express();

const constructorMethod = app => {
  app.use("/students", studentRoutes);
  app.use("/courses", courseRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

constructorMethod(app);
module.exports = constructorMethod;
