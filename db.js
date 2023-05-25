const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "todolist",
    password: "admin",
    port: 5432,
    max: 10, // Pool max size
    idleTimeoutMillis: 1000 // Close idle clients after 1 second
});

module.exports = pool;