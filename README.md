# 🚀 FSD-Task-Manager

> A modern, feature-rich task management application designed for maximum productivity with AI-powered capabilities.

![Repository Size](https://img.shields.io/badge/size-60KB-blue)
![Language](https://img.shields.io/badge/language-HTML%20CSS%20JavaScript-green)
![License](https://img.shields.io/badge/license-MIT-purple)
![Status](https://img.shields.io/badge/status-Active-success)

**Live Demo:** [TaskBoard Manager](https://taskboard-manager.vercel.app/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [Language Composition](#language-composition)
- [Contributing](#contributing)
- [Contact](#contact)

---

## 🎯 Overview

**FSD-Task-Manager** is a comprehensive, cloud-based task management solution built with modern web technologies. It combines intuitive UI/UX design with powerful backend functionality to help individuals and teams organize, prioritize, and track their work efficiently.

Whether you're managing personal tasks, team projects, or complex workflows, TaskBoard provides all the tools you need in one streamlined platform.

### Why TaskBoard?
✨ Simple yet powerful  
☁️ Cloud-synced data  
🔒 Secure authentication  
📱 Fully responsive  
🤖 AI-powered assistance  
⚡ Real-time updates  

---

## ✨ Key Features

### 🔐 Authentication & Security
- **Google Sign-In Integration** – Secure login via Firebase Authentication
- **Cloud Data Sync** – Tasks automatically synced across devices
- **User-specific Data** – Each user's tasks isolated and protected

### 📝 Task Management
- **Create Tasks** – Add task titles and detailed descriptions
- **Edit & Delete** – Modify tasks on the fly
- **Task Completion** – Mark tasks as done with visual feedback
- **Bulk Operations** – Manage multiple tasks efficiently

### 📅 Date & Time Tracking
- **Due Dates** – Set deadlines for each task
- **Smart Badges** – Visual indicators for:
  - 🔴 Overdue tasks
  - 🟢 Tasks due today
  - 🔵 Future tasks

### ⭐ Priority & Organization
- **Priority Levels** – Categorize tasks as High, Medium, Low
- **Task Search** – Quick search functionality
- **Auto-sorting** – Tasks sorted by creation date
- **Statistics Dashboard** – Track completion progress (X/Y Completed)

### 🎤 AI & Voice Features
- **Gemini AI Integration** – Smart task suggestions and improvements
- **Voice Input** – Create tasks using speech recognition
- **AI Settings Panel** – Configure API keys securely

### 🌓 User Experience
- **Dark/Light Mode** – Toggle theme preference
- **Responsive Design** – Works seamlessly on desktop, tablet, mobile
- **Smooth Animations** – Polished, professional interactions
- **Undo Functionality** – Recover recently deleted tasks

---

## 💻 Tech Stack

### Frontend Technologies
| Technology | Purpose | Composition |
|-----------|---------|------------|
| **HTML** | Structure & Markup | **47.1%** |
| **CSS** | Styling & Animations | **37.7%** |
| **JavaScript** | Interactivity & Logic | **15.2%** |

### Backend & Services
- **Firebase** – Authentication & Firestore Database
- **Google Gemini AI** – AI-powered task suggestions
- **Web Speech API** – Voice recognition for tasks
- **LocalStorage** – Client-side data caching

### Deployment
- **Vercel** – Hosting & deployment
- **Git** – Version control

---

## 📁 Project Structure

```
FSD-Task-Manager/
├── 📄 index.html                 # Landing/Home page
├── 📄 app.html                   # Main task management interface
├── 📄 features.html              # Features showcase page
├── 📄 pricing.html               # Pricing plans page
├── 📄 contact.html               # Contact information page
│
├── 📁 css/
│   ├── main.css                  # Landing page styles
│   └── app.css                   # Task app styles
│
├── 📁 js/
│   ├── app.js                    # Main application logic
│   ├── config.js                 # Configuration & API keys
│   └── firebase-config.js        # Firebase initialization
│
├── 📁 .vscode/
│   └── settings.json             # VS Code settings
│
├── 📄 README.md                  # Project documentation
└── 📄 .gitignore                 # Git ignore rules
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (optional, for local development)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Firebase account
- Google Gemini API key (for AI features)

### Step 1: Clone the Repository
```bash
git clone https://github.com/rachit-barapatre/FSD-Task-Manager.git
cd FSD-Task-Manager
```

### Step 2: Firebase Configuration
1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Google Authentication
3. Set up Firestore Database
4. Create `js/firebase-config.js`:

```javascript
// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
```

### Step 3: Add Gemini API Key (Optional)
1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Open the app and go to Settings
3. Paste your API key (saved securely in browser storage)

### Step 4: Run Locally
Using Live Server (VS Code extension):
- Right-click `index.html` → "Open with Live Server"
- Opens at `http://localhost:5500`

Or use any local server:
```bash
python -m http.server 8000
# Visit http://localhost:8000
```

### Step 5: Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

---

## 📖 Usage Guide

### Getting Started
1. **Visit the app** → Navigate to `app.html` or the live demo
2. **Sign in** → Click "Sign in with Google"
3. **Create a task** → Type task title and optional description
4. **Set due date** → Click the date picker
5. **Submit** → Press Enter or click the Add button

### Managing Tasks
- **Mark Complete** → Click the checkmark icon
- **Edit Task** → Click the task to inline edit
- **Delete Task** → Click trash icon (can undo within 5 seconds)
- **Use Voice** → Click microphone icon and speak your task
- **Get AI Help** → Click sparkle icon for AI suggestions

### Advanced Features
- **Search** → Use browser find (Ctrl+F) to search tasks
- **Dark Mode** → Toggle moon icon in header
- **View Stats** → See completion percentage in header
- **Settings** → Configure AI API key securely

---

## 📊 Language Composition

This project showcases modern web development fundamentals:

```
┌─────────────┬──────────┬─────────────┐
│ Language    │ Percent  │ Use Case    │
├─────────────┼──────────┼─────────────┤
│ HTML        │  47.1%   │ Structure   │
│ CSS         │  37.7%   │ Styling     │
│ JavaScript  │  15.2%   │ Logic       │
└─────────────┴──────────┴─────────────┘
```

### HTML (47.1%)
- Semantic markup for accessibility
- Form inputs and data binding
- Multi-page structure (landing + app)

### CSS (37.7%)
- Modern CSS Grid & Flexbox layouts
- CSS variables for theming
- Animations and transitions
- Mobile-first responsive design
- Dark mode implementation

### JavaScript (15.2%)
- Firebase integration
- DOM manipulation
- Event handling
- Web Speech API
- Local storage management
- AI API communication

---

## 🎨 Design Highlights

- **Color Palette** – Modern blues and purples with accessibility focus
- **Typography** – Clean, professional sans-serif fonts
- **Animations** – Smooth transitions and micro-interactions
- **Accessibility** – WCAG compliant with proper labels and contrast
- **Performance** – Optimized assets and lazy loading

---

## 🔒 Security & Privacy

- ✅ Firebase security rules restrict data access
- ✅ Google OAuth 2.0 authentication
- ✅ API keys stored in browser LocalStorage (user can clear)
- ✅ No sensitive data in repository
- ✅ HTTPS enforced on deployment

---

## 🚧 Future Enhancements

- [ ] Team collaboration features
- [ ] Task templates & recurring tasks
- [ ] Advanced filtering & sorting
- [ ] Task attachments & file uploads
- [ ] Calendar integration
- [ ] Notifications & reminders
- [ ] Export to PDF/CSV
- [ ] Mobile app (React Native)

---

## 📝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License – see LICENSE file for details.

---

## 👤 Author

**Rachit Barapatre**
- GitHub: [@rachit-barapatre](https://github.com/rachit-barapatre)
- Live Demo: [TaskBoard Manager](https://taskboard-manager.vercel.app/)
- Portfolio: [Your Portfolio]

---

## 💬 Support & Contact

- **Issues** – Report bugs via GitHub Issues
- **Discussions** – Ask questions in GitHub Discussions
- **Email** – [Your Email]
- **Twitter** – [@Your Handle]

---

## 🙏 Acknowledgments

- Firebase for real-time database & authentication
- Google Gemini AI for intelligent suggestions
- Font Awesome for beautiful icons
- Vercel for seamless deployment
- The open-source community for inspiration

---

**Made with ❤️ by Rachit Barapatre**

*Last Updated: April 2026*
