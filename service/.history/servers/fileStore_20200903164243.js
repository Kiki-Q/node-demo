//收集参数值并解析文件数据库的路径
let fs = require('fs');
let path = require('path');

//去掉“node cli_tasks.js”只留下参数
let args = process.argv.splice(2);
// console.log('args:',args,process.cwd())

//取出第一个参数（命令）
let command = args.shift();


//合并剩余的参数
let taskDescription = args.join(' ');
//根据当前的工作目录解析数据库的相对路径
let file = path.join(process.cwd(), '/.tasks');

//确定CLI脚本应该采取什么动作
switch (command) {
    case 'list':
        listTasks(file);
        break;

    case 'add':
        addTask(file, taskDescription);
        break;

    default:
        console.log('Usage: ' + process.argv[0]) + ' list|add [taskDescription]';
};

//从文本文件中加载用JSON编码的数据
function loadOrInitializeTaskArray(file, cb) {
    //检查.tasks文件是否已经存在
    fs.exists(file, (exists) => {
        let tasks = [];
        if(exists) {
            //从.tasks文件中读取代办事项数据
            fs.readFile(file, 'utf8', (err, data) => {
                if (err) throw err;
                data = data.toString();
                //把用JSON编码的待办事项数据解析到任务数组中
                tasks = JSON.parse(data || '[]');
                cb(tasks);
            })
        } else {
            //如果.tasks文件不存在，则创建空的任务数组
            cb([]);
        }
    })
}

//列出任务的函数
function listTasks(file) {
    loadOrInitializeTaskArray(file, (tasks) => {
        for(let i in tasks){
            console.log(tasks[i]);
        }
    })
}

//把任务保存到磁盘中
function storeTasks(file, tasks) {
    fs.writeFile(file, JSON.stringify(tasks), 'utf8', (err) => {
        if (err) throw err;
        console.log('Saved.');
    })
}

//添加一项任务
function addTask(file, taskDescription) {
    loadOrInitializeTaskArray(file, (tasks) => {
        tasks.push(taskDescription);
        storeTasks(file, tasks);
    })
}

