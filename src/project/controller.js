const pool = require('../../db');
const queries = require('./queries');

const getProjects = (req, res) => {
    pool.query(queries.getProjects, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

module.exports = {
    getProjects,
};