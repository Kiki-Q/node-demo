let net = require('net');

let server = net.createServer((socket) => {
    //当读取到新数据时处理的data事件
    socket.on('data', (data) => {
        //数据被写回到客户端
        socket.write(data);
    })
})

server.listen(8888)