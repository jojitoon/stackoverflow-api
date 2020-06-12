const User = require("../models/users.model");
const passwordHash = require("../utils/passwordHash");
const tokenGen = require("../utils/tokenGen");
const Question = require("../models/questions.model");
const Answer = require("../models/answers.model");
const Subscription = require("../models/subscription.model");
const Notification = require("../models/notifications.model");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        status: "error",
        message: "Provide email and password",
      });
    }

    const user = await User.findOne({ email }).populate("questions");

    if (user) {
      if (!passwordHash.compare(password, user.password)) {
        return res.status(400).send({
          status: "error",
          message: "Invalid credentials",
        });
      }
      const { password: p, ...rest } = user._doc;
      return res.send({
        status: "success",
        user: rest,
        message: `Welcome ${user.username}`,
        token: tokenGen.encypt({ _id: user._id }),
      });
    } else {
      return res.status(400).send({
        status: "error",
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Server Error! Try again", error: error.stack });
  }
};

exports.signup = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).send({
        status: "error",
        message: "Provide email, username and password",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).send({
        status: "error",
        message: "email is taken",
      });
    }

    const userval = new User({
      email,
      username,
      password: passwordHash.hash(password),
    });
    const newuser = await userval.save();
    const { password: p, ...rest } = newuser._doc;
    res.send({
      status: "success",
      user: rest,
      message: `Welcome ${newuser.username}`,
      token: tokenGen.encypt({ _id: newuser._id }),
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Server Error! Try again", error: error.stack });
  }
};

exports.search = async (req, res) => {
  try {
    const {
      params: { keyword },
    } = req;

    const questions = await Question.find({
      $or: [
        { title: { $regex: ".*" + keyword + ".*" } },
        { body: { $regex: ".*" + keyword + ".*" } },
      ],
    });
    const answers = await Answer.find({
      $or: [{ body: { $regex: ".*" + keyword + ".*" } }],
    });
    const users = await User.find({
      $or: [{ username: { $regex: ".*" + keyword + ".*" } }],
    });

    res.send({
      status: "success",
      questions,
      users,
      answers,
      message: "Search retrieved",
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Server Error! Try again", error: error.stack });
  }
};

exports.subscribe = async (req, res) => {
  try {
    const {
      currentUserId,
      params: { questionId },
    } = req;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(400).send({
        status: "error",
        message: "Question does not exist",
      });
    }

    const user = await User.findById(currentUserId);

    const subscription = new Subscription({
      user: user._id,
      question: question._id,
    });

    await subscription.save();

    return res.send({
      status: "success",
      message: "Questions subscribed to",
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Server Error! Try again", error: error.stack });
  }
};

exports.allNotifications = async (req, res) => {
  try {
    const { currentUserId } = req;

    const notifications = await Notification.find({ user: currentUserId });

    return res.send({
      status: "success",
      notifications,
      message: "Notifications retrieved",
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Server Error! Try again", error: error.stack });
  }
};
