//添加照片提交路由定义
let Photo = require('../models/Photo');//引入photo模型
let path = require('path');
let fs = require('fs');
//引用path.join,这样你就可以用“path”命名变量
let join  = path.join; 

let submit = function(dir) {
    return function(req, res, next) {
        //默认为原来的文件名
        let img = req.files.photo.image;
        let name = req.body.photo.name || img.name;
        let path = jion(dir, img.name);

        //重命名文件
        fs.rename(img.path, path, function(err) {
            //委派错误
            if(err) return next(err);

            Photo.create({
                name:name,
                path:img.name
            },function(err) {
                //委派错误
                if(err) return next(err);

                res.redirect('/'); //重定向到首页
            })
        })
    }
}

let photos = [];

// //假数据
// photos.push({
//     name: 'Node.js Logo',
//     path: './images/favicon.png'
// });

// photos.push({
//     name: 'speaking',
//     path: './images/favicon.png'
// });

let list = function(req, res) {
    res.render('photos', {
        title: 'Photos',
        photos
    })
}

let form = function(req, res) {
    res.render('photos/upload', {
        title: 'Photo upload',
    })
}


var express = require('express');
const app = require('../app');
var router = express.Router();

router.get('/', list);
router.get('/upload', form);
router.post('/upload', photos.submit(router.get('photos')));

module.exports = router;
