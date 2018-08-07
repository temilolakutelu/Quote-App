var express = require('express');
var router = express.Router();

var controller = require('../controllers/userController');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// router.param('id', controller.findByParam);

// router.route('/')
//   .post(controller.createOne)
//   .get(controller.getAll)

// router.route('/:id')
//   .put(controller.updateOne)
//   .delete(controller.deleteOne)
//   .get(controller.getOne)


module.exports = router;
