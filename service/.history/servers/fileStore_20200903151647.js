//收集参数值并解析文件数据库的路径
let fs = require('fs');
let path = require('path');

//去掉“node cli_tasks.js”只留下参数
let args = process.argv.splice(2);
console.log('args:',process,process.argv,args,args.shift())

//取出第一个参数（命令）
let command = args.shift();

switch (command) {
    case 'list':
        listTasks(file);
        break;

    case 'add':
        addTask(file, taskDescription);
        break;

    default:
        console.log('Usage: ' + process.argv[0]) + ' list|add [taskDescription]';
}

//合并剩余的参数
let taskDescription = args.join(' ');
//根据当前的工作目录解析数据库的相对路径
let file = path.join(process.cwd(), '/.tasks');

