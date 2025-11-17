# 🐬 MySQL Setup Guide for VelvetRoutes

## ✅ What Changed

The database has been converted from PostgreSQL to MySQL!

### Key Changes:
- ✅ Schema updated for MySQL compatibility
- ✅ UUID types changed to VARCHAR(36)
- ✅ Timestamp types changed to DateTime
- ✅ JSON fields simplified (no @db.JsonB)
- ✅ All PostgreSQL-specific types removed

---

## 📋 Prerequisites

### Install MySQL

**Windows:**
1. Download MySQL Installer from: https://dev.mysql.com/downloads/installer/
2. Run the installer
3. Choose "Developer Default" setup
4. Set root password during installation
5. Complete the installation

**Verify Installation:**
```bash
mysql --version
```

---

## 🚀 Quick Setup (4 Steps)

### Step 1: Install Dependencies

```bash
install-all.bat
```

### Step 2: Create MySQL Database

Open MySQL Command Line or MySQL Workbench:

```sql
-- Login to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE velvetroutes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verify
SHOW DATABASES;

-- Exit
EXIT;
```

### Step 3: Configure Environment

Edit `.env` file:

```env
# MySQL Database Connection
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/velvetroutes"

# JWT Secret
JWT_SECRET=your_secret_key_here

# Server Port
PORT=5000
```

**Important:** Replace `YOUR_PASSWORD` with your MySQL root password!

### Step 4: Setup Database

```bash
# Generate Prisma Client
npm run db:generate

# Create tables
npm run db:migrate

# Add sample data
npm run db:seed
```

### Step 5: Start Application

```bash
start.bat
```

---

## 🔧 MySQL Connection Strings

### Local Development

```env
# Basic connection
DATABASE_URL="mysql://root:password@localhost:3306/velvetroutes"

# With specific user
DATABASE_URL="mysql://username:password@localhost:3306/velvetroutes"

# With connection pooling
DATABASE_URL="mysql://root:password@localhost:3306/velvetroutes?connection_limit=5"

# With SSL
DATABASE_URL="mysql://root:password@localhost:3306/velvetroutes?sslmode=require"
```

### Production (Example)

```env
# AWS RDS
DATABASE_URL="mysql://admin:password@mydb.123456.us-east-1.rds.amazonaws.com:3306/velvetroutes"

# Google Cloud SQL
DATABASE_URL="mysql://root:password@/velvetroutes?host=/cloudsql/project:region:instance"

# Azure Database
DATABASE_URL="mysql://admin@server:password@server.mysql.database.azure.com:3306/velvetroutes?ssl=true"
```

---

## 📊 Database Schema

### Tables Created (20+)

```
MySQL Database: velvetroutes
├── users                    # User accounts
├── profiles                 # User profiles
├── sessions                 # Login sessions
├── providers                # API providers
├── provider_api_keys        # Encrypted keys
├── inventory_items          # Travel products
├── hotels                   # Hotel details
├── flights                  # Flight info
├── cars                     # Car rentals
├── trains                   # Train bookings
├── buses                    # Bus services
├── bookings                 # Reservations
├── booking_items            # Booking details
├── payments                 # Transactions
├── invoices                 # Invoices
├── refunds                  # Refunds
├── reviews                  # User reviews
├── notifications            # Messages
├── audit_logs               # Activity logs
└── searches                 # Search cache
```

---

## 🛠️ MySQL Commands

### Database Management

```sql
-- Show all databases
SHOW DATABASES;

-- Use velvetroutes database
USE velvetroutes;

-- Show all tables
SHOW TABLES;

-- Describe table structure
DESCRIBE users;

-- Show table data
SELECT * FROM users;

-- Count records
SELECT COUNT(*) FROM users;

-- Drop database (⚠️ deletes everything)
DROP DATABASE velvetroutes;
```

### User Management

```sql
-- Create new MySQL user
CREATE USER 'velvetroutes'@'localhost' IDENTIFIED BY 'password';

-- Grant privileges
GRANT ALL PRIVILEGES ON velvetroutes.* TO 'velvetroutes'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Show users
SELECT User, Host FROM mysql.user;
```

---

## 🔍 Verify Setup

### Check Database Connection

```bash
# Test MySQL connection
mysql -u root -p -e "USE velvetroutes; SHOW TABLES;"
```

### Check Prisma Connection

```bash
# Open Prisma Studio
npm run db:studio
```

This opens: http://localhost:5555

You should see all 20+ tables with data!

---

## 🧪 Test Data

After running `npm run db:seed`, you'll have:

### Users
```sql
SELECT * FROM users;
```
- admin@velvetroutes.com (Admin)
- john.doe@example.com (User)

### Hotels
```sql
SELECT * FROM hotels;
```
- Grand Hotel Paris
- Tokyo Bay Hotel

### Flights
```sql
SELECT * FROM flights;
```
- AA100 (New York to London)

### Bookings
```sql
SELECT * FROM bookings;
```
- 1 sample booking for John Doe

---

## 🐛 Troubleshooting

### Problem: Can't connect to MySQL

**Solution:**
```bash
# Check if MySQL is running
# Windows: Services -> MySQL80

# Or restart MySQL
net stop MySQL80
net start MySQL80
```

### Problem: Access denied for user

**Solution:**
```sql
-- Reset root password
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

### Problem: Database doesn't exist

**Solution:**
```sql
-- Create it
CREATE DATABASE velvetroutes;
```

### Problem: Prisma Client error

**Solution:**
```bash
# Regenerate Prisma Client
npm run db:generate
```

### Problem: Migration failed

**Solution:**
```bash
# Reset and try again
npm run db:reset
npm run db:migrate
npm run db:seed
```

---

## 📱 Using MySQL Workbench

### Visual Database Management

1. **Open MySQL Workbench**
2. **Connect to localhost**
   - Hostname: localhost
   - Port: 3306
   - Username: root
   - Password: your_password

3. **Select velvetroutes database**
4. **Browse tables visually**
5. **Run queries**
6. **Export/Import data**

---

## 🔄 Migrating from PostgreSQL

If you had PostgreSQL data:

### Export from PostgreSQL
```bash
pg_dump -U postgres velvetroutes > backup.sql
```

### Convert and Import to MySQL
1. Convert SQL syntax (PostgreSQL → MySQL)
2. Import to MySQL
3. Or use Prisma to recreate data

---

## 🎯 MySQL vs PostgreSQL Differences

### What Changed:

| Feature | PostgreSQL | MySQL |
|---------|-----------|-------|
| UUID | `@db.Uuid` | `@db.VarChar(36)` |
| Timestamp | `@db.Timestamptz(6)` | `DateTime` |
| JSON | `@db.JsonB` | `Json` |
| Float | `@db.Real` | `Float` |
| Port | 5432 | 3306 |

### What Stayed the Same:

- ✅ All features work identically
- ✅ Same API endpoints
- ✅ Same frontend code
- ✅ Same business logic
- ✅ Same Prisma queries

---

## 📊 Performance Tips

### Optimize MySQL

```sql
-- Check table sizes
SELECT 
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS "Size (MB)"
FROM information_schema.TABLES
WHERE table_schema = "velvetroutes"
ORDER BY (data_length + index_length) DESC;

-- Optimize tables
OPTIMIZE TABLE users, bookings, payments;

-- Analyze tables
ANALYZE TABLE users, bookings, payments;
```

### Connection Pooling

In `.env`:
```env
DATABASE_URL="mysql://root:password@localhost:3306/velvetroutes?connection_limit=10&pool_timeout=20"
```

---

## 🔐 Security

### Secure MySQL

```sql
-- Remove anonymous users
DELETE FROM mysql.user WHERE User='';

-- Remove remote root access
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');

-- Flush privileges
FLUSH PRIVILEGES;
```

### Use Strong Passwords

```sql
-- Set strong password
ALTER USER 'root'@'localhost' IDENTIFIED BY 'StrongP@ssw0rd!123';
```

---

## 📚 Additional Resources

- **MySQL Documentation:** https://dev.mysql.com/doc/
- **Prisma MySQL Guide:** https://www.prisma.io/docs/concepts/database-connectors/mysql
- **MySQL Workbench:** https://www.mysql.com/products/workbench/

---

## ✅ Success Checklist

Your MySQL setup is successful if:

- [ ] MySQL is installed and running
- [ ] Database `velvetroutes` created
- [ ] `.env` configured with correct connection string
- [ ] `npm run db:generate` completed
- [ ] `npm run db:migrate` completed
- [ ] `npm run db:seed` completed
- [ ] Prisma Studio shows all tables
- [ ] Backend starts without errors
- [ ] Frontend connects successfully
- [ ] Can login with test account
- [ ] Profile page works

---

## 🎉 You're Ready!

**Your VelvetRoutes platform is now running on MySQL!**

Everything works exactly the same as before, just with MySQL instead of PostgreSQL.

### Quick Start:
```bash
# 1. Create database
mysql -u root -p -e "CREATE DATABASE velvetroutes;"

# 2. Setup
npm run db:generate
npm run db:migrate
npm run db:seed

# 3. Start
start.bat
```

### Test:
- Login: john.doe@example.com / password123
- Profile: http://localhost:3000/profile

**Enjoy your MySQL-powered VelvetRoutes!** 🐬✈️🏨🚗

---

*For more help, see QUICK_START.md or SETUP_GUIDE.md*
