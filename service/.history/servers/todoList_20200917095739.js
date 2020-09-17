//支持get和post的http服务器
let http = require('http');
let items = [];
let qs = require('querystring');

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


//待办事项列表页面的表单和事项列表
function show(res) {
    let html = `<html><head><title>TODO LIST</title></head><body>
                <h1>Todo List</h1>
                <ul>${items.map((item) => {
                    return '<li>'+ item +'</li>'
                }).join('')}</ul>
                <form method="post" action="/">
                <p><input type="text" name="item"/></p>
                <p><input type="submit" name="Add Item"/></p>
                </form></body></html>`;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length',Buffer.byteLength(html));
    res.end(html);
}

function notFound(res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    res.end('Not Found');
}

function badRequest(res) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/html');
    res.end('Bad Request');
}

function add(req, res) {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => { body += chunk });
    req.on('end', () => {
        let obj = qs.parse(body);
        items.push(obj.item);
        show(res);
    })
}