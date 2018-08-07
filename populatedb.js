console.log('This script populates some test quotes, authors, categories and quoteinstances to your database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

var async = require('async')
var Quote = require('./models/quotes')
var Author = require('./models/author')
var Category = require('./models/category')



var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var authors = []
var categories = []
var quotes = []


function authorCreate(first_name, family_name, d_birth, d_death, cb) {
    authordetail = { first_name: first_name, family_name: family_name }
    if (d_birth != false) authordetail.date_of_birth = d_birth
    if (d_death != false) authordetail.date_of_death = d_death

    var author = new Author(authordetail);

    author.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Author: ' + author);
        authors.push(author)
        cb(null, author)
    });
}

function categoryCreate(name, cb) {
    var category = new Category({ name: name });

    category.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Category: ' + category);
        categories.push(category)
        cb(null, category);
    });
}

function quoteCreate(category, author, content, cb) {
    quotedetail = {
        content: content,
        author: author
    }
    if (category != false) quotedetail.category = category

    var quote = new Quote(quotedetail);
    quote.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Quote: ' + quote);
        quotes.push(quote)
        cb(null, quote)
    });
}



function createCategoryAuthors(cb) {
    async.parallel([
        function (callback) {
            authorCreate('Patrick', 'Rothfuss', '1973-06-06', false, callback);
        },
        function (callback) {
            authorCreate('Ben', 'Bova', '1932-11-8', false, callback);
        },
        function (callback) {
            authorCreate('Isaac', 'Asimov', '1920-01-02', '1992-04-06', callback);
        },
        function (callback) {
            authorCreate('Bob', 'Billings', false, false, callback);
        },
        function (callback) {
            authorCreate('Jim', 'Jones', '1971-12-16', false, callback);
        },
        function (callback) {
            categoryCreate("Fantasy", callback);
        },
        function (callback) {
            categoryCreate("Science Fiction", callback);
        },
        function (callback) {
            categoryCreate("French Poetry", callback);
        },
    ],
        // optional callback
        cb);
}


function createQuotes(cb) {
    async.parallel([
        function (callback) {
            quoteCreate(categories[0], authors[0], 'I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.', callback);
        },
        function (callback) {
            quoteCreate(categories[0], authors[0], 'Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.', callback);
        },
        function (callback) {
            quoteCreate(categories[0], authors[0], 'Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.', callback);
        },
        function (callback) {
            quoteCreate(categories[1], authors[1], "Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...", callback);
        },
        function (callback) {
            quoteCreate(categories[1], authors[1], "In Ben Bova's previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...", callback);
        },
        function (callback) {
            quoteCreate(categories[1], authors[4], 'Summary of test quote 1', callback);
        },
        function (callback) {
            quoteCreate(false, authors[4], 'Summary of test quote 2', callback)
        }
    ],
        // optional callback
        cb);
}



async.series([
    createCategoryAuthors,
    createQuotes,

],
    function (err, results) {
        if (err) {
            console.log('FINAL ERR: ' + err);
        }

        mongoose.connection.close();
    });
