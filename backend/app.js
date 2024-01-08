const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 5000;
const userRoutes = require("./router/userRoutes");
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false,
};


//Integration for multiple database
const TUString = "mongodb://localhost:27017/tumis";
const CFCString = "mongodb://localhost:27017/cfcmis";

// connecting mongoose instance
function makeNewConnection(connectionString) {
  const db = mongoose.createConnection(connectionString, mongooseOptions);
  db.on("error", function (error) {
    console.log(`MongoDB :: connection ${this.name} ${JSON.stringify(error)}`);
    db.close().catch(() =>
      console.log(`MongoDB :: failed to close connection ${this.name}`)
    );
  });

  db.on("connected", function () {
    mongoose.set("debug", function (col, method, query, doc) {
      // console.log(`MongoDB :: ${this.conn.name} ${col}.${method}(${JSON.stringify(query)},${JSON.stringify(doc)})`);
    });
    console.log(`MongoDB :: connected ${this.name}`);
  });

  db.on("disconnected", function () {
    console.log(`MongoDB :: disconnected ${this.name}`);
  });

  return db;
}
const ConnectionStringTU = makeNewConnection(TUString);
const ConnectionStringCFC = makeNewConnection(CFCString);
mongoose.connection = ConnectionStringTU;


const setPlatform = function (req, res, next) {
  console.log(
    "======================================= \n Target Platform : ",
    req.params.platform + "\n======================================="
  );
  if (req.params.platform === "TU") {
    mongoose.connection = ConnectionStringTU;
    req.platform = req.params.platform;
  } else if (req.params.platform === "CFC") {
    mongoose.connection = ConnectionStringCFC;
    req.platform = req.params.platform;
  } else {
    mongoose.connection = ConnectionStringTU;
  }
  next();
};
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(cors());
app.use("/users", setPlatform, userRoutes);
app.use("/:platform/users", setPlatform, userRoutes);
app.listen(port, () => {
  console.log("Connection is running on the port: ", port);
});
