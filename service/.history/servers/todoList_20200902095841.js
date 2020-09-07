//支持get和post的http服务器
let http = require('http');
let items = [];

let server = http.createServer( (req, res) => {
    if ('/' == req.url) {
        switch (req.method) {
            case 'GET':
                show(res);
                break;
            case 'POST':
                add(req, res);
                break;
            default:
                badRequest(res);
        } 
    }else {
        notFound(res);
    }
});

server.listen(3000);