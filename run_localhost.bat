@echo off
title TaskFlow Runner
echo ==============================================================================
echo                      TASKFLOW - FULL-STACK RUNNER
echo ==============================================================================
echo.
echo [1/3] Starting Backend API Server (Node.js + Express + MySQL) on port 5000...
start "TaskFlow Backend API (Port 5000)" cmd /k "cd /d "%~dp0backend" && npm start"

echo [2/3] Waiting for backend to initialize...
ping -n 3 127.0.0.1 >nul

echo [3/3] Starting React Frontend (Vite) on port 5173...
start "TaskFlow React Frontend (Port 5173)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ==============================================================================
echo Both servers are actively running!
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo ==============================================================================
ping -n 3 127.0.0.1 >nul
start http://localhost:5173
