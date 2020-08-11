var dbConn = require('../config/db.js')["sqlConn"]();
var userQueries = require('../queries/users');
var commonHelper = require('../helpers/common');

var user = {};

user.getAll = async () => {
  const results = await dbConn.query(userQueries.getAll());
  return results;
}

user.findByMobileOrEmail = async (email, mobile, countryCode) => {
	let query;

	if(!!email) {
		query = userQueries.findByEmail(email);
	} else {
		query = userQueries.findByMobile(mobile, countryCode);
	}

	const results = await dbConn.query(query);
  return results;
}

user.create = async (email, mobile, countryCode) => {
	const results = await dbConn.query(userQueries.create(email, mobile, countryCode, commonHelper.getCurrentTime()));
  return results;
}

module.exports = user;