let connect = require('connect');
let cookieParser = require('cookie-parser');

let bodyParser = require('body-parser')
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

let app = connect()
        .use(bodyParser())
        .listen(3000)