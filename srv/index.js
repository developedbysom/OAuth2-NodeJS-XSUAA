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
app.use(express.json())
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

app.put("/callback/v1.0/tenants/:tenantId", (req, res) => {
  let consumerSubdomain = req.body.subscribedSubdomain;
  let tenantUrl = `https://approuter-emp-list${consumerSubdomain}.cfapps.us10-001.hana.ondemand.com`;
  res.status(200).send(tenantUrl);
});

app.delete("/callback/v1.0/tenants/:tenantId", (req, res) => {
  let consumerSubdomain = req.body.subscribedSubdomain;
  let tenantUrl = `https://approuter-emp-list${consumerSubdomain}.cfapps.us10-001.hana.ondemand.com`;
  res.status(200).send(tenantUrl);
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
