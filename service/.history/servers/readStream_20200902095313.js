//最基本的ReadStream静态文件服务器
let http = require('http');
let parse = require('url').parse;
let join = require('path').join;
let fs = require('fs');

let root = __dirname;

// let server = http.createServer((req, res) => {
//     let url = parse(req.url);
//     //构造绝对路径
//     let path = join(root, url.pathname);
//     //创建fs.ReadStream
//     let stream = fs.createReadStream(path);
//     // stream.on('data', (chunk) => {
//     //     res.write(chunk); //将文件数据写到响应中
//     // });
//     // stream.on('end', () => {
//     //     res.end(); //文件写完后结束响应
//     // })

//     //优化
//     stream.pipe(res);
//     stream.on('error', (err) => {
//         res.statusCode = 500;
//         res.end('Internal Server Error')
//     });

// })

//检查文件是否存在，并在响应中提供Content-Length
let server = http.createServer((req, res) => {
    let url = parse(req.url);
    let path = join(root, url.pathname);
    fs.stat(path, (err, stat) => {
        if (err) {
            if ('ENOENT' == err.code) {
                res.statusCode = 404;
                res.end('Not Found');
            } else {
                res.statusCode = 500;
                res.end('Internal Server Error')
            }
        } else {
            res.setHeader('Content-Length', stat.size);
            let stream = fs.createReadStream(path);
            stream.pipe(res);
            stream.on('error', (err) => {
                res.statusCode = 500;
                res.end('Internal Server Error');;
            })
        }
    })
})

server.listen(3000);
