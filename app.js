var express = require('express')
var url = require("url")

require('./http_status')

var app = express()

var mysql = require('mysql')
const { response } = require('express')

var connectionPool = mysql.createPool({
    connectionLimit: 1,
    host: "localhost",
    user: "root",
    password: "",
    database: "comparison_database",
    debug: false
})

app.get('/test', handleGetRequestTest)

// Return all cards
app.get('/cards', handleGetRequest)

// Return all cards whose name contains given string
app.get('/cards/*', handleGetRequest)

// Return card with given id
app.get('/card/*', handleGetRequest)

//Return all options
app.get('/options', handleGetRequest)

// Return option with given id
app.get('/option/*', handleGetRequest)

// Return all options for the given (card) id
app.get('/cardoptions/*', handleGetRequest)

console.log("App listening on 8080")
app.listen(8080)

function handleGetRequestTest(request, response) {
    try {
        console.log("GET Recieved")
    } catch (ex) {
        response.status(HTTP_STATUS.NOT_FOUND);
        response.send("{error: '" + JSON.stringify(ex) + "', url: " + request.url + "}");
    }
}

function handleGetRequest(request, response) {
    let urlObject = url.parse(request.url, true)

    let queries = urlObject.query

    let numItems = queries['num_items'];
    let offset = queries['offset'];

    let pathArray = urlObject.pathname.split("/");

    let pathBeforeEnd = pathArray[pathArray.length - 2];

    let pathEnd = pathArray[pathArray.length - 1];

    try {
        //console.log("pathBeforeEnd is " + pathBeforeEnd)
        // console.log("pathEnd is " + pathEnd)
        // console.log("pathEnd is type " + typeof(pathEnd))
        let regExAllDigits = new RegExp('^[0-9]+$')

        if (pathEnd === "cards") {
            console.log("Getting all cards")
            getAllCardsCount(response, numItems, offset);
            return;

        }
        if (pathBeforeEnd === "card" && regExAllDigits.test(pathEnd)) {
            console.log("Getting card with id" + pathEnd)
            getCard(response, pathEnd);
            return;

        }
        if (pathBeforeEnd === "cards" && typeof(pathEnd) == "string") {
            console.log("Getting all cards with query " + pathEnd)
            searchCardsCount(response, numItems, offset, pathEnd);
            return;

        }
        if (pathEnd === "options") {
            console.log("Getting all options")
            getAllOptionsCount(response, numItems, offset)
            return;

        }
        if (pathBeforeEnd === "option" && regExAllDigits.test(pathEnd)) {
            console.log("Getting option with id " + pathEnd)
            getOption()
            return;

        }
        if (pathBeforeEnd === "cardoptions" && regExAllDigits.test(pathEnd)) {
            console.log("Getting all options for given card")
                //getCardOptions()
            return;
        }
    } catch (ex) {
        response.status(HTTP_STATUS.NOT_FOUND);
        response.send("{error: '" + JSON.stringify(ex) + "', url: " + request.url + "}");
    }
}

function getAllCardsCount(response, numItems, offset) {
    var sql = "SELECT COUNT(*) FROM cards";

    connectionPool.query(sql, function(err, result) {

        if (err) {
            response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            response.json({ 'error': true, 'message': +err })
            return;

        }

        let total = result[0]['COUNT(*)']

        getAllCards(response, total, numItems, offset)
    });
}

function getAllCards(response, total, numItems, offset) {
    let sql = "SELECT * FROM cards"

    if (numItems != undefined && offset != undefined) {
        sql += " ORDER BY id LIMIT " + numItems + " OFFSET " + offset;
    }

    connectionPool.query(sql, function(err, result) {

        if (err) {
            response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            response.json({ 'error': true, 'message': +err })
            return;

        }

        let returnObject = { total: total }
        returnObject.data = result;

        response.json(returnObject);
    });
}


function getCard(response, id) {
    let sql = "SELECT * FROM cards WHERE id = " + id + ";"

    console.log(sql);
    connectionPool.query(sql, function(err, result) {

        if (err) {
            response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            response.json({ 'error': true, 'message': +err })
            return;

        }

        let returnObject = { data: result }

        response.json(returnObject);
    });
}

function searchCardsCount(response, numItems, offset, name) {
    var sql = "SELECT COUNT(*) FROM cards WHERE card_name LIKE '%" + name + "%';";

    connectionPool.query(sql, function(err, result) {

        if (err) {
            response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            response.json({ 'error': true, 'message': +err })
            return;

        }

        let total = result[0]['COUNT(*)']

        searchCards(response, numItems, offset, name)
    });
}

function searchCards(response, numItems, offset, name) {
    let sql = "SELECT * FROM cards WHERE card_name LIKE '%" + name + "%';";

    if (numItems != undefined && offset != undefined) {
        sql += " ORDER BY id LIMIT " + numItems + " OFFSET " + offset;
    }

    connectionPool.query(sql, function(err, result) {

        if (err) {
            response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            response.json({ 'error': true, 'message': +err })
            return;

        }

        let returnObject = { data: result }

        response.json(returnObject);
    });
}

function getAllOptionsCount(response, numItems, offset) {
    var sql = "SELECT COUNT(*) FROM options";

    connectionPool.query(sql, function(err, result) {

        if (err) {
            response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            response.json({ 'error': true, 'message': +err })
            return;

        }

        let total = result[0]['COUNT(*)']

        getAllOptions(response, total, numItems, offset)
    });
}

function getAllOptions(response, total, numItems, offset) {
    let sql = "SELECT * FROM options"

    if (numItems != undefined && offset != undefined) {
        sql += " ORDER BY id LIMIT " + numItems + " OFFSET " + offset;
    }

    connectionPool.query(sql, function(err, result) {

        if (err) {
            response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            response.json({ 'error': true, 'message': +err })
            return;

        }

        let returnObject = { total: total }
        returnObject.data = result;

        response.json(returnObject);
    });
}

function getOption(response, id) {
    let sql = "SELECT * FROM option WHERE id = " + id + ";"

    console.log(sql);
    connectionPool.query(sql, function(err, result) {

        if (err) {
            response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            response.json({ 'error': true, 'message': +err })
            return;

        }

        let returnObject = { data: result }

        response.json(returnObject);
    });
}