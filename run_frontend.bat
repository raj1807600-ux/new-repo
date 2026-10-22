@echo off
title Oriental Placement Frontend App (Port 5173)
echo ========================================================
echo Starting Oriental Placement Intelligence React Frontend...
echo ========================================================
cd /d "%~dp0"
set "PATH=%~dp0tools\nodejs;%PATH%"
cd frontend
call npm run dev -- --host
pause
