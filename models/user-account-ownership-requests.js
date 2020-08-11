var dbConn = require('../config/db.js')["sqlConn"]();
var queries = require('../queries/user-account-ownership-requests');

var userAccountOwnershipRequests = {};

userAccountOwnershipRequests.getAllPendingRequests = async () => {
  const results = await dbConn.query(queries.getAllPendingRequests());
  return results;
}

userAccountOwnershipRequests.expireRequest = async (id) => {
  const results = await dbConn.query(queries.expireRequest(id));
  return results;
}

userAccountOwnershipRequests.updateStatus = async (id, txnHash, status, userId, memberId, result) => {
  const results = await dbConn.query(queries.updateStatus(id, txnHash, status, userId, memberId));
  return results;
}

module.exports = userAccountOwnershipRequests;