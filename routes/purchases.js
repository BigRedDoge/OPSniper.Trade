var express = require('express');
var router = express.Router();

router.get('/purchases', function(req, res, next) {
  res.render('purchases', { title: 'OPSniper User Purchases'});
});

module.exports = router;
