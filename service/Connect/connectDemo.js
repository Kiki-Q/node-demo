let connect = require('connect');
let app = connect();

// app.use(logger)
//     .use('/admin', restrict)
//     .use('/admin', admin)
//    .use(hello)
//    .listen(3000);

function logger(req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
}

function hello(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('hello world');
}

//实现http basic认证的中间件组件
function restrict(req, res, next) {
    let authorization = req.headers.authorization;
    if(!authorization) return next(new Error('Unauthorized'));

    let parts = authorization.split(' ');
    let scheme = parts[0]
    let auth = Buffer.from(parts[1], 'base64').toString().split(':')
    let user = auth[0];
    let pass = auth[1];

    //根据数据库中的记录检查认证信息的函数
    authenticateWithDatabase(user, pass, (err)=>{
        //告诉分发器出错了
        if(err) return next(err)
        //如果认证信息有效，不带参数调用next()
        next()
    })
}

function authenticateWithDatabase(user, pass, callback) {
    var err;
    if (user != 'tobi' || pass != 'ferret') {
      err = new Error('Unauthorized');
    }
    callback(err);
  }

//路由admin请求
function admin(req, res, next) {
    switch (req.url) {
        case '/':
            res.end('try /users')
            break;
        case '/users':
            res.setHeader('Content-type', 'application/json');
            res.end(JSON.stringify(['tobi', 'loki', 'jane']));
            break;
    }
}

//可配置的Connect中间件组件logger
function setup(format) {
    //logger组件用正则表达式匹配请求属性
    let regexp = /:(\w+)/g;

    return function logger(req, res, next) {
        let str = format.replace(regexp, function(match, property) {
            //用正则表达式格式化请求的日志条目
            return req[property];
        });

        console.log(str);

        //将控制权交给下一个中间件组件
        next();
    }
}


//使用router中间组件
// let connect = require('connect');
//路由器组件，稍后定义
let router = require('./middleware/router');


//定义路由的对象
let routes = {
    GET : {
        '/users' : (req, res) => {
            res.end('tobi, loki, ferret');
        },
        //其中的每一项都是对请求URL的映射，并包含要调用的回调函数
        '/user/:id': (req, res, id) => {
            res.end('user ' + id);
        }
    },
    DELETE: {
        '/user/:id': (req, res, id) => {
            res.end('deleted user ' + id)
        }
    }

}

//基于缩略名重写请求URL的中间件
let path = url.parse(req.url).pathname;

function rewrite(req, res, next) {
    let match = path.match(/^\/blog\/posts\/(.+)/);

    //只针对/blog/posts请求执行查找
    if (match) {
        findPostIdBySlug(match[1], (err, id) => {
            //如果查找出错，则通知错误处理器并停止处理
            if (err) return next(err);
            if (!id) return next(new Error('User not found'));
            //重写req.url属性，以便后续中间件可以使用真实的ID
            req.url = '/blog/posts/' + id;
            next();
        })
    } else {
        next();
    }

}

//Connnect中的错误处理中间件
function errorHandler() {
    let env = process.env.NODE_ENV || 'development';

    //错误处理中间件定义四个参数
    return function(err, req, res, next) {
        res.statusCode = 500;
        //errorHandler中间件组件根据NODE_ENV的值执行不同的操作
        switch (env) {
            case 'development':
                res.setHeader('Content-Type','application/json');
                res.end(JSON.stringify(ERR));
                break;
            default:
                res.end('Server error');
        }
    }
}


// module.exports = setup;

//将路由对象传给路由器的setup函数
app.use(router(routes))
   .listen(4000);