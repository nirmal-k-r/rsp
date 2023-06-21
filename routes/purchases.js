var express = require('express');
var config = require('../config')
var router = express.Router();
var db = config.db;
var showdown = require('showdown');
var converter = new showdown.Converter();
var mongojs = require('mongojs');


/* GET home page. */
router.get('/scan', function(req, res) {
    if (req.session.user) {
        res.render('purchases/scan', {
            session: req.session,
        });
    } else {
        res.redirect('/')
    }
});


router.post('/itemDetails', function(req, res) {
    uname=req.body.uname;
    image=req.body.image;
    price=parseFloat(req.body.price);

    name=req.body.name;

    console.log(uname,price,name);

    config.db.purchases.find({uname:uname,name:name},(err,items) => {
        recommendation=true;
        average=parseFloat(price);
        total=0;
        if (items.length>0){
            // console.log('found',items.length)
            for (var i=0;i<items.length;i++){
               total=total+items[i].price;
            }
            average=total/items.length;
            if (price>(1.1*average)){
                recommendation=false;
            }
            // console.log(price,average);
            res.send({name:name,status:"old", recommendation:recommendation, entered_price:price, average_price:average})
        }else{
            console.log('not found')
            res.send({name:name,status:"new", recommendation:recommendation})
        }
    });

});

function detectItem(image){
    return "milk"
}

router.post('/new', function(req, res) {
    console.log('works');
    if (req.session.user) {
        if (req.body.type=="wishlist"){
            var new_wishlist_item={
                uname: req.session.user.uname,
                image: req.body.image,
                price: parseFloat(req.body.price),
                name: req.body.name,
                time: new Date()
            }
            //console.log(new_incident);
            db.wishlist.insert(new_wishlist_item, function(err, wishlist_item) {
                res.redirect('/?new=true')
            })
        }else if (req.body.type=="purchase"){
            
            var new_item={
                uname: req.session.user.uname,
                image: req.body.image,
                price: parseFloat(req.body.price),
                name: req.body.name,
                time: new Date()
            }
            //console.log(new_incident);
            db.purchases.insert(new_item, function(err, item) {
                res.redirect('/?new=true')
            })
        }

    } else {
        res.redirect('/authentication');
    }

});

// router.get('/view/:id', function(req, res) {
//     if (req.session.user) {
//         var notif=false;
//         //console.log(req.query.new);
//         if (req.query.new=="true"){
//             notif=true;
//         }

//         db.purchases.find({
//             _id: mongojs.ObjectID(req.params.id)
//         }, function(err, data) {
//             incident=data[0];   
//             res.render('incident/incident', {
//                 title: config.title,
//                 domain: config.domain,
//                 session: req.session,
//                 incident: incident,
//                 notif: notif
//             });
//         });
//     } else {
//         res.redirect('/authentication');
//     }
// });


router.get('/delete/:pid', (req, res) => {
    if (req.session.user) {
        db.purchases.remove({
            _id: mongojs.ObjectID(req.params.pid)
        }, (err, purchases) => {
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