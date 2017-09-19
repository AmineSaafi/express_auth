var express = require('express');
var path = require('path'); // file path
var favicon = require('serve-favicon');
var logger = require('morgan'); // write routes in the console
var cookieParser = require('cookie-parser'); //Parses cookies from web browsers into req.cookies //https://www.youtube.com/watch?v=qOSTEnod0Qw
var bodyParser = require('body-parser'); // Parses json/ text/ raw into req.body.
var session = require('express-session'); // create a session middleware with the given options
                                          // (Session data is not saved in the cookie itself, just the session ID. Session data is stored server-side.)
var passport = require('passport'); // compatible authentication middleware for Node.js
// authenticate requests with a set of plugins(strategies)
// you provide Passport a request to authenticate, and Passport provides hooks(crochet, hameçon) for controlling what occurs when authentication succeeds or fails.
var LocalStrategy = require('passport-local').Strategy; // This module lets you authenticate using a username and password in your Node.js applications. By plugging into Passport.
var multer = require('multer'); // Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files
var flash = require('connect-flash'); // The flash is a special area of the session used for storing messages
// The flash is typically used in combination with redirects, ensuring that the message is available to the next page that is to be rendered.
var expressValidator = require('express-validator');
var mongo = require('mongodb'); //  Provides a high-level API on top of mongodb-core that is meant for end users.
var mongoose = require('mongoose'); // Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment
var db = mongoose.connection;

// import roots
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Handle file uploads
//app.use(multer({ dest: 'uploads/' }));
var upload = multer({ dest: 'uploads/' });

//  placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// morgan logger(urls in console)
app.use(logger('dev'));

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Handle express Sessions
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Validator
app.use(expressValidator({
    errorFormatter(param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;
        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            value: value,
            msg: msg
        };
    }
}));

//cookie-Parser
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// connect-flash
app.use(flash());
app.use( (req, res, next) => {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// define uri
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
