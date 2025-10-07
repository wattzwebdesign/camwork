const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory data store
let tasks = [
  { id: 1, title: 'Sample Task 1', description: 'This is a sample task', completed: false },
  { id: 2, title: 'Sample Task 2', description: 'Another sample task', completed: true }
];
let nextId = 3;

// API Routes
const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/tasks`);
});

// Export for use in routes
module.exports = { tasks, getNextId: () => nextId++ };
