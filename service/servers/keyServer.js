//https服务器配置项
let https = require('https');
let fs = require('fs');

let options = {
    key: fs.readFileSync('../key/key.pem'),
    cert: fs.readFileSync('../key/key-cert.pem')
};

https.createServer( options, (req, res) => {
    res.writeHead(200);
    res.end("hello world\n");
}).listen(3000);