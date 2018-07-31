var express = require('express');
var router = express.Router();

var controller = require('../controllers/quotesController');

router.param('id', controller.findByParam);

router.route('/')
    .post(controller.createOne)
    .get(controller.getAll);

router.route('/:id')
    .delete(controller.deleteOne)
    .put(controller.updateOne)
    .get(controller.getOne);

module.exports = router;