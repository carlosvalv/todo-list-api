const express = require('express');
const taskRoutes = require('./src/task/routes');
const taskProjects = require('./src/project/routes');

const app = express();
const port = 3001;

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(express.json());

app.get("/", (req, res) =>{
    res.send("Hey");
});

app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/projects', taskProjects);

const server = app.listen(port, () => console.log(`app listening on port ${port}`));

module.exports = {app, server}; 