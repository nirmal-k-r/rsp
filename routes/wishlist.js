var express = require('express');
var config = require('../config')
var router = express.Router();
var db = config.db;
var showdown = require('showdown');
var converter = new showdown.Converter();
var mongojs = require('mongojs');


/* GET home page. */


router.get('/delete/:wid', (req, res) => {
    if (req.session.user) {
        db.wishlist.remove({
            _id: mongojs.ObjectID(req.params.wid)
        }, (err, wishlist) => {
            if (err) {
                res.send(err) // TODO: Show as alert
            } else {
                res.redirect('/')
            }
        })
    } else {
        res.redirect('/');
    }
})

module.exports = router;