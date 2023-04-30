const getProjects = "SELECT * FROM project WHERE deleted_date is null";
const getProjectById = "SELECT * FROM project WHERE id = $1 AND deleted_date is null";
const addProject = "INSERT INTO project (id, name, creation_date, user_id) VALUES ($1, $2, $3, $4)";
const updateProject = "UPDATE project SET {{sets}} WHERE id = $1";
const deleteProject = "UPDATE project SET deleted_date = $1 WHERE id = $2";

module.exports = {
    getProjects,
    getProjectById,
    addProject,
    updateProject,
    deleteProject
};
