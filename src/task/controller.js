const pool = require('../../db');
const queries = require('./queries');

const userId = "f6a16ff7-4a31-11eb-be7b-8344edc8f36b";

const getTasks = (req, res) => {
    pool.query(queries.getTasks, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const getTaskById = (req, res) => {
    const id = req.params.id;
    pool.query(queries.getTaskById, [id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const getTaskByProjectId = (req, res) => {
    const projectId = req.params.projectId;
    pool.query(queries.getTaskByProjectId, [projectId], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const addTask = (req, res) => {
    let creationDate = new Date();
    let done = false;
    const { id, title, description, projectId } = req.body;
    pool.query(
        queries.addTask,
        [id, title, description, done, creationDate, projectId, userId],
        (error, results) => {
            if (error) res.status(500).json("Error adding task");
            res.status(200).send("Task created succesfully")
        });
}

const updateTask = (req, res) => {
    const id = req.params.id;
    const { title } = req.body;

    pool.query(queries.getTaskById, [id], (error, results) => {
        let noTasksFound = !results || !results.rows.length;
        if (noTasksFound)
            res.status(404).send(`The task with id ${id} does not exist`);

        pool.query(queries.updateTask, [title, id], (error, results) =>{
            if (error) res.status(500).json("Error updating task with Id " + id);
            res.status(200).send("Task updated succesfully")
        });
    });
}

const deleteTask = (req, res) => {
    const id = req.params.id;
    let deletedDate = new Date();
    pool.query(
        queries.deleteTask,
        [deletedDate, id],
        (error, results) => {
            if (error) res.status(500).json("Error deleting task with Id " + id);

            let noTasksFound = !results.rows.length;
            if (noTasksFound)
                res.status(404).send(`The task with id ${id} does not exist`);

            res.status(200).send("Task deleted succesfully")
        });
}

module.exports = {
    getTasks,
    getTaskById,
    getTaskByProjectId,
    addTask,
    updateTask,
    deleteTask,
};