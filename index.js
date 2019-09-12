const bsv = require('bsv'),
Transaction = bsv.Transaction,
config = require('./config'),
mongoose = require('mongoose'),
express = require('express'),
app = express(),
unplanaria = require('./controller/unplanaria'),
router = express.router();

mongoose.connect(config.mongo.url, config.mongo.settings);
app.use('/api', unplanaria);

onReorg = () => {
    //TODO: Change block numbers on reorg    
}

onBlock = () => {
    //TODO: Confirm old TXs when a new block is mined
}

unplanaria.listen(config.port, console.log('Unplanaria listening on port ' + config.port));