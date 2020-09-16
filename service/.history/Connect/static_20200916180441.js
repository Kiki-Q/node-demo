const connect = require('connect');
let static = require('serve-static')

let app = connect()

app.use( static('Connect')).listen(3000)