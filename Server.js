const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

app.get("/goals", function(req, res){
  const goals = JSON.parse(fs.readFileSync("data.json"));
  res.json(goals);
});

app.get("/goals/:id", function(req, res){
  const goals = JSON.parse(fs.readFileSync("data.json"));
  const goalId = parseInt(req.params.id);
  const goal = goals.find(g => g.id === goalId);

  if(goal){
    res.json(goal);
  } else {
    res.status(404).json({msg : "goal not found"})
  }
});

// add
app.post("/goals", function(req, res){

})

// update
app.put("/goals/:id", function(req, res) {
  const goals = JSON.parse(fs.readFileSync("data.json"));
  const goalId = parseInt(req.params.id);
  const goal = goals.find(g => g.id === goalId);

  fs.writeFile("data.json", content, (err) => {
    
  })
})

app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});

app.listen(3000);