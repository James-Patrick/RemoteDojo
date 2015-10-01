var express = require('express');

var router = express.Router();

router.get('/', function (req, res) {
    res.render('index', { title: 'CoderDojo' });
});

module.exports = router;