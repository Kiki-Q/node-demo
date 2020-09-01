let http = require('http');
let server = http.createServer();
server.on('request',(req,res)=>{
    res.writeHead('200',{'Content-Type':'text/plain'});
    res.end('Hello World11\n');
})

server.listen(8000);
