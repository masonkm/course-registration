// Author: Kenneth Mason

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const configRoutes = require("./database/routes");
const path = require('path');
const exphbs = require("express-handlebars");// JG add 


app.use(bodyParser.json());

app.get("/", (req,res) => {
  res.sendFile(path.resolve(__dirname, "client", "index.html"));
});

// added by JG START
const static = express.static(__dirname + "/public");
app.use("/public",static);
app.use(bodyParser.urlencoded());
app.engine("handlebars",exphbs({defaultLayout: "main"}));
app.set("view engine","handlebars");
// added by JG END



configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
