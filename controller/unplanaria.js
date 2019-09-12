const express = require('express'),
TX = require('../models/tx'),
config = require('../config'),
axios = require('axios'),
unplanaria = express.router();

//Unplanaria routes
unplanaria.get('/tx/:txid', getTx);
unplanaria.post('/tx', sendTx);
unplanaria.post('/id', sendTx);

//Route functions
sendTx = async (req, res) => {
    try {        
        const tx = new Transaction(req.body);
        const r = (tx.isValidSignature()) ? await onSigned(tx) : await onUnsigned(tx);
        return res.send(r);
    } catch(e){
        console.log(e);
        res.send({error: e}).status(500);
    }
};

getTx = async (req, res) => {
    try {
        const tx = await TX.findOne({ txid: req.params.txid });
        res.send(tx);
    } catch(e) {
        console.log(e);
        res.send({error: e}).status(500);
    }
}

onSigned = async (tx) => {
    //If the TX is signed, do X.
    let serialized = tx.serialize();
    let newTx = new TX({
        confirmed: false,
        txid: tx.txid,
        body: serialized,
        sent: true
    });
    try {
        let broadcast = await axios.post(config.channels[0].url, config.channels[0].post(serialized));
        let savedTx = await newTx.save();
        return savedTx;
    } catch(e){
        return throw e;        
    }
}

onUnsigned = async (tx) => {
    //Add some validation first
    //validate(tx);
    try {
        //TODO: Private key management for signing
        tx.sign(config.privateKey);
        return await onSigned(tx);
    } catch(e){
        throw e;
    }
}

module.exports = unplanaria;