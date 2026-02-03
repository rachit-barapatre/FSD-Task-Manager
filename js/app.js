// 1. Select DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const stats = document.getElementById('stats');
let currentFilter = 'all'; // Default state
let editId = null; // Agar ye null nahi hai, matlab hum edit kar rahe hain

// 2. Initial State (Data Model)
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// 3. Save to LocalStorage
const saveLocal = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// 4. Update Stats (User Motivation)
const updateStats = () => {
    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    
    stats.innerText = `${completed} / ${total} Completed`;
    
    // --- Progress Bar & Celebration Logic ---
    // Agar sab complete ho gaya aur tasks 0 nahi hain
    if(total > 0 && completed === total) {
        confettiEffect(); // Ye function hum niche banayenge
    }
};

// 5. Render UI (Sabse Important Function)
const renderTasks = () => {
    taskList.innerHTML = "";

    // 1. Filter Logic
    let filteredTasks = tasks;
    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    // 2. Render Filtered Tasks
    filteredTasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';

        li.innerHTML = `
            <div class="task-info">
                <span class="task-text">${task.text}</span>
            </div>
            <div class="actions">
    <button onclick="editTask('${task.id}')" class="btn-edit"><i class="fas fa-pen"></i></button>
    <button onclick="toggleTask('${task.id}')" class="btn-check">
        <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
    </button>
    <button onclick="deleteTask('${task.id}')" class="btn-delete">
        <i class="fas fa-trash"></i>
    </button>
</div>
        `;
        taskList.appendChild(li);
    });

    updateStats();
};

// 6. Add Task Logic
const addTask = () => {
    const text = taskInput.value.trim();
    if (text === '') return alert("Please write a task!");

    if (editId) {
        // --- UPDATE MODE ---
        // Purane task ko dhund ke update karo
        tasks = tasks.map(task => 
            task.id === editId ? { ...task, text: text } : task
        );
        
        // Reset everything
        editId = null;
        addBtn.innerHTML = '<i class="fas fa-plus"></i>';
        addBtn.style.background = ""; // Default color wapas
    } else {
        // --- ADD MODE ---
        const newTask = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
    }

    saveLocal();
    renderTasks();
    taskInput.value = ""; // Clear input
};

// 7. Toggle Complete Logic
window.toggleTask = (id) => {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveLocal();
    renderTasks();
};

// 8. Delete Logic
window.deleteTask = (id) => {
    if (confirm("Are you sure?")) {
        tasks = tasks.filter(task => task.id !== id);
        saveLocal();
        renderTasks();
    }
};

window.editTask = (id) => {
    const taskToEdit = tasks.find(task => task.id === id);
    if(taskToEdit) {
        taskInput.value = taskToEdit.text; // Text wapas input me bhejo
        taskInput.focus(); // Cursor wahan le jao
        editId = id; // Flag set kar do ki hum edit kar rahe hain
        addBtn.innerHTML = '<i class="fas fa-save"></i>'; // Icon badal do
        addBtn.style.background = "#2ecc71"; // Color change (Optional feedback)
    }
};

// 9. Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Filter Logic
const filters = {
    all: document.getElementById('filterAll'),
    pending: document.getElementById('filterPending'),
    completed: document.getElementById('filterCompleted')
};

// Ek helper function jo active class switch karega
const setActiveFilter = (type) => {
    // UI update
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    filters[type].classList.add('active');

    // State update & Re-render
    currentFilter = type;
    renderTasks();
};

// Click Events
filters.all.addEventListener('click', () => setActiveFilter('all'));
filters.pending.addEventListener('click', () => setActiveFilter('pending'));
filters.completed.addEventListener('click', () => setActiveFilter('completed'));
// Initial Render
renderTasks();

const confettiEffect = () => {
    // Basic visual feedback
    const header = document.querySelector('header h1');
    const originalText = header.innerText;
    
    header.innerText = "🎉 All Done! Great Job! 🎉";
    header.style.color = "#2ecc71"; // Green color
    
    // 3 second baad wapas normal kar do
    setTimeout(() => {
        header.innerText = originalText;
        header.style.color = "var(--primary-color)";
    }, 3000);
};