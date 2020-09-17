let photos = [];
photos.push({
    name: 'Node.js Logo',
    path: 'http://nodejs.org/images/logos/nodejs-green.png'
});

photos.push({
    name: 'speaking',
    path: 'http://nodejs.org/images/logos/nodejs-green.png'
});

exports.list = function(req, res) {
    res.render('photos', {
        title: 'Photos',
        photo: 'photos'
    })
}


var express = require('express');
var router = express.Router();

router.get('/', exports.list);

module.exports = router;
