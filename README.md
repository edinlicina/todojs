📝 Full-Stack Todo App (Node.js + Express + SQLite + Vanilla JS)

A simple full-stack Todo application built for learning purposes.
This project demonstrates:
• A clean frontend using HTML + Vanilla JavaScript
• A complete REST API built with Express
• A persistent SQLite database
• Full CRUD (Create, Read, Update, Delete)
• Separation of concerns between frontend and backend
• Real full-stack data flow using fetch()

It’s a perfect starter app for understanding how modern backend and frontend work together.

⸻

🚀 Features

Frontend
• Add new todos
• Edit existing todos
• Toggle todo completion
• Delete todos
• Automatically refresh UI after server changes
• Clean code structure (rendering functions, API helpers, DOM creation)

Backend (Express)
• REST API:
• GET /api/todos – fetch all todos
• POST /api/todos – create a new todo
• PUT /api/todos/:id – update a todo
• DELETE /api/todos/:id – remove a todo
• JSON body parsing
• Error handling and input validation

Database (SQLite)
• Automatic table creation on startup
• Auto-seed with example todos
• Persistent storage in todos.db
• Lightweight + included automatically

🛠 Installation & Setup
npm install
npm start || npm run dev

    Server starts at:
    http://localhost:5001

    🧰 Technologies Used
    •	Node.js
    •	Express
    •	SQLite3
    •	Vanilla JavaScript
    •	HTML5
    •	Fetch API

⸻

📦 Database

Auto-created

The SQLite database (todos.db) is automatically created on first startup.

Auto-seeded

If empty, the database receives 3 initial example todos.

⸻

🧑‍💻 Development Notes
• node_modules/ is ignored via .gitignore
• todos.db can also be ignored if you do not want to commit data
• Project is built step-by-step to maximize understanding of:
• state management
• REST design
• database persistence
• frontend-backend communication

⸻

📘 Learning Goals

This project is ideal for learning:
• How a REST API works
• How frontend communicates with backend
• How to store data persistently
• How rendering & DOM manipulation works
• How to structure small full-stack apps
