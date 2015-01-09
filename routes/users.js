var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.post('/create', function(req, res) {
    var db = req.db;
    db.collection('userlist').findOne({username: req.body.username, password: req.body.password}, function(err, result) {
        if (result == null) {
            db.collection('userlist').insert(req.body, function(err, result){
                  res.send("Succesfully created account. Please login.");
            });
        } else {
            res.send("Username has already been taken.");
        }
    });
});

router.delete('/delete', function(req, res) {
    var db = req.db;
    db.collection('userlist').findOne({username: req.body.username, password: req.body.password}, function(err, result) {
        if (result == null) {
            res.send("This user does not exist.");
        } else {
            var userToDelete = result._id;
            db.collection('userlist').removeById(userToDelete, function(err, result) {
                res.send("User was deleted.")
            });
        }
    });
});

router.post('/login', function(req, res) {
    var db = req.db;
    db.collection('userlist').findOne({username: req.body.username, password: req.body.password}, function(err, result) {
        if (result == null) {
            res.send("Username and password combination are invalid.");
        } else {
            res.send("success");
        }
    });
});

router.put('/updateartists', function(req, res) {
    var db = req.db;
    db.collection('userlist').findOne({username: req.body.username, password: req.body.password}, function(err, result) {
        if (result == null) {
            res.send("This user does not exist.");
        } else {
            var userToDelete = result._id;
            db.collection('userlist').update({username: req.body.username}, {$set:{artists:req.body.artists}}, function(err, result) {
                res.send("The user's artists were updated.")
            });
        }
    });
});

router.put('/updatesongs', function(req, res) {
    var db = req.db;
    db.collection('userlist').findOne({username: req.body.username, password: req.body.password}, function(err, result) {
        console.log("err:" + err);
        console.log("result:" + result);
        if (result == null) {
            res.send("This user does not exist.");
        } else {
            var userToDelete = result._id;
            db.collection('userlist').update({username: req.body.username}, {$set:{songs:req.body.songs}}, function(errr, results) {
                res.send("The user's songs were updated.")
            });
        }
    });
});

router.get('/getartists', function(req, res) {
    var db = req.db;
    db.collection('userlist').findOne({username: req.query.username, password: req.query.password}, function(err, result) {
        if (result == null) {
            res.send("User doesn't exist.");
        } else {
            res.send(result.artists);
        }
    });
});

router.get('/getsongs', function(req, res) {
    var db = req.db;
    db.collection('userlist').findOne({username: req.query.username, password: req.query.password}, function(err, result) {
        if (result == null) {
            res.send("User doesn't exist.");
        } else {
            res.send(result.songs);
        }
    });
});

module.exports = router;