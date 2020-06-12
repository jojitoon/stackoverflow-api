const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VoteSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["up", "down"],
      default: "up",
      required: true,
    },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vote", VoteSchema);
