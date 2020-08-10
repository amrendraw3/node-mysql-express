var mysql = require('mysql');
module.exports = {
    "local": {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'node-mysql'
    },

    "staging": {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'node-mysql-stag'
    },

    "production": {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'node-mysql-prod'
    },

    sqlConn: function() {
    	const nodeEnv = process.env.NODE_ENV || "local";
    	var connection = mysql.createConnection(this[nodeEnv]);
    	connection.connect();
    	return connection;
    }
}