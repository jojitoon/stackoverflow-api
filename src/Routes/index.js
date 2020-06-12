const user = require("../controllers/user");
const question = require("../controllers/question");
const Auth = require("../middlewares/auth");
const exp = require("express");
const app = exp.Router();

// users
app.post("/login", user.login);
app.post("/signup", user.signup);

// question
app.get("/questions", Auth, question.viewAll);
app.get("/questions/:id", Auth, question.viewOne);
app.post("/questions", Auth, question.create);
app.post("/questions/:id/answer", Auth, question.answerQuestion);
app.patch("/questions/:id/vote/:type", Auth, question.voteQuestion);

// questions
app.get("/search/:keyword", user.search);

// notifications
app.get("/notifications", Auth, user.allNotifications);

// subscribe
app.post("/subscribe/:questionId", Auth, user.subscribe);

module.exports = app;
