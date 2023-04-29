const express = require('express');
const taskRoutes = require('./src/task/routes');

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) =>{
    res.send("Hey");
});

app.use('/api/v1/tasks', taskRoutes);

app.listen(port, () => console.log(`app listening on port ${port}`));