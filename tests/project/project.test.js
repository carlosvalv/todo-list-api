const request =  require('supertest');
const Pool = require('pg').Pool;
const client = require('../../db.js')

const projectId = "f6a16ff7-4a31-11eb-be7b-8344edc8f36b";
const userId = "731577e4-7547-48cb-9a74-48574d52bd00";
const project ={
    "id": projectId,
    "name": "test project",
    "creation_date": new Date().toString(),
    "deleted_date": null,
    "user_id": userId
}

describe('project', ()=>{
    let app;
    let server;
    let api;
    beforeAll(async function () {
        // Create a new pool with a connection limit of 1
        const pool = new Pool({
            user: "postgres",
            host: "localhost",
            database: "todolist",
            password: "admin",
            port: 5432,
            max: 1,
            idleTimeoutMillis: 0 // Disable auto-disconnection of idle clients to make sure we always hit the same temporal schema
        });
    
        client.pool = pool;

        app = require('../../server.js').app;
        server = require('../../server.js').server;
        api = request(app);
    })
    
    beforeEach( async function () {
        await client.query('CREATE TEMPORARY TABLE "user" (LIKE "user" INCLUDING ALL)').then({})
        await client.query('CREATE TEMPORARY TABLE project (LIKE project INCLUDING ALL)').then({})
        await client.query('CREATE TEMPORARY TABLE task (LIKE task INCLUDING ALL)').then({})
        
    })

    beforeEach(async function () {
        await client.query(`INSERT INTO pg_temp.project (id, name, creation_date, user_id) VALUES ('${projectId}', '${project.name}', to_timestamp(${Date.now()} / 1000.0), '${project.user_id}')`);
        await client.query(`INSERT INTO pg_temp.user (id, creation_date) VALUES ('${userId}', to_timestamp(${Date.now()} / 1000.0))`);
    })

    afterEach(async function () {
        await client.query('DROP TABLE IF EXISTS pg_temp.project')
        await client.query('DROP TABLE IF EXISTS pg_temp.user')
        await client.query('DROP TABLE IF EXISTS pg_temp.task')
    })

    describe('get project route', ()=>{
        test("should return a 404", async ()=> {
            let projectIdTest="784f3300-1b4c-411d-946f-abfb6a5ab82f";
            await request(app).get(`/api/v1/projects/${projectIdTest}`).expect(404);
        });
        test("exists, should return a 200", async ()=> {
            await request(app).get(`/api/v1/projects/${projectId}`).expect(200);
        })
    })

    afterAll(()=>{
        server.close();
    })
})

