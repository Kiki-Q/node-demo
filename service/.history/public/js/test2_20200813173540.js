let fs = require('fs');
let stream = fs.createReadStream('../files/book')
stream.on('data',(chunk)=>{
    console.log(chunk)
})
stream.on('end',()=>{
    console.log('finished')
})

