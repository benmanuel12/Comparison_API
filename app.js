// Import requirements

var express = require('express')
var url = require("url")

require('./http_status')

var app = express()

var mysql = require('mysql')

// Create connection pool
var connectionPool = mysql.createPool({
    connectionLimit: 1,
    host: "localhost",
    user: "root",
    password: "",
    database: "comparison_database",
    debug: false
})

app.use(express.static('public'))

// Return all cards
app.get('/cards', handleGetRequest)

// Return all cards whose name contains given string
app.get('/searchcards/*', handleGetRequest)

// Return card with given id
app.get('/card/*', handleGetRequest)

//Return all options
app.get('/options', handleGetRequest)

// Return option with given id
app.get('/option/*', handleGetRequest)

// Return all options for the given (card) id
app.get('/cardoptions/*', handleGetRequest)

// Open the server
console.log("App listening on 8080")
app.listen(8080)

// Parse the URL and call the correct function based on its structure
function handleGetRequest(request, response) {
    let urlObject = url.parse(request.url, true)

    let queries = urlObject.query

    let numItems = queries['num_items'];
    let offset = queries['offset'];

    let pathArray = urlObject.pathname.split("/");

    let pathBeforeEnd = pathArray[pathArray.length - 2];

    let pathEnd = pathArray[pathArray.length - 1];

    try {
        let regExAllDigits = new RegExp('^[0-9]+$')

        if (pathEnd === "cards") {
            console.log("Getting all cards")
            getAllCardsCount(response, numItems, offset);
            return;

        }
        if (pathBeforeEnd === "card" && regExAllDigits.test(pathEnd)) {
            console.log("Getting card with id " + pathEnd)
            getCard(response, pathEnd);
            return;

        }
        if (pathBeforeEnd === "searchcards" && typeof(pathEnd) == "string") {
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
            getOption(response, pathEnd)
            return;

        }
        if (pathBeforeEnd === "cardoptions" && regExAllDigits.test(pathEnd)) {
            console.log("Getting all options for given card")
            getCardOptionsCount(response, numItems, offset, pathEnd)
            return;
        }
    } catch (ex) {
        response.status(HTTP_STATUS.NOT_FOUND);
        response.send("{error: '" + JSON.stringify(ex) + "', url: " + request.url + "}");
    }
}
// Queries the database for total number of cards in database
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

// Queries database for data on all cards in database
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

// Queries database for data on a specific card
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

        response.json(returnObject.data[0]);
    });
}

// Queries database for total number of cards with a name containing the given string
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
// Queries the database for data on cards with a name containing the given string
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

        response.json(returnObject.data);
    });
}


// Queries database for total number of options in the database
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

// Queries database for data on all options
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

// Queries database for data on a specific option
function getOption(response, id) {
    let sql = "SELECT * FROM options WHERE id = " + id + ";"

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

// Queries database for total number of options for the given card id
function getCardOptionsCount(response, numItems, offset, id) {
    var sql = "SELECT COUNT(*) FROM options WHERE card_id = " + id + ";";

    console.log(sql)

    connectionPool.query(sql, function(err, result) {

        if (err) {
            response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            response.json({ 'error': true, 'message': +err })
            return;

        }

        let total = result[0]['COUNT(*)']

        getCardOptions(response, total, numItems, offset, id)
    });
}

// Queries database for data on all options for the given card id
function getCardOptions(response, total, numItems, offset, id) {
    let sql = "SELECT shop_name, price, link FROM options WHERE card_id = " + id + ";";

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

        response.json(returnObject.data);
    });
}