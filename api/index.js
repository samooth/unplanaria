const express = require('express'),
controller = require('./controller'),
unplanaria = express.Router();

//Unplanaria routes
unplanaria.get('/tx/:txid', controller.getTx);
unplanaria.post('/tx', controller.sendTx);

module.exports = unplanaria;