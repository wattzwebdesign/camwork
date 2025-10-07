const API_URL = '/api/tasks';
let currentFilter = 'all';

// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const tasksList = document.getElementById('tasksList');
const filterBtns = document.querySelectorAll('.filter-btn');

// Fetch and display all tasks
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        tasksList.innerHTML = '<div class="empty-state">Error loading tasks</div>';
    }
}

// Display tasks based on current filter
function displayTasks(tasks) {
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
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newTask = {
        title: taskTitle.value.trim(),
        description: taskDescription.value.trim()
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        });

        if (response.ok) {
            taskTitle.value = '';
            taskDescription.value = '';
            fetchTasks();
        }
    } catch (error) {
        console.error('Error adding task:', error);
        alert('Failed to add task');
    }
});

// Toggle task completion
async function toggleTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const task = await response.json();

        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...task, completed: !task.completed })
        });

        fetchTasks();
    } catch (error) {
        console.error('Error toggling task:', error);
        alert('Failed to update task');
    }
}

// Delete task
async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        fetchTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
    }
}

// Filter tasks
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        fetchTasks();
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
fetchTasks();
