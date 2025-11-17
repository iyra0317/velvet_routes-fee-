# 🌍 VelvetRoutes - Complete Travel Options Guide

## ✈️ All Travel Modes Available

Your VelvetRoutes platform now supports **5 complete travel modes**:

1. 🏨 **Hotels** - Accommodations worldwide
2. ✈️ **Flights** - Domestic and international flights
3. 🚗 **Cars** - Rental cars from major suppliers
4. 🚂 **Trains** - Rail travel across continents
5. 🚌 **Buses** - Budget-friendly bus travel

---

## 📊 Sample Data Included

After running `npm run db:seed`, you'll have:

### 🏨 Hotels (3 properties)
- **Grand Hotel Paris** - 5-star luxury in Paris, France ($150/night)
- **Tokyo Bay Hotel** - 4-star business hotel in Tokyo, Japan ($120/night)
- **Manhattan Plaza Hotel** - 5-star premium in New York, USA ($250/night)

### ✈️ Flights (5 routes)
- **AA100** - New York (JFK) → London (LHR) - $450
- **BA005** - London (LHR) → Tokyo (NRT) - $650
- **DL264** - Paris (CDG) → New York (JFK) - $350
- **UA890** - San Francisco (SFO) → Tokyo (NRT) - $550
- **EM202** - Dubai (DXB) → New York (JFK) - $750

### 🚗 Cars (4 vehicles)
- **Toyota Corolla** - Economy, Hertz, Paris - $55/day
- **BMW X3** - SUV, Avis, New York - $85/day
- **Mercedes E-Class** - Luxury, Enterprise, Los Angeles - $120/day
- **Ford Focus** - Compact, Budget, London - $45/day

### 🚂 Trains (4 routes)
- **Eurostar ES9012** - London → Paris - $150
- **SNCF TGV6651** - Paris → Lyon - $120
- **ICE507** - Berlin → Munich - $180
- **Shinkansen NOZOMI1** - Tokyo → Osaka - $220

### 🚌 Buses (4 routes)
- **FlixBus FB1234** - New York → Boston - $35
- **Greyhound GH5678** - Los Angeles → San Francisco - $45
- **Megabus MB9012** - Chicago → Detroit - $25
- **National Express NE3456** - London → Edinburgh - $55

---

## 🎯 How to Access Each Travel Mode

### Frontend URLs

```
Hotels:     http://localhost:3000/hotels
Flights:    http://localhost:3000/flights
Cars:       http://localhost:3000/cars
Trains:     http://localhost:3000/trains
Buses:      http://localhost:3000/buses
```

### API Endpoints

```
GET /api/hotels      - List all hotels
GET /api/flights     - List all flights
GET /api/cars        - List all cars
GET /api/trains      - List all trains
GET /api/buses       - List all buses
```

---

## 🔍 Search & Filter

### Search by Location

**Hotels:**
```javascript
// Search hotels in Paris
GET /api/hotels?location=Paris

// Search hotels in Tokyo
GET /api/hotels?location=Tokyo
```

**Flights:**
```javascript
// Search flights from New York
GET /api/flights?origin=New York

// Search flights to London
GET /api/flights?destination=London
```

**Cars:**
```javascript
// Search cars in Paris
GET /api/cars?location=Paris
```

**Trains:**
```javascript
// Search trains from London
GET /api/trains?origin=London
```

**Buses:**
```javascript
// Search buses from New York
GET /api/buses?origin=New York
```

---

## 💾 Database Structure

### Hotels Table
```sql
SELECT * FROM hotels;
```
Fields: name, location, address, rating, stars, amenities, checkInTime, checkOutTime

### Flights Table
```sql
SELECT * FROM flights;
```
Fields: airline, flightNumber, origin, destination, departAt, arriveAt, duration, stops, aircraftType, cabinClass

### Cars Table
```sql
SELECT * FROM cars;
```
Fields: name, category, supplier, location, seats, doors, transmission, fuelType, features

### Trains Table
```sql
SELECT * FROM trains;
```
Fields: operator, trainNumber, origin, destination, departAt, arriveAt, duration, trainClass, amenities

### Buses Table
```sql
SELECT * FROM buses;
```
Fields: operator, busNumber, origin, destination, departAt, arriveAt, duration, busType, amenities

---

## 🛠️ Using Prisma Studio

View all travel options visually:

```bash
npm run db:studio
```

Opens: http://localhost:5555

Navigate to:
- `hotels` table - See all hotels
- `flights` table - See all flights
- `cars` table - See all cars
- `trains` table - See all trains
- `buses` table - See all buses

---

## 📝 Example Queries

### Get All Hotels
```javascript
const hotels = await prisma.hotel.findMany({
  include: {
    inventoryItem: true
  }
});
```

### Get Flights by Route
```javascript
const flights = await prisma.flight.findMany({
  where: {
    origin: 'New York',
    destination: 'London'
  },
  include: {
    inventoryItem: true
  }
});
```

### Get Available Cars
```javascript
const cars = await prisma.car.findMany({
  where: {
    inventoryItem: {
      isAvailable: true
    }
  },
  include: {
    inventoryItem: true
  }
});
```

### Get Trains by Operator
```javascript
const trains = await prisma.train.findMany({
  where: {
    operator: 'Eurostar'
  },
  include: {
    inventoryItem: true
  }
});
```

### Get Buses by Price Range
```javascript
const buses = await prisma.bus.findMany({
  where: {
    inventoryItem: {
      priceCents: {
        lte: 5000 // $50 or less
      }
    }
  },
  include: {
    inventoryItem: true
  }
});
```

---

## 🎨 Frontend Display

### Hotel Card Example
```jsx
<div className="hotel-card">
  <h3>{hotel.name}</h3>
  <p>📍 {hotel.location}</p>
  <p>⭐ {hotel.rating} stars</p>
  <p>💰 ${hotel.inventoryItem.priceCents / 100}/night</p>
  <button>Book Now</button>
</div>
```

### Flight Card Example
```jsx
<div className="flight-card">
  <h3>{flight.airline} {flight.flightNumber}</h3>
  <p>🛫 {flight.origin} ({flight.originCode})</p>
  <p>🛬 {flight.destination} ({flight.destinationCode})</p>
  <p>⏱️ {flight.duration} minutes</p>
  <p>💰 ${flight.inventoryItem.priceCents / 100}</p>
  <button>Book Flight</button>
</div>
```

### Car Card Example
```jsx
<div className="car-card">
  <h3>{car.name}</h3>
  <p>🚗 {car.category}</p>
  <p>📍 {car.location}</p>
  <p>👥 {car.seats} seats</p>
  <p>💰 ${car.inventoryItem.priceCents / 100}/day</p>
  <button>Rent Now</button>
</div>
```

### Train Card Example
```jsx
<div className="train-card">
  <h3>{train.operator} {train.trainNumber}</h3>
  <p>🚂 {train.origin} → {train.destination}</p>
  <p>⏱️ {train.duration} minutes</p>
  <p>🎫 {train.trainClass}</p>
  <p>💰 ${train.inventoryItem.priceCents / 100}</p>
  <button>Book Train</button>
</div>
```

### Bus Card Example
```jsx
<div className="bus-card">
  <h3>{bus.operator} {bus.busNumber}</h3>
  <p>🚌 {bus.origin} → {bus.destination}</p>
  <p>⏱️ {bus.duration} minutes</p>
  <p>🎫 {bus.busType}</p>
  <p>💰 ${bus.inventoryItem.priceCents / 100}</p>
  <button>Book Bus</button>
</div>
```

---

## 🔄 Adding More Travel Options

### Add a New Hotel
```javascript
await prisma.inventoryItem.create({
  data: {
    providerId: 'provider-id',
    providerItemId: 'hotel_london_001',
    travelMode: 'HOTEL',
    priceCents: 18000,
    currency: 'USD',
    searchableLocation: 'London, UK',
    isAvailable: true,
    rawData: {},
    hotel: {
      create: {
        name: 'London Luxury Hotel',
        location: 'London, UK',
        address: '123 Oxford Street',
        rating: 4.8,
        stars: 5,
        amenities: { wifi: true, pool: true },
        checkInTime: '14:00',
        checkOutTime: '11:00'
      }
    }
  }
});
```

### Add a New Flight
```javascript
await prisma.inventoryItem.create({
  data: {
    providerId: 'provider-id',
    providerItemId: 'flight_new_001',
    travelMode: 'FLIGHT',
    priceCents: 40000,
    currency: 'USD',
    searchableLocation: 'Miami to London',
    isAvailable: true,
    rawData: {},
    flight: {
      create: {
        airline: 'Virgin Atlantic',
        flightNumber: 'VS015',
        origin: 'Miami',
        originCode: 'MIA',
        destination: 'London',
        destinationCode: 'LHR',
        departAt: new Date('2024-12-20T18:00:00Z'),
        arriveAt: new Date('2024-12-21T06:30:00Z'),
        duration: 510,
        stops: 0,
        aircraftType: 'Boeing 787',
        cabinClass: 'Economy'
      }
    }
  }
});
```

---

## 📊 Statistics

### Count by Travel Mode
```sql
-- Hotels
SELECT COUNT(*) FROM hotels;

-- Flights
SELECT COUNT(*) FROM flights;

-- Cars
SELECT COUNT(*) FROM cars;

-- Trains
SELECT COUNT(*) FROM trains;

-- Buses
SELECT COUNT(*) FROM buses;
```

### Average Prices
```sql
-- Average hotel price
SELECT AVG(price_cents) / 100 AS avg_price FROM inventory_items WHERE travel_mode = 'HOTEL';

-- Average flight price
SELECT AVG(price_cents) / 100 AS avg_price FROM inventory_items WHERE travel_mode = 'FLIGHT';
```

---

## ✅ Verification

### Check All Travel Options Exist

```bash
# Open Prisma Studio
npm run db:studio

# Check each table:
# 1. Click on "hotels" - Should see 3 hotels
# 2. Click on "flights" - Should see 5 flights
# 3. Click on "cars" - Should see 4 cars
# 4. Click on "trains" - Should see 4 trains
# 5. Click on "buses" - Should see 4 buses
```

### Test API Endpoints

```bash
# Test hotels
curl http://localhost:5000/api/hotels

# Test flights
curl http://localhost:5000/api/flights

# Test cars
curl http://localhost:5000/api/cars

# Test trains
curl http://localhost:5000/api/trains

# Test buses
curl http://localhost:5000/api/buses
```

---

## 🎉 Summary

**Your VelvetRoutes platform now has:**

✅ **3 Hotels** - Luxury accommodations
✅ **5 Flights** - International routes
✅ **4 Cars** - Various categories
✅ **4 Trains** - High-speed rail
✅ **4 Buses** - Budget travel

**Total: 20 travel options across 5 modes!**

### Quick Start

```bash
# 1. Seed the database
npm run db:seed

# 2. Start the application
start.bat

# 3. Browse travel options
# Hotels: http://localhost:3000/hotels
# Flights: http://localhost:3000/flights
# Cars: http://localhost:3000/cars
# Trains: http://localhost:3000/trains
# Buses: http://localhost:3000/buses
```

**Enjoy your complete travel booking platform!** 🌍✈️🏨🚗🚂🚌

---

*For more information, see README.md or SETUP_GUIDE.md*
