
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  res.send("respond send succesfully")
});

module.exports = router;
