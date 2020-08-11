const tableName = 'useraccountownershiprequests';

module.exports = {
  getAllPendingRequests: function() {
      return 	`SELECT * FROM ${tableName} WHERE status='pending' AND otpVerified=true AND ethAddress IS NOT NULL;`;
  },
  expireRequest: function(id) {
      return 	`UPDATE ${tableName} SET status='expired' WHERE id=${id};`;
  },
  updateStatus: function(id, txnHash, status, userId, memberId) {
      return 	`UPDATE ${tableName} SET status="${status}", transactionHash="${txnHash}", user=${userId}, member=${memberId} WHERE id=${id};`;
  }
}