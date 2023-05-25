const pool = require('../../db');
const queries = require('./queries');

const userId = "f6a16ff7-4a31-11eb-be7b-8344edc8f36b";

const getProjects = (req, res) => {
    pool.query(queries.getProjects, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const getProjectById = async(req, res) => {
    const id = req.params.id;
    if(!id)
        return res.status(422).json(`Missing param id`);
        
    pool.query(queries.getProjectById, [id], (error, results) => {
        if (error) return res.status(500).json(`Project with id ${id} not found`);
        if (results.rows.length === 0)  return res.status(404).json(`Project with id ${id} not found`);
        res.status(200).json(results.rows);
    });
}

const addProject = (req, res) => {
    let creationDate = new Date();
    const { id, name } = req.body;

    pool.query(
        queries.addProject,
        [id, name, creationDate, userId],
        (error, results) => {
            if (error) return res.status(500).json("Error adding project");
            res.status(200).send("Project created succesfully")
        });
}

const updateProject = (req, res) => {
    const id = req.params.id;
    const { name } = req.body;
    
    if (name === undefined)
        return res.status(500).send('Parameters empty')

    pool.query(queries.getProjectById, [id], (error, results) => {
        let notFound = !results || !results.rows.length;
        if (notFound)
            return res.status(404).send(`The project with id ${id} does not exist`);
            
        let query = queries.updateProject;
        let statements = [];
        if (name)
            statements.push(`name = '${name}' `);

        query = query.replace("{{sets}}", statements.join(","));

        pool.query(query, [id], (error, results) => {
            if (error) return res.status(500).json(error);
            res.status(200).send("Project updated succesfully")
        });
    });
}

const deleteProject = (req, res) => {
    const id = req.params.id;
    let deletedDate = new Date();

    pool.query(queries.getProjectById, [id], (error, results) => {
        let notFound = !results || !results.rows.length;
        if (notFound)
            return res.status(404).send(`The project with id ${id} does not exist`);

        pool.query(queries.deleteProject, [deletedDate, id], (error, results) => {
            if (error) return res.status(500).json("Error deleting project with Id " + id);
            res.status(200).send("Project deleted succesfully")
        });
    });
}

module.exports = {
    getProjects,
    getProjectById,
    addProject,
    updateProject,
    deleteProject
};