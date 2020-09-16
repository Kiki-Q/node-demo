let connect = require('connect');
let app = connect();

app.use(logger)
    .use('/admin', restrict)
    .use('/admin', admin)
   .use(hello)
   .listen(3000);

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
    let auth = new Buffer(parts[1], 'base64').toString().split(':')
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