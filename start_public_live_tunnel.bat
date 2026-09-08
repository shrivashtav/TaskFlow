@echo off
title TaskFlow Live Public Cloud Tunnel
echo ==============================================================================
echo             TASKFLOW - LIVE PUBLIC INTERNET DEPLOYMENT
echo ==============================================================================
echo.
echo Starting secure Cloudflare Tunnel to expose your local TaskFlow to the world...
echo.
"%~dp0cloudflared.exe" tunnel --url http://localhost:5173
pause
