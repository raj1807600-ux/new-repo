@echo off
title Oriental Placement System Launcher
echo ========================================================
echo Launching Oriental Placement Intelligence Full-Stack App...
echo ========================================================
cd /d "%~dp0"
start "Backend Flask Server" run_backend.bat
timeout /t 2 >nul
start "Frontend React App" run_frontend.bat
echo Both servers started!
echo Frontend: http://localhost:5173/
echo Backend:  http://127.0.0.1:5000/
pause
