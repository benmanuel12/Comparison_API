var axios = require("axios");

var expect = require('chai').expect;

describe('#testgetCard()', function() {
    var url = "http://localhost:8080/card/1"

    it("Should return JSON object of the card of the given id ", function(done) {
        axios.get(url)
            .then(function(response) {
                expect(response.body).to.have.property('id');
                expect(response.body).to.have.property('card_name');
                expect(response.body).to.have.property('card_set_code');
                expect(response.body).to.have.property('image_url');
                expect(response.body.id).to.equal(1)
            })
            .catch(function(error) {
                console.log(error)
            })
        done();
    })
})

describe('#testgetOption()', function() {
    var url = "http://localhost:8080/option/1"

    it("Should return JSON object of the option of the given id ", function(done) {
        axios.get(url)
            .then(function(response) {
                expect(response.body.data).to.have.property('id');
                expect(response.body.data).to.have.property('shop_name');
                expect(response.body.data).to.have.property('card_id');
                expect(response.body.data).to.have.property('price');
                expect(response.body.data).to.have.property('link');
                expect(response.body.data.id).to.equal(1)
            })
            .catch(function(error) {
                console.log(error)
            })
        done();
    })
})

describe('#testgetCardOptions()', function() {
    var url = "http://localhost:8080/cardoptions/1"

    it("Should return array of JSON objects of options for that card id", function(done) {
        axios.get(url)
            .then(function(response) {
                expect(Array.isArray(response.body)).to.be.true
                    // There's a possibility that the array is empty, so I can't expect it to be filled
            })
            .catch(function(error) {
                console.log(error)
            })
        done();
    })
})

describe('#testgetAllCards()', function() {
    var url = "http://localhost:8080/card/1"

    it("Should return array containing all the cards on the database", function(done) {
        axios.get(url)
            .then(function(response) {
                expect(Array.isArray(response.body)).to.be.true
                    // Since the scrapers dynamically fill it, I can't trust the output remains the same each time
            })
            .catch(function(error) {
                console.log(error)
            })
        done();
    })
})

describe('#testgetAllOptions()', function() {
    var url = "http://localhost:8080/card/1"

    it("Should return array containing all the options on the database", function(done) {
        axios.get(url)
            .then(function(response) {
                expect(Array.isArray(response.body)).to.be.true
                    // Since the scrapers dynamically fill it, I can't trust the output remains the same each time
            })
            .catch(function(error) {
                console.log(error)
            })
        done();
    })
})