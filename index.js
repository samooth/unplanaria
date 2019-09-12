const config = require('./config'),
mongoose = require('mongoose'),
express = require('express'),
app = express(),
unplanaria = require('./controller/unplanaria');

mongoose.connect(config.mongo.url, config.mongo.settings);

app.use('/api', unplanaria);

onReorg = () => {
    //TODO: Change block numbers on reorg    
}

onBlock = () => {
    //TODO: Confirm old TXs when a new block is mined
}

setInterval(() => {
    //checkBlockHeaders();
}, 5000);

unplanaria.listen(config.port, console.log('Unplanaria listening on port ' + config.port));