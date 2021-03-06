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
    //让房间里的其他用户知道有新用户进入了房间
    socket.broadcast.to(room).emit('message',{
        text: nickNames[socket.id] + ' has joined ' + room + '.'
    });

    //确定有哪些用户在这个房间里
    let usersInRoom = io.sockets.clients(room);
    //如果不止一个用户在这个房间里，汇总下都是谁
    if (usersInRoom.length > 1) {
        let usersInRoomSummary = 'Users currently in ' + room + ': ';
        for (let index in usersInRoom) {
            let userSocketId =  usersInRoom[index].id;
            if (userSocketId != socket.id) {
                if (index > 0) {
                    usersInRoomSummary += ', ';
                }
                usersInRoomSummary += nickNames[userSocketId];
            }
        }
        usersInRoomSummary += '.';
        //将房间里其他用户的汇总发送给这个用户
        socket.emit('message', {text: usersInRoomSummary});
    }
    
}

//更名请求的处理逻辑
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
    //添加nameAttempt事件的监听器
    socket.on('nameAttempt', function() {
        //昵称不能以Guest开头
        if (name.indexOf('Guest') == 0) {
            socket.emit('nameResult', {
                success: false,
                message: 'Names cannot begin with "Guest".'
            })
        } else {
            //如果昵称还没注册就注册上
            if (namesUsed.indexOf(name) == -1) {
                let previousName = nickNames[socket.id];
                let previousNameIndex = namesUsed.indexOf(previousName);
                namesUsed.push(name);
                nickNames[socket.id] = name;
                //删除之前用的昵称，让其他用户可以使用
                delete namesUsed[previousNameIndex];
                socket.emit('nameResult', {
                    success: true,
                    name: name
                });
                socket.broadcast.to(currentRoom[socket.id].emit('message', {
                    text: previousName + 'is now known as ' + name + '.'
                }))
            } else {
                //如果逆臣已经被占用，给客户端发送错误消息
                socket.emit('nameResult', {
                    success: false,
                    message: 'That name is already in use.'
                })
            }
        }
    })
}

//转发消息
function handleMessageBroadcasting(socket) {
    socket.on('message', function (message) {
        socket.broadcast.to(message.room).emit('message', {
            text: nickNames[SocketIO.id] + ': ' + message.text
        })
    })
}

//更换房间
function handleRoomJoining(socket) {
    socket.on('join', function(room) {
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, room.newRoom);
    })
}

//用户断开连接
function handleClientDisconnection(socket) {
    socket.on('disconnet', function() {
        let nameIndex = namesUsed.indexOf(nickNames[socket.id]);
        delete namesUsed[nameIndex];
        delete nickNames[socket.id];
    })
}