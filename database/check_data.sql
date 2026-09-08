-- ==============================================================================
-- TaskFlow - Inspect & Verify Saved Data
-- Location: database/check_data.sql
-- ==============================================================================

USE taskflow_db;

-- ------------------------------------------------------------------------------
-- 1. View All Registered Users
-- ------------------------------------------------------------------------------
SELECT 
    id, 
    name, 
    email, 
    password AS bcrypt_hashed_password, 
    created_at 
FROM users;

-- ------------------------------------------------------------------------------
-- 2. View All Projects
-- ------------------------------------------------------------------------------
SELECT 
    id, 
    name AS project_name, 
    description, 
    created_by AS owner_user_id, 
    created_at, 
    updated_at 
FROM projects;

-- ------------------------------------------------------------------------------
-- 3. View All Tasks
-- ------------------------------------------------------------------------------
SELECT 
    id, 
    project_id, 
    title AS task_title, 
    status, 
    priority, 
    due_date, 
    assigned_to, 
    created_at 
FROM tasks;

-- ------------------------------------------------------------------------------
-- 4. View Tasks Joined with Project Details
-- ------------------------------------------------------------------------------
SELECT 
    p.id AS project_id,
    p.name AS project_name,
    t.id AS task_id,
    t.title AS task_title,
    t.status,
    t.priority,
    t.due_date,
    t.assigned_to
FROM tasks t
JOIN projects p ON t.project_id = p.id
ORDER BY p.id ASC, t.id ASC;

-- ------------------------------------------------------------------------------
-- 5. Aggregate Dashboard Summary Statistics
-- ------------------------------------------------------------------------------
SELECT 
    (SELECT COUNT(*) FROM projects) AS total_projects,
    (SELECT COUNT(*) FROM tasks) AS total_tasks,
    (SELECT COUNT(*) FROM tasks WHERE status != 'COMPLETED') AS pending_tasks,
    (SELECT COUNT(*) FROM tasks WHERE status = 'COMPLETED') AS completed_tasks;
