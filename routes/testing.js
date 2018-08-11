var express = require('express');
var router = express.Router();

router.get('/optest', function(req, res, next) {
  res.render('testing', { title: 'OPSniper Testing Page'});
});

module.exports = router;
