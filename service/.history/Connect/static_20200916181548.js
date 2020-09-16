const connect = require('connect');
let static = require('serve-static')
let directory = require('serve-index')
let app = connect()

app.use( directory('sites'))
.use( static('./sites')).listen(3000)