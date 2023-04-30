const getProjects = "SELECT * FROM project WHERE deleted_date is null";

module.exports = {
    getProjects,
};
