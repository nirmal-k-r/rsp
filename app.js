var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongojs = require('mongojs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var config = require('./config')
var dotenv = require('dotenv').config();
var debug = require('debug')('app');
const cors = require('cors');

// var multer = require('multer');
// var upload = multer();

//Routes
var index = require('./routes/index');
var authentication = require('./routes/authentication')
var purchases = require('./routes/purchases');
var wishlist = require('./routes/wishlist');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(favicon("./public/img/favicon.ico")); //Need to enable and set favicon
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
app.use(bodyParser.text({ limit: '200mb' }));
// app.use(upload.array()); 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(cors({
//     origin: ['https://localhost']
// }));

app.use(session({
    secret: "RsPTs23",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 3600000
    }
}));


app.use('/', index);
app.use('/authentication', authentication);
app.use('/purchases', purchases);
app.use('/wishlist', wishlist);

/// catch 404 and forwarding to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

/// error handlers

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    res.render('404', {
        message: err.message,
        error: err
    });
});


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//Server 

//app.set('port', process.env.PORT || 80);
var server = app.listen(5002, '0.0.0.0', function() {
    debug('Express server listening on port ' + server.address().port);
});