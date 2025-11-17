# ⚡ VelvetRoutes - Quick Start Guide

## 🎯 Goal
Get VelvetRoutes running with beautiful profile page and database in under 10 minutes!

## ✅ Prerequisites Checklist
- [ ] Node.js 18+ installed
- [ ] PostgreSQL 14+ installed and running
- [ ] Git (optional)

## 🚀 Installation (5 minutes)

### Step 1: Install Everything
```bash
install-all.bat
```
This installs all dependencies for both backend and frontend.

### Step 2: Configure Database
1. Open `.env` file
2. Update this line:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/velvetroutes"
   ```
3. Replace `YOUR_PASSWORD` with your PostgreSQL password

### Step 3: Create Database
```bash
# Open PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE velvetroutes;

# Exit
\q
```

### Step 4: Setup Database
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### Step 5: Start Application
```bash
start.bat
```

## 🎉 You're Done!

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **Database GUI:** `npm run db:studio`

## 🧪 Test It

### Login with Test Account
- Email: `john.doe@example.com`
- Password: `password123`

### Visit Profile
- Click your name in navigation
- Or go to: http://localhost:3000/profile

### Explore Features
- ✅ View your statistics
- ✅ Edit personal info
- ✅ Update travel preferences
- ✅ Check security settings

## 🆘 Troubleshooting

### Database Connection Error?
```bash
# Check PostgreSQL is running
pg_ctl status

# Verify DATABASE_URL in .env
```

### Port Already in Use?
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Prisma Client Error?
```bash
npm run db:generate
```

### Migration Failed?
```bash
npm run db:reset
npm run db:migrate
npm run db:seed
```

## 📚 Commands Reference

### Database
```bash
npm run db:generate    # Generate Prisma Client
npm run db:migrate     # Run migrations
npm run db:seed        # Add sample data
npm run db:studio      # Open database GUI
npm run db:reset       # Reset database (⚠️ deletes data)
```

### Application
```bash
start.bat              # Start both servers
npm run server         # Backend only
npm run client         # Frontend only (from client folder)
```

## 🎨 What You Get

### Beautiful Profile Page
- Modern gradient design
- Three organized tabs
- User statistics
- Responsive layout
- Smooth animations

### Complete Database
- 15+ tables
- User profiles
- Bookings & payments
- Notifications
- Reviews & ratings
- Audit logs

### Working Features
- User registration
- Login/logout
- Profile management
- Travel preferences
- Statistics dashboard

## 📖 More Information

- **Detailed Setup:** See `SETUP_GUIDE.md`
- **Complete Guide:** See `COMPLETE_SETUP.md`
- **What's New:** See `WHATS_NEW.md`
- **Architecture:** See `ARCHITECTURE.md`

## 🎯 Success Checklist

You'll know it's working when you see:

- [x] Backend: "✈️ Velvet Routes Server running on port 5000"
- [x] Backend: "💾 Database: PostgreSQL (Prisma)"
- [x] Frontend opens at http://localhost:3000
- [x] Can login with test account
- [x] Profile page shows beautiful design
- [x] Statistics display correctly
- [x] Can edit and save profile

## 💡 Pro Tips

1. **Use Prisma Studio** to visually explore your database:
   ```bash
   npm run db:studio
   ```

2. **Check logs** if something doesn't work - both terminal windows show helpful errors

3. **Customize colors** in `client/src/pages/Profile.css`

4. **Add your own data** through the profile page or Prisma Studio

5. **Backup before reset** - `npm run db:reset` deletes everything!

## 🎊 That's It!

You now have a fully functional travel booking platform with:
- ✨ Beautiful modern UI
- 💾 PostgreSQL database
- 🔐 User authentication
- 📊 Statistics tracking
- 🎨 Responsive design

**Happy coding!** ✈️🏨🚗

---

**Need help?** Check the other documentation files or review the error messages in your terminal.
