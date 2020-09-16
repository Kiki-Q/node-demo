// let mongodb = require('mongodb');
// let server = new mongodb.Server('10.4.64.78', 50002, {});

// let client = new mongodb.Db('mongo', server, {w:1});

// client.open( function(err){
//     if (err) throw err;
//     client.collection('test_insert', (err,collection) => {
//         if (err) throw err;
//         console.log('we are now able to perform queries.')
//     })
// })


let mongoose = require('mongoose');
let db = mongoose.connect('mongodb://localhost/mongo');

//注册schema
let Schema = mongoose.Schema;
let Tasks = new Schema({
    project:String,
    description:String
});

mongoose.model('Task', Tasks)

//添加任务
let Task = mongoose.model('Task');
let task = new Task();
task.project = 'Bikeshed';
task.description = 'Paint the bikeshed red.';
task.save(function(err) {
    if(err) throw err;
    console.log('Task saved.')
})

//搜索文档
