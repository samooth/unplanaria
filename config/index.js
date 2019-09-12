module.exports = {
    port: process.env.PORT || 1337,
    mongo: {
        url: process.env.DB_HOST || 'mongodb://localhost/unplanaria',
        settings: {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }
    },
    channels: [{
        name: 'WhatsOnChain',
        url: 'https://api.whatsonchain.com/v1/bsv/main/tx/raw',
        post: (x) => { return { rawtx: x }; }
    }],
    privateKey: 'someprivatekey'
}