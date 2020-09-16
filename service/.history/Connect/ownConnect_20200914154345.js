let connect = require('connect');
let cookieParser = require('cookie-parser');

let app = connect()
        .use(cookieParser('tobi is a cool ferret'))
        .use((req, res) => {
            console.log(req.cookies);
            console.log(req.signedCookies);
            res.end('hello\n');
        }).listen(3000)