const config = require('./config'),
mongoose = require('mongoose'),
express = require('express'),
app = express(),
router = require('./api');

mongoose.connect(config.mongo.url, config.mongo.settings);

app.use('/api', router);

app.listen(config.port, () => {
    console.log('Unplanaria listening on port ' + config.port);
});