let mongodb = require('mongodb');
let server = new mongodb.Server('127.0.0.1', 27017, {});

let client = new mongodb.Db('mydatabase', server, {w:1});

client.open( (err)=>{
    if (err) throw err;
    client.collection('test_insert', (err,collection) => {
        if (err) throw err;
        console.log('we are now able to perform queries.')
    })
})