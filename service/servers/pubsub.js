//用事件发射器实现简单的发布/订阅系统
let events = require('events');
let net = require('net');

let util = require('util');
let fs = require('fs');
let watchDir = '../watch', processedDir = '../done';

function Watcher(watchDir, processedDir) {
    this.watchDir = watchDir;
    this.processedDir = processedDir;

}

util.inherits(Watcher, events.EventEmitter)

//扩展EventEmitter,添加处理文件的方法
Watcher.prototype.watch = function() {
    let watcher = this;
    //保存对Watcher对象的引用，以便在回调函数read敌人中使用
    fs.readdir(this.watchDir, function(err, files) {
        if (err) throw err;

        for(let index in files) {
            //处理watch目录中的所有文件
            watcher.emit('process', files[index]);
        }
    })
}

//扩展EventEmitter,添加开始监控的方法
Watcher.prototype.start = function() {
    let watcher = this;
    fs.watchFile(watchDir, function() {
        watcher.watch();
    })
}

let watcher = new Watcher(watchDir, processedDir);
watcher.on('process', function process(file) {
    let watchFile = this.watchDir + '/' + file;
    let processedFile = this.processedDir + '/' + file.toLowerCase();

    fs.rename(watchFile, processedFile, function(err) {
        if (err) throw err; 
    })
})

watcher.start();


//
let channel = new events.EventEmitter();
channel.client = {};
channel.subscriptions = {};

channel.on('join', function(id, client) {
    //保存用户的client对象，以便程序可以将数据发送给用户
    this.clients[id] = client;

    this.subscriptions[id] = function(senderId, message) {
        if (id != senderId) {
            this.clients[id].write(message);//忽略发出这一广播数据的用户
        }
    }

    //添加一个专门针对当前用户的broadcast事件监听器
    this.on('broadcast', this.subscriptions[id]);

    //
    let welcome = `Welcome!\n Guests online: ${this.listenners('broadcast').length}`;
    client.write(welcome + "\n");

})

//创建leave事件的监听器
channel.on('leave', function(id) {
    channel.removeListener('broadcast', this.subscriptions[id]);
    channel.emit('broadcast', id, id + " has left the chat.\n");
})

//停止提供聊天服务，但不关服务器
channel.on('shutdown', () => {
    channel.emit('broadcast', '', "Chat has shut down.\n");
    channel.removeAllListeners('broadcast');
})

//
channel.setMaxListeners(50);


let server = net.createServer( (client) => {
    let id = client.remoteAddress + ':' + client.remotePort;

    client.on('connect', (client) => {
        //当有用户连到服务器上来时发出一个join时间，指明用户ID和client对象
        channel.emit('join', id, client);
    })

    client.on('data', (data) => {
        data = data.toString();

        if(data == "shutdown\r\n") {
            channel.emit('shutdown');
        }
        channel.emit('broadcast', id, data);
    })

    client.on('close', () => {
        channel.emit('leave', id);
    })
    
});

server.listen(8888);