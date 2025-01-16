const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(express.json());

const corsOptions = {
  origin: "http://127.0.0.1:5501/FrontEnd/",
  methods: "GET,POST,PUT,DELETE",  
};


app.use(cors(corsOptions));

const DATA_FILE = "./data.json";
let idCounter = 1;

function readDataSync() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf8");
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error("Error reading file:", error);
    return [];
  }
}

function writeDataSync(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing file:", error);
    return false;
  }
}

// GET all goals
app.get("/goals", (req, res) => {
  const goals = readDataSync();
  if (goals.length > 0) {
    res.json(goals);
  } else {
    res.status(204).json({ msg: "List is empty" });
  }
});

// GET single goal
app.get("/goals/:id", (req, res) => {
  const goals = readDataSync();
  const goalId = parseInt(req.params.id);
  const goal = goals.find((g) => g.id === goalId);

  if (goal) {
    res.json(goal);
  } else {
    res.status(404).json({ msg: "Goal not found" });
  }
});

// POST new goal
app.post("/goals", (req, res) => {
  const { title, isCompleted } = req.body;
  const goals = readDataSync();

  // Find the highest ID and increment
  idCounter = Math.max(0, ...goals.map((g) => g.id)) + 1;

  const newGoal = {
    id: idCounter,
    title,
    // description,
    isCompleted: isCompleted || false,
  };

  goals.push(newGoal);

  if (writeDataSync(goals)) {
    res.status(201).json({ id: newGoal.id });
  } else {
    res.status(500).json({ msg: "Error saving goal" });
  }
});

// PUT update goal
app.put("/goals/:id", (req, res) => {
  const goalId = parseInt(req.params.id);
  const { title, isCompleted } = req.body;
  
  const goals = readDataSync();

  const goalIndex = goals.findIndex((g) => g.id === goalId);

  if (goalIndex === -1) {
    return res.status(404).json({ msg: "Goal not found" });
  }

  goals[goalIndex] = {
    ...goals[goalIndex],
    title: title || goals[goalIndex].title,
    // description: description || goals[goalIndex].description,
    isCompleted:
      isCompleted !== undefined ? isCompleted : goals[goalIndex].isCompleted,
  };

  if (writeDataSync(goals)) {
    res.json({ msg: "Goal updated successfully" });
  } else {
    res.status(500).json({ msg: "Error updating goal" });
  }
});

app.delete("/goals/:id", function (req, res) {
  const goals = readDataSync();

  const goalIndex = goals.findIndex((g) => g.id === parseInt(req.params.id));
  if (goalIndex !== -1) {
    goals.splice(goalIndex, 1);
    // writeDataSync(data);
    if (writeDataSync(goals)) {
      res.json({ msg: "Deleted" });
    } else {
      res.status(404).json({ error: "Todo Id not found" });
    }
  }
});

app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});


app.listen(3000);
