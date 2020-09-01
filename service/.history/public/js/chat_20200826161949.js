//定义类，初始化传入Socket.IO的参数socket
let Chat = function(socket) {
    this.socket = socket;
}

//发送聊天消息函数
Chat.prototype.sendMessage = function(room, text) {
    let message = {
        room: room,
        text: text
    };

    this.socket.emit('message', message);
};

//变更房间的函数
Chat.prototype.changeRoom = function(room) {
    this.socket.emit('join', {
        newRoom: room
    })
}

//处理聊天命令
Chat.prototype.processCommand = function(command) {
    let words = command.split(' ');
    //从第一个单词开始解析命令
    command = words[0].substring(1, words[0].length).toLowerCase();
    let message = false;

    switch(command) {
        case 'join':
            words.shift();
            let room = words.join(' ');
            //处理房间的变换/创建
            this.changeRoom(room);
            break;
        case 'nick':
            words.shift();
            let name = words.join(' ');
            //处理更名尝试
            this.socket.emit('nameAttempt', name);
            break;
        default:
            //如果命令无法识别，返回错误消息
            message = 'Unrecongnized command.';
            break;
    }
    return message;

}

