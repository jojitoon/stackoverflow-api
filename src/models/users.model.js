const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: String,
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
