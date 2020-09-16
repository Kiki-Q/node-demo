let connect = require('connect');
let vhost = require('vhost')

let server = connect()
let app = require('./sites/expressjs.dev')

server.use(vhost('expressjs.dev', app))

server.listen(3000)