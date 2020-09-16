let connect = require('connect');

let app = connect()
        .use(connect.cookieParser('tobi is a cool ferret'))
        .use((req, res) => {
            console.log(req.cookies);
            console.log(req.signedCookies);
            res.end('hello\n');
        }).listen(3000)