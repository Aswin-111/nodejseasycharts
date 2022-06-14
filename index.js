const sqlconnect = require("mysql");
const express = require("express");
const parser = require("body-parser");
const path = require("path");
const hbs = require("hbs");
var requestIp = require("request-ip");
const driver = express();
driver.set("views", path.join(__dirname));
driver.set("view engine", "hbs");
driver.use(parser.json());

let sqlconnection = sqlconnect.createConnection({
  host: "localhost",
  user: "root",
  password: "",

  database: "easycharts",
  multipleStatements: true,
});

sqlconnection.connect((error) => {
  if (!error) {
    console.log("Connected");
  } else {
    console.log("Connection failed");
  }
});
driver.get("/", function (req, res) {
  var clientIp = requestIp.getClientIp(req);
  console.log(clientIp);
  sqlconnection.query("SELECT * FROM selectedstock", (err, rows, fields) => {
    if (!err) {
      res.render("index", {
        array: rows,
        message: "Greetings from geekforgeeks",
      });
      // res.send(rows);
    } else {
      console.log(error);
    }
  });
});
var data;
let dict = [];
driver.get("/test", function (req, res) {
  dict = [];
  data = null;
  var clientIp = requestIp.getClientIp(req);
  console.log(clientIp);
  sqlconnection.query("SELECT * FROM selectedstock", (err, rows, fields) => {
    if (!err) {
      data = rows.pop();
      console.log(data["stock"]);
      // res.render("index", {
      //   array: rows
      // });
      // res.send(rows);
    } else {
      console.log(error);
    }
  });
  sqlconnection.query(
    `SELECT * FROM selectedstock ORDER BY stock`,
    (err, rows, fields) => {
      if (!err) {
        console.log(rows);
        console.log("--------------------");
        console.log(data);
        dict.push(data);
        console.log("--------------------");
        console.log(dict);
        res.render("index", {
          array: rows,
          lastdata: dict,
        });
        // res.send(rows);
      } else {
        console.log(error);
      }
    }
  );
});
driver.listen(3000);
