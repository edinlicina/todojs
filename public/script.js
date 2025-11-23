let todos = [];

async function fetchTodosFromApi() {
  const response = await fetch("/api/todos");
  if (!response.ok) {
    throw new Error("Failed to load todos from server");
  }
  return await response.json();
}

async function createTodoOnServer(text) {
  const response = await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error("Failes to create todo");
  }

  return await response.json();
}

async function updateTodoOnServer(id, data) {
  const response = await fetch(`/api/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Update failed:", response.status, errorText);
    throw new Error("Failed to update todo");
  }

  return await response.json();
}

async function deleteTodoOnServer(id) {
  const response = await fetch(`/api/todos/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete todo");
  }
}

function loadTodos() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    todos = getDefaultTodos();
    return;
  }

  try {
    todos = JSON.parse(stored);
  } catch (error) {
    console.error(
      "Failed to parse todos from localStorage, will use defaults",
      error
    );
    todos = getDefaultTodos();
  }
}

const todoListElement = document.getElementById("todoList");
const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");

// DOM creation

function createTodoListItem(todo) {
  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.done;
  checkbox.addEventListener("change", async () => {
    try {
      await updateTodoOnServer(todo.id, {
        done: checkbox.checked,
        text: todo.text,
      });
      await refreshFromServer();
    } catch (error) {
      console.error(error);
      alert("Could not update todo.");
      checkbox.checked = !checkbox.checked;
    }
  });

  //Text
  const span = document.createElement("span");
  span.textContent = " " + todo.text;
  if (todo.done) {
    span.style.textDecoration = "line-through";
  }

  //Edit button
  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.textContent = "Edit";
  editButton.addEventListener("click", async () => {
    const newText = prompt("Edit todo:", todo.text);
    if (newText === null) return;

    const trimmed = newText.trim();
    if (!trimmed) return;

    try {
      await updateTodoOnServer(todo.id, { text: trimmed, done: todo.done });
      await refreshFromServer();
    } catch (error) {
      console.error(error);
      alert("Could not edit todo.");
    }
  });

  //Delete Button
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", async () => {
    try {
      await deleteTodoOnServer(todo.id);
      await refreshFromServer();
    } catch (error) {
      console.error(error);
      alert("Could not delete todo.");
    }
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(editButton);
  li.appendChild(deleteButton);

  return li;
}

function renderTodos() {
  todoListElement.innerHTML = "";

  todos.forEach((todo) => {
    const li = createTodoListItem(todo);
    todoListElement.appendChild(li);
  });
}

async function refreshFromServer() {
  try {
    todos = await fetchTodosFromApi();
    renderTodos();
  } catch (error) {
    console.error(error);
    alert("Could not load todos from server.");
  }
}

todoForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = todoInput.value.trim();
  if (!text) {
    return;
  }

  try {
    await createTodoOnServer(text);
    todoInput.value = "";
    await refreshFromServer();
  } catch (error) {
    console.error(error);
    alert("Could not create todo.");
  }
});

async function init() {
  await refreshFromServer();
}

init();
