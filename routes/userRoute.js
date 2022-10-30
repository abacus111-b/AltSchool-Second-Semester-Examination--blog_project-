const router = require("express").Router();
const userController = require("../controllers/userController");

// http://localhost:4000/register/
router.post("/", userController.createUser);

module.exports = router;
