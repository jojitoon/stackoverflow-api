const request = require("supertest");
const mongoose = require("mongoose");
const app = require("./expressServer");
const server = request(app);

describe("user controller", () => {
  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGO_URL,
      {
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
      },
      (err) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      }
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("user should sign up because of complete data", async (done) => {
    const res = await server.post("/signup").send({
      email: "testa@email.com",
      password: "password",
      username: "tester",
    });
    expect(res.body.user.username).toBe("tester");
    done();
  });
  it("user should sign up because of complete data", async (done) => {
    const res = await server.post("/signup").send({
      email: "testa@email.com",
      password: "password",
      username: "tester",
    });
    expect(res.body.message).toBe("email is taken");
    done();
  });

  it("user should not sign up because of incomplete data", async (done) => {
    const res = await server.post("/signup").send({
      email: "testa@email.com",
      username: "tester",
    });

    expect(res.body.message).toBe("Provide email, username and password");
    done();
  });

  it("user should log in because of complete data", async (done) => {
    const res = await server.post("/login").send({
      email: "testa@email.com",
      password: "password",
    });
    expect(res.body.user.username).toBe("tester");
    done();
  });

  it("user should not log in because of complete data", async (done) => {
    const res = await server.post("/login").send({
      email: "testa@email.com",
      password: "password2",
    });
    expect(res.body.message).toBe("Invalid credentials");
    done();
  });

  it("user should not log in because of complete data", async (done) => {
    const res = await server.post("/login").send({
      email: "ses@email.com",
      password: "password2",
    });
    expect(res.body.message).toBe("Invalid credentials");
    done();
  });

  it("user should not log in because of incomplete data", async (done) => {
    const res = await server.post("/login").send({
      email: "testa@email.com",
    });

    expect(res.body.message).toBe("Provide email and password");
    done();
  });
});
