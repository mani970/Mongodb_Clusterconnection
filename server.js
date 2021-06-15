const fs = require("fs"); // in-built module in nodejs // commonjs file system
const { createServer } = require("http"); // in-built module in nodejs
const { parse } = require("querystring"); //in-built module in nodejs
const { connect } = require("mongodb").MongoClient; // third party module

// database url for cloud
let MONGODB_CLOUD_URL =
  "mongodb+srv://mani:mani123@cluster0.uuyih.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// database url for local
let MONGODB_LOCAL_URL = "mongodb://localhost:27017/";

//nodejs path creation for connecting to port number
function connectDatabase(req, callback) {
  let body = "";
  req.on("data", (chuck) => {
    body += chuck.toString();
  });
  req.on("end", (_) => {
    callback(parse(body));
  });
}

//server build with mongodb driver

const server = createServer((req, res) => {
  if (req.method === "POST") {
    connectDatabase(req, (result) => {
      console.log(result);
      // adding path to sever
      connect(
        MONGODB_CLOUD_URL,
        {
          useUnifiedTopology: true,
          useNewUrlParser: true,
        },
        (err, db) => {
          if (err) throw err;
          //create database name
          let databaseName = db.db("UserInfo");
          //create collection name
          databaseName.collection("Users", (err, userData) => {
            if (err) throw err;
            userData.insertMany([result], (err, data) => {
              if (err) throw err;
              console.log("Successfully User credintial added", data);
            });
          });
        }
      );
    });
    res.end("successfully database created");
  } else {
    //adding file of html using nodejs
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream(__dirname + "/index.html", "utf8").pipe(res);
  }
});

server.listen(2709, (err) => {
  if (err) throw err;
  console.log("server is running on port number 2709");
});
