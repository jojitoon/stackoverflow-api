const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubscriptionSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subscription", SubscriptionSchema);
