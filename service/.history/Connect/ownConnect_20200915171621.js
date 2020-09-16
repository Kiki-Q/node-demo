let connect = require('connect');
let cookieParser = require('cookie-parser');

let bodyParser = require('body-parser');

let morgan = require('morgan');

// let app = connect()
//         .use(cookieParser('tobi is a cool ferret'))
//         .use((req, res) => {
//             console.log(req.cookies);
//             console.log(req.signedCookies);
//             res.end('hello\n');
//         }).listen(3000)


// let app = connect()
//         .use(bodyParser())
//         .use((req, res) => {
//             console.log(req.body)
//             res.end('Registered new user:' + req.body.username);
//         }).listen(3000)


// let app = connect()
//         .use(bodyParser())
//         .use((req, res) => {
//             console.log(req.body)
//             console.log(req.files)
//             res.end('thanks!');
//         }).listen(3000)

// let app = connect()
//         .use(connect.limit('32kb'))
//         .use(bodyParser())
        
//         Http.createServer(app).listen(3000)


//根据请求的Content-Type限制主体大小
function type(type, fn) {
        //fn在这里是个limit()实例
        return function(req, res, next) {
                let ct = req.headers['content-type'] || '';
                //被返回的中间件首先检查content-type
                if (0 != ct.indexOf(type)) {
                        return next()
                }
                //然后它会调用传入的limit组件
                fn(req, res, next);
        }
}

// let app = connect()
//         .use(type('application/x-www-form-urlencoded', connect.limit('64kb')))
//         .use(type('application/json',connect.limit('32kb')))
//         .use(type('image', connect.limit('2mb')))
//         .use(type('video', connect.limit('300mb')))
//         .use(connect.bodyParser())


// let app = connect()
//         .use(connect.query())
//         .use( (req, res, next) =>{
//                 res.setHeader('Content-type', 'application/json');
//                 res.end(JSON.stringify(req.query));
//         })


let app = connect()
        .use(morgan(':method :url :response-time ms'))
        .listen(3000)