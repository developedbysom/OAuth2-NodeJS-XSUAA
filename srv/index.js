const express = require("express");
const app = express();
const port = process.env.port || 8080;
const { JWTStrategy } = require("@sap/xssec");
const xsenv = require("@sap/xsenv");
const passport = require("passport");
const empl_list = require("./db/employye-list.json");

passport.use(new JWTStrategy(xsenv.getServices({ uaa: { tag: "xsuaa" } }).uaa));

app.use(passport.initialize());
app.use(passport.authenticate("JWT", { session: false }));

app.get("/", (req, res, next) => {
  res.send("Welcome to employee dashboard");
});

app.get("/getemplist", checkScope, (req, res, next) => {
  var result = [];
  for (let emp in empl_list) {
    result.push(empl_list[emp]);
  }
  res.send(result);
});

app.get("/getempbyname", (req, res, next) => {
  var result = [];
  for (let emp in empl_list) {
    if (req.query.name == emp) {
      result.push(empl_list[emp]);
      break;
    }
  }
  res.send(result);
});

function checkScope(req, res, next) {
  if (req.authInfo.checkLocalScope("read")) {
    next();
  } else {
    res.status(403).end("Forbidden");
  }
}
app.listen(port, console.log(`Listening on port ${port}`));
