@echo off
echo ===================================================
echo Starting TaskFlow Backend REST API Server...
echo ===================================================
cd /d "%~dp0backend"
node server.js
pause
