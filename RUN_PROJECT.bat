@echo off
title Evolve Meter - Professional Demo Launcher
echo ==========================================
echo    EVOLVE METER - STARTING DEMO
echo ==========================================
echo.
echo [1/2] Checking dependencies...
if not exist node_modules (
  echo ❌ Error: node_modules folder is missing. 
  echo Running 'npm install' for you...
  call npm install
)

echo [2/2] Launching System...
node scripts/start-tunnel.js
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo ❌ CRITICAL ERROR: The system failed to start.
  echo Please check if Node.js is installed correctly.
)
pause
