// Author JG
const express = require("express");
const router = express.Router();

router.get("/", async (req,res) => {
    res.render("users/mainPage");
});

module.exports = router;