
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter'); var mongoose = require('mongoose')
var Quote = require('../models/quotes');
var Author = require('../models/author');
var Category = require('../models/category');

var async = require('async');



exports.index = function (req, res) {

    async.parallel({
        quote_count: function (callback) {
            Quote.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
       
        
        author_count: function (callback) {
            Author.countDocuments({}, callback);
        },
        category_count: function (callback) {
            Category.countDocuments({}, callback);
        },
    }, function (err, results) {
        res.render('index', { title: 'Quote App', error: err, data: results });
    });
};


// Display list of allquotes.
exports.quote_list = function (req, res, next) {

    Quote.find({}, 'category author')

        .populate('author')
        .exec(function (err, list_quotes) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('quote_list', { title: 'Quote List', quote_list: list_quotes });
        });

};

// Display detail page for a specific quote.
exports.quote_detail = function (req, res, next) {

    async.parallel({
        quote: function (callback) {

            Quote.findById(req.params.id)
                .populate('author')
                .populate('category')
                .exec(callback);
        },
       
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.quote == null) { // No results.
            var err = new Error('Quote not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('quote_detail', { title: 'Category', quote: results.quote});
    });

};

// Display quote create form on GET.
exports.quote_create_get = function (req, res, next) {
    // Get all authors and categories, which we can use for adding to our quote.
    async.parallel({
        authors: function (callback) {
            Author.find(callback);
        },
        categories: function (callback) {
            Category.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        res.render('quote_form', { title: 'Create Quote', authors: results.authors, categories: results.categories });
    });

};

// Handle quote create on POST.
exports.quote_create_post = [
    // Convert the category to an array.
    (req, res, next) => {
        if (!(req.body.category instanceof Array)) {
            if (typeof req.body.category === 'undefined')
                req.body.category = [];
            else
                req.body.category = new Array(req.body.category);
        }
        next();
    },

    // Validate fields.
    body('category', 'Category must not be empty.').isLength({ min: 1 }).trim(),
    body('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
    body('content', 'Content must not be empty.').isLength({ min: 1 }).trim(),


    // Sanitize fields (using wildcard).
    sanitizeBody('*').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Quote object with escaped and trimmed data.
        var quote = new Quote(
            {
                category: req.body.category,
                author: req.body.author,
                content: req.body.content,


            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and categories for form.
            async.parallel({
                authors: function (callback) {
                    Author.find(callback);
                },
                categories: function (callback) {
                    Category.find(callback);
                },
            }, function (err, results) {
                if (err) { return next(err); }

                // Mark our selected categories as checked.
                for (let i = 0; i < results.categories.length; i++) {
                    if (quote.category.indexOf(results.categories[i]._id) > -1) {
                        results.categories[i].checked = 'true';
                    }
                }
                res.render('quote_form', { title: 'Create Quote', authors: results.authors, categories: results.categories, quote: quote, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save quote.
            quote.save(function (err) {
                if (err) { return next(err); }
                //successful - redirect to new quote record.
                res.redirect(quote.url);
            });
        }
    }
];

// Display quote delete form on GET.
exports.quote_delete_get = function (req, res, next) {
    async.parallel({
        quote: function (callback) {
            Quote.findById(req.params.id).populate('author').populate('category').exec(callback);
        },
       
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.Quote == null) { // No results.
            res.redirect('/catalog/Quotes');
        }
        // Successful, so render.
        res.render('Quote_delete', { title: 'Delete Quote', Quote: results.Quote });
    });
};

// Handle quote delete on POST.
exports.quote_delete_post = function (req, res, next) {
    async.parallel({
        quote: function (callback) {
            Quote.findById(req.params.id).populate('author').populate('category').exec(callback);
        },
       
    }, function (err, results) {
        if (err) { return next(err); }
        // Success
      
        else {
            // Quote has no QuoteInstance objects. Delete object and redirect to the list of quotes.
            Quote.findByIdAndRemove(req.body.id, function deleteQuote(err) {
                if (err) { return next(err); }
                // Success - got to quotes list.
                res.redirect('/catalog/quotes');
            });

        }
    });
};

// Display quote update form on GET.
exports.quote_update_get = function (req, res, next) {
    // Get quote, authors and categories for form.
    async.parallel({
        quote: function (callback) {
            Quote.findById(req.params.id).populate('author').populate('category').exec(callback);
        },
        authors: function (callback) {
            Author.find(callback);
        },
        categories: function (callback) {
            Category.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.quote == null) { // No results.
            var err = new Error('Quote not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        // Mark our selected categories as checked.
        for (var all_g_iter = 0; all_g_iter < results.categories.length; all_g_iter++) {
            for (var quote_g_iter = 0; quote_g_iter < results.quote.category.length; quote_g_iter++) {
                if (results.categories[all_g_iter]._id.toString() == results.quote.category[quote_g_iter]._id.toString()) {
                    results.categories[all_g_iter].checked = 'true';
                }
            }
        }
        res.render('quote_form', { title: 'Update Quote', authors: results.authors, categories: results.categories, quote: results.quote });
    });

};

// Handle quote update on POST.
exports.quote_update_post = [

    // Convert the category to an array
    (req, res, next) => {
        if (!(req.body.category instanceof Array)) {
            if (typeof req.body.category === 'undefined')
                req.body.category = [];
            else
                req.body.category = new Array(req.body.category);
        }
        next();
    },

    // Validate fields.
    body('category', 'Category must not be empty.').isLength({ min: 1 }).trim(),
    body('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
    body('content', 'Content must not be empty.').isLength({ min: 1 }).trim(),


    // Sanitize fields.
    sanitizeBody('category.*').trim().escape(),
    sanitizeBody('author').trim().escape(),
    sanitizeBody('content').trim().escape(),



    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Quote object with escaped/trimmed data and old id.
        var quote = new Quote(
            {
                category: (typeof req.body.category === 'undefined') ? [] : req.body.category,
                author: req.body.author,
                content: req.body.content,
                _id: req.params.id //This is required, or a new ID will be assigned!
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and categories for form.
            async.parallel({
                authors: function (callback) {
                    Author.find(callback);
                },
                categories: function (callback) {
                    Category.find(callback);
                },
            }, function (err, results) {
                if (err) { return next(err); }

                // Mark our selected categories as checked.
                for (let i = 0; i < results.categories.length; i++) {
                    if (quote.category.indexOf(results.categories[i]._id) > -1) {
                        results.categories[i].checked = 'true';
                    }
                }
                res.render('quote_form', { title: 'Update Quote', authors: results.authors, categories: results.categories, quote: quote, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Quote.findByIdAndUpdate(req.params.id, quote, {}, function (err, thequote) {
                if (err) { return next(err); }
                // Successful - redirect to quote detail page.
                res.redirect(thequote.url);
            });
        }
    }
];