let connect = require('connect');
let vhost = require('vhost');

let fs = require('fs');

let server = connect()

// let app = require('./sites/expressjs.dev');

// console.log(typeof app)
// server.use(vhost('expressjs.dev', app))

// let app2 = require('./sites/learnboost.dev')
// server.use(vhost('learnboost.dev', app2))

let sites = fs.readFileSync('./sites');

sites.forEach((site)=>{
    console.log(' ... %s', site)
    app.use(vhost(site, require('./sites/' + site)))
})


server.listen(3000)