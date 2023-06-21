var express = require('express');
var config = require('../config')
var router = express.Router();
var config = require('../config')
var session = require('express-session');
var db = require('../config').db;
var Common = require('../common')

var common=new Common();

/* Homepage: login redirect or render dashboard */
router.get('/', function(req, res) {
    var interests = []
    if (!req.session.user) {
        res.redirect('/authentication');
    }else{
        config.db.wishlist.find({uname:req.session.user.uname},(err,wishlist) => {
            config.db.purchases.find({uname:req.session.user.uname},(err,purchases) => {
                res.render('dashboard', {
                    title: config.title,
                    domain: config.domain,
                    session: req.session,
                    wishlist: wishlist,
                    purchases: purchases
                });
            });
        });
    }
});

module.exports = router;