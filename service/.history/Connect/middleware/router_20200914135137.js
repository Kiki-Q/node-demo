let parse = require('url').parse;

module.exports = function route(obj) {
    return function(req, res, next) {
        //检查以确保req.method定义了
        //如果未定义，调用next(),并停止一切后续操作
        if (!obj[req.method]) {
            next();
            return;
        }
        let routes = obj[req.method];
        //解析URL,以便跟pathname匹配
        let url = parse(req.url);
        //将req.method对应的路径存放到数组中
        let paths = Object.keys(routes)

        for (let i=0;i < paths.length; i++) {
            let path = paths[i];
            let fn = routes[path];
            path =  path.replace(/\//g,'\\/').replace(/:(\w+)/g,'([^\\/]+)');
            //构造正则表达式
            let re = new RegExp('^' + path + '$');
            let captures = url.pathname.match(re);
            //尝试跟pathname匹配
            if(captures) {
                //传递被捕获的分组
                let args = [req, res].concat(captures.slice(1));
                fn.apply(null, args);
                //当有相匹配的函数时，返回，以防止后续的next（）调用
                return;
            }
            next();
        }
    }
}