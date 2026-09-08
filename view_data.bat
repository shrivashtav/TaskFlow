@echo off
title TaskFlow - View Saved Database Data
echo ==============================================================================
echo                      TASKFLOW - SAVED DATABASE DATA
echo ==============================================================================
echo.
echo Running queries from database/check_data.sql...
echo.
"C:\xampp\mysql\bin\mysql.exe" -u root --table taskflow_db < "%~dp0database\check_data.sql"
echo.
echo ==============================================================================
echo [SQL Export File Location]
echo %~dp0database\saved_data.sql
echo ==============================================================================
pause
