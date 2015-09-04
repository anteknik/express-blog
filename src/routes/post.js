var express    = require('express'),
    router     = express.Router(),
    auth       = require('./auth.js'),
    MustLogin  = auth.MustLoggedInMiddleware,
    db         = require('../database/database.js'),
    bodyParser = require('body-parser'),
    markdown   = require('markdown-js').markdown;

var urlEncodedParser = bodyParser.urlencoded({extended: true});

router.use(MustLogin);

router.get('/list', MarkdownProcessor, function (req, res) {
    db.GetPosts(10, function (err, results) {
        if (err) {
            console.log(err);
            res.status(500).send("Database Query Failed.");
        }

        res.render('post/list', {posts: results});
    });
});

router.get('/create', function (req, res) {
    res.render('post/create');
});

router.post('/create', urlEncodedParser, function (req, res) {
    var title   = req.body['title'],
        content = req.body['content'],
        author  = req.session.userid;

    db.CreateNewPost(title, content, author, make_NewPost(req, res));
});

function make_NewPost(req, res) {
    return function (err, results) {
        if (err) {
            console.log(err);
            res.status(500).send('Database Query Failed.');
            return;
        }

        res.redirect('/post/list');
    };
};

function MarkdownProcessor (req, res, next) {
    res.locals.markdown = markdown;
    next();
}

exports.router = router;
