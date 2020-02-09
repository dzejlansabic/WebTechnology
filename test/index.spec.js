const supertest = require("supertest");
const assert = require('assert');
const app = require("../index.js");

var chai = require("chai");
var chaiHttp = require("chai-http");
chai.use(chaiHttp);

const db = require('../js/db.js');

var expect = chai.expect;

before(function (done) {
    setTimeout(function () {
        done();
    }, 1700);
});

describe('Tests', function () { 

    
        it("GET/osoblje vraca status code OK - 200", function (done) {
            supertest(app).get('/osoblje')
                .end(function (err, res) {

                    if (err) done(err);
                    expect(res).to.have.status(200);
                    done();
                })

        });




        it("GET/provjera statusa ucitavanja", function (done) {
            supertest(app).get('/html/ucitavanje')
                .end(function (err, res) {

                    if (err) done(err);
                    expect(res).to.have.status(200);
                    done();
                })

        });


        it("GET/provjera statusa vracanja osoba", function (done) {
            supertest(app).get('/vratiOsoblje')
                .end(function (err, res) {

                    if (err) done(err);
                    expect(res).to.have.status(200);
                    done();
                })

        });


        it("GET/provjera statusa vracanja osoba i mjesta", function (done) {
            supertest(app).get('/vratiOsobeMjesto')
                .end(function (err, res) {

                    if (err) done(err);
                    expect(res).to.have.status(200);
                    done();
                })

        });        
});