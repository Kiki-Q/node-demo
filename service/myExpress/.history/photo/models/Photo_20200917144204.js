//照片模型
let mongoose = require('mongoose');
mongoose.connect('mongodb://10.4.64.78:50002/photo_app');

let schema = new mongoose.Schema({
    name:String,
    path:String
});

module.exports = mongoose.Model('Photo', schema);