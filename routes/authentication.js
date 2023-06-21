var dotenv = require('dotenv').config();
var express = require('express');
var config = require('../config')
var router = express.Router();
var session = require('express-session');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');


/* GET login page. */
router.get('/', function (req, res) {
    if (req.query.message) {
        message = {};
        message.msg = req.query.message;
        if (req.query.message.startsWith('S.')) {
            message.msg = req.query.message.slice(2);
            message.type = 'Success';
        } else {
            message.type = 'Danger'
        }
    } else {
        message = "";
    }
    if (req.session.user) {
        res.redirect(config.domain + "/message=" + encodeURIComponent("Already logged in!"));
    } else {
        res.render('authentication', {
            title: config.title,
            message: message,
            session: req.session,
        });
    };
});

router.post('/auth', function (req, res) {
    var uname = req.body.un;
    config.db.users.find({
        uname: uname
    }, function (err, user_details) {
        if (err) {
            console.log(err);
        } else {
            console.log(user_details);
            if (user_details[0]) {
                user_details = user_details[0];
               
                if (bcrypt.compareSync(req.body.pw, user_details.hash)) {
                    user = {
                        uname: user_details.uname,
                        //pw: user_details.hash,
                        full_name: user_details.full_name,
                        token: user_details.token
                    };
                    req.session.user = user;
                    res.redirect("/?message=" + encodeURIComponent("S.Successfully logged in!"));
                    // res.redirect(config.domain + "/account?message=" + encodeURIComponent("S.Successfully logged in!"));
                } else {
                    res.redirect(config.domain + "/authentication?message=" + encodeURIComponent("Error: Incorrect username or password"));
                }
                
            } else {
                res.redirect(config.domain + "/authentication?message=" + encodeURIComponent("Error: Incorrect username or password"));
            };

        };
    });
});

router.post('/register', function (req, res) {
    if (req.body['g-recaptcha-response']) { //TODO: in depth check

        auth_token = crypto.createHash('md5').update(req.body.uname).digest("hex");
        let hash = bcrypt.hashSync(req.body.pw, 10);
 
        new_user = {
            uname: req.body.uname,
            hash: hash,
            full_name: req.body.full_name,
            token:auth_token
        };

        config.db.users.find({
            uname: new_user.uname
        }, function (err, user_details) {
            if (err) {
                console.log(err);
            } else {
                if (!user_details[0]) {
                    config.db.users.insert(new_user, function (err, user_details) {
                        if (err){
                            console.log(err);
                        }
                        console.log(user_details);
                        delete new_user.hash;
                        req.session.user = new_user;
                        res.redirect("/?message=" + encodeURIComponent("S.Successfully signed up!"));
                    });
                } else {
                    res.redirect("/authentication/?message=" + encodeURIComponent("Error: Username already exists. Please choose another one"));
                };

            };
        });
    } else {
        res.redirect('/authentication')
    }
});

router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect(config.domain + "/authentication?message=" + encodeURIComponent("S.You have logged out!"));
    });

});

module.exports = router;