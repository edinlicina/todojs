const STORAGE_KEY = "todos-demo-app";
let todos = [];

function getDefaultTodos() {
  return [
    { id: 1, text: "Lern JS and frontend basics", done: false },
    {
      id: 2,
      text: "Understand how back and frontend communicate",
      done: false,
    },
    { id: 3, text: "Build a real todo app step by step", done: true },
  ];
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

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

const todoListElement = document.getElementById("todoList");
const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");

//Todo operations

function addTodo(text) {
  const newTodo = {
    id: Date.now(),
    text: text,
    done: false,
  };
  todos.push(newTodo);
}

function updateTodoText(todo, newText) {
  todo.text = newText;
}

function toggleTodoDone(todo, done) {
  todo.done = done;
}

function deleteTodoById(id) {
  const index = todos.findIndex((t) => t.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
  }
}

// DOM creation

function createTodoListItem(todo) {
  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.done;
  checkbox.addEventListener("change", () => {
    toggleTodoDone(todo, checkbox.checked);
    saveAndRender();
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

  editButton.addEventListener("click", () => {
    //prefill with old todo and ask user for new todo
    const newText = prompt("Edit todo:", todo.text);
    //upon cancel do nothing
    if (newText === null) return;

    //trim spaces and ignore empty edit
    const trimmed = newText.trim();
    if (!trimmed) return;

    updateTodoText(todo, trimmed);
    saveAndRender();
  });

  //Delete Button
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    deleteTodoById(todo.id);
    saveAndRender();
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

function saveAndRender() {
  saveTodos();
  renderTodos();
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = todoInput.value.trim();
  if (!text) {
    return;
  }

  addTodo(text);
  todoInput.value = "";
  saveAndRender();
});

function init() {
  loadTodos();
  renderTodos();
}

init();
