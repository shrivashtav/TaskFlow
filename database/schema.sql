-- ==============================================================================
-- TaskFlow Database Schema
-- Mini Task Management System
-- ==============================================================================

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS taskflow_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE taskflow_db;

-- 2. Drop existing tables in reverse dependency order if re-running
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;

-- 3. Users Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(191) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_users_email UNIQUE (email)
) ENGINE=InnoDB;

-- 4. Projects Table
-- Strategy on deletion: ON DELETE CASCADE
-- When a project is deleted, associated tasks are automatically purged to prevent orphan records.
CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_projects_created_by FOREIGN KEY (created_by)
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Tasks Table
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NULL,
  status ENUM('TODO', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'TODO',
  priority ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM',
  due_date DATE NULL,
  assigned_to VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_project_id FOREIGN KEY (project_id)
    REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Indexes for Performance & Search/Filter Optimization
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_projects_name ON projects(name);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_title ON tasks(title);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- 7. Seed Initial Predefined Admin User
-- Password: admin123 (hashed with bcrypt 10 rounds)
INSERT INTO users (id, name, email, password)
VALUES (
  1,
  'Admin User',
  'admin@example.com',
  '$2a$10$kuAmH1MDJ7vtPL.CnRf3a.EjwJ.bAQAMy/pipWu01FG8BtrnDyt4y'
) ON DUPLICATE KEY UPDATE id=id;

-- 8. Seed Sample Projects for Demo
INSERT INTO projects (id, name, description, created_by)
VALUES
(1, 'Website Redesign', 'Complete redesign of company marketing website with responsive UI and modern branding.', 1),
(2, 'Mobile API Integration', 'Build RESTful API endpoints for the forthcoming React Native mobile application.', 1),
(3, 'Cloud Infrastructure Migration', 'Migrate legacy on-prem services to containerized Docker workloads on AWS/GCP.', 1)
ON DUPLICATE KEY UPDATE id=id;

-- 9. Seed Sample Tasks for Demo
INSERT INTO tasks (id, project_id, title, description, status, priority, due_date, assigned_to)
VALUES
(1, 1, 'Design Figma Prototypes', 'Draft high-fidelity mockups for desktop and mobile homepages.', 'COMPLETED', 'HIGH', DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY), 'Sarah Designer'),
(2, 1, 'Develop Navigation Component', 'Implement responsive navbar with drawer toggle for mobile screens.', 'IN_PROGRESS', 'MEDIUM', DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY), 'John Developer'),
(3, 1, 'Conduct Accessibility Audit', 'Test WCAG 2.1 compliance and color contrast across all landing pages.', 'TODO', 'LOW', DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY), 'Alex QA'),
(4, 2, 'Auth & JWT Middleware', 'Implement token verification and role checking for mobile clients.', 'COMPLETED', 'HIGH', DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY), 'Michael Backend'),
(5, 2, 'Push Notification Service', 'Integrate Firebase Cloud Messaging webhook handler.', 'IN_PROGRESS', 'HIGH', DATE_ADD(CURRENT_DATE, INTERVAL 4 DAY), 'Michael Backend'),
(6, 2, 'API Rate Limiting', 'Add Redis-backed token bucket rate limiting on public endpoints.', 'TODO', 'MEDIUM', DATE_ADD(CURRENT_DATE, INTERVAL 8 DAY), 'Admin User'),
(7, 3, 'Containerize Express Server', 'Write multi-stage production Dockerfile and docker-compose configurations.', 'COMPLETED', 'MEDIUM', DATE_ADD(CURRENT_DATE, INTERVAL -2 DAY), 'DevOps Lead'),
(8, 3, 'Terraform Scripting', 'Declare VPC, subnet, and RDS instance infrastructure via code.', 'TODO', 'HIGH', DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY), 'DevOps Lead')
ON DUPLICATE KEY UPDATE id=id;
