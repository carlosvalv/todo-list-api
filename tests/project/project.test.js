const request =  require('supertest');
const Pool = require('pg').Pool;
const client = require('../../db.js')
const { v4: uuidv4 } = require('uuid');

const projectId = uuidv4();
const userId = uuidv4();
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
        await client.query('CREATE TEMPORARY TABLE "user" (LIKE "user" INCLUDING ALL)').then({});
        await client.query('CREATE TEMPORARY TABLE project (LIKE project INCLUDING ALL)').then({});
        await client.query('CREATE TEMPORARY TABLE task (LIKE task INCLUDING ALL)').then({});
        
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
            let projectIdTest= uuidv4();
            await request(app).get(`/api/v1/projects/${projectIdTest}`).expect(404);
        });
        test("exists, should return a 200", async ()=> {
            await request(app).get(`/api/v1/projects/${projectId}`).expect(200);
        });
    })

    describe('add project route', ()=>{
        test("should return a 200", async ()=> {
            const payload = {id: uuidv4(), name: 'test'};
            await request(app).post(`/api/v1/projects`,).send(payload).expect(200);
        });
        test("missing params, should return a 422", async ()=> {
            const payload = {id: uuidv4()};
            await request(app).post(`/api/v1/projects`,).send(payload).expect(422);
        });
    })

    describe('update project route', ()=>{
        test("should return a 200", async ()=> {
            const payload = {name: 'test2'};
            await request(app).put(`/api/v1/projects/${projectId}`).send(payload).expect(200);
            const res = await request(app).get(`/api/v1/projects/${projectId}`).expect(200);
            expect(res.body[0].name).toEqual(payload.name);
        });
    
        test("missing params, should return a 422", async ()=> {
            const payload = {};
            await request(app).put(`/api/v1/projects/${projectId}`).send(payload).expect(422);
        });
    })

    describe('delete project route', ()=>{
        test("should return a 200", async ()=> {
            await request(app).delete(`/api/v1/projects/${projectId}`).expect(200);
            await request(app).get(`/api/v1/projects/${projectId}`).expect(404);
        });
    })

    afterAll(()=>{
        server.close();
    })
})

