@echo off
setlocal

echo ===================================================
echo   Stopping CampusConnect Local Services
echo ===================================================
echo.

echo Stopping Backend on port 8080...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080" ^| findstr "LISTENING"') do (
    echo Terminating PID %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo Stopping Frontend on port 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo Terminating PID %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo All CampusConnect services stopped successfully.
