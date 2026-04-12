// --- IMPORTS ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// --- STATE & CONFIG ---
let API_KEY = "";
let tasks = [];
let currentUser = null;
let unsubscribe = null;
let currentFilter = 'all';
let editId = null;
let tempDeletedTask = null;
let undoTimeout = null;

const firebaseConfig = {
    apiKey: "AIzaSyBhmspI5mFEoTw7S1VuLfp_8S-QqBullXw", 
    authDomain: "pro-task-board.firebaseapp.com",
    projectId: "pro-task-board",
    storageBucket: "pro-task-board.firebasestorage.app",
    messagingSenderId: "527388918652",
    appId: "1:527388918652:web:7ee8c1f273837d2e1c5af9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const tasksCol = collection(db, "tasks");

// --- UTILS ---
const getCurrentApiKey = async () => {
    const local = localStorage.getItem("GEMINI_API_KEY");
    if (local) return local;
    try {
        const config = await import("./config.js");
        return config.API_KEY || "";
    } catch (e) { return ""; }
};

// --- DOM ELEMENTS ---
const loginScreen = document.getElementById('loginScreen');
const appContainer = document.getElementById('appContainer');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userDisplay = document.getElementById('userDisplay');
const taskInput = document.getElementById('taskInput');
const descInput = document.getElementById('descInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const stats = document.getElementById('stats');
const dateInput = document.getElementById('dateInput');
const micBtn = document.getElementById('micBtn');
const themeToggle = document.getElementById('themeToggle');
const aiBtn = document.getElementById('aiBtn'); 
const aiStatus = document.getElementById('aiStatus');
const undoToast = document.getElementById('undoToast');
const undoBtn = document.getElementById('undoBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsBox = document.getElementById('settingsBox');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveKeyBtn = document.getElementById('saveKeyBtn');

// --- SETTINGS LOGIC ---
if (settingsBtn) settingsBtn.addEventListener('click', () => settingsBox.classList.toggle('hidden'));
if (saveKeyBtn) {
    saveKeyBtn.addEventListener('click', () => {
        const val = apiKeyInput.value.trim();
        if (val) {
            localStorage.setItem("GEMINI_API_KEY", val);
            alert("Status: Saved! 🚀");
            settingsBox.classList.add('hidden');
        }
    });
}
if (apiKeyInput) apiKeyInput.value = localStorage.getItem("GEMINI_API_KEY") || "";

// ==========================================
// 🔐 AUTHENTICATION
// ==========================================

if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        signInWithPopup(auth, provider).catch((error) => alert(error.message));
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        if (confirm("Logout kar rahe ho?")) signOut(auth);
    });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        loginScreen.classList.add('hidden');
        appContainer.classList.remove('hidden');
        if (userDisplay) userDisplay.innerText = `👤 ${user.displayName}`;
        loadUserTasks(user.uid);
    } else {
        currentUser = null;
        loginScreen.classList.remove('hidden');
        appContainer.classList.add('hidden');
        if (unsubscribe) unsubscribe();
        tasks = [];
        renderTasks();
    }
});

// ==========================================
// ☁️ DATABASE LOGIC
// ==========================================

const loadUserTasks = (uid) => {
    const q = query(tasksCol, where("uid", "==", uid));
    unsubscribe = onSnapshot(q, (snapshot) => {
        tasks = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        renderTasks();
    });
};

const addTask = async () => {
    const text = taskInput.value.trim();
    const desc = descInput ? descInput.value.trim() : "";
    const date = dateInput.value;

    if (!currentUser) return alert("Pehle Login kar bhai!");
    if (text === '') return alert("Kuch likhna padega!");

    addBtn.innerText = "⏳";

    try {
        if (editId) {
            await updateDoc(doc(db, "tasks", editId), { text, description: desc, date });
            editId = null;
            addBtn.innerHTML = '<i class="fas fa-plus"></i>';
            addBtn.style.background = "";
        } else {
            await addDoc(tasksCol, {
                text: text,
                description: desc,
                date: date,
                completed: false,
                createdAt: new Date().toISOString(),
                uid: currentUser.uid
            });
        }
    } catch (error) {
        console.error("Error:", error);
    }

    addBtn.innerHTML = '<i class="fas fa-plus"></i>';
    taskInput.value = "";
    if (descInput) descInput.value = "";
    dateInput.value = "";
};

// ==========================================
// 🧠 AI LOGIC (AUTO-DETECT MODEL)
// ==========================================

if (aiBtn) {
    aiBtn.addEventListener('click', async () => {
        const text = taskInput.value.trim();

        if (!currentUser) return alert("Pehle Login karo!");
        if (!text) return alert("Task likho pehle!");

        const originalIcon = aiBtn.innerHTML;
        aiBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>'; 
        aiBtn.disabled = true;
        
        const statusP = document.getElementById('aiStatus');
        if(statusP) {
            statusP.innerText = "🧠 Finding best model...";
            statusP.style.color = "#6C63FF";
        }

        try {
            const key = await getCurrentApiKey();
            if (!key) {
                alert("Please set your Gemini API Key in the ⚙️ Settings first!");
                settingsBox.classList.remove('hidden');
                return;
            }

            const validModel = "gemini-2.5-flash"; 
            if(statusP) statusP.innerText = `Using AI Assistant...`;

            // STEP 1: Generate Content (Stable V1 Endpoint)
            const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${validModel}:generateContent?key=${key}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Break down this task: "${text}" into 3 short sub-tasks. Return ONLY sub-tasks separated by commas.`
                        }]
                    }]
                })
            });



            const data = await response.json();

            if (data.error) throw new Error(data.error.message);

            if (data.candidates && data.candidates[0].content) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                const subTasks = aiResponse.split(',').map(t => t.trim());

                for (const subTask of subTasks) {
                    if (subTask) {
                        await addDoc(tasksCol, {
                            text: subTask,
                            description: `✨ AI (${validModel})`,
                            date: new Date().toISOString().split('T')[0],
                            completed: false,
                            createdAt: new Date().toISOString(),
                            uid: currentUser.uid
                        });
                    }
                }
                
                if(statusP) {
                    statusP.innerText = "✅ Done!";
                    statusP.style.color = "green";
                }
                taskInput.value = ""; 
            }

        } catch (error) {
            console.error("AI Error:", error);
            alert(`AI Error:\n${error.message}`);
            if(statusP) statusP.innerText = "❌ Error";
        }

        // Reset
        aiBtn.innerHTML = originalIcon;
        aiBtn.disabled = false;
        setTimeout(() => { if(statusP) statusP.innerText = ""; }, 4000);
    });
}

// ==========================================
// 🎨 RENDER, DELETE & UNDO LOGIC
// ==========================================

// Undo Button Listener
if (undoBtn) {
    undoBtn.addEventListener('click', async () => {
        if (tempDeletedTask) {
            // Task restore karo
            await addDoc(tasksCol, tempDeletedTask);
            
            // Toast hatao
            undoToast.classList.add('hidden');
            tempDeletedTask = null;
            clearTimeout(undoTimeout);
        }
    });
}

// NEW DELETE FUNCTION (No Popup, With Undo)
window.deleteTask = async (id) => {
    const taskToDelete = tasks.find(t => t.id === id);
    
    if (taskToDelete) {
        // Data copy karo backup ke liye
        tempDeletedTask = {
            text: taskToDelete.text,
            description: taskToDelete.description || "",
            date: taskToDelete.date || "",
            completed: taskToDelete.completed,
            createdAt: taskToDelete.createdAt, 
            uid: currentUser.uid
        };

        // Database se delete karo
        await deleteDoc(doc(db, "tasks", id));

        // Toast Dikhao
        if(undoToast) {
            undoToast.classList.remove('hidden');

            // 5 second baad toast aur backup gayab
            if (undoTimeout) clearTimeout(undoTimeout);
            undoTimeout = setTimeout(() => {
                undoToast.classList.add('hidden');
                tempDeletedTask = null;
            }, 5000);
        }
    }
};

window.toggleTask = async (id) => { const task = tasks.find(t => t.id === id); if (task) await updateDoc(doc(db, "tasks", id), { completed: !task.completed }); };

window.editTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
        taskInput.value = task.text;
        if (descInput) descInput.value = task.description || "";
        dateInput.value = task.date;
        editId = id;
        taskInput.focus();
        addBtn.innerHTML = '<i class="fas fa-save"></i>';
        addBtn.style.background = "#2ecc71";
    }
};

const renderTasks = () => {
    taskList.innerHTML = "";
    let filteredTasks = tasks;
    if (currentFilter === 'pending') filteredTasks = tasks.filter(t => !t.completed);
    else if (currentFilter === 'completed') filteredTasks = tasks.filter(t => t.completed);

    filteredTasks.forEach((task) => {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        li.className = task.completed ? 'completed' : '';
        const descriptionHtml = task.description ? `<p class="task-desc" style="font-size:0.9rem; color:#888;">${task.description}</p>` : '';

        li.innerHTML = `
            <div class="task-info">
                <span class="task-text">${task.text}</span>
                ${descriptionHtml}
                <div class="task-meta">${getBadge(task.date)}</div>
            </div>
            <div class="actions">
                <button onclick="editTask('${task.id}')" class="btn-edit"><i class="fas fa-pen"></i></button>
                <button onclick="toggleTask('${task.id}')" class="btn-check"><i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i></button>
                <button onclick="deleteTask('${task.id}')" class="btn-delete"><i class="fas fa-trash"></i></button>
            </div>
        `;
        taskList.appendChild(li);
    });
    updateStats();
};

const getBadge = (d) => d ? `<span class="badge badge-future">📅 ${new Date(d).toLocaleDateString()}</span>` : '';
const updateStats = () => { if (stats) stats.innerText = `${tasks.filter(t => t.completed).length} / ${tasks.length} Completed`; };

if (addBtn) addBtn.addEventListener('click', addTask);
if (taskInput) taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });

// Filter
const filters = { all: document.getElementById('filterAll'), pending: document.getElementById('filterPending'), completed: document.getElementById('filterCompleted') };
const setActiveFilter = (type) => {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (filters[type]) filters[type].classList.add('active');
    currentFilter = type;
    renderTasks();
};
if (filters.all) filters.all.addEventListener('click', () => setActiveFilter('all'));
if (filters.pending) filters.pending.addEventListener('click', () => setActiveFilter('pending'));
if (filters.completed) filters.completed.addEventListener('click', () => setActiveFilter('completed'));

// --- THEME LOGIC ---
const applyTheme = (theme) => {
    if (theme === 'dark') {
        document.body.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark');
        document.documentElement.removeAttribute('data-theme');
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
};

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
}

// Init theme on load
applyTheme(localStorage.getItem('theme') || 'light');

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