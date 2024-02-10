/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable object-curly-spacing */
const request = require("supertest");
const db = require("../models");
const app = require("../app");

let server;
let agent;

const login = async (agent, email, password) => {
  let res = await agent.get("/get-csrf-token");
  const csrfToken = res.body.csrfToken;
  // post csrf in header as xsrf-token
  res = await agent
    .post("/login")
    .send({ email, password })
    .set("xsrf-token", csrfToken);
  return res;
};

describe("Sport Shedular Test Suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3001);
    agent = request.agent(server);
  });

  afterAll(async () => {
    await db.sequelize.close();
    await server.close();
  });

  test("User can signup", async () => {
    const res = await agent.get("/get-csrf-token");
    const csrfToken = res.body.csrfToken;
    const name = "test";
    const email = "test@gmail.com";
    const password = "password";
    const response = await agent
      .post("/signup")
      .send({ name, email, password })
      .set("xsrf-token", csrfToken);
    expect(response.statusCode).toBe(200);
  });

  test("User can login", async () => {
    const response = await login(agent, "test@gmail.com", "password");
    expect(response.statusCode).toBe(200);
  });

  test("User can not login with wrong password", async () => {
    const response = await login(agent, "test@gmail.com", "wrongpassword");
    expect(response.statusCode).toBe(400);
  });

  test("checking admin", async () => {
    const res = await agent.get("/get-csrf-token");
    const csrfToken = res.body.csrfToken;
    const response = await agent
      .post("/check-admin")
      .send({ email: "test@gmail.com" })
      .set("xsrf-token", csrfToken);
    expect(response.statusCode).toBe(200);
  });

  test("User can create sport", async () => {
    await login(agent, "test@gmail.com", "password");
    const res = await agent.get("/get-csrf-token");
    const csrfToken = res.body.csrfToken;
    const response = await agent
      .post("/create-sport")
      .send({ s_name: "Football" })
      .set("xsrf-token", csrfToken);
    expect(response.statusCode).toBe(200);
  });

  test("User can get sports", async () => {
    const response = await agent.get("/get-sports");
    expect(response.statusCode).toBe(200);
  });

  test("User can get sport by id", async () => {
    const sports = await agent.get("/get-sports");
    const id = sports.body[0].id;
    const response = await agent.get(`/get-sport/${id}`);
    expect(response.statusCode).toBe(200);
  });

  test("User can create session", async () => {
    const sports = await agent.get("/get-sports");
    const s_id = sports.body[0].id;
    const res = await agent.get("/get-csrf-token");
    const csrfToken = res.body.csrfToken;
    const response = await agent
      .post("/create-session")
      .send({
        sess_name: "Training",
        s_id,
        userId: 1,
        date: "2021-08-01",
        start_time: "10:00",
        end_time: "12:00",
        venue: "Lekki",
      })
      .set("xsrf-token", csrfToken);
    expect(response.statusCode).toBe(200);
  });

  test("User can get session by id and sport id", async () => {
    const sports = await agent.get("/get-sports");
    const s_id = sports.body[0].id;
    const sessions = await agent.get(`/get-sessions-by-sport-id/${s_id}`);
    const id = sessions.body[0].id;
    const response = await agent.get(
      `/get-session-by-id-and-sport-id/${id}/${s_id}`
    );
    expect(response.statusCode).toBe(200);
  });

  test("User can create team", async () => {
    const sports = await agent.get("/get-sports");
    const s_id = sports.body[0].id;
    const sessions = await agent.get(`/get-sessions-by-sport-id/${s_id}`);
    const sess_id = sessions.body[0].id;
    const res = await agent.get("/get-csrf-token");
    const csrfToken = res.body.csrfToken;
    const response = await agent
      .post("/create-team")
      .send({ t_name: "Team A", t_size: 10, sess_id })
      .set("xsrf-token", csrfToken);
    expect(response.statusCode).toBe(200);
  });
});
