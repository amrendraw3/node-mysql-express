var dbConn = require('../config/db.js')["sqlConn"]();
var userQueries = require('../queries/users');

var user = {};

user.getAll = result => {
    dbConn.query(userQueries.getAll(), function(error, results, fields) {
        if (error) throw error;
        console.log('The users are: ', results);
        result(null, results);
    });
}

module.exports = user;