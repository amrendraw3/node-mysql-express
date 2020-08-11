const tableName = 'ethereumlastscanblocks';

module.exports = {
  getLast: function() {
      return 	`SELECT * FROM ${tableName} ORDER BY blockNumber DESC LIMIT 1;`;
  },
  updateBlock: function(block, time) {
    return 	`UPDATE ${tableName} SET blockNumber=${block}, updatedAt=${time};`;
  },
  createBlock: function(block, time) {
    return 	`INSERT INTO ${tableName}(blockNumber, createdAt, updatedAt) VALUES (${block}, ${time}, ${time})`;
  }
}