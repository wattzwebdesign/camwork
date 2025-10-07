# Task Manager App

A comprehensive Node.js task management application with a REST API and interactive front-end.

## Features

- **REST API** for task management (CRUD operations)
- **Interactive UI** with real-time updates
- **Task filtering** (All, Active, Completed)
- **Responsive design** with modern styling
- **In-memory data storage** for quick testing

## Project Structure

```
camwork/
├── server.js           # Express server setup
├── package.json        # Dependencies and scripts
├── routes/
│   └── tasks.js        # Task API endpoints
└── public/
    ├── index.html      # Main HTML page
    ├── styles.css      # Styling
    └── app.js          # Frontend JavaScript
```

## Installation

```bash
npm install
```

## Usage

Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Example API Usage

Create a task:
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","description":"Task description"}'
```

Get all tasks:
```bash
curl http://localhost:3000/api/tasks
```
