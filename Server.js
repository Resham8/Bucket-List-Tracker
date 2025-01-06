const express = require("express");
const fs = require("fs");
const app = express();

app.get("/goals", (req, res) => {
  const goals = JSON.parse(fs.readFileSync("data.json"));
  res.json(goals);
});


app.listen(3000);
