var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;

chai.use(chaiHttp);

describe('CRUD for users', function () {
    var id = "";

    it('Create new user', function (done) {
        chai.request('http://localhost:3000')
            .post('/users')
            .send({
                name: "Larry Boo",
                email: "Larry@gmail.com",
                password: "larry",
            })
            .end(function (err, res) {
                id = res.body._id;

                expect(res.body).to.have.property('_id');
                done();
            });
    });

    it('Get One User', function (done) {
        chai.request('http://localhost:3000')
            .get('/users/' + id)
            .end(function (err, res) {
                expect(res.body[0].name).to.be.equal('Larry Boo');
                done();
            });
    });

    it('Get All Users', function (done) {
        chai.request('http://localhost:3000')
            .get('/users')
            .end(function (err, res) {

                expect(res.body.length).to.be.greaterThan(0)
                done();
            });
    });


    it('Update One User', function (done) {
        chai.request('http://localhost:3000')
            .put('/users/' + id)
            .send({
                name: "Monkey tail"
            })
            .end(function (err, res) {

                expect(res.body.name).to.be.equal('Monkey tail');
                done();
            });
    });

    it('Delete One User', function (done) {
        chai.request('http://localhost:3000')
            .delete('/users/' + id)
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                done();
            });
    });
});
