@echo off
echo ========================================
echo VelvetRoutes - Complete Installation
echo ========================================
echo.

echo [STEP 1/3] Installing backend dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install backend dependencies!
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed
echo.

echo [STEP 2/3] Installing frontend dependencies...
cd client
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install frontend dependencies!
    pause
    exit /b 1
)
cd ..
echo [OK] Frontend dependencies installed
echo.

echo [STEP 3/3] Setting up environment...
if not exist .env (
    copy .env.example .env
    echo [OK] .env file created
) else (
    echo [OK] .env file already exists
)
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env file and configure your DATABASE_URL
echo 2. Make sure PostgreSQL is running
echo 3. Run: npm run db:generate
echo 4. Run: npm run db:migrate
echo 5. Run: npm run db:seed
echo 6. Run: start.bat to launch the application
echo.
echo For detailed instructions, see SETUP_GUIDE.md
echo.
pause
