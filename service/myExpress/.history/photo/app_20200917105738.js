var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let http = require('http')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let photoRouter = require('./routes/photo')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/photos', photoRouter);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//可以设定照片上传目的地址的定制配置项
app.configure( function() {
  app.set('views', __dirname + 'views');
  app.set('view engine', 'ejs');
  app.set('photos', __dirname + '/public/photos')
})

http.createServer(app).listen(3000, function(){
  console.log('Express server listening on port 3000')
})

module.exports = app;
