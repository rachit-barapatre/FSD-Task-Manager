# FSD-Task-Manager

## Project Overview

FSD-Task-Manager is a comprehensive task management application designed to help users manage their tasks efficiently. The application provides an intuitive interface for creating, updating, and organizing tasks, ensuring that users can focus on what matters most.

## Features
- **User Authentication**: Secure login and registration.
- **Task Creation**: Easily add new tasks.
- **Task Management**: Edit, delete, and manage tasks seamlessly.
- **Due Dates**: Set and track due dates for each task.
- **Task Prioritization**: Mark tasks based on priority levels (High, Medium, Low).
- **Search Functionality**: Search for tasks quickly using keywords.
- **Responsive Design**: Optimized for mobile and desktop views.

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Styling**: CSS, Bootstrap
- **Version Control**: Git
- **Deployment**: Heroku

## Installation Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/rachit-barapatre/FSD-Task-Manager.git
   ```
2. Navigate to the project directory:
   ```bash
   cd FSD-Task-Manager
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Set up the environment variables by creating a `.env` file in the root directory and configuring the required settings:
   ```
   PORT=5000
   MONGODB_URI=<Your MongoDB URI>
   JWT_SECRET=<Your JWT Secret>
   ```
5. Start the application:
   ```bash
   npm run dev
   ```

## Usage Guide
- Open your browser and go to `http://localhost:5000`.
- Register an account or log in if you already have one.
- Start creating and managing your tasks through the user-friendly interface.

## Project Structure
```plaintext
FSD-Task-Manager/
├── client/                # Frontend application
│   ├── src/              # Source files
│   ├── public/           # Public files
├── server/                # Backend application
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── config/           # Configuration files
├── .env                  # Environment variables
├── README.md             # Project documentation
├── package.json          # Project metadata
└── ...                  # Other configuration files
```