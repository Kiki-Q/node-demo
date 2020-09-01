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
            items.forEach((item, i) => {
                res.write(`${i}) ${item} \n`);
            });
            res.end();
            break;
    }
})