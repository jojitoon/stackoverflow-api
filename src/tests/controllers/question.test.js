const request = require("supertest");
const mongoose = require("mongoose");
const app = require("./expressServer");
const server = request(app);
let user1, user2, question;
const answer = "this is an answer to your question";
const questionData = {
  title: "tester question",
  body: "do you know this is a question",
};

describe("Question controller", () => {
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

    const res = await server.post("/signup").send({
      email: "tester1@email.com",
      password: "password",
      username: "tester",
    });

    const res1 = await server.post("/signup").send({
      email: "tester2@email.com",
      password: "password",
      username: "tester",
    });

    user1 = res.body;
    user2 = res1.body;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("user should create question", async (done) => {
    const res = await server
      .post("/questions")
      .set("authorization", user1.token)
      .send({
        ...questionData,
      });
    question = res.body.question;
    expect(res.body.question.title).toBe(questionData.title);
    done();
  });

  it("user should not create question", async (done) => {
    const res = await server
      .post("/questions")
      .set("authorization", user1.token)
      .send({
        title: "only title",
      });
    expect(res.body.message).toBe("Provide question title and body");
    done();
  });

  it("user should get question", async (done) => {
    const res = await server
      .get(`/questions/${question._id}`)
      .set("authorization", user1.token);

    expect(res.body.question.title).toBe(questionData.title);
    done();
  });

  it("user should not get question", async (done) => {
    const res = await server
      .get(`/questions/${user1.user._id}`)
      .set("authorization", user1.token);

    expect(res.body.message).toBe("Question does not exist");
    done();
  });

  it("user should not get question", async (done) => {
    const res = await server
      .get(`/questions/1`)
      .set("authorization", user1.token);

    expect(res.body.message).toBe("Server Error! Try again");
    done();
  });

  it("user should get all question", async (done) => {
    const res = await server
      .get("/questions")
      .set("authorization", user1.token);

    expect(res.body.questions[0].title).toBe(questionData.title);
    done();
  });

  it("user should not get all question", async (done) => {
    const res = await server
      .get("/questions")
      .set("authorization", "user1.token");

    expect(res.body.message).toBe("Server error!. Please try again later");
    done();
  });

  it("user should not get all question because of token", async (done) => {
    const res = await server.get("/questions");

    expect(res.body.message).toBe("Unauthorized access.");
    done();
  });

  it("user should not  answer a question", async (done) => {
    const res = await server
      .post(`/questions/${question._id}/answer`)
      .set("authorization", user2.token);

    expect(res.body.message).toBe("Provide answer body");
    done();
  });

  it("user should not  answer a question", async (done) => {
    const res = await server
      .post(`/questions/${user1.user._id}/answer`)
      .set("authorization", user2.token)
      .send({ body: answer });

    expect(res.body.message).toBe("Question does not exist");
    done();
  });

  it("user should not  answer a question", async (done) => {
    const res = await server
      .post(`/questions/1/answer`)
      .set("authorization", user2.token)
      .send({ body: answer });

    expect(res.body.message).toBe("Server Error! Try again");
    done();
  });

  it("user should answer a question", async (done) => {
    const res = await server
      .post(`/questions/${question._id}/answer`)
      .set("authorization", user2.token)
      .send({ body: answer });

    expect(res.body.answer.body).toBe(answer);
    done();
  });

  it("user should vote up a question", async (done) => {
    const res = await server
      .patch(`/questions/${question._id}/vote/up`)
      .set("authorization", user2.token);

    expect(res.body.vote.type).toBe("up");
    done();
  });

  it("user should vote down a question", async (done) => {
    const res = await server
      .patch(`/questions/${question._id}/vote/down`)
      .set("authorization", user2.token);

    expect(res.body.vote.type).toBe("down");
    done();
  });

  it("user should not vote a question", async (done) => {
    const res = await server
      .patch(`/questions/${question._id}/vote/up`)
      .set("authorization", user1.token);

    expect(res.body.message).toBe("You can not vote on your question");
    done();
  });

  it("user should not vote a question", async (done) => {
    const res = await server
      .patch(`/questions/${user1.user._id}/vote/up`)
      .set("authorization", user1.token);

    expect(res.body.message).toBe("Question does not exist");
    done();
  });

  it("user should not vote a question", async (done) => {
    const res = await server
      .patch(`/questions/${question._id}/vote/ups`)
      .set("authorization", user2.token);

    expect(res.body.message).toBe("You can only vote up or down");
    done();
  });

  it("user should not vote a question", async (done) => {
    const res = await server
      .patch(`/questions/1/vote/up`)
      .set("authorization", user2.token);

    expect(res.body.message).toBe("Server Error! Try again");
    done();
  });

  it("user should subscribe to a question", async (done) => {
    const res = await server
      .post(`/subscribe/${question._id}`)
      .set("authorization", user2.token);

    expect(res.body.message).toBe("Questions subscribed to");
    done();
  });

  it("user should not subscribe to a question", async (done) => {
    const res = await server
      .post(`/subscribe/${user1.user._id}`)
      .set("authorization", user2.token);

    expect(res.body.message).toBe("Question does not exist");
    done();
  });

  it("user should be notified for question", async (done) => {
    const res = await server
      .post(`/questions/${question._id}/answer`)
      .set("authorization", user1.token)
      .send({ body: answer });

    expect(res.body.answer.body).toBe(answer);
    done();
  });
  it("user should receive notified for question", async (done) => {
    const res = await server
      .get(`/notifications`)
      .set("authorization", user2.token);

    expect(res.body.notifications).toHaveLength(1);
    expect(res.body.notifications[0].question).toBe(question._id);
    done();
  });

  it("user should not subscribe to a question", async (done) => {
    const res = await server
      .post(`/subscribe/1`)
      .set("authorization", user2.token);

    expect(res.body.message).toBe("Server Error! Try again");
    done();
  });

  it("user should search for any thing", async (done) => {
    const res = await server.get(`/search/${questionData.title}`);

    expect(res.body.questions.length).toBe(1);
    done();
  });
});
