const express = require("express");

const router = express.Router();
const controller = require("../controller/controller");

router.post("/register", controller.createUser);

module.exports = router;
