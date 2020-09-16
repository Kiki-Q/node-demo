let connect = require('connect');
let vhost = require('vhost')

let server = connect()

let app = require('./sites/expressjs.dev')
server.use(vhost('expressjs.dev', app))

let app2 = require('./sites/learnboost.dev')
server.use(vhost('learnboost.dev', app2))

server.listen(3000)