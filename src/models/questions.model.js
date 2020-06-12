const mongoose = require("mongoose");

const QuestionSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vote" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", QuestionSchema);
