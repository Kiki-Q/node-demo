let photo = [];
photo.push({
    name: 'Node.js Logo',
    path: 'http://nodejs.org/images/logos/nodejs-green.png'
});

photo.push({
    name: 'speaking',
    path: 'http://nodejs.org/images/logos/nodejs-green.png'
});

exports.list = function(req, res) {
    resizeBy.render('photos', {
        title: 'Photos',
        photo: 'photos'
    })
}
