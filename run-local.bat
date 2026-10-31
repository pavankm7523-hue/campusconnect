@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo   CampusConnect - Campus Recruitment Portal
echo   Starting Local Development Environment
echo ===================================================
echo.

rem Detect Java executable
set "JAVA_CMD="
if exist "C:\Program Files\Android\Android Studio\jbr\bin\java.exe" (
    set "JAVA_CMD=C:\Program Files\Android\Android Studio\jbr\bin\java.exe"
) else if defined JAVA_HOME (
    set "JAVA_CMD=%JAVA_HOME%\bin\java.exe"
) else (
    set "JAVA_CMD=java"
)

echo [1/3] Checking Java environment...
"%JAVA_CMD%" -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java not found. Please ensure Java 17+ is installed.
    pause
    exit /b 1
)
echo       Using Java: "%JAVA_CMD%"

echo [2/3] Starting Spring Boot Backend on port 8080...
start "CampusConnect Backend (Port 8080)" cmd /k "cd /d "%~dp0backend" && "%JAVA_CMD%" -jar target\campusconnect-backend-1.0.0.jar"

echo [3/3] Starting React Vite Frontend on port 5173...
start "CampusConnect Frontend (Port 5173)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ===================================================
echo   CampusConnect is starting!
echo.
echo   Frontend:  http://localhost:5173
echo   Backend:   http://localhost:8080
echo   API Docs:  http://localhost:8080/swagger-ui.html
echo.
echo   Demo Credentials (Password for all: Admin@123):
echo   - Student:    student1@college.edu
echo   - Recruiter:  recruiter1@tcs.com
echo   - Admin:      admin@campusconnect.edu
echo ===================================================
echo.
timeout /t 5 >nul
start http://localhost:5173
