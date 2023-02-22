const router = require('express').Router();
const userController = require('../controllers/userController');

//Login
router.post('/login', userController.userLogin);
router.get('/login', userController.userLoginHome);
//Register
router.post('/register', userController.userReg);
router.get('/register', userController.userRegHome);
//Logout
router.get('/logout', userController.userLogout);
module.exports = router;