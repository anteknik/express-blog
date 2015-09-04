var express     = require('express'),
    app         = express(),
    session     = require('express-session'),
    auth        = require('./src/routes/auth.js'),
    authRoute   = auth.router,
    postRoute   = require('./src/routes/post.js').router,
    JadeLoginMW = auth.JadeLoggedInMiddleware;

var SESSION_INFO = {
    secret: 'lasjdfoawu012391z',
    cookie: { maxAge: 3600 * 1000 },
    resave: true,
    saveUninitialized: false
};

app.use(express.static('./src/static'));
app.use(session(SESSION_INFO));

app.set('view engine', 'jade');
app.set('views', './src/views');

app.get('*', JadeLoginMW);

app.get('/', function (req, res) {
    res.render('index');
});

app.use('/auth', authRoute);
app.use('/post', postRoute);

var server = app.listen(3000, 'localhost', function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Blog is running at http://%s:%s', host, port);
});
