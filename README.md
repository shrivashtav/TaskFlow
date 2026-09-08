# TaskFlow — Mini Task Management System

A modern, production-grade SaaS-style Task Management System built with **React.js**, **Node.js**, **Express.js**, and **MySQL**.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Features](#2-features)
3. [Tech Stack](#3-tech-stack)
4. [Architecture](#4-architecture)
5. [Folder Structure](#5-folder-structure)
6. [Database Schema & Relationships](#6-database-schema--relationships)
7. [API Documentation](#7-api-documentation)
8. [Environment Variables](#8-environment-variables)
9. [Installation Guide](#9-installation-guide)
10. [Setting Up MySQL](#10-setting-up-mysql)
11. [Running the Backend](#11-running-the-backend)
12. [Running the Frontend](#12-running-the-frontend)
13. [Test Credentials](#13-test-credentials)
14. [API Examples & Postman](#14-api-examples--postman)
15. [UI Screenshots & Design System](#15-ui-screenshots--design-system)
16. [Security & Best Practices](#16-security--best-practices)
17. [Interview Readiness & Architecture Decisions](#17-interview-readiness--architecture-decisions)
18. [Future Improvements](#18-future-improvements)

---

## 1. Project Overview

**TaskFlow** is a full-stack web application designed for engineering teams and product organizations to streamline project tracking and task workflows. Unlike static CRUD apps or mock-data prototypes, TaskFlow is powered by an Express REST API directly connected to a **MySQL** relational database with connection pooling, JWT security, server-side filtering, and responsive UI components.

---

## 2. Features

### Authentication & Security
- **JWT Authentication**: Secure Bearer token authentication stored safely in client-side storage.
- **Bcrypt Password Hashing**: Passwords stored using salt rounds of 10.
- **Protected Routes**: React client-side route guards and Express backend authorization middleware.
- **Predefined Test Account**: Seamless one-click test credentials autofill for quick demonstration.

### Dashboard
- **Real-Time Statistics**: 4 dynamic metric cards (**Total Projects**, **Total Tasks**, **Pending Tasks**, **Completed Tasks**) calculated directly via MySQL aggregate queries.
- **Recent Projects Carousel/Grid**: Displays latest projects with completion percentage, progress bars, and direct navigation.
- **Loading, Empty, and Error States**: Polished feedback during network transitions.

### Project Management
- **Full CRUD Operations**: Create, View, Edit, and Delete projects with instant UI feedback.
- **Cascading Deletions**: Intentional foreign-key cascading (`ON DELETE CASCADE`) to clean up tasks when a project is removed.
- **Search Projects**: Server-side name and description search with client-side debouncing.
- **View Toggles**: Switch between detailed Table view and card Grid view.

### Task Management
- **Task Attributes**: Title, Description, Priority (`LOW`, `MEDIUM`, `HIGH`), Status (`TODO`, `IN_PROGRESS`, `COMPLETED`), Due Date, and Assignee.
- **Task CRUD**: Add tasks to projects, edit task details, delete tasks with confirmation dialogs.
- **Quick Status Transitions**: Change task statuses directly from the project task table.
- **Server-Side Search & Filtering**: Filter tasks simultaneously by search query, status enum, and priority level via backend query parameters (`?search=&status=&priority=`).

---

## 3. Tech Stack

- **Frontend**:
  - React.js (v18)
  - React Router (v6)
  - CSS3 Modern SaaS Design System (CSS Custom Properties, Flexbox, CSS Grid)
  - Lucide React (Icons)
  - Vite (Build Tool & Dev Server)
- **Backend**:
  - Node.js & Express.js
  - `mysql2/promise` (Connection pool with parameterized queries)
  - `jsonwebtoken` (JWT Token generation & verification)
  - `bcryptjs` (Password hashing)
  - `cors` & `dotenv`
- **Database**:
  - MySQL / MariaDB (Port 3306)
- **Tools**:
  - Git & GitHub
  - Postman (Comprehensive API Collection included)
  - VS Code

---

## 4. Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React.js Frontend                    │
│    (Pages, Contexts, Hooks, Reusable UI Components)     │
└───────────────────────────┬─────────────────────────────┘
                            │ HTTP / JSON
                            │ (Bearer JWT Token)
                            ▼
┌─────────────────────────────────────────────────────────┐
│                 Express.js REST API                     │
│  (Auth Middleware, Validation, Controllers, Error HW)   │
└───────────────────────────┬─────────────────────────────┘
                            │ Parameterized SQL
                            │ Connection Pool (mysql2)
                            ▼
┌─────────────────────────────────────────────────────────┐
│                     MySQL Database                      │
│      (users ──1:N──> projects ──1:N──> tasks)           │
└─────────────────────────────────────────────────────────┘
```

---

## 5. Folder Structure

```
taskflow/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── DashboardCard.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── FilterDropdown.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── ProjectModal.jsx
│   │   │   ├── ProjectTable.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TaskModal.jsx
│   │   │   └── TaskTable.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useDebounce.js
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── ProjectDetailsPage.jsx
│   │   │   └── ProjectsPage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── dashboardService.js
│   │   │   ├── projectService.js
│   │   │   └── taskService.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .gitignore
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── utils/
│   │   ├── apiResponse.js
│   │   └── seedData.js
│   ├── server.js
│   ├── test_api.js
│   ├── package.json
│   ├── .env
│   ├── .env.example
│   └── .gitignore
│
├── database/
│   └── schema.sql
│
├── postman/
│   └── TaskFlow.postman_collection.json
│
├── .gitignore
└── README.md
```

---

## 6. Database Schema & Relationships

The MySQL database is named **`taskflow_db`**.

### Entity Relationship Diagram

```
┌─────────────────────┐
│        USERS        │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ email (UQ)          │
│ password (hashed)   │
│ created_at          │
└──────────┬──────────┘
           │ 1:N
           ▼
┌─────────────────────┐
│      PROJECTS       │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ description         │
│ created_by (FK)     │────────┐
│ created_at          │        │
│ updated_at          │        │
└─────────────────────┘        │ 1:N
                               ▼
                    ┌─────────────────────┐
                    │        TASKS        │
                    ├─────────────────────┤
                    │ id (PK)             │
                    │ project_id (FK)     │
                    │ title               │
                    │ description         │
                    │ status (ENUM)       │
                    │ priority (ENUM)     │
                    │ due_date            │
                    │ assigned_to         │
                    │ created_at          │
                    │ updated_at          │
                    └─────────────────────┘
```

### Table Definitions
1. **`users`**:
   - `id`: `INT AUTO_INCREMENT PRIMARY KEY`
   - `name`: `VARCHAR(100) NOT NULL`
   - `email`: `VARCHAR(191) UNIQUE NOT NULL`
   - `password`: `VARCHAR(255) NOT NULL` (bcrypt hash)
   - `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
2. **`projects`**:
   - `id`: `INT AUTO_INCREMENT PRIMARY KEY`
   - `name`: `VARCHAR(150) NOT NULL`
   - `description`: `TEXT NULL`
   - `created_by`: `INT NOT NULL`, `FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE`
   - `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
   - `updated_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`
3. **`tasks`**:
   - `id`: `INT AUTO_INCREMENT PRIMARY KEY`
   - `project_id`: `INT NOT NULL`, `FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE`
   - `title`: `VARCHAR(200) NOT NULL`
   - `description`: `TEXT NULL`
   - `status`: `ENUM('TODO', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'TODO' NOT NULL`
   - `priority`: `ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM' NOT NULL`
   - `due_date`: `DATE NULL`
   - `assigned_to`: `VARCHAR(100) NULL`
   - `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
   - `updated_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`

### Indexing Strategy
- `idx_users_email` &rarr; Quick index lookup on login.
- `idx_projects_created_by` & `idx_projects_name` &rarr; Fast user project filtering and searches.
- `idx_tasks_project_id`, `idx_tasks_status`, `idx_tasks_priority`, `idx_tasks_title` &rarr; Optimized compound query performance for server-side task search & filters.

---

## 7. API Documentation

All responses follow the unified JSON structure:
- **Success**: `{ "success": true, "message": "...", "data": ... }`
- **Error**: `{ "success": false, "message": "..." }`

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user and receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (Bearer) |

### Dashboard Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | Aggregate stats (projects, tasks, pending, completed) & recent projects | Yes (Bearer) |

### Project Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/projects` | Get all user projects (supports `?search=`) | Yes (Bearer) |
| `POST` | `/api/projects` | Create a new project | Yes (Bearer) |
| `GET` | `/api/projects/:id` | Get project by ID with task metrics | Yes (Bearer) |
| `PUT` | `/api/projects/:id` | Update project name and description | Yes (Bearer) |
| `DELETE` | `/api/projects/:id` | Delete project and cascade delete tasks | Yes (Bearer) |

### Task Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/projects/:projectId/tasks` | Get tasks for project (supports `?search=`, `?status=`, `?priority=`) | Yes (Bearer) |
| `POST` | `/api/projects/:projectId/tasks` | Create a task within a project | Yes (Bearer) |
| `GET` | `/api/tasks/:id` | Get single task details | Yes (Bearer) |
| `PUT` | `/api/tasks/:id` | Update task details / status / priority | Yes (Bearer) |
| `DELETE` | `/api/tasks/:id` | Delete task | Yes (Bearer) |

---

## 8. Environment Variables

> [!CAUTION]
> **DO NOT commit passwords, API keys, or production secrets to Git.**

The backend uses `.env` (a `.env.example` template is provided):

```env
# Server
PORT=5000
NODE_ENV=development

# Database Configuration (MySQL)
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=taskflow_db
DB_USERNAME=root
DB_PASSWORD=

# JWT Secret Configuration
JWT_SECRET=super_secret_taskflow_jwt_key_987654321
JWT_EXPIRES_IN=7d
```

---

## 9. Installation Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- MySQL / MariaDB Server running on port 3306
- Git

### Clone the Repository
```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow
```

---

## 10. Setting Up MySQL

1. Ensure your local MySQL / MariaDB service is running:
   ```powershell
   Get-Service -Name *mysql*
   ```
2. Import the database schema and seed data:
   - **Option A: Using MySQL CLI**
     ```bash
     mysql -u root -p < database/schema.sql
     # Or if no password:
     mysql -u root < database/schema.sql
     ```
   - **Option B: Using Backend Seed Script**
     ```bash
     cd backend
     npm run seed
     ```

This creates the `taskflow_db` database, generates the tables, constraints, indexes, and provisions the default administrator account.

---

## 11. Running the Backend

```bash
cd backend
npm install
npm run dev
# Or for standard production start:
npm start
```

The server starts on `http://localhost:5000`. You will see:
```text
=========================================
🚀 TaskFlow Backend Server running on port 5000
🌐 Base URL: http://localhost:5000
=========================================
[Database] Successfully connected to MySQL database: taskflow_db
```

### Running the Backend Test Suite
To verify all REST endpoints and database queries automatically:
```bash
node test_api.js
```

---

## 12. Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend launches on `http://localhost:5173`. Open your browser and navigate to:
```
http://localhost:5173
```

---

## 13. Test Credentials

A predefined admin account is pre-seeded in MySQL:

| Field | Value |
|---|---|
| **Email** | `admin@example.com` |
| **Password** | `admin123` |

*(On the Login screen, click the **Auto Fill** button for instant 1-click login!)*

---

## 14. API Examples & Postman

A complete Postman collection is provided in `postman/TaskFlow.postman_collection.json`.

### 1. Login Request
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com"
    }
  }
}
```

### 2. Search & Filter Tasks Request
```http
GET /api/projects/1/tasks?search=prototype&status=COMPLETED&priority=HIGH
Authorization: Bearer <your_jwt_token>
```
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": 1,
      "project_id": 1,
      "title": "Design Figma Prototypes",
      "description": "Draft high-fidelity mockups for desktop and mobile homepages.",
      "status": "COMPLETED",
      "priority": "HIGH",
      "due_date": "2026-09-09",
      "assigned_to": "Sarah Designer",
      "created_at": "2026-09-07T16:31:20.000Z",
      "updated_at": "2026-09-07T16:31:20.000Z"
    }
  ]
}
```

---

## 15. UI Screenshots & Design System

The UI is built with a modern SaaS product aesthetic:
- **Typography**: Clean, geometric typography powered by `Plus Jakarta Sans` and `Inter`.
- **Status Badges**:
  - `TODO`: Slate Gray pill
  - `IN_PROGRESS`: Indigo Blue pill
  - `COMPLETED`: Emerald Green pill
- **Priority Badges**:
  - `LOW`: Light Green pill
  - `MEDIUM`: Amber Warm pill
  - `HIGH`: Crimson Red pill
- **Responsive Layout**: Collapsible mobile sidebar overlay drawer, flex-wrap toolbars, and responsive tables.
- **Micro-Interactions**: Hover elevation, progress bar animations, dialog fade-ins, and toast alerts.

---

## 16. Security & Best Practices

1. **SQL Injection Prevention**: All SQL queries use prepared statements with placeholders (`?`) via `mysql2/promise`.
2. **Password Hashing**: Bcrypt with 10 salt rounds ensures brute-force resistance.
3. **No Password Hash Leakage**: Password hashes are stripped from all query projections before returning user objects to the client.
4. **Data Ownership Verification**: Every project and task query strictly verifies that the requested entity belongs to the authenticated user's `id`.
5. **Sanitized Error Responses**: Internal database error codes and SQL stacks are logged on the server but shielded from the client, displaying clean user-friendly messages.

---

## 17. Interview Readiness & Architecture Decisions

Use these notes to explain your architectural choices during an interview:

### Why Express.js & MySQL?
- **Relational Integrity**: Projects and tasks have an explicit one-to-many relationship with foreign key integrity. MySQL enforces these constraints at the database engine level.
- **Connection Pooling**: `mysql2/promise` maintains an active pool of reusable connections, eliminating the latency of creating a new socket handshake per HTTP request.
- **Raw Parameterized SQL**: Used instead of bulky ORMs to show deep understanding of SQL syntax, indexing, aggregation (`SUM(CASE ...)`), and avoid N+1 query problems.

### Why Server-Side Filtering & Search?
- Client-side filtering breaks down when datasets scale to thousands of records. Executing searches and filters on MySQL allows the database engine to utilize compound B-Tree indexes (`idx_tasks_status`, `idx_tasks_priority`), keeping response times in single-digit milliseconds.

### Cascading Delete Strategy
- When a project is deleted, orphan tasks serve no business purpose. By specifying `FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE`, MySQL atomically purges dependent tasks inside the same transaction, guaranteeing data hygiene.

---

## 18. Future Improvements

- **Drag-and-Drop Kanban Board**: Visual drag-and-drop task status transitions using `@hello-pangea/dnd`.
- **Role-Based Access Control (RBAC)**: Support for Organization, Manager, and Team Member roles with fine-grained permissions.
- **Activity Audit Logs**: History timeline tracking who changed task statuses or reassigned tasks.
- **WebSocket Notifications**: Real-time collaborative updates when teammates update tasks.

---

## License
MIT License &bull; Built with dedication for the Full-Stack Engineering Assessment.
