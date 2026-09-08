@echo off
echo ===================================================
echo Starting TaskFlow React Frontend Server...
echo ===================================================
cd /d "%~dp0frontend"
npm run dev
pause
