var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;

var app = require('../app');

chai.use(chaiHttp);


describe('CRUD for quotes resources', function () {

    var id = "";

    it('Create new quote', function (done) {
        chai.request(app)
            .post('/quotes')
            .send({
                category: 'Inspirational',
                author: 'Mahatma Gandhi',
                content: "My life is my message",
                userId: '5b5eeeb3c83f5186c9eb0542'

            })
            .end(function (err, res) {
                id = res.body._id;
                expect(res.body).to.have.property('_id');
                done();
            });
    });

    it('Get One Quote', function (done) {
        chai.request(app)
            .get('/quotes/' + id)
            .end(function (err, res) {
                expect(res.body[0].category).to.be.equal('Inspirational');
                done();
            });
    });

    it('Get All Quotes', function (done) {
        chai.request(app)
            .get('/quotes')
            .end(function (err, res) {
                expect(res.body.length).to.be.greaterThan(0)
                done();
            });
    });

    it('Update One Quote', function (done) {
        chai.request(app)
            .put('/quotes/' + id)
            .send({
                content: "My life is my message"
            })
            .end(function (err, res) {
                expect(res.body.content).to.be.equal('My life is my message');
                done();
            });
    });

    it('Delete One Quote', function (done) {
        chai.request(app)
            .delete('/quotes/' + id)
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                done();
            });
    });

});
