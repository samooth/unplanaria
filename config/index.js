module.exports = {
    port: process.env.PORT || 9999,
    mongo: {
        url: process.env.DB_HOST || 'mongodb://localhost/unplanaria'
    },
    channels: [{
        name: 'WhatsOnChain',
        url: 'https://api.whatsonchain.com/v1/bsv/main/tx/raw',
        format: (x) => { return { rawtx: x }; }
    },{
        name: 'Bitails',
        url: 'https://api.bitails.net/tx/broadcast',
        format: (x) => { return { txhex: x }; }
    },{
        name: 'GorillaPool',
        url: 'merchantapi.gorillapool.io/mapi/tx',
        format: (x) => { return { rawtx: x }; }
    }],
    privateKey: 'someprivatekey'
}
