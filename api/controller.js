TX = require('../models/tx'),
config = require('../config'),
axios = require('axios'),
bsv = require('bsv'),
Transaction = bsv.Transaction;
let broadcastChannel = config.channels[0];

module.exports = {
    sendTx: async (req, res) => {
        try {        
            const tx = new Transaction(req.body);
            const r = (tx.isValidSignature()) ? await onSigned(tx) : await onUnsigned(tx);
            return res.send(r);
        } catch(e){
            console.log(e);
            res.send({error: e}).status(500);
        }
    },

    getTx: async (req, res) => {
        try {
            const tx = await TX.findOne({ txid: req.params.txid });
            res.send(tx);
        } catch(e) {
            console.log(e);
            res.send({error: e}).status(500);
        }
    },

    onSigned: async (tx) => {
        //If the TX is signed, do X.
        let txObject = tx.toObject();
        let txSerialized = tx.serialize();
        let newTx = new TX({
            confirmed: false,
            hash: txObject.hash,
            raw: txSerialized,
            object: txObject,
            sent: false
        });
        //Save to capture TX in case broadcast fails
        let savedTx = await newTx.save();
        try {
            let broadcast = await axios.post(broadcastChannel.url, broadcastChannel.format(serialized));
            savedTx.sent = true;
            let savedTx = await savedTx.save();
            return savedTx;
        } catch(e){
            throw e;
        }
    }

    // TODO: Unsigned txs 
    // onUnsigned: async (tx) => {
    //     try {
    //         tx.sign(config.privateKey);
    //         return await onSigned(tx);
    //     } catch(e){
    //         throw e;
    //     }
    // }
}