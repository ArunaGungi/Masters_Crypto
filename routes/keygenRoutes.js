const express = require('express');
const keygenController = require('../controllers/keygenController');

const keygenRouter = express.Router();

keygenRouter.post('/validateSecretKey', keygenController.validateSecretKey);
keygenRouter.get('/exchangePublicKeys', keygenController.exchangePublicKeys);

module.exports = keygenRouter;