let net = require('net');
let redis = require('redis');


// let client = redis.createClient(6379,'127.0.0.1');

// client.on('error', (err) => {
//     console.log('Error ' + err);
// })

// client.set('color', 'red', redis.print);
// client.get('color', (err, value) => {
//     if (err) throw err;
//     console.log('Got: ' + value)
// })

let server = net.createServer( (socket) => {
    //为每个连接到聊天服务器上的用户定义设置逻辑
    let subscriber;
    let publisher;

    socket.on('connect', () => {
        //为用户创建预定客户端
        subscriber = redis.createClient();
        //预定信道
        subscriber.subscribe('main_chat_room');

        //信道收到消息后，把它发给用户
        subscriber.on('message', function(channel, message){
            socket.write('Channel ' + channel + ': ' + message);
        });

        //为用户创建发布客户端
        publisher =  redis.createClient();
    })

    socket.on('data', (data) => {
        //用户输入消息后发布它
        publisher.publish('main_chat_room', data)
    })

    socket.on('end', () => {
        subscriber.unsubscribe('main_chat_room');
        subscriber.end();
        publisher.end();
    })
})

server.listen(3000)