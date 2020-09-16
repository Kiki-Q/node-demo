const connect = require('connect');
let basicAuth = require('basic-auth-connect')

let app = connect()

app.use(basicAuth('tobi', 'ferret'))
    .use( (req, res) => {
        res.end("i'm a secret\n")
    }).listen(3000)