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

  if (stored) {
    try {
      todos = JSON.parse(stored);
    } catch (e) {
      console.error(
        "Failed to parse todos from localStorage, using defaults.",
        e
      );
      todos = getDefaultTodos();
    }
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

const todoListElement = document.getElementById("todoList");
const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");

function renderTodos() {
  //clear initially
  todoListElement.innerHTML = "";

  todos.forEach((todo) => {
    const li = document.createElement("li");
    //Checkbox for done/undone
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;

    checkbox.addEventListener("change", () => {
      todo.done = checkbox.checked;
      renderTodos();
    });
    //Text of the Todo
    const span = document.createElement("span");
    span.textContent = "" + todo.text;

    if (todo.done) {
      span.style.textDecoration = "line-through";
    }

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";

    editButton.addEventListener("click", () => {
      //prefill with old todo and ask user for new todo
      const newText = prompt("Edit todo:", todo.text);
      //upon cancel do nothing
      if (newText === null) {
        return;
      }
      //trim spaces and ignore empty edit
      const trimmed = newText.trim();
      if (trimmed === "") {
        return;
      }

      todo.text = trimmed;
      saveTodos();
      renderTodos();
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
      const index = todos.findIndex((t) => t.id === todo.id);
      if (index !== -1) {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
      }
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    todoListElement.appendChild(li);
  });
}

//Handle todo creation
todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = todoInput.value.trim();
  //ignore empty todo
  if (text === "") {
    return;
  }
  //create new todo object
  const newTodo = {
    id: Date.now(),
    text: text,
    done: false,
  };

  todos.push(newTodo); //add to db
  saveTodos();
  todoInput.value = "";
  renderTodos();
});

loadTodos();

renderTodos();
