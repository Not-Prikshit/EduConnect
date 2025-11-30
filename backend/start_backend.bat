@echo off
echo ========================================
echo   Starting Backend Server
echo ========================================
echo.

echo [1/3] Checking Python installation...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)
echo.

echo [2/3] Installing dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo.

echo [3/3] Starting Flask server...
echo.
echo Backend server will start on: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
python app.py
