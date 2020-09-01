let socketio =  require('socket.io');
let io;
let guestNumber = 1;
let nickNames = {};
let namesUsed = [];
let currentRoom = {};

exports.listen = function(server) {
    //启动socket.io服务器，允许它搭载在已有的http服务器上
    io = socketio.listen(server);
    io.set('log level', 1);
    //定义每个用户连接的处理逻辑
    io.sockets.on('connection', function (socket) {
        
        //在用户连接上来时赋予其一个访客名
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);

        //在用户连接上来时把他放入聊天室Lobby里
        joinRoom(socket, 'Lobby');

        //处理用户的消息，更名，以及聊天室的创建和变更
        handleMessageBroadcasting(socket, nickNames);
        handleNameChangeAttempts(socket, nickNames, namesUsed);
        handleRoomJoining(socket);

        //用户发出请求时，向其提供已经被占用的聊天室的列表
        socket.on('rooms', function() {
            socket.emit('rooms', io.sockets.manager.rooms);
        });

        //定义用户断开连接后的清除逻辑
        handleClientDisconnection(socket, nickNames, namesUsed);
    })
}

//分配用户昵称
function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
    //生成新昵称
    let name = `Guest${guestNumber}`;
    //把客户昵称和客户端连接ID关联上
    nickNames[socket.id] = name;
    //让用户知道他们的昵称
    socket.emit('nameResult', {
        success: true,
        name: name
    })
    //存放已经被占用的昵称
    namesUsed.push(name);
    //增加用来生成昵称的计数器
    return guestNumber+1
}

//与进入聊天室相关的逻辑
function joinRoom(socket, room) {
    //让用户进入房间
    socket.join(room);
    //记录用户的当前房间
    currentRoom[socket.id] = room;
    //让用户知道他们进入了新的房间
    socket.emit('joinResult', {room: room});
    
}