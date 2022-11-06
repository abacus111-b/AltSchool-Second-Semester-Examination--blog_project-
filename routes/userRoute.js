const router = require('express').Router();
// const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// http://localhost:4000/register/
router.post('/register', authController.createUser);
router.post('/login', authController.loginUser);

router.route('/');

module.exports = router;
