var dbConn = require('../config/db.js')["sqlConn"]();
var queries = require('../queries/ethereum-last-scan-blocks');
var commonHelper = require('../helpers/common');

var lastScanBlocksRequests = {};

lastScanBlocksRequests.getLast = async () => {
  const results = await dbConn.query(queries.getLast());
  return results;
}

lastScanBlocksRequests.updateBlock = async (block) => {
  const results = await dbConn.query(queries.updateBlock(block, commonHelper.getCurrentTime()));
  return results;
}

lastScanBlocksRequests.createBlock = async (block) => {
  const results = await dbConn.query(queries.createBlock(block, commonHelper.getCurrentTime()));
  return results;
}


module.exports = lastScanBlocksRequests;