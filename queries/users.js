const tableName = 'user';
const KEYS = require("../config/keys")[process.env.NODE_ENV || "local"];

module.exports = {
  getAll: function() {
    return "SELECT * from users";
  },
  findByEmail: function(email) {
    return `SELECT * FROM ${tableName} WHERE email="${email}" LIMIT 1;`;
  },
  findByMobile: function(mobile, countryCode) {
    return `SELECT * FROM ${tableName} WHERE mobileNo=${mobile} AND countryCode=${countryCode} LIMIT 1;`;
  },
  create: function(email, mobile, countryCode, time) {
    let query = `INSERT INTO user(createdAt, updatedAt, email, mobileNo, password, countryCode, hotWalletId, isMigrated) VALUES (${time}, ${time}, `;
    query += !!email ? `"${email}", ` : `null, `;
    query += `${mobile}, "${KEYS.TEMP_PASSWORD}", ${countryCode}, 1, 0);`;
    return query;
  }
}