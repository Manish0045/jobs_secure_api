const router = require('express').Router();

router
    .get("/", (req, res) => {
        res.send("Get User")
    })
    .post("/", (req, res) => {
        res.send("Create User");
    })

module.exports = router
