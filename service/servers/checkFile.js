//准备好接收上传文件的http服务器
let http = require('http');
let formidable = require('formidable');

let server = http.createServer((req, res) => {
    switch (req.method) {
        case 'GET':
            show(req, res);
            break;
        case 'POST':
            upload(req, res);
            break;
    }
});

//提供带有文件上传空间的HTML表单
function show(req, res) {
    let html = `<form method="post" action="/" enctype="multipart/form-data">
                <p><input type="text" name="name"></p>
                <p><input type="file" name="file"></p>
                <p><input type="submit" name="Upload"></p>
                </form>`;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length',Buffer.byteLength(html));
    res.end(html);
}

//上传逻辑
function upload(req, res) {
    if ( !isFormData(req) ) {
        res.statusCode = 400;
        res.end('Bad Request: expecting multipart/form-data');
        return;
    }

    let form = new formidable.IncomingForm();

    //收完输入域后会发出filed事件
    form.on('field', (field, value) => {
        // console.log(field, value)
    });

    //收到文件并处理好后会发出file事件
    form.on('file', (name, file) => {
        // console.log(name, file)
    });

    //
    form.on('progress', (bytesReceived, bytesExpected) => {
        let percent = Math.floor(bytesReceived / bytesExpected *100);
        console.log(percent);
    })

    form.on('end', () => {
        res.end('upload complete！')
    });

    form.parse(req, (err, fields, files) => {
        // console.log(fields, files)
        res.end('upload complete！')
    });

}

function isFormData(req) {
    let type = req.headers['content-type'] || '';
    return 0 == type.indexOf('multipart/form-data');
}

server.listen(3000)