let mongodb = require('mongodb');
let server = new mongodb.Server('127.0.0.1', 27017, {});

let client = new mongodb.Db('mydatabase', server, {w:1});