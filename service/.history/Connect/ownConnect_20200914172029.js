let connect = require('connect');
let cookieParser = require('cookie-parser');

// let app = connect()
//         .use(cookieParser('tobi is a cool ferret'))
//         .use((req, res) => {
//             console.log(req.cookies);
//             console.log(req.signedCookies);
//             res.end('hello\n');
//         }).listen(3000)


let app = connect()
        .use(connect.bodyParser())
        .use((req, res) => {
            
            res.end('Registered new user:' + req.body.username);
        }).listen(3000)