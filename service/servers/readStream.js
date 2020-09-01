//最基本的ReadStream静态文件服务器
let http = require('http');
let parse = require('url').parse;
let join = require('path').join;
let fs = require('fs');

let root = __dirname;

let server = http.createServer((req, res) => {
    let url = parse(req.url);
    //构造绝对路径
    let path = join(root, url.pathname);
    //创建fs.ReadStream
    let stream = fs.createReadStream(path);
    // stream.on('data', (chunk) => {
    //     res.write(chunk); //将文件数据写到响应中
    // });
    // stream.on('end', () => {
    //     res.end(); //文件写完后结束响应
    // })

    //优化
    stream.pipe(res);

})

server.listen(3000);
