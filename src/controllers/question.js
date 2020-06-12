const Question = require("../models/questions.model");
const User = require("../models/users.model");
const Answer = require("../models/answers.model");
const Vote = require("../models/votes.model");
const Subscription = require("../models/subscription.model");
const Notification = require("../models/notifications.model");

exports.create = async (req, res) => {
  try {
    const {
      body: { title, body },
      currentUserId,
    } = req;

    if (!title || !body) {
      return res.status(400).send({
        status: "error",
        message: "Provide question title and body",
      });
    }

    const user = await User.findById(currentUserId);

    const questionVal = new Question({
      title,
      body,
      owner: currentUserId,
    });

    const question = await questionVal.save();
    user.questions.push(question._id);
    await user.save();

    res.send({
      status: "success",
      question,
      message: "Question created",
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Server Error! Try again", error: error.stack });
  }
};

exports.viewAll = async (req, res) => {
  try {
    const { currentUserId } = req;

    const questions = await Question.find()
      .populate("answers")
      .populate("votes")
      .populate("owner");

    res.send({
      status: "success",
      questions,
      message: "Questions retrieved",
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Server Error! Try again", error: error.stack });
  }
};

exports.viewOne = async (req, res) => {
  try {
    const {
      params: { id },
      currentUserId,
    } = req;

    const question = await Question.findById(id)
      .populate("answers")
      .populate("votes")
      .populate("owner");

    if (!question) {
      return res.status(400).send({
        status: "error",
        message: "Question does not exist",
      });
    }

    res.send({
      status: "success",
      question,
      message: "Question retrieved",
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Server Error! Try again", error: error.stack });
  }
};

exports.answerQuestion = async (req, res) => {
  try {
    const {
      body: { body },
      params: { id },
      currentUserId,
    } = req;

    if (!body) {
      return res.status(400).send({
        status: "error",
        message: "Provide answer body",
      });
    }

    const question = await Question.findById(id);

    if (!question) {
      return res.status(400).send({
        status: "error",
        message: "Question does not exist",
      });
    }

    const subscriptions = await Subscription.find({ question: question._id });

    const answerVal = new Answer({
      question: question._id,
      body,
      user: currentUserId,
    });

    const answer = await answerVal.save();
    question.answers.push(answer._id);
    await question.save();

    const notificationsVal = [];

    subscriptions.forEach((doc) => {
      notificationsVal.push({
        user: doc.user,
        question: question._id,
        message: `Question: ${question.title} - just got answered`,
      });
    });

    await Notification.insertMany(notificationsVal);

    res.send({
      status: "success",
      answer,
      message: "Question answered",
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Server Error! Try again", error: error.stack });
  }
};

exports.voteQuestion = async (req, res) => {
  try {
    const {
      params: { id, type },
      currentUserId,
    } = req;

    if (type.toLowerCase() !== "up" && type.toLowerCase() !== "down") {
      return res.status(400).send({
        status: "error",
        message: "You can only vote up or down",
      });
    }

    const question = await Question.findById(id);

    if (!question) {
      return res.status(400).send({
        status: "error",
        message: "Question does not exist",
      });
    }

    if (`${question.owner}` === currentUserId) {
      return res.status(400).send({
        status: "error",
        message: "You can not vote on your question",
      });
    }

    const userVote = await Vote.findOne({
      user: currentUserId,
      question: question._id,
    });
    let vote;
    if (userVote) {
      userVote.type = type.toLowerCase();
      vote = await userVote.save();
    } else {
      const voteVal = new Vote({
        question: question._id,
        type: type.toLowerCase(),
        user: currentUserId,
      });
      vote = await voteVal.save();
      question.votes.push(vote._id);
      await question.save();
    }

    res.send({
      status: "success",
      vote,
      message: `Question voted ${type}`,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Server Error! Try again", error: error.stack });
  }
};
