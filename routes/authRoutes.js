const express = require('express');
const authController = require('../controllers/authController');

const authRouter = express.Router();

authRouter.post('/login', authController.login);
authRouter.post('/logout', authController.logout);
authRouter.post('/register', authController.register);
module.exports = authRouter;