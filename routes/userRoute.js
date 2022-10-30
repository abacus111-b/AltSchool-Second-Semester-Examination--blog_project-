const router = require("express").Router();
const userController = require("../controllers/userController");

// http://localhost:4000/register/
router.post("", userController.createUser);

// http://localhost:4000/register/revert
router.post("/revert", userController.revertUser);

module.exports = router;
