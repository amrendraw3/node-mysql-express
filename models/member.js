var dbConn = require('../config/db.js')["sqlConn"]();
var queries = require('../queries/member');

var member = {};

member.findByEthAddress = async (address) => {
  const results = await dbConn.query(queries.findByEthAddress(address));
  return results;
}

member.findByUser = async (userId) => {
  const results = await dbConn.query(queries.findByUser(userId));
  return results;
}

member.updateMemberForUser = async (memberId, userId) => {

  const userMembers = await member.findByUser(userId);
  let active = false;

  if(userMembers.length == 0) {
    active = true;
  } else {
    let activeMember = userMembers.find(member => member.active);
    active = !activeMember;
  }

  const results = await dbConn.query(queries.associateUser(memberId, userId, active));
  return results;
}


module.exports = member;