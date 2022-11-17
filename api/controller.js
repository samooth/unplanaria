TX = require('../models/tx'),
config = require('../config'),
axios = require('axios'),
bsv = require('bsv'),
bitpacket = require('bitpacket'),
Script = bsv.Script,
Transaction = bsv.Transaction;
let broadcastChannel = config.channels[0];

//Endpoint functions
const sendTx = async (req, res) => {
    try {        
        let tx = new Transaction();
        tx.fromString(req.body.rawtx);
        const r = (!tx.toObject().inputs.length) ? await onUnpaid(tx) : await onPaid(tx);
        return res.send(r);
    } catch(e){
        console.log(e);
        res.send({error: e}).status(500);
    }
};

const getTx = async (req, res) => {
    try {
        const tx = await TX.findOne({ hash: req.params.txid });
        res.send(tx);
    } catch(e) {
        console.log(e);
        res.send({error: e}).status(500);
    }
};

//Utility functions

const onPaid = async (tx) => {
    try {
        //Save TX to DB
        let savedTx = await saveTxToDB(tx);
        //Broadcast
        await broadcastTx(tx);
        //Then return saved TX
        return savedTx;
    } catch(e){
        console.log(e);
        throw e;
    }
};

const onUnpaid = async (tx) => {
    try {
        //Save TX to DB to process and broadcast later
        let savedTx = await saveTxToDB(tx);
        //Then return saved TX
        return savedTx;
    } catch(e){
        console.log(e);
        throw e;
    }
};

const fromHex = (h) => {
    var s = ''
    for (var i = 0; i < h.length; i+=2) {
        s += String.fromCharCode(parseInt(h.substr(i, 2), 16))
    }
    return decodeURIComponent(escape(s))
}

const saveTxToDB = async (tx) => {
    obj = tx.toObject();
    let data = Script.fromHex(obj.outputs[0].script)
    .toASM()
    .split("OP_RETURN ")
    .pop()
    .split(" ")
    .map(x => {
        return fromHex(x);
    });
    let newTx = new TX({
        hash: obj.hash,
        raw: tx,
        data: data,
        sent: false
    });
    try {
        let tx = await newTx.save();
        return tx;
    } catch(e){
        throw e;
    }
}
const broadcastTx = async (tx) => {
    try {
        let broadcast = await axios.post(broadcastChannel.url, broadcastChannel.format(tx));
        let { data } = broadcast.data;
        console.log(data);
        return data;
    } catch(e){
        console.log(e);
        throw e;
    }
}

module.exports = {
    onPaid: onPaid,
    onUnpaid: onUnpaid,
    sendTx: sendTx,
    getTx: getTx    
}