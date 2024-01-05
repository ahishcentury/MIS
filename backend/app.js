const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 5000;
const userRoutes = require("./router/userRoutes");
let connectionURL = "mongodb://localhost:27017/tumis";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(connectionURL, options)
  .then((res) => {
    console.log("Mongo Connected Successfully");
  })
  .catch((err) => {
    console.log("ERROR in Connection");
  });
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(cors());
app.use("/users", userRoutes);
app.listen(port, () => {
  console.log("Connection is running on the port: ", port);
});
