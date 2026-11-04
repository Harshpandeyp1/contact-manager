const express = require("express");
const UserController = require("../controllers/UserController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/current", validateToken, UserController.currentUser);

module.exports = router;