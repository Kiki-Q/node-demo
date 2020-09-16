//一个使用session的页面浏览计数器
let connect = require('connect');
let favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
let session = require('express-session');

let app = connect()
        .use(favicon())
        .use(cookieParser('keyboard cat'))
        .use(session())
        .use( (req, res, next) => {
            let sess = req.session;
            if (sess.view) {
                res.setHeader('Content-Type', 'text/html');
                res.write(`<p>views: ${sess.views} </p>`);
                res.end();
                sess.views++;
            } else {
                sess.views = 1;
                res.end('welcome to the session demo. refresh!')
            }
        })

    app.listen(3000);