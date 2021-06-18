var express = require('express');

const { body } = require('express-validator');
var router = express.Router();

const userController = require('../controllers/userController');
const passportJWT = require('../middleware/passportJWT');

/* GET users listing. */
router.get('/', userController.getUser);
// Create Default User From data
router.get('/seed', userController.seedUsers);
// Create Default User From data
router.post('/register', userController.insertUser);
// profile Staff
router.get('/me', [passportJWT.isLogin], userController.me);
// Find User by id
router.get('/:id', userController.findUser);
// Update User
router.put('/:id', userController.updateUser);
// Delete User
router.delete('/:id', userController.deleteUser);
// Login User
router.post('/login', userController.loginUser);
module.exports = router;