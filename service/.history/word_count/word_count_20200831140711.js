//并行化流程控制
let fs = require('fs');
let completedTasks = 0;
let tasks = [];
let wordCounts = {};
let filesDir = './text';

function checkIfComplete() {
    completedTasks++;
    if (completedTasks == tasks.length) {
        //当所有的任务全部完成后，列出文件中用到的每个单词以及用到的次数
        for (let index in wordCounts) {
            console.log(index + ": " + wordCounts[index]);
        }
    }
}

function countWordsInText(text) {
    let words = text.toString().toLowerCase().split(/\W+/).sort();

    //对文本中出现的单词计数
    for (let index in words) {
        let word = words[index];
        if(word) {
            wordCounts[word] = (wordCounts[word]) ? wordCounts[word] + 1 : 1;
        }
    }
}

fs.readdir(filesDir, (err, files) => {
    //得出text目录中的文件列表
    if (err) throw err;
    //定义处理每个文件的任务。每个任务中都会调用一个异步读取文件的函数并对文件中使用的单词计数
    for(let index in files) {
        let task = (function(file){
            return function() {
                fs.readFile(file, (err,text) => {
                    if (err) throw err;
                    countWordsInText(text);
                    checkIfComplete();
                })
            }
        })(filesDir + '/' + files[index]);
        //吧所有任务都添加到函数调用数组中
        tasks.push(task);
    }
    for(let task in tasks) {
        //开始并行执行所有任务
        tasks[task]();
    }
})