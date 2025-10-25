@echo off
echo Starting Crypto Volatility Watcher Website...
echo.

cd /d "C:\Users\arigi\Crypto Volatility Watcher\Crypto-Volatility-ML-Engineering"

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Starting Mock API server on port 8000...
start "Mock API Server" cmd /k "python mock_api.py"

echo.
echo Starting frontend server on port 3000...
start "Frontend Server" cmd /k "python -m http.server 3000"

echo.
echo Both servers are starting...
echo.
echo Frontend: http://localhost:3000
echo Mock API: http://localhost:8000
echo.
echo The website should now work with mock data!
echo.
echo Press any key to exit...
pause > nul
