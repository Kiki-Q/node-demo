//串行化流程控制
let fs = require('fs');
let request = require('request');
let htmlparser = require('htmlparser');
const { nextTick } = require('process');
let configFilename = './rss_feeds.txt';

//确保包含RSS预定源URL列表的文件存在
function checkForRSSFile() {
    fs.exists(configFilename, (exists) => {
        if(!exists)
         return next(new Error('Missing RSS file:' + configFilename)); //只要有错误就尽早返回

        next(null, configFilename);
    })

}

//读取并解析包含预定源URL的文件
function readRSSFile(configFilename) {
    fs.readFile(configFilename, (err, feedList) => {
        if (err) return next(err);

        //将预定源URL列表转换成字符串，然后分割成一个数组
        feedList = feedList.toString().replace(/^\s+|\s+$/g,'').split("\n");

        //从预定源URL数组中随机选择一个预定源URL
        let random = Math.floor(Math.random() * feedList.length);
        next(null, feedList[random]);
    })
}

//向预定的预定源发送HTTP请求以获取数据
function downloadRSSFeed(feedUrl) {
    request({url:feedUrl}, (err, res, body) => {
        if (err) return next(err); 
        if (res.statusCode != 200)
            return next(new Error('Abnormal response status code'))
        next(null, body);
    })

}

//将预定源数据解析到一个条目数组中
function parseRSSFeed (rss) {
    let handler = new htmlparser.RssHandler();
    let parser = new htmlparser.Parser(handler);
    parser.parseComplete(rss);

    if (!handler.dom.items.length)
        return next(new Error('No RSS items found'));

    let item = handler.dom.items.shift();
    //如果有数据，显示第一个预定源条目的标题和URL
    console.log(item.title);
    console.log(item.link);
}

 //把所有要做的任务按直线顺序添加到一个数组中
 let tasks = [ checkForRSSFile, readRSSFile, downloadRSSFeed, parseRSSFeed];

 //负责执行任务的next函数
 function next(err, result) {
    if (err) throw err;

    let currentTask = tasks.shift();

    if (currentTask) {
        currentTask(result);
    }
 }

 next();//开始任务的串行化执行

