const tableName = 'member';

module.exports = {
  findByEthAddress: function(address) {
    return `SELECT id, user, userId, active, oldEthAddress FROM ${tableName} WHERE oldEthAddress="${address}" LIMIT 1;`;
  },
  findByUser: function(userId) {
  	console.log(`SELECT id, active, oldEthAddress FROM ${tableName} WHERE user=${userId};`);
    return `SELECT id, active, oldEthAddress FROM ${tableName} WHERE user=${userId};`;
  },
  associateUser: function(memberId, userId, active) {
    return `UPDATE ${tableName} SET user=${userId}, userId=${userId}, active=${active} WHERE id=${memberId};`;
  }
}