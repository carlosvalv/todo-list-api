const getTasks = "SELECT * FROM task WHERE deleted_date is null ORDER BY creation_date";
const getTaskById = "SELECT * FROM task WHERE id = $1 AND deleted_date is null";
const getTaskByProjectId = "SELECT * FROM task WHERE project_id = $1 AND deleted_date is null  ORDER BY task.order ASC";
const addTask = "INSERT INTO task (id, title, description, done, creation_date, project_id, user_id, order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
const updateTask = "UPDATE task SET {{sets}} WHERE id = $1";
const deleteTask = "UPDATE task SET deleted_date = $1 WHERE id = $2";

module.exports = {
    getTasks,
    getTaskById,
    getTaskByProjectId,
    addTask,
    updateTask,
    deleteTask
};
