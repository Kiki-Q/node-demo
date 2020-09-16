const { connect } = require("mongoose");

const connect = require('connect');
// let basicAuth = require('basicAuth')

let app = connect()

app.use(connect.basicAuth('tobi', 'ferret'))
    .use( (req, res) => {
        res.end("i'm a secret\n")
    }).listen(3000)