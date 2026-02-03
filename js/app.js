// 1. Select DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const stats = document.getElementById('stats');

// 2. Initial State (Data Model)
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// 3. Save to LocalStorage
const saveLocal = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// 4. Update Stats (User Motivation)
const updateStats = () => {
    const completed = tasks.filter(t => t.completed).length;
    stats.innerText = `${completed} / ${tasks.length} Completed`;
    // Yahan future me progress bar add kar sakte hain
};

// 5. Render UI (Sabse Important Function)
const renderTasks = () => {
    taskList.innerHTML = ""; // List clear karo
    
    tasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        
        li.innerHTML = `
            <div class="task-info">
                <span class="task-text">${task.text}</span>
            </div>
            <div class="actions">
                <button onclick="toggleTask('${task.id}')" class="btn-check"><i class="fas fa-check"></i></button>
                <button onclick="deleteTask('${task.id}')" class="btn-delete"><i class="fas fa-trash"></i></button>
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

    const newTask = {
        id: Date.now().toString(), // Simple ID generation
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
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
    if(confirm("Are you sure?")) {
        tasks = tasks.filter(task => task.id !== id);
        saveLocal();
        renderTasks();
    }
};

// 9. Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Initial Render
renderTasks();