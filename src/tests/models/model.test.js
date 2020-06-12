const mongoose = require("mongoose");
const UserModel = require("../../models/users.model");
const QuestionModel = require("../../models/questions.model");
const AnswerModel = require("../../models/answers.model");
const VoteModel = require("../../models/votes.model");
const userData = {
  username: "tester",
  password: "password",
  email: "tester@email.com",
};
const questionData = {
  title: "tester question",
  body: "do you know this is a question",
};

const answer = "this is an answer to your question";

describe("User Model Test", () => {
  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGO_URL,
      //   global.__MONGO_URI__,
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

  it("create & save user successfully", async () => {
    const validUser = new UserModel(userData);
    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.email).toBe(userData.email);
  });

  it("insert user successfully, but the field not defined in schema should be undefined", async () => {
    const userWithInvalidField = new UserModel({
      username: "looker",
      gender: "Male",
      email: "looker@email.com",
    });
    const savedUserWithInvalidField = await userWithInvalidField.save();
    expect(savedUserWithInvalidField._id).toBeDefined();
    expect(savedUserWithInvalidField.gender).toBeUndefined();
  });

  // Test Validation is working!!!
  // It should us told us the errors in on email field.
  it("create user without required field should failed", async () => {
    const userWithoutRequiredField = new UserModel({ username: "there" });
    let err;
    try {
      const savedUserWithoutRequiredField = await userWithoutRequiredField.save();
      error = savedUserWithoutRequiredField;
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
  });
});
