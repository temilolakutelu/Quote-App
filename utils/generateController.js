module.exports = function (model) {
    return {
        findByParam: function (req, res, next, id) {
            model.findById(id, function (err, doc) {
                if (err) next(new Error("Data not found"));
                req.docId = doc.id;
                next();
            });
        },
        createOne: function (req, res, next) {
            var body = req.body;
            console.log(body);
            model.create(body, function (err, doc) {
                if (err) next(err);
                res.send(doc);
            });
        },
        deleteOne: function (req, res, next) {
            var id = req.docId;
            model.deleteOne({ _id: id }, function (err, doc) {
                if (err) next(err);
                res.send(doc);
            });
        },
        getAll: function (req, res, next) {
            model.find({}, function (err, docs) {
                if (err) next(err);
                res.status(200).send(docs);
            });
        },
        getOne: function (req, res, next) {
            var id = req.docId;
            model.find({ _id: id }, function (err, docs) {
                if (err) next(err);
                res.send(docs);
            });
        },
        updateOne: function (req, res, next) {
            var id = req.docId;
            var body = req.body;
            model.findOneAndUpdate({ _id: id }, body, function (err, doc) {
                if (err) next(err);
                var updated = Object.assign({}, body, doc);
                res.status(200).send(updated);
            });
        }
    }

};