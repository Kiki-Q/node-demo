let connect = require('connect');
const bodyParser = require('body-parser');
let morgan = require('morgan')

//不可用的用户更新程序
function edit(req, res, next) {
    if ('GET' != req.method) return next();
    res.setHeader('Conent-Type', 'text/html');
    res.write('<form method="put"');
    res.write('<input type="text" name="user[name]" value="Tobi"');
    res.write('<input type="submit" value="Update"/>');
    res.write('/form');
    res.end();
}

function update(req, res, next) {
    if ('PUT' != req.method)  return next();
    res.end('Updated name to ' + req.body.user.name);
}

let app = connect()
        .use(morgan('dev'))
        .use(bodyParser())
        .use(edit)
        .use(update)