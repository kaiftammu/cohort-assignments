import express from "express";
import fs from "fs";

const app = express(); 
const FILE_PATH = "todo.json";

app.use(express.json());

//get
app.get("/todos", (req, res) => {
  const data = fs.readFileSync(FILE_PATH, "utf-8");
  const todos = JSON.parse(data);
  res.json(todos); 
});

//post
app.post("/todos", (req, res) => {
  const data = fs.readFileSync(FILE_PATH, "utf-8");
  const todos = JSON.parse(data);

  const newTodo = {
    id: todos.length + 1,
    task: req.body.task,
    status: "pending"
  };

  todos.push(newTodo);
  fs.writeFileSync(FILE_PATH, JSON.stringify(todos, null, 2));

  res.json({ message: "Todo added", todo: newTodo });
});

//put
app.put("/todos/:id", (req, res) => {
  const data = fs.readFileSync(FILE_PATH, "utf-8");
  const todos = JSON.parse(data);

  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  if (req.body.task) todo.task = req.body.task;
  if (req.body.status) todo.status = req.body.status;

  fs.writeFileSync(FILE_PATH, JSON.stringify(todos, null, 2));
  res.json({ message: "Todo updated", todo });
});

//delete
app.delete("/todos/:id", (req, res) => {
  const data = fs.readFileSync(FILE_PATH, "utf-8");
  const todos = JSON.parse(data);

  const id = parseInt(req.params.id);
  const newTodos = todos.filter((t) => t.id !== id); 

  if (newTodos.length === todos.length) {
    return res.status(404).json({ error: "Todo not found" }); // <-- lowercase json
  }

  fs.writeFileSync(FILE_PATH, JSON.stringify(newTodos, null, 2));
  res.json({ message: "Todo deleted" }); 
});

//server
app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
