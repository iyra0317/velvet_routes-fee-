@echo off
echo ========================================
echo VelvetRoutes - Travel Booking Platform
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js version:
node --version
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
)

echo [OK] npm version:
npm --version
echo.

REM Install dependencies
echo [STEP 1/5] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies!
    pause
    exit /b 1
)
echo [OK] Dependencies installed
echo.

REM Check if .env exists
if not exist .env (
    echo [STEP 2/5] Creating .env file...
    copy .env.example .env
    echo [OK] .env file created
    echo.
    echo [ACTION REQUIRED] Edit .env file and set your DATABASE_URL
    echo Example: DATABASE_URL="postgresql://postgres:password@localhost:5432/velvetroutes"
    echo.
) else (
    echo [STEP 2/5] .env file already exists
    echo.
)

REM Generate Prisma Client
echo [STEP 3/5] Generating Prisma Client...
call npm run db:generate
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to generate Prisma Client!
    pause
    exit /b 1
)
echo [OK] Prisma Client generated
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Ensure PostgreSQL is running
echo 2. Configure DATABASE_URL in .env file
echo 3. Run migrations: npm run db:migrate
echo 4. Seed database: npm run db:seed
echo 5. Start server: npm run dev
echo.
echo Quick start (if database is ready):
echo   npm run db:migrate ^&^& npm run db:seed ^&^& npm run dev
echo.
pause
