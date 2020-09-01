const Koa = require('koa');
const staticFiles = require('koa-static');
const app = new Koa();

app.use(staticFiles(__dirname + '/public'));

let getIPAdress = () => {
    const interfaces = require('os').networkInterfaces();
    let address;
    for (let key in interfaces) {
        interfaces[key].forEach(item => {
            if (item.family === 'IPv4' && item.address !== '127.0.0.1' && item.internal !== true) {
                address = item.address;
            }
        })
    }
    return address;
}


let IpAddress = getIPAdress();
console.log(`服务已运行，地址: ${IpAddress}:3000`);
app.listen(3000);