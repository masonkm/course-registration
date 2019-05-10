const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const auth = require("../data");
const data = auth.authentication;
const app = express();

const studentData = require("../data/students");

var flag=1;
app.use(cookieParser());
app.use(bodyParser.json());

var authenticated = false;
const authenticate = function authenticate(req, res, next) {

    if (req.cookies.name === 'AuthCookie') {
        next();
    }
    else { res.status(403).render("users/login", { title: "ERROR : 403 Forbidden" }) }
};

router.get("/", (req, res) => {
    if (req.cookies.name === 'AuthCookie' && flag==0) {
        res.redirect("/private");
    }
    else {
        app.set("view", "/views");
        res.render('users/login', {title: "Login"});
        flag=0;
    }
});

router.post("/login", async (req, res, next) => {

    let user = req.body.username;
    let password = req.body.password;

    if (user && password) {
        let userCheck = await data.checkUsername(user);
        let passCheck = await data.matchPassword(user, password);

        console.log("Passcheck Status: "+passCheck.status);
        //console.log(passCheck);
        
        if (userCheck === user && passCheck.status === true) {
            flag=0;
            res.cookie('name', 'AuthCookie')
            let user = {
                username: passCheck.studentgo.userName,
                profile: passCheck.studentgo.profile
            }
            req.session.user = user;
            res.redirect("/mainPage")
        }
        else {
            res.render("users/login",
                {
                    title: "Login",
                    message: "Did not provide valid Username/Password",
                    status: false
                }
            )
        }

    }
});

router.get("/mainPage", async (req, res, next) => {
    try{
        let loginUser = req.session.user; // cannot use it because it will not be updated
        //console.log(loginUser);
        const user = await studentData.getByUserName(loginUser.username);
        //console.log(user);
        res.render("users/mainPage",
        {
            user: user.profile,
            title: "Main Page"
        });
    }catch(e){
        res.status(500).json({error:e});
    }
});

router.get("/logout", (req, res, next) => {
    res.clearCookie("name")
    flag=1;
    res.render("users/logout", {title: "Logout"});
});


module.exports = router;
