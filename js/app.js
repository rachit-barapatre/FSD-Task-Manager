// // 1. Select DOM Elements
// const taskInput = document.getElementById('taskInput');
// const descInput = document.getElementById('descInput'); 
// const addBtn = document.getElementById('addBtn');
// const taskList = document.getElementById('taskList');
// const stats = document.getElementById('stats');
// const dateInput = document.getElementById('dateInput');
// const micBtn = document.getElementById('micBtn');
// const themeToggle = document.getElementById('themeToggle');
// const toast = document.getElementById('toast'); // Undo notification
// const body = document.body;

// // 2. Initial State
// let currentFilter = 'all'; 
// let editId = null; 
// let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
// let lastDeletedTask = null; // Backup for Undo
// let toastTimer = null;

// // --- UTILITY FUNCTIONS ---

// const saveLocal = () => {
//     localStorage.setItem('tasks', JSON.stringify(tasks));
// };

// // Date Badge Logic
// const getBadge = (dateString) => {
//     if (!dateString) return ''; 

//     const taskDate = new Date(dateString);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); 
//     taskDate.setHours(0, 0, 0, 0);

//     if (taskDate < today) {
//         return `<span class="badge badge-overdue">Overdue ⚠️</span>`;
//     } else if (taskDate.getTime() === today.getTime()) {
//         return `<span class="badge badge-today">Today 🔥</span>`;
//     } else {
//         const options = { month: 'short', day: 'numeric' };
//         return `<span class="badge badge-future">📅 ${taskDate.toLocaleDateString('en-US', options)}</span>`;
//     }
// };

// // Confetti Effect
// const confettiEffect = () => {
//     const header = document.querySelector('header h1');
//     if (!header) return;
    
//     const originalText = header.innerText;
//     header.innerText = "🎉 All Done! Great Job! 🎉";
//     header.style.color = "#2ecc71"; 
    
//     setTimeout(() => {
//         header.innerText = originalText;
//         header.style.color = ""; 
//     }, 3000);
// };

// // Toast Notification (Undo Logic)
// const showToast = () => {
//     if (!toast) return; // Safety check
//     if (toastTimer) clearTimeout(toastTimer);
    
//     toast.classList.add('show');
    
//     toastTimer = setTimeout(() => {
//         hideToast();
//         lastDeletedTask = null; // Time up
//     }, 3000);
// };

// const hideToast = () => {
//     if (toast) toast.classList.remove('show');
// };

// // --- CORE FUNCTIONS ---

// const updateStats = () => {
//     const completed = tasks.filter(t => t.completed).length;
//     const total = tasks.length;
    
//     if(stats) stats.innerText = `${completed} / ${total} Completed`;
    
//     if(total > 0 && completed === total) {
//         confettiEffect(); 
//     }
// };

// const renderTasks = () => {
//     taskList.innerHTML = "";

//     let filteredTasks = tasks;
//     if (currentFilter === 'pending') {
//         filteredTasks = tasks.filter(task => !task.completed);
//     } else if (currentFilter === 'completed') {
//         filteredTasks = tasks.filter(task => task.completed);
//     }

//     filteredTasks.forEach((task) => {
//         const li = document.createElement('li');
//         li.className = task.completed ? 'completed' : '';

//         const descriptionHtml = task.description 
//             ? `<p class="task-desc">${task.description}</p>` 
//             : '';

//         li.innerHTML = `
//             <div class="task-info">
//                 <span class="task-text">${task.text}</span>
//                 ${descriptionHtml}
//                 <div class="task-meta">
//                     ${getBadge(task.date)} 
//                 </div>
//             </div>

//             <div class="actions">
//                 <button onclick="editTask('${task.id}')" class="btn-edit"><i class="fas fa-pen"></i></button>
//                 <button onclick="toggleTask('${task.id}')" class="btn-check">
//                     <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
//                 </button>
//                 <button onclick="deleteTask('${task.id}')" class="btn-delete">
//                     <i class="fas fa-trash"></i>
//                 </button>
//             </div>
//         `;
//         taskList.appendChild(li);
//     });

//     updateStats();
// };

// const addTask = () => {
//     const text = taskInput.value.trim();
//     const desc = descInput.value.trim();
//     const date = dateInput.value; 

//     if (text === '') return alert("Please write a task title!");

//     if (editId) {
//         // Update Mode
//         tasks = tasks.map(task => 
//             task.id === editId ? { ...task, text: text, description: desc, date: date } : task
//         );
//         editId = null;
//         addBtn.innerHTML = '<i class="fas fa-plus"></i>';
//         addBtn.style.background = ""; 
//     } else {
//         // Add Mode
//         const newTask = {
//             id: Date.now().toString(),
//             text: text,
//             description: desc,
//             date: date, 
//             completed: false,
//             createdAt: new Date().toISOString()
//         };
//         tasks.push(newTask);
//     }

//     saveLocal();
//     renderTasks();
    
//     // Reset Inputs
//     taskInput.value = ""; 
//     descInput.value = "";
//     dateInput.value = ""; 
// };

// // --- GLOBAL WINDOW FUNCTIONS ---

// window.toggleTask = (id) => {
//     tasks = tasks.map(task =>
//         task.id === id ? { ...task, completed: !task.completed } : task
//     );
//     saveLocal();
//     renderTasks();
// };

// // Updated Delete Logic with Undo
// window.deleteTask = (id) => {
//     const taskIndex = tasks.findIndex(t => t.id === id);
//     if (taskIndex > -1) {
//         lastDeletedTask = tasks[taskIndex]; // Backup logic
//         tasks.splice(taskIndex, 1);
        
//         saveLocal();
//         renderTasks();
//         showToast(); // Show Undo popup
//     }
// };

// // Undo Function
// window.undoDelete = () => {
//     if (lastDeletedTask) {
//         tasks.push(lastDeletedTask);
//         saveLocal();
//         renderTasks();
        
//         lastDeletedTask = null;
//         hideToast();
//     }
// };

// window.editTask = (id) => {
//     const taskToEdit = tasks.find(task => task.id === id);
//     if(taskToEdit) {
//         taskInput.value = taskToEdit.text;
//         descInput.value = taskToEdit.description || "";
//         dateInput.value = taskToEdit.date; 
        
//         taskInput.focus();
//         editId = id;
//         addBtn.innerHTML = '<i class="fas fa-save"></i>';
//         addBtn.style.background = "#2ecc71";
//     }
// };

// // --- THEME TOGGLE ---
// if (themeToggle) {
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme === 'dark') {
//         body.classList.add('dark');
//         themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
//     }

//     themeToggle.addEventListener('click', () => {
//         body.classList.toggle('dark');
//         if (body.classList.contains('dark')) {
//             localStorage.setItem('theme', 'dark');
//             themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
//         } else {
//             localStorage.setItem('theme', 'light');
//             themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
//         }
//     });
// }

// // --- SMART VOICE RECOGNITION (Fix applied here) ---
// const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// // 1. Focus Tracker: Pata karo user kahan likhna chahta hai
// let activeInput = taskInput; // Default Title

// taskInput.addEventListener('focus', () => { activeInput = taskInput; });
// descInput.addEventListener('focus', () => { activeInput = descInput; });

// if (SpeechRecognition && micBtn) {
//     const recognition = new SpeechRecognition();
//     recognition.continuous = false;
//     recognition.lang = 'en-US';

//     micBtn.addEventListener('click', () => {
//         if (micBtn.classList.contains('listening')) {
//             recognition.stop();
//         } else {
//             recognition.start();
//         }
//     });

//     recognition.onstart = () => {
//         micBtn.classList.add('listening');
//         // Jo box active hai, wahan placeholder change karo
//         activeInput.placeholder = "Listening... Speak now 🗣️";
//     };

//     recognition.onend = () => {
//         micBtn.classList.remove('listening');
//         // Reset placeholders
//         taskInput.placeholder = "Task Title (e.g., Project Meeting)";
//         descInput.placeholder = "Add details... (optional)";
//     };

//     recognition.onresult = (event) => {
//         const transcript = event.results[0][0].transcript;
        
//         // Smart Insert: Jo box last click kiya tha, wahan text daalo
//         activeInput.value = transcript;
//     };

// } else if (micBtn) {
//     micBtn.style.display = 'none';
// }

// // --- EVENT LISTENERS ---
// addBtn.addEventListener('click', addTask);
// taskInput.addEventListener('keypress', (e) => {
//     if (e.key === 'Enter') addTask();
// });

// const filters = {
//     all: document.getElementById('filterAll'),
//     pending: document.getElementById('filterPending'),
//     completed: document.getElementById('filterCompleted')
// };

// const setActiveFilter = (type) => {
//     document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
//     if(filters[type]) filters[type].classList.add('active');
//     currentFilter = type;
//     renderTasks();
// };

// if(filters.all) filters.all.addEventListener('click', () => setActiveFilter('all'));
// if(filters.pending) filters.pending.addEventListener('click', () => setActiveFilter('pending'));
// if(filters.completed) filters.completed.addEventListener('click', () => setActiveFilter('completed'));

// // --- INITIAL RENDER ---
// renderTasks();

// --- IMPORTS (Auth + Database) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// --- TERA CONFIG (Ready to use) ---
const firebaseConfig = {
    apiKey: "AIzaSyBhmspI5mFEoTw7S1VuLfp_8S-QqBullXw",
    authDomain: "pro-task-board.firebaseapp.com",
    projectId: "pro-task-board",
    storageBucket: "pro-task-board.firebasestorage.app",
    messagingSenderId: "527388918652",
    appId: "1:527388918652:web:7ee8c1f273837d2e1c5af9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const tasksCol = collection(db, "tasks");

// --- DOM ELEMENTS ---
// Login Screens
const loginScreen = document.getElementById('loginScreen');
const appContainer = document.getElementById('appContainer');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userDisplay = document.getElementById('userDisplay');

// App Elements
const taskInput = document.getElementById('taskInput');
const descInput = document.getElementById('descInput'); 
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const stats = document.getElementById('stats');
const dateInput = document.getElementById('dateInput');
const micBtn = document.getElementById('micBtn');
const themeToggle = document.getElementById('themeToggle');

// --- STATE ---
let tasks = [];
let currentUser = null; 
let unsubscribe = null; // Listener band karne ke liye
let currentFilter = 'all';
let editId = null;

// ==========================================
// 🔐 AUTHENTICATION LOGIC (Login/Logout)
// ==========================================

// 1. Login with Google
if(loginBtn) {
    loginBtn.addEventListener('click', () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log("Login Success:", result.user.email);
            })
            .catch((error) => {
                console.error("Login Failed:", error);
                alert("Login Error: " + error.message);
            });
    });
}

// 2. Logout
if(logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        if(confirm("Are you sure you want to logout?")) {
            signOut(auth).then(() => {
                console.log("Logged out");
            });
        }
    });
}

// 3. User Monitor (Auto Check)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // --- USER LOGGED IN ---
        currentUser = user;
        loginScreen.classList.add('hidden');    // Hide Login
        appContainer.classList.remove('hidden');// Show App
        
        if(userDisplay) userDisplay.innerText = `👤 ${user.displayName}`;
        
        // Load ONLY this user's tasks
        loadUserTasks(user.uid);
    } else {
        // --- USER LOGGED OUT ---
        currentUser = null;
        loginScreen.classList.remove('hidden'); // Show Login
        appContainer.classList.add('hidden');   // Hide App
        
        if (unsubscribe) unsubscribe(); // Stop database listener
        tasks = []; 
        renderTasks(); 
    }
});

// ==========================================
// ☁️ DATABASE LOGIC (Firestore)
// ==========================================

const loadUserTasks = (uid) => {
    // Query: Select * From Tasks WHERE uid == current_user_id
    const q = query(tasksCol, where("uid", "==", uid));

    unsubscribe = onSnapshot(q, (snapshot) => {
        tasks = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        
        // Manual Sort (Newest First)
        tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        renderTasks();
    });
};

const addTask = async () => {
    const text = taskInput.value.trim();
    const desc = descInput ? descInput.value.trim() : ""; 
    const date = dateInput.value;

    if (!currentUser) return alert("Please login first!");
    if (text === '') return alert("Please write a task!");

    addBtn.innerText = "⏳"; 

    try {
        if (editId) {
            // Update
            const taskRef = doc(db, "tasks", editId);
            await updateDoc(taskRef, { text, description: desc, date });
            editId = null;
            addBtn.innerHTML = '<i class="fas fa-plus"></i>';
            addBtn.style.background = "";
        } else {
            // Add New (with UID)
            await addDoc(tasksCol, {
                text: text,
                description: desc,
                date: date,
                completed: false,
                createdAt: new Date().toISOString(),
                uid: currentUser.uid // 🔴 USER ID SAVE KARO
            });
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to save. Check console.");
    }

    addBtn.innerHTML = '<i class="fas fa-plus"></i>';
    taskInput.value = "";
    if(descInput) descInput.value = "";
    dateInput.value = "";
};

// ==========================================
// 🎨 UI & HELPERS
// ==========================================

const renderTasks = () => {
    taskList.innerHTML = "";
    
    let filteredTasks = tasks;
    if (currentFilter === 'pending') filteredTasks = tasks.filter(t => !t.completed);
    else if (currentFilter === 'completed') filteredTasks = tasks.filter(t => t.completed);

    filteredTasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';

        const descriptionHtml = task.description 
            ? `<p class="task-desc" style="font-size:0.9rem; color:#888;">${task.description}</p>` 
            : '';

        li.innerHTML = `
            <div class="task-info">
                <span class="task-text">${task.text}</span>
                ${descriptionHtml}
                <div class="task-meta">${getBadge(task.date)}</div>
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

// --- Global Functions for HTML ---
window.deleteTask = async (id) => {
    if (confirm("Delete this task?")) {
        await deleteDoc(doc(db, "tasks", id));
    }
};

window.toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if(task) await updateDoc(doc(db, "tasks", id), { completed: !task.completed });
};

window.editTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if(task) {
        taskInput.value = task.text;
        if(descInput) descInput.value = task.description || "";
        dateInput.value = task.date;
        editId = id;
        taskInput.focus();
        addBtn.innerHTML = '<i class="fas fa-save"></i>';
        addBtn.style.background = "#2ecc71";
    }
};

// --- Utilities ---
const getBadge = (dateString) => {
    if (!dateString) return ''; 
    const d = new Date(dateString);
    return `<span class="badge badge-future">📅 ${d.toLocaleDateString()}</span>`;
};

const updateStats = () => {
    const completed = tasks.filter(t => t.completed).length;
    if(stats) stats.innerText = `${completed} / ${tasks.length} Completed`;
};

// --- Event Listeners ---
if(addBtn) addBtn.addEventListener('click', addTask);
if(taskInput) taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });

// Filter
const filters = {
    all: document.getElementById('filterAll'),
    pending: document.getElementById('filterPending'),
    completed: document.getElementById('filterCompleted')
};
const setActiveFilter = (type) => {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if(filters[type]) filters[type].classList.add('active');
    currentFilter = type;
    renderTasks();
};
if(filters.all) filters.all.addEventListener('click', () => setActiveFilter('all'));
if(filters.pending) filters.pending.addEventListener('click', () => setActiveFilter('pending'));
if(filters.completed) filters.completed.addEventListener('click', () => setActiveFilter('completed'));

// Theme Toggle
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
    });
}

// Voice Logic
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition && micBtn) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    
    micBtn.addEventListener('click', () => {
        if (micBtn.classList.contains('listening')) recognition.stop();
        else recognition.start();
    });
    
    recognition.onresult = (event) => {
        taskInput.value = event.results[0][0].transcript;
    };
}