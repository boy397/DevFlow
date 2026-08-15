# DevFlow

DevFlow is a lightweight, Jira-inspired project and issue management web application. It is built using the **MERN** stack (MongoDB, Express.js, React with Vite, and Node.js) and features role-based access control (RBAC) and a Kanban board workflow.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express.js, JWT, bcrypt
- **Database**: MongoDB (via Mongoose)

## Features
- **Authentication**: JWT-based secure authentication and bcrypt password hashing.
- **Role-Based Access Control**: Assign roles (Admin, Manager, Developer) to manage permissions within projects.
- **Projects & Issues**: Create projects and manage tasks (issues) with a Kanban board (Backlog, Todo, In Progress, Done).
- **Interactive UI**: Drag-and-drop Kanban board and responsive layout.
- **Analytics Dashboard**: View project statistics and progress.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas (or a local MongoDB instance)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd DevFlow
   ```

2. **Setup Server**:
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory and fill in the required variables (see `.env` template). Then start the server:
   ```bash
   npm run dev
   ```

3. **Setup Client**:
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env` file in the `client` directory and configure the API URL. Then start the frontend:
   ```bash
   npm run dev
   ```

## License
MIT
