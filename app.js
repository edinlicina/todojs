const express = require("express");
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.static("public"));

let todos = [
  { id: 1, text: "Lern JS and frontend basics", done: false },
  { id: 2, text: "Understand how back and frontend communicate", done: false },
  { id: 3, text: "Build a real todo app step by step", done: true },
];

let nextId = 4;

app.get("/api/todos", (req, res) => {
  res.json(todos);
});

app.post("/api/todos", (req, res) => {
  const { text, done } = req.body;

  if (typeof text !== "string" || text.trim() === "") {
    return res
      .status(400)
      .json({ error: "Field 'text' is required and must not be empty." });
  }

  const newTodo = {
    id: nextId++,
    text: text.trim(),
    done: Boolean(done),
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.put("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found." });
  }
  const { text, done } = req.body;

  if (text !== undefined) {
    if (typeof text !== "string" || text.trim() === "") {
      return res
        .status(400)
        .json({ error: "If provided, text must not be empty" });
    }
    todo.text = text.trim();
  }

  if (done !== undefined) {
    todo.done = Boolean(done);
  }
  res.json(todo);
});

app.delete("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todos.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
