let photos = [];
photos.push({
    name: 'Node.js Logo',
    path: './images/favicon.png'
});

photos.push({
    name: 'speaking',
    path: './images/favicon.png'
});

let list = function(req, res) {
    res.render('photos', {
        title: 'Photos',
        photos
    })
}


var express = require('express');
const app = require('../app');
var router = express.Router();

router.get('/', list);
router.get('/upload', photos.form);
router.post('/upload', photos.submit(router.get('photos')));

module.exports = router;
