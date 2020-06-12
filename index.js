let express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
const routes = require("./src/Routes");
const port = process.env.PORT || 8080;

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose
  .connect(
    process.env.NODE_ENV === "production"
      ? process.env.MONGO_DB
      : process.env.MONGO_DB_TEST,
    {
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get("/", (req, res) =>
  res.send({ message: "Welcome to stack overflow api" })
);

app.use("/", routes);

app.all("*", (req, res) =>
  res.status(404).send({ message: "Route Not Found" })
);

app.listen(port, function () {
  console.log("Running stackoverflow clone api on port " + port);
});
