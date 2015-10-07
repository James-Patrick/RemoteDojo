var express = require('express');
var router = express.Router();
var dry_layers = require('dry-layers');

router.all('*', dry_layers.SecurityService.authorize('meeting', function (req) {
    return (-1 != req.user.roles.indexOf('Ninja'));
}));

router.get('/', function(req, res, next) {
  res.render('ninja');
});

module.exports = router;
