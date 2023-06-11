const pool = require('../../db');
const queries = require('./queries');

const userId = "f6a16ff7-4a31-11eb-be7b-8344edc8f36b";

const getTasks = (req, res) => {
    pool.query(queries.getTasks, (error, results) => {
        if (error) return res.status(500).json("Error get tasks");
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
    const { id, title, description, projectId, order } = req.body;
    pool.query(
        queries.addTask,
        [id, title, description, done, creationDate, projectId, userId, order, creationDate],
        (error, results) => {
            if (error) return res.status(500).json("Error adding task");
            res.status(200).send("Task created succesfully")
        });
}

const updateTask = (req, res) => {
    const id = req.params.id;
    const { title, description, done } = req.body;

    if (title === undefined && description === undefined && done === undefined)
        return res.status(422).json(`Missing params`);

    pool.query(queries.getTaskById, [id], (error, results) => {
        let noTasksFound = !results || !results.rows.length;
        if (noTasksFound)
            return res.status(404).send(`The task with id ${id} does not exist`);
            
        let query = queries.updateTask;
        let statements = [];
        if (title)
            statements.push(`title = '${title}' `);
        if (description)
            statements.push(`description = '${description}' `);
        if (done !== undefined && done !== null && done.toString())
            statements.push(`done = '${done}' `);

        query = query.replace("{{sets}}", statements.join(","));
        pool.query(query, [id], (error, results) => {
            if (error) return res.status(500).json(error);
            res.status(200).send("Task updated succesfully")
        });
    });
}

const orderTasks = (req, res) => {
    const { ids } = req.body;
    
    if (ids === undefined || !ids.length)
        return res.status(422).json(`Missing params`);

        let query = "update task set \"order\" = nv.o " +
        "from( values "+
        ids.map((element, index) => {
            return "(uuid('"+element+"'), "+index+") "
        });
        query +=") as nv (id, o) "+
        "where task.id = nv.id";
    pool.query(query, (error, results) => {
        if (error) return res.status(500).json(error);
        res.status(200).send("Task updated succesfully")     
    });
}


const deleteTask = (req, res) => {
    const id = req.params.id;
    let deletedDate = new Date();

    pool.query(queries.getTaskById, [id], (error, results) => {
        let notFound = !results || !results.rows.length;
        if (notFound)
            return res.status(404).send(`The task with id ${id} does not exist`);

        pool.query(queries.deleteTask, [deletedDate, id], (error, results) => {
            if (error) return res.status(500).json("Error deleting task with Id " + id);
            res.status(200).send("Task deleted succesfully")
        });
    });
}

module.exports = {
    getTasks,
    getTaskById,
    getTaskByProjectId,
    addTask,
    updateTask,
    orderTasks,
    deleteTask,
};