let net = require('net');

let server = net.createServer((socket) => {
    //当读取到新数据时处理的data事件
    socket.on('data', (data) => {
        //数据被写回到客户端
        socket.write(data);
    })
})

server.listen(8888)

//定义channel事件发射器
let EventEmitter = require('events').EventEmitter;
let channel = new EventEmitter();

channel.on('join', function() {
    console.log('welcome!')
})

channel.emit('join');
