function divEscapedContentElement(message) {
    return $('<div></div>').text(message);
}

function divSystemContentElement(message) {
    return $('<div></div>').html('<i>'+ message +'</i>')
}

//处理原始的用户输入
function processUserInput(chatApp, socket) {
    let message = $('#send-message').val();
    let systemMessage;

    //如果用户输入的内容以斜杠（/）开头，将其作为聊天命令
    if(message.chatAt(0) == '/') {
        systemMessage = chatApp.processCommand(message);
        if (systemMessage) {
            $('#messages').append(divSystemContentElement(systemMessage));
        }
    } else {
        //将非命令输入广播给其他用户
        chatApp.sendMessage($('#room').text(), message);
        $('#messages').append(divEscapedContentElement(message));
        $('#messages').scrollTop($('#messages').prop('scrollHeight'));
    }
    $('#send-message').val('');
}

let socket = io.connect();

$(document).ready(function() {
    let chatApp = new Chat(socket);

    //显示更名尝试的结果
    socket.on('nameResult', function(result) {
        let message;
        if(result.success) {
            message = 'You are now known as ' + result.name + '.';
        } else {
            message = result.message;
        }
        $('#messages').append(divSystemContentElement);
    })

    socket.on('joinResult', function(result) {
        //显示房间变更结果
        $('#room').text(result.room);
        $('#messages').append(divSystemContentElement('Room changed'));
    })

    socket.on('message', function(message) {
        //显示接收到的消息
        let newElement = $('<div></div>').text(message.text);
        $('#messages').append(newElement);
    });

    socket.on('rooms', function(rooms) {
        //显示可用房间列表
        $('#room-list').empty();

        for(let room in rooms) {
            room = room.substring(1, room.length);
            if (room != '') {
                $('#room-list').append(divEscapedContentElement(room));
            }
        }

        $('#room-list div').click(function() {
            //点击房间名可以换到那个房间中
            chatApp.processCommand('/join ' + $(this).text());
            $('#send-message').focus();
        })

    })

    //定期请求可用房间列表
    setInterval( function() {
        socket.emit('rooms');
    },1000)

    $('#send-message').fous();

    $('#send-form').submit( function() {
        //提交表单可以发送聊天消息
        processUserInput(chatApp, socket);
        return false;
    })

})
