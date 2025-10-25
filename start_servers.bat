@echo off
echo Starting Crypto Volatility Watcher Servers...
echo.

cd /d "C:\Users\arigi\Crypto Volatility Watcher\Crypto-Volatility-ML-Engineering"

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Starting FastAPI backend server on port 8000...
start "FastAPI Backend" cmd /k "python -m uvicorn api.main:app --host 127.0.0.1 --port 8000"

echo.
echo Starting frontend server on port 3000...
start "Frontend Server" cmd /k "python -m http.server 3000"

echo.
echo Both servers are starting...
echo.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000
echo.
echo Press any key to exit...
pause > nul
