let http = require('http');
let url = require('url');
let items = [];
//用一个常规的JavaScript数组存放数据

let server = http.createServer( (req, res) => {
    //req.method是请求所用的HTTP方法
    switch (req.method) {
        case 'POST':
            //为进来的事项设置字符串缓存
            let item = '';
            //将进来的data时间编码为utf-8字符串
            req.setEncoding('utf8');
            req.on('data', (chunk) => {
                item += chunk; //将数据块拼接到缓存上
            });

            req.on('end', () => {
                //将完整的新事项压入事项数组中
                items.push(item);
                res.end('OK\n')
            })
            break;
        case 'GET':
            // items.forEach((item, i) => {
            //     res.write(`${i}) ${item} \n`);
            // });
            // res.end();

            //优化
            let body = items.map( (item, i) => {
                return `${i}) ${item}`
            }).join('\n');
            res.setHeader('Content-Length', Buffer.byteLength(body));
            res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
            res.end(body);
            break;
        case 'DELETE':
            let path = url.parse(req.url).pathname;
            let i = parseInt(path.slice(1), 10);

            if(isNaN(i)) {
                res.statusCode = 400;
                res.end('Invalid item id');
            } else if (!items[i]) {
                res.statusCode = 404;
                res.end('Invalid not found');
            } else {
                items.splice(i, 1);
                res.end('ok\n');
            }
            break;
        case 'PUT':
            break;

    }
})

server.listen(3000);