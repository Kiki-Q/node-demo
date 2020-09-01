let fs = require('fs');
fs.readFile('../files/book',function(err,data){
    console.log(data);
})