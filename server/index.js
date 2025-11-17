const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Check if Prisma routes exist, otherwise use regular routes
const authPrismaPath = path.join(__dirname, 'routes', 'auth-prisma.js');
const usePrisma = fs.existsSync(authPrismaPath);

const authRoutes = usePrisma ? require('./routes/auth-prisma') : require('./routes/auth');
const tripRoutes = require('./routes/trips');
const hotelRoutes = require('./routes/hotels');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');
const carRoutes = require('./routes/cars');
const flightRoutes = require('./routes/flights');
const trainRoutes = require('./routes/trains');
const busRoutes = require('./routes/buses');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/buses', busRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Velvet Routes API',
    version: '3.0',
    database: usePrisma ? 'PostgreSQL (Prisma)' : 'In-Memory',
    endpoints: {
      auth: '/api/auth',
      trips: '/api/trips',
      hotels: '/api/hotels',
      bookings: '/api/bookings',
      payments: '/api/payments',
      cars: '/api/cars',
      flights: '/api/flights',
      trains: '/api/trains',
      buses: '/api/buses'
    }
  });
});

app.listen(PORT, () => {
  console.log(`✈️  Velvet Routes Server running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}`);
  console.log(`💾 Database: ${usePrisma ? 'PostgreSQL (Prisma)' : 'In-Memory'}`);
});
