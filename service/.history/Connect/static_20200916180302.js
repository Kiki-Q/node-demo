const connect = require('connect');
let static = require('serve-static')

let app = connect()

app.use( static('sites')).listen(3000)