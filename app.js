const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const dbPath = path.join(__dirname, "todos.db");
const db = new sqlite3.Database(dbPath, (error) => {
  if (error) {
    console.error("Could not open database", error);
  } else {
    console.log("Connected to SQLite database at", dbPath);
  }
});

db.run(
  `CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0
    )`,
  (error) => {
    if (error) {
      console.error("Failed to create todos table", error);
      return;
    }
    db.get("SELECT COUNT (*) AS count FROM todos", (error, row) => {
      if (error) {
        console.error("Failed to count todos", error);
        return;
      }
      if (row.count === 0) {
        console.log("Seeding initial todos...");
        const statement = db.prepare(
          "INSERT INTO todos (text, done) VALUES (?, ?)"
        );
        statement.run("Lern JS and frontend basics", 0);
        statement.run("Understand how back and frontend communicate", 0);
        statement.run("Build a real todo app step by step", 1);
        statement.finalize();
      }
    });
  }
);

function mapRowToTodo(row) {
  return {
    id: row.id,
    text: row.text,
    done: !!row.done,
  };
}

app.get("/api/todos", (req, res) => {
  db.all("SELECT id, text, done FROM todos", [], (error, rows) => {
    if (error) {
      console.error("Error fetching todos", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    const todos = rows.map(mapRowToTodo);
    res.json(todos);
  });
});

app.post("/api/todos", (req, res) => {
  const { text, done } = req.body;

  if (typeof text !== "string" || text.trim() === "") {
    return res
      .status(400)
      .json({ error: "Field text is required and must not be empty" });
  }

  const doneValue = done ? 1 : 0;

  db.run(
    "INSERT INTO todos (text, done) VALUES (?, ?)",
    [text.trim(), doneValue],
    function (error) {
      if (error) {
        console.error("Error inserting todo", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      db.get(
        "SELECT id, text, done FROM todos WHERE id = ?",
        [this.lastID],
        (error, row) => {
          if (error) {
            console.error("Error fetching created todo", error);
            return res.status(500).json({ error: "Internal server error" });
          }
          res.status(201).json(mapRowToTodo(row));
        }
      );
    }
  );
});

app.put("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const { text, done } = req.body;

  db.get(
    "SELECT id, text, done FROM todos WHERE id = ?",
    [id],
    (error, row) => {
      if (error) {
        console.error("Error fetching todo", error);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (!row) {
        return res.status(404).json({ error: "Todo not found." });
      }

      let newText = row.Text;
      let newDone = row.done;

      if (text !== undefined) {
        if (typeof text !== "string" || text.trim() === "") {
          return res
            .status(400)
            .json({ error: "If provided, text must no be empty" });
        }
        newText = text.trim();
      }
      if (done !== undefined) {
        newDone = done ? 1 : 0;
      }

      db.run(
        "UPDATE todos SET text = ?, done = ? WHERE id = ?",
        [newText, newDone, id],
        function (error) {
          if (error) {
            console.error("Error updating todo", error);
            return res.status(500).json({ error: "Internal server error" });
          }

          db.get(
            "SELECT id, text, done FROM todos WHERE id = ?",
            [id],
            (error, updatedRow) => {
              if (error) {
                console.error("Error fetching updated todo", error);
                return res.status(500).json({ error: "Internal server error" });
              }

              res.json(mapRowToTodo(updatedRow));
            }
          );
        }
      );
    }
  );
});

app.delete("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);

  db.run("DELETE FROM todos WHERE id = ?", [id], function (error) {
    if (error) {
      console.error("Error deleting todo", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (this.changes === 0) {
      return res.status(400).json({ error: "Todo not found." });
    }

    res.status(204).send();
  });
});

app.listen(PORT, () => {
  console.log(`Server starten on port ${PORT}`);
});
