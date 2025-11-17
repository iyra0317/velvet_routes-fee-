# VelvetRoutes Complete Setup Guide

## 🚀 Quick Start

This guide will help you set up the complete VelvetRoutes travel booking platform with a beautiful profile page and PostgreSQL database integration.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ installed and running
- Git (optional)

## Step 1: Install Dependencies

### Backend Dependencies
```bash
# Install root dependencies
npm install

# Install Prisma dependencies
npm install @prisma/client
npm install -D prisma tsx typescript @types/node
```

### Frontend Dependencies
```bash
# Navigate to client folder
cd client

# Install dependencies
npm install

# Install React Icons (for beautiful profile page)
npm install react-icons

# Go back to root
cd ..
```

## Step 2: Database Setup

### Create PostgreSQL Database

```bash
# Using psql command line
psql -U postgres

# In psql:
CREATE DATABASE velvetroutes;
\q
```

### Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/velvetroutes?schema=public"

# Server
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Stripe (Payment Processing)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Twilio (SMS/WhatsApp)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Email Service
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@velvetroutes.com

# RapidAPI (for travel providers)
RAPIDAPI_KEY=your_rapidapi_key
```

**Important:** Replace `your_password` with your actual PostgreSQL password!

## Step 3: Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations to create tables
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

You should see output like:
```
✅ Created users and profiles
✅ Created providers
✅ Created inventory items
✅ Created sample booking
✅ Created payment and invoice
✅ Created sample review
✅ Created notifications

🎉 Database seeded successfully!

🔐 Test Credentials:
   Admin: admin@velvetroutes.com / admin123
   User:  john.doe@example.com / password123
```

## Step 4: Start the Application

### Option 1: Using the start script (Windows)

```bash
# This will start both backend and frontend
start.bat
```

### Option 2: Manual start

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

## Step 5: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Prisma Studio (Database GUI):** Run `npm run db:studio`

## 🎨 Beautiful Profile Page Features

The new profile page includes:

- **Modern gradient design** with glassmorphism effects
- **Three tabs:**
  - Personal Info: Name, email, phone, address, date of birth
  - Travel Preferences: Travel class, dietary restrictions, accessibility
  - Security: Password change, 2FA, session management
- **User statistics:** Total bookings, total spent, countries visited
- **Responsive design** for mobile and desktop
- **Smooth animations** and transitions
- **Real-time form validation**

## 📊 Database Schema

The application uses a comprehensive PostgreSQL schema with:

- **Users & Profiles:** User accounts with detailed travel preferences
- **Inventory Items:** Hotels, flights, cars, trains, buses
- **Bookings:** Complete booking management
- **Payments:** Stripe integration
- **Invoices:** PDF invoice generation
- **Notifications:** Multi-channel (Email, SMS, WhatsApp, Push)
- **Reviews:** User ratings and feedback
- **Audit Logs:** Complete activity tracking

## 🔧 Troubleshooting

### Database Connection Issues

If you get a database connection error:

1. Make sure PostgreSQL is running:
   ```bash
   # Windows
   pg_ctl status
   
   # Or check services
   services.msc
   ```

2. Verify your DATABASE_URL in `.env` is correct

3. Test connection:
   ```bash
   psql -U postgres -d velvetroutes
   ```

### Prisma Client Not Generated

If you get "Cannot find module '@prisma/client'":

```bash
npm run db:generate
```

### Port Already in Use

If port 5000 or 3000 is already in use:

1. Change PORT in `.env` for backend
2. Change port in `client/package.json` for frontend

### Migration Errors

If migrations fail:

```bash
# Reset database (WARNING: deletes all data)
npm run db:reset

# Or manually drop and recreate
psql -U postgres
DROP DATABASE velvetroutes;
CREATE DATABASE velvetroutes;
\q

# Then run migrations again
npm run db:migrate
npm run db:seed
```

## 🧪 Testing the Profile Page

1. **Register a new account:**
   - Go to http://localhost:3000/register
   - Create an account

2. **Login:**
   - Use your credentials or test account:
     - Email: john.doe@example.com
     - Password: password123

3. **Access Profile:**
   - Click on your name in the navigation
   - Or go to http://localhost:3000/profile

4. **Test Features:**
   - Edit personal information
   - Update travel preferences
   - View your statistics

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `GET /api/auth/stats` - Get user statistics
- `POST /api/auth/change-password` - Change password

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `GET /api/bookings/user/:userId` - Get user bookings
- `POST /api/bookings/:id/cancel` - Cancel booking
- `POST /api/bookings/search` - Search inventory

## 🎯 Next Steps

1. **Configure External APIs:**
   - Get RapidAPI key for hotel/flight data
   - Set up Stripe for payments
   - Configure Twilio for notifications

2. **Customize:**
   - Update colors in CSS files
   - Add your logo
   - Modify email templates

3. **Deploy:**
   - Set up production database
   - Configure environment variables
   - Deploy to hosting service

## 📚 Additional Resources

- **Prisma Documentation:** https://www.prisma.io/docs
- **React Documentation:** https://react.dev
- **Express Documentation:** https://expressjs.com
- **PostgreSQL Documentation:** https://www.postgresql.org/docs

## 🆘 Need Help?

If you encounter any issues:

1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure PostgreSQL is running
4. Check that all dependencies are installed

## 🎉 Success!

If everything is working, you should see:
- ✅ Backend running on port 5000
- ✅ Frontend running on port 3000
- ✅ Database connected
- ✅ Beautiful profile page accessible
- ✅ User can register, login, and update profile

Enjoy your VelvetRoutes travel booking platform! ✈️🏨🚗
