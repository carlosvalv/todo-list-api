# todo-list-api

node .\server.js   


docker build -t postgresdb .
docker run -d --name todolist-postgresdb-container -p 5432:5432 postgresdb