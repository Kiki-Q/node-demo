let http = require('http');

module.exports = http.createServer( (req, res) => {
    res.end('hello from learnboost.com\n')
})