var mysql = require('mysql');
const util = require( 'util' );

module.exports = {
    "local": {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'superone_prod'
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
    	const connection = mysql.createConnection(this[nodeEnv]);
          return {
            query( sql, args ) {
              return util.promisify( connection.query )
                .call( connection, sql, args );
            },
            close() {
              return util.promisify( connection.end ).call( connection );
            }
          };
    }
}