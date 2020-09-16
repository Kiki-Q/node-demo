let mongodb = require('mongodb');
let server = new mongodb.Server('10.4.64.78', 50002, {});

let client = new mongodb.Db('mongo', server, {w:1});

client.open( (err)=>{
    if (err) throw err;
    client.collection('test_insert', (err,collection) => {
        if (err) throw err;
        console.log('we are now able to perform queries.')
    })
})