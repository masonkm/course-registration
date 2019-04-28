// Author: Kenneth Mason

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const configRoutes = require("./database/routes");
const path = require('path');

app.use(bodyParser.json());

app.get("/", (req,res) => {
  res.sendFile(path.resolve(__dirname, "client", "index.html"));
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
