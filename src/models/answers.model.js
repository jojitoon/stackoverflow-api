const mongoose = require("mongoose");

const AnswerSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Answer", AnswerSchema);
