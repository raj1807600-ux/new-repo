@echo off
title Oriental Placement Backend Server (Port 5000)
echo ========================================================
echo Starting Oriental Placement Intelligence Flask Backend...
echo ========================================================
cd /d "%~dp0"
python backend/run.py
pause
