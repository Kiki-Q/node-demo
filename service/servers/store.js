//内存存储
let http = require('http');
let counter = 0;

let server = http.createServer( (req, res) => {
    counter++;
    res.write('i have been accessed' + counter + ' times.');
    res.end();
})

server.listen(8888)