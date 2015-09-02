var dry_layers = require('dry-layers');

var express = require('express');

var router = express.Router();

router.get('/', dry_layers.SecurityService.authenticated, function (req, res) {
    var c1 = dry_layers.Registry.getCollection('dojo');
    c1.find().toArray(function (err, dojos) {
        if (err) {
            res.status(500);
            return;
        }
        var c2 = dry_layers.Registry.getCollection('role');
        c2.find().toArray(function (err, roles) {
            res.render('champion', {
                title: "Champion",
                dojos: dojos,
                roles: roles
            });
        });
    });
});

module.exports = router;