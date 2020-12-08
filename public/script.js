var axios = require("axios");

var app = new Vue({
    el: '#bodydiv',
    data: {
        cards: [],
        options: [],
        searchTerm: "",
        focusCardID: 0,
        focusCard: {},
    },
    methods: {

        // Uses the API to search the database for cards by partial name
        searchCards: function() {
            var localApp = this;
            console.log("Searching")
            if (this.searchTerm == "") {
                // Catch all for no search term
                alert("You have entered no search term. Your search will return all cards in the database")
            }
            longSearchTerm = '/searchcards/' + this.searchTerm
            axios.get(longSearchTerm)
                .then(function(response) {
                    localApp.cards = response.data
                    if (localApp.cards.length == 0) {
                        // Catch all for an invalid search
                        alert("Your search has returned no cards")
                    }
                })
                .catch(function(error) {
                    console.log(error)
                })
        },

        // Uses the API to search the database for options by card id
        findOptions: function() {
            var localApp = this;
            console.log("Finding Options for id " + localApp.focusCardID)
            longSearchTerm = '/cardoptions/' + localApp.focusCardID
            axios.get(longSearchTerm)
                .then(function(response) {
                    localApp.options = response.data
                    console.log(JSON.stringify(response.data))
                })
                .catch(function(error) {
                    console.log(error)
                })
        },

        // Uses the API to search the database for a specific card by id
        findCard: function() {
            var localApp = this;
            console.log("Finding card for id " + localApp.focusCardID)
            longSearchTerm = '/card/' + localApp.focusCardID
            axios.get(longSearchTerm)
                .then(function(response) {
                    console.log(JSON.stringify(response.data))
                    localApp.focusCard = response.data
                })
                .catch(function(error) {
                    console.log(error)
                })
        },

        // Uses the API to search the database for all info on the card and its relevant options that the user selected, then alters the page to fit
        displayCardInfo: function(position) {
            var localApp = this;
            console.log("Displaying info")
            localApp.focusCardID = localApp.cards[position].id
            localApp.findCard()
            localApp.findOptions()
            document.getElementById("resultdiv").style.display = "none"
            document.getElementById("carddetails").style.display = "grid"
        },

        // Changes the visibility of elements to go 'back'
        backFunction: function() {
            document.getElementById("resultdiv").style.display = "flex"
            document.getElementById("carddetails").style.display = "none"
        }
    }

})