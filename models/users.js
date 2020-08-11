var dbConn = require('../config/db.js')["sqlConn"]();
var userQueries = require('../queries/users');
var commonHelper = require('../helpers/common');

var user = {};

user.getAll = result => {
    dbConn.query(userQueries.getAll(), function(error, results, fields) {
        if (error) throw error;
        console.log('The users are: ', results);
        result(null, results);
    });
}

user.findByMobileOrEmail = (email, mobile, countryCode, result) => {
	let query;

	if(!!email) {
		query = userQueries.findByEmail(email);
	} else {
		query = userQueries.findByMobile(mobile, countryCode);
	}

	dbConn.query(query, function(error, results, fields) {
    if (error) throw error;
    console.log('The users are: ', results);
    result(null, results);
  });
}

user.create = (email, mobile, countryCode, result) => {
	dbConn.query(userQueries.create(email, mobile, countryCode, commonHelper.getCurrentTime()), function(error, results, fields) {
    if (error) throw error;
    console.log('The users are: ', results);
    result(null, results);
  });
}

module.exports = user;