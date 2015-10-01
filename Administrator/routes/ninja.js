var dry_layers = require('dry-layers');

var express = require('express');

var router = express.Router();

router.all('*', dry_layers.SecurityService.authorize('meeting', function (req) {
    return (-1 != req.user.roles.indexOf('Ninja'));
}));

router.get('/', function (req, res) {
    res.render('ninja', {
        title: "Ninja",
        user: req.user
    });
});

module.exports = router;