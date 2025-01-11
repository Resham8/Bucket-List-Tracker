const express = require("express");
const fs = require("fs");
const { json } = require("stream/consumers");
const app = express();

app.use(express.json());

let idCounter = 1;
const path = './data.json';

let fileData = []

function getData(){
  fs.readFile(path, 'utf8', (err, data) => {
    if(err){
      console.log(err);      
    }
    const fileData = data;    
  })
  return fileData;
}

app.get("/goals", function (req, res) {
  const goals = getData();
  if(goals.length > 0){
    res.json(getData());
  } else {
    res.status(204).json({ msg: "List is empty" }); // 204 is for no content
  }
  
});

app.get("/goals/:id", function (req, res) {
  const goals = JSON.parse(fs.readFileSync(path));
  const goalId = parseInt(req.params.id);
  const goal = goals.find((g) => g.id === goalId);

  if (goal) {
    res.json(goal);
  } else {
    res.status(404).json({ msg: "goal not found" });
  }
});


app.post("/goals", function (req, res) {
  const { title, description, isCompleted } = req.body;
  let newGoal = {
    id: idCounter++,
    title,
    description,
    isCompleted: isCompleted || false,
  };

  let d = getData();

  d.push(newGoal);

  const jsonString = JSON.stringify(d, null, 2);
  fs.writeFile(path, jsonString, (err) => {
    if (err) {
      res.status(404).json({ msg: "Error" });
    } else {
      res.status(200).json({ id: newGoal.id });        
    }
  });  
});

// update
app.put("/goals/:id", function (req, res) {
 
});

app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});

app.listen(3000);