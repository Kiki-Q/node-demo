let http = require('http'); //内置的http模块，提供http服务器于客户端功能
let fs = require('fs');    
let path = require('path');  //内置的path模块，提供文件系统路径相关功能
let mime = require('mime');  //附加的mime模块，提供根据文件扩展名得到MIME类型的能力
let cache = {};

//处理基于socket.io的服务端聊天功能
let chatServer =  require('./lib/chat_server');


//文件不存在
function send404(response) {
    response.writeHead(404,{'Content-Type':'text/plain'});
    response.write('ERROR 404:resource not found.');
    response.end();
}

//提供文件数据服务
function sendFile(response, filePath, fileContents) {
    response.writeHead(200,{'content-type': mime.getType(path.basename(filePath))});
    response.end(fileContents);
}

//提供静态文件服务
function serveStatic(response, cache, absPath) {
    //检查文件是否存在内存中
    if (cache[absPath]) {
        //从内存中返回文件
        sendFile(response, absPath, cache[absPath]);
    } else {
        //检查文件是否存在
        fs.exists(absPath, function(exists) {
            if (exists) {
                //从硬盘中读取文件并返回
                fs.readFile(absPath, function(err, data) {
                    if (err) {
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        //从硬盘读取文件并返回
                        sendFile(response, absPath, data);
                    }
                })
            } else {
                send404(response);//发送http404相应
            }
        })
    }
}

//创建http服务器
let server = http.createServer(function(req,res) {
    let filePath = false;
    if (req.url == '/') {
        //确定返回的默认HTML文件
        filePath = 'public/index.html'; 
    } else {
        filePath = `public/${req.url}`
    }
    let absPath = `./${filePath}`;
    //返回静态文件
    serveStatic(res, cache, absPath)
})

//启动服务器
server.listen(3000, function() {
    console.log("Server listening on port 3000.")
})

//启动socket.io服务器，给它提供一个已经定义好的http服务器
chatServer.listen(server);
