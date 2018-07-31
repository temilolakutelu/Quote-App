var express = require('express');
var router = express.Router();

var controller = require('../controllers/userController');

router.param('id', controller.findByParam);

router.route('/')
  .post(controller.createOne)
  .get(controller.getAll)

router.route('/:id')
  .put(controller.updateOne)
  .delete(controller.deleteOne)
  .get(controller.getOne)


module.exports = router;
