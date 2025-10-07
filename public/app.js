let currentFilter = 'all';
let tasks = [];
let nextId = 1;

// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const tasksList = document.getElementById('tasksList');
const filterBtns = document.querySelectorAll('.filter-btn');

// Load tasks from localStorage
function loadTasks() {
    const saved = localStorage.getItem('tasks');
    if (saved) {
        tasks = JSON.parse(saved);
        nextId = Math.max(...tasks.map(t => t.id), 0) + 1;
    } else {
        tasks = [
            { id: 1, title: 'Sample Task 1', description: 'This is a sample task', completed: false },
            { id: 2, title: 'Sample Task 2', description: 'Another sample task', completed: true }
        ];
        nextId = 3;
        saveTasks();
    }
    displayTasks();
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Display tasks based on current filter
function displayTasks() {
    let filteredTasks = tasks;

    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    if (filteredTasks.length === 0) {
        tasksList.innerHTML = '<div class="empty-state">No tasks found</div>';
        return;
    }

    tasksList.innerHTML = filteredTasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
            <div class="task-content">
                <div class="task-title">${escapeHtml(task.title)}</div>
                ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
            </div>
            <div class="task-actions">
                <button class="toggle-btn" onclick="toggleTask(${task.id})">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Add new task
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newTask = {
        id: nextId++,
        title: taskTitle.value.trim(),
        description: taskDescription.value.trim(),
        completed: false
    };

    tasks.push(newTask);
    saveTasks();

    taskTitle.value = '';
    taskDescription.value = '';
    displayTasks();
});

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        displayTasks();
    }
}

// Delete task
function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    displayTasks();
}

// Filter tasks
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        displayTasks();
    });
});

// Utility function to escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Initial load
loadTasks();
