//启动程序
//程序设置及数据库连接初始化

let http = require('http');
let work = require('./timetrack');
let mysql = require('mysql'); //引入MySQL api

let db = mysql.createConnection({
    host: '10.4.64.78',
    user: 'root',
    password: '123',
    database: 'timetrack',
    port:'50002'
});

db.connect(function(error, results) {
    if(error) {
        console.log('Connection Error: ' + error.message);
        return;
    }
    console.log('Connected to MySQL');
});

//http请求路由
let server = http.createServer( (req, res) => {
    switch (req.method) {
        //HTTP POST请求路由
        case 'POST': 
            switch(req.url) {
                case '/':
                    work.add(db, req, res);
                    break;
                case '/archive':
                    work.archive(db, req, res);
                    break;
                case '/delete':
                    work.delete(db, req, res);
                    break;
            }
            break;

        //HTTP GET请求路由
        case 'GET':
            switch(req.url) {
                case '/':
                    work.show(db, res);
                    break;
                case '/archived':
                    work.showArchived(db, res);
            }
            break;
    }
});

//创建数据库表
db.query(
    //建表SQL
    `CREATE TABLE IF NOT EXISTS work ( id INT(10) NOT NULL AUTO_INCREMENT, hours 
    DECLMAL(5,2) DEFAULT 0, date DATE, archived INT(1) DEFAULT 0, date DATE, archived
    INT(1) DEFAULT 0, description LONGTEXT, PRIMARY KEY(id))`, 
    (err) => {
        if (err) throw err;
        console.log('Server started...');
        server.listen(3000,'127.0.0.1'); //启动HTTP服务器
    }
)