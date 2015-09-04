var express    = require('express'),
    router     = express.Router(),
    bodyParser = require('body-parser'),
    db         = require('../database/database');

var urlEncodedParser = bodyParser.urlencoded({extended: true});

router.get('/login', function (req, res) {
    res.render('auth/login');
});

router.post('/login', urlEncodedParser, function (req, res) {
    var uname = req.body['username'],
        passw = req.body['password'];

    db.CheckUserExists(uname, make_UserExistsLogin(req, res, uname, passw));
});

router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
            res.status(500).send('Failed to destroy session.');
            return;
        }

        res.locals.loggedin = false;
        res.redirect('/');
    });
});

router.get('/register', function (req, res) {
    res.render('auth/register');
});

router.post('/register', urlEncodedParser, function (req, res) {
    var uname = req.body['username'],
        passw = req.body['password'],
        rpass = req.body['retype-password'];

    if (passw === rpass) {
        db.CheckUserExists(uname, make_UserExistsRegister(req, res, uname, passw));
    } else {
        res.render('auth/register', {
            flashError: 'Password and Retype Password don\'t match.'
        });
    }
});

function make_UserExistsLogin(req, res, uname, passw) {
    return function (err, results) {
        if (err) {
            console.log(err);
            res.status(500).send('Database Query Failed.');
            return;
        }

        if (results.length > 0) { // user ada
            var bcrypt = require('bcrypt'),
                user   = results[0];

            if(bcrypt.compareSync(passw, user['password'])) {
                var sess = req.session;
                sess.loggedin = true;
                sess.username = uname;
                sess.userid   = user['id'];

                res.redirect('/');
            } else {
                res.render('auth/login', {
                    flashError: 'Wrong password'
                });
            }

        } else { // username tidak ada
            res.render('auth/login', {
                flashError: 'User not found'
            });
        }
    }
};

function make_UserExistsRegister(req, res, uname, passw) {
    return function (err, results) {
        if (err) {
            console.log(err);
            res.status(500).send('Database Query Failed.');
            return;
        }

        if (results.length > 0) { // username telah ada
            res.render('auth/register', {
                flashError: 'Username already exists'
            });
        } else { // username belum ada
            db.CreateNewUser(uname, passw, make_CreateUser(req, res));
        }
    }
};

function make_CreateUser(req, res) {
    return function (err, results) {
        if (err) {
            console.log(err);
            res.status(500).send('Database Insertion Failed.');
            return;
        }

        var info = 'Register Success. Please login now!';
        res.render('auth/login', {flashInfo: info});
    };
};

function jadeLoggedInMiddleware(req, res, next) {
    res.locals.loggedin = req.session.loggedin || null;
    next();
};

function mustLoggedInMiddleware(req, res, next) {
    if (req.session.loggedin) {
        next();
    } else {
        res.status(302).send("User must logged in to access the page.");
    }
};

exports.router = router;
exports.JadeLoggedInMiddleware = jadeLoggedInMiddleware;
exports.MustLoggedInMiddleware = mustLoggedInMiddleware;
