const mongoose = require('mongoose');

const txSchema = mongoose.Schema({
    txid: {
        type: String,
        required: true
    },
    confirmed: Number,
    body: Object,
    created: Date,
    modified: Date
});

txSchema.pre('save', async function (next) {
    const tx = this
    let d = new Date();
    if(!tx.created){
        tx.created = d;
    }
    tx.modified = d;
    next();
});

const TX = mongoose.model('TX', txSchema);

module.exports = TX;