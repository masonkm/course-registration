// Author: Kenneth Mason

const express = require("express");
const bodyParser = require("body-parser");
const cookie = require('cookie-parser');
const app = express();
const configRoutes = require("./database/routes");
const session = require('express-session');
const exphbs = require("express-handlebars");// JG add 
const Handlebars = require("handlebars");

const handlebarsInstance = exphbs.create({
    defaultLayout: "main",
    // Specify helpers which are only registered on this instance.
    helpers: {
        asJSON: (obj, spacing) => {
            if (typeof spacing === "number")
                return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

            return new Handlebars.SafeString(JSON.stringify(obj));
        }
    }
});

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    // If the user posts to the server with a property called _method, rewrite the request's method
    // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
    // rewritten in this middleware to a PUT route
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }

    // let the next middleware run:
    next();
};

// added by JG START
const static = express.static(__dirname + "/public");
app.use(cookie());
app.use("/public",static);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(rewriteUnsupportedBrowserMethods);
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.engine("handlebars",exphbs({defaultLayout: "main"}));
app.set("view engine","handlebars");
// added by JG END



configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");

  if (process && process.send) process.send({ done: true }); 
});
