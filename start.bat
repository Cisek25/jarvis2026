@echo off
title JARVIS — IdoBooking Site Builder
echo.
echo   ========================================
echo        J A R V I S   v1.0
echo        IdoBooking Site Builder
echo   ========================================
echo.
echo   Uruchamiam serwer...
echo.
cd /d "%~dp0"
start http://localhost:3000
node server.js
pause
