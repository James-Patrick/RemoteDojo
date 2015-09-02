var dry_layers = require('dry-layers');

var express = require('express');

var router = express.Router();

router.get('/', function (req, res) {
    if (null == dry_layers.Registry.getDatabase()) {
        var err = dry_layers.Registry.getError();
        if (err) {
            res.render('error', {
                message : 'Cannot connect to database',
                error : err
            });
            return;
        }
    }
    res.render('index', { title: 'CoderDojo' });
});

module.exports = router;