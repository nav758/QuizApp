const express  = require("express");
const router  = express.Router();

const authController = require("../controller/user");

router.post("/signup", authController.createUser);
router.post("/login", authController.loginUser);


module.exports = router