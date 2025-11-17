# 📁 VelvetRoutes - Project Structure

## Directory Overview

```
velvetroutes/
│
├── 📱 client/                          # React Frontend Application
│   ├── public/                         # Static files
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/                 # Reusable components
│   │   ├── context/                    # React context providers
│   │   ├── pages/                      # Page components
│   │   │   ├── Profile.js             # ⭐ Beautiful profile page
│   │   │   ├── Profile.css            # Profile styling
│   │   │   ├── Home.js
│   │   │   ├── Hotels.js
│   │   │   ├── Flights.js
│   │   │   ├── Cars.js
│   │   │   ├── Dashboard.js
│   │   │   └── ...
│   │   ├── App.js                      # Main app component
│   │   ├── index.js                    # Entry point
│   │   └── index.css                   # Global styles
│   └── package.json                    # Frontend dependencies
│
├── 🖥️ server/                          # Express Backend Application
│   ├── routes/                         # API route handlers
│   │   ├── auth-prisma.js             # ⭐ Prisma-integrated auth
│   │   ├── auth.js                    # Original auth (fallback)
│   │   ├── bookings.js                # Booking routes
│   │   ├── hotels.js                  # Hotel routes
│   │   ├── flights.js                 # Flight routes
│   │   ├── cars.js                    # Car rental routes
│   │   ├── trains.js                  # Train routes
│   │   ├── buses.js                   # Bus routes
│   │   ├── trips.js                   # Trip routes
│   │   ├── payments.js                # Payment routes
│   │   └── notifications.js           # Notification routes
│   ├── services/                       # Business logic services
│   │   ├── hotelService.js
│   │   ├── flightService.js
│   │   ├── carRentalService.js
│   │   ├── trainService.js
│   │   ├── busService.js
│   │   ├── emailService.js
│   │   └── notificationService.js
│   ├── middleware/                     # Express middleware
│   │   └── auth.js                    # JWT authentication
│   └── index.js                        # ⭐ Main server file
│
├── 💾 prisma/                          # Database Configuration
│   ├── schema.prisma                   # ⭐ Database schema (20+ tables)
│   ├── seed.ts                         # ⭐ Sample data seeding
│   └── migrations/                     # Database migrations
│       ├── 001_initial_schema.sql
│       └── ...
│
├── 📚 Documentation/                   # Project Documentation
│   ├── README.md                       # ⭐ Main documentation
│   ├── QUICK_START.md                  # 10-minute setup guide
│   ├── SETUP_GUIDE.md                  # Detailed setup instructions
│   ├── ARCHITECTURE.md                 # System architecture
│   ├── WHATS_NEW.md                    # Changelog
│   ├── VERIFICATION_CHECKLIST.md       # Testing checklist
│   ├── GET_API_KEYS_NOW.md            # API key guide
│   ├── GIT_PUSH_GUIDE.md              # Git workflow
│   └── PROJECT_STRUCTURE.md            # This file
│
├── 🛠️ Scripts/                         # Automation Scripts
│   ├── install-all.bat                 # ⭐ Install all dependencies
│   ├── setup.bat                       # Setup wizard
│   └── start.bat                       # Launch application
│
├── ⚙️ Configuration Files/             # Project Configuration
│   ├── .env                            # Environment variables (not in git)
│   ├── .env.example                    # Environment template
│   ├── .gitignore                      # Git ignore rules
│   ├── package.json                    # Backend dependencies
│   ├── package-lock.json               # Dependency lock file
│   └── tsconfig.json                   # TypeScript configuration
│
└── 📄 Root Files/
    └── (configuration and documentation files)
```

## Key Files Explained

### Frontend (client/)

#### Core Files
- **src/App.js** - Main React application component with routing
- **src/index.js** - Application entry point
- **src/index.css** - Global styles and CSS variables

#### Pages
- **Profile.js** ⭐ - Beautiful profile page with tabs and statistics
- **Profile.css** - Modern styling with gradients and animations
- **Home.js** - Landing page
- **Hotels.js** - Hotel search and listing
- **Flights.js** - Flight search and booking
- **Cars.js** - Car rental search
- **Dashboard.js** - User dashboard

### Backend (server/)

#### Main Server
- **index.js** ⭐ - Express server setup, routes, middleware

#### Routes
- **auth-prisma.js** ⭐ - Prisma-integrated authentication
  - POST /api/auth/register
  - POST /api/auth/login
  - GET /api/auth/profile
  - PUT /api/auth/profile
  - GET /api/auth/stats

- **bookings.js** - Booking management
- **hotels.js** - Hotel operations
- **flights.js** - Flight operations
- **cars.js** - Car rental operations
- **payments.js** - Payment processing

#### Services
- **hotelService.js** - Hotel business logic
- **flightService.js** - Flight business logic
- **emailService.js** - Email notifications
- **notificationService.js** - Multi-channel notifications

### Database (prisma/)

#### Schema
- **schema.prisma** ⭐ - Complete database schema
  - 20+ tables
  - Relationships defined
  - Indexes for performance
  - Enums for type safety

#### Migrations
- **migrations/** - Version-controlled schema changes
- **seed.ts** ⭐ - Sample data for development

### Documentation

#### Essential Guides
- **README.md** ⭐ - Main project documentation
- **QUICK_START.md** - Fast setup (10 minutes)
- **SETUP_GUIDE.md** - Detailed setup instructions
- **ARCHITECTURE.md** - System design and architecture

#### Reference
- **WHATS_NEW.md** - Changelog and new features
- **VERIFICATION_CHECKLIST.md** - Testing checklist
- **GET_API_KEYS_NOW.md** - External API setup
- **GIT_PUSH_GUIDE.md** - Git workflow guide

### Scripts

- **install-all.bat** ⭐ - One-click installation
- **setup.bat** - Setup wizard with Prisma
- **start.bat** - Launch both backend and frontend

### Configuration

- **.env** - Environment variables (create from .env.example)
- **.env.example** - Template with all required variables
- **package.json** - Dependencies and npm scripts
- **tsconfig.json** - TypeScript configuration

## File Count Summary

```
Frontend:       50+ files (React components, pages, styles)
Backend:        20+ files (routes, services, middleware)
Database:       3 files (schema, seed, migrations)
Documentation:  8 files (guides, references)
Scripts:        3 files (automation)
Configuration:  5 files (env, packages, typescript)
─────────────────────────────────────────────────────
Total:          ~90 files
```

## Important Paths

### Development
```
Frontend:  client/src/
Backend:   server/
Database:  prisma/
```

### Configuration
```
Environment:  .env
Backend Deps: package.json
Frontend Deps: client/package.json
Database:     prisma/schema.prisma
```

### Documentation
```
Quick Start:  QUICK_START.md
Setup Guide:  SETUP_GUIDE.md
Architecture: ARCHITECTURE.md
```

### Scripts
```
Install:  install-all.bat
Setup:    setup.bat
Start:    start.bat
```

## Database Tables (20+)

### User Management
- users
- profiles
- sessions

### Providers
- providers
- provider_api_keys

### Inventory
- inventory_items
- hotels
- flights
- cars
- trains
- buses

### Bookings
- bookings
- booking_items

### Payments
- payments
- invoices
- refunds

### Engagement
- reviews
- notifications
- audit_logs
- searches

## NPM Scripts

### Database
```bash
npm run db:generate    # Generate Prisma Client
npm run db:migrate     # Run migrations
npm run db:seed        # Seed sample data
npm run db:studio      # Open Prisma Studio
npm run db:reset       # Reset database
```

### Application
```bash
npm run server         # Start backend
npm run client         # Start frontend
```

## Environment Variables

Required in `.env`:
```
DATABASE_URL           # PostgreSQL connection
PORT                   # Backend port (5000)
JWT_SECRET            # JWT signing key
```

Optional:
```
STRIPE_SECRET_KEY     # Payment processing
TWILIO_ACCOUNT_SID    # SMS/WhatsApp
SENDGRID_API_KEY      # Email delivery
RAPIDAPI_KEY          # Travel data
```

## Git Workflow

### Ignored Files (.gitignore)
- node_modules/
- .env
- dist/
- build/
- *.log
- .vscode/
- .DS_Store

### Tracked Files
- Source code (client/, server/)
- Database schema (prisma/)
- Documentation (*.md)
- Configuration (package.json, tsconfig.json)
- Scripts (*.bat)

## Access Points

### Development
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Database GUI: http://localhost:5555 (Prisma Studio)

### API Endpoints
- Auth: /api/auth/*
- Bookings: /api/bookings/*
- Hotels: /api/hotels/*
- Flights: /api/flights/*
- Cars: /api/cars/*

## Quick Navigation

### To modify profile page:
```
client/src/pages/Profile.js
client/src/pages/Profile.css
```

### To modify API routes:
```
server/routes/auth-prisma.js
server/routes/bookings.js
```

### To modify database:
```
prisma/schema.prisma
(then run: npm run db:migrate)
```

### To add sample data:
```
prisma/seed.ts
(then run: npm run db:seed)
```

---

**Last Updated:** November 2024
**Version:** 3.0.0

For more information, see **README.md**
