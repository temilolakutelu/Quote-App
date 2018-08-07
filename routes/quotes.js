var express = require('express');
var router = express.Router();

// Require controller modules.
var quote_controller = require('../controllers/quotesController');
var author_controller = require('../controllers/authorController');
var category_controller = require('../controllers/categoryController');


/// quote ROUTES ///

// GET catalog home page.
router.get('/', quote_controller.index);

// GET request for creating a quote. NOTE This must come before routes that display quote (uses id).
router.get('/quote/create', quote_controller.quote_create_get);

// POST request for creating quote.
router.post('/quote/create', quote_controller.quote_create_post);

// GET request to delete quote.
router.get('/quote/:id/delete', quote_controller.quote_delete_get);

// POST request to delete quote.
router.post('/quote/:id/delete', quote_controller.quote_delete_post);

// GET request to update quote.
router.get('/quote/:id/update', quote_controller.quote_update_get);

// POST request to update quote.
router.post('/quote/:id/update', quote_controller.quote_update_post);

// GET request for one quote.
router.get('/quote/:id', quote_controller.quote_detail);

// GET request for list of all quote items.
router.get('/quotes', quote_controller.quote_list);

/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get('/author/create', author_controller.author_create_get);

// POST request for creating Author.
router.post('/author/create', author_controller.author_create_post);

// GET request to delete Author.
router.get('/author/:id/delete', author_controller.author_delete_get);

// POST request to delete Author.
router.post('/author/:id/delete', author_controller.author_delete_post);

// GET request to update Author.
router.get('/author/:id/update', author_controller.author_update_get);

// POST request to update Author.
router.post('/author/:id/update', author_controller.author_update_post);

// GET request for one Author.
router.get('/author/:id', author_controller.author_detail);

// GET request for list of all Authors.
router.get('/authors', author_controller.author_list);

/// category ROUTES ///

// GET request for creating a category. NOTE This must come before route that displays category (uses id).
router.get('/category/create', category_controller.category_create_get);

//POST request for creating category.
router.post('/category/create', category_controller.category_create_post);

// GET request to delete category.
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST request to delete category.
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET request to update category.
router.get('/category/:id/update', category_controller.category_update_get);

// POST request to update category.
router.post('/category/:id/update', category_controller.category_update_post);

// GET request for one category.
router.get('/category/:id', category_controller.category_detail);

// GET request for list of all category.
router.get('/categories', category_controller.category_list);



module.exports = router;