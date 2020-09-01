let http = require('http');
let fs = require('fs');

//创建http服务器并用回调定义响应逻辑
http.createServer((req,res) => {
    let jsonPath = '../json/title.json';
    let templatePath = '../HTML/template.html'
    getTitles(res, jsonPath, templatePath)
}).listen(8000, "127.0.0.1")





function getTitles(res, jsonPath, templatePath) {
     //读取json文件并用回调定义如何处理其中的内容
     fs.readFile( jsonPath, (err, data) => {
        //如果出错，输出错误日志，并给客户端返回“Server Error”
        if (err) {
            hadError(err, res)
        } else {
            getTemplate(JSON.parse(data.toString()), res, templatePath)
        }
    })
}


function getTemplate(titles, res, templatePath) {
    fs.readFile(templatePath, (err, data) => {
        //读取html模板，并在加载完成后使用回调
        if (err) {
            hadError(err, res)
        } else {
            formatHtml(titles, data.toString(), res)
        }
    })

}

function formatHtml(titles, tmpl, res) {
    //组装html页面以显示博客标题
    let html = tmpl.replace('%',titles.join('</li><li>'));
    res.writeHead(200, {'Content-Type': 'text/html'});
    //将HTML页面发送给用户
    res.end(html);
}

function hadError(err, res) {
    console.error(err);
    res.end('Server Error')
}