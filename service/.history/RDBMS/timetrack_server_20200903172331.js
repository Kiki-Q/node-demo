//启动程序
//程序设置及数据库连接初始化

let http = require('http');
let work = require('./lib/timetrack');
let mysql = require('mysql'); //引入MySQL api

let db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'timetrack'
})