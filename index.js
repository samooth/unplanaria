const config = require('./config'),
mongoose = require('mongoose'),
express = require('express'),
app = express(),
bodyParser = require('body-parser'),
router = require('./api');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());

mongoose.connect(config.mongo.url, config.mongo.settings);

app.use('/api', router);

app.listen(config.port, () => {
    console.log('Unplanaria listening on port ' + config.port);
});