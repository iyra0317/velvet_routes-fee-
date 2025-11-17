import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ============================================================================
  // USERS & PROFILES
  // ============================================================================

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@velvetroutes.com',
      passwordHash: await bcrypt.hash('admin123', 10),
      name: 'Admin User',
      phone: '+1234567890',
      isVerified: true,
      role: 'ADMIN',
      metadata: { preferences: { notifications: true, darkMode: false, language: 'en' } },
      profile: {
        create: {
          dob: new Date('1990-01-01'),
          address: '123 Admin Street, Admin City, AC 12345',
          preferences: { travelClass: 'business', dietaryRestrictions: [], accessibility: false }
        }
      }
    }
  });

  const regularUser = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      passwordHash: await bcrypt.hash('password123', 10),
      name: 'John Doe',
      phone: '+1987654321',
      isVerified: true,
      role: 'USER',
      metadata: { preferences: { notifications: true, darkMode: true, language: 'en' } },
      profile: {
        create: {
          dob: new Date('1985-06-15'),
          address: '456 User Avenue, User City, UC 67890',
          preferences: { travelClass: 'economy', dietaryRestrictions: ['vegetarian'], accessibility: false }
        }
      }
    }
  });

  console.log('✅ Created users and profiles');

  // ============================================================================
  // PROVIDERS
  // ============================================================================

  const bookingProvider = await prisma.provider.create({
    data: {
      name: 'booking_com',
      displayName: 'Booking.com',
      baseUrl: 'https://booking-com15.p.rapidapi.com',
      isActive: true,
      metadata: { description: 'Hotel and car rental booking', supportedModes: ['HOTEL', 'CAR'] }
    }
  });

  const skyScrapperProvider = await prisma.provider.create({
    data: {
      name: 'sky_scrapper',
      displayName: 'Sky Scrapper',
      baseUrl: 'https://sky-scrapper.p.rapidapi.com',
      isActive: true,
      metadata: { description: 'Flight search and booking', supportedModes: ['FLIGHT'] }
    }
  });

  const trainProvider = await prisma.provider.create({
    data: {
      name: 'rail_europe',
      displayName: 'Rail Europe',
      baseUrl: 'https://rail-europe.com/api',
      isActive: true,
      metadata: { description: 'Train booking across Europe', supportedModes: ['TRAIN'] }
    }
  });

  const busProvider = await prisma.provider.create({
    data: {
      name: 'flixbus',
      displayName: 'FlixBus',
      baseUrl: 'https://flixbus.com/api',
      isActive: true,
      metadata: { description: 'Bus travel across Europe and USA', supportedModes: ['BUS'] }
    }
  });

  console.log('✅ Created providers');

  // ============================================================================
  // HOTELS
  // ============================================================================

  const hotel1 = await prisma.inventoryItem.create({
    data: {
      providerId: bookingProvider.id,
      providerItemId: 'hotel_paris_001',
      travelMode: 'HOTEL',
      priceCents: 15000,
      currency: 'USD',
      searchableLocation: 'Paris, France',
      isAvailable: true,
      rawData: { hotelId: 'hotel_paris_001', name: 'Grand Hotel Paris', rating: 4.5 },
      hotel: {
        create: {
          name: 'Grand Hotel Paris',
          location: 'Paris, France',
          address: '123 Champs-Élysées, 75008 Paris, France',
          rating: 4.5,
          stars: 5,
          amenities: { wifi: true, pool: true, spa: true, restaurant: true, gym: true },
          checkInTime: '15:00',
          checkOutTime: '11:00',
          imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'
        }
      }
    }
  });

  const hotel2 = await prisma.inventoryItem.create({
    data: {
      providerId: bookingProvider.id,
      providerItemId: 'hotel_tokyo_001',
      travelMode: 'HOTEL',
      priceCents: 12000,
      currency: 'USD',
      searchableLocation: 'Tokyo, Japan',
      isAvailable: true,
      rawData: { hotelId: 'hotel_tokyo_001', name: 'Tokyo Bay Hotel', rating: 4.2 },
      hotel: {
        create: {
          name: 'Tokyo Bay Hotel',
          location: 'Tokyo, Japan',
          address: '1-1-1 Shiodome, Minato-ku, Tokyo 105-7001, Japan',
          rating: 4.2,
          stars: 4,
          amenities: { wifi: true, restaurant: true, businessCenter: true },
          checkInTime: '15:00',
          checkOutTime: '12:00',
          imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'
        }
      }
    }
  });

  const hotel3 = await prisma.inventoryItem.create({
    data: {
      providerId: bookingProvider.id,
      providerItemId: 'hotel_nyc_001',
      travelMode: 'HOTEL',
      priceCents: 25000,
      currency: 'USD',
      searchableLocation: 'New York, USA',
      isAvailable: true,
      rawData: { hotelId: 'hotel_nyc_001', name: 'Manhattan Plaza Hotel', rating: 4.7 },
      hotel: {
        create: {
          name: 'Manhattan Plaza Hotel',
          location: 'New York, USA',
          address: '768 5th Avenue, New York, NY 10019, USA',
          rating: 4.7,
          stars: 5,
          amenities: { wifi: true, pool: true, spa: true, restaurant: true, concierge: true },
          checkInTime: '16:00',
          checkOutTime: '11:00',
          imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945'
        }
      }
    }
  });

  console.log('✅ Created 3 hotels');

  // ============================================================================
  // FLIGHTS
  // ============================================================================

  const flight1 = await prisma.inventoryItem.create({
    data: {
      providerId: skyScrapperProvider.id,
      providerItemId: 'flight_aa_100',
      travelMode: 'FLIGHT',
      priceCents: 45000,
      currency: 'USD',
      searchableLocation: 'New York to London',
      isAvailable: true,
      rawData: { flightId: 'flight_aa_100', airline: 'American Airlines', flightNumber: 'AA100' },
      flight: {
        create: {
          airline: 'American Airlines',
          flightNumber: 'AA100',
          origin: 'New York',
          originCode: 'JFK',
          destination: 'London',
          destinationCode: 'LHR',
          departAt: new Date('2024-12-15T14:30:00Z'),
          arriveAt: new Date('2024-12-16T02:45:00Z'),
          duration: 495,
          stops: 0,
          aircraftType: 'Boeing 777-300ER',
          cabinClass: 'Economy'
        }
      }
    }
  });

  const flight2 = await prisma.inventoryItem.create({
    data: {
      providerId: skyScrapperProvider.id,
      providerItemId: 'flight_ba_005',
      travelMode: 'FLIGHT',
      priceCents: 65000,
      currency: 'USD',
      searchableLocation: 'London to Tokyo',
      isAvailable: true,
      rawData: { flightId: 'flight_ba_005', airline: 'British Airways', flightNumber: 'BA005' },
      flight: {
        create: {
          airline: 'British Airways',
          flightNumber: 'BA005',
          origin: 'London',
          originCode: 'LHR',
          destination: 'Tokyo',
          destinationCode: 'NRT',
          departAt: new Date('2024-12-20T11:00:00Z'),
          arriveAt: new Date('2024-12-21T09:30:00Z'),
          duration: 690,
          stops: 0,
          aircraftType: 'Boeing 787-9',
          cabinClass: 'Business'
        }
      }
    }
  });

  const flight3 = await prisma.inventoryItem.create({
    data: {
      providerId: skyScrapperProvider.id,
      providerItemId: 'flight_dl_264',
      travelMode: 'FLIGHT',
      priceCents: 35000,
      currency: 'USD',
      searchableLocation: 'Paris to New York',
      isAvailable: true,
      rawData: { flightId: 'flight_dl_264', airline: 'Delta Air Lines', flightNumber: 'DL264' },
      flight: {
        create: {
          airline: 'Delta Air Lines',
          flightNumber: 'DL264',
          origin: 'Paris',
          originCode: 'CDG',
          destination: 'New York',
          destinationCode: 'JFK',
          departAt: new Date('2024-12-25T10:15:00Z'),
          arriveAt: new Date('2024-12-25T13:45:00Z'),
          duration: 510,
          stops: 0,
          aircraftType: 'Airbus A330-300',
          cabinClass: 'Economy'
        }
      }
    }
  });

  const flight4 = await prisma.inventoryItem.create({
    data: {
      providerId: skyScrapperProvider.id,
      providerItemId: 'flight_ua_890',
      travelMode: 'FLIGHT',
      priceCents: 55000,
      currency: 'USD',
      searchableLocation: 'San Francisco to Tokyo',
      isAvailable: true,
      rawData: { flightId: 'flight_ua_890', airline: 'United Airlines', flightNumber: 'UA890' },
      flight: {
        create: {
          airline: 'United Airlines',
          flightNumber: 'UA890',
          origin: 'San Francisco',
          originCode: 'SFO',
          destination: 'Tokyo',
          destinationCode: 'NRT',
          departAt: new Date('2024-12-18T16:00:00Z'),
          arriveAt: new Date('2024-12-19T19:30:00Z'),
          duration: 630,
          stops: 0,
          aircraftType: 'Boeing 777-200',
          cabinClass: 'Premium Economy'
        }
      }
    }
  });

  const flight5 = await prisma.inventoryItem.create({
    data: {
      providerId: skyScrapperProvider.id,
      providerItemId: 'flight_em_202',
      travelMode: 'FLIGHT',
      priceCents: 75000,
      currency: 'USD',
      searchableLocation: 'Dubai to New York',
      isAvailable: true,
      rawData: { flightId: 'flight_em_202', airline: 'Emirates', flightNumber: 'EM202' },
      flight: {
        create: {
          airline: 'Emirates',
          flightNumber: 'EM202',
          origin: 'Dubai',
          originCode: 'DXB',
          destination: 'New York',
          destinationCode: 'JFK',
          departAt: new Date('2024-12-22T08:00:00Z'),
          arriveAt: new Date('2024-12-22T14:30:00Z'),
          duration: 870,
          stops: 0,
          aircraftType: 'Airbus A380',
          cabinClass: 'First Class'
        }
      }
    }
  });

  console.log('✅ Created 5 flights');

  // ============================================================================
  // CARS
  // ============================================================================

  const car1 = await prisma.inventoryItem.create({
    data: {
      providerId: bookingProvider.id,
      providerItemId: 'car_hertz_001',
      travelMode: 'CAR',
      priceCents: 5500,
      currency: 'USD',
      searchableLocation: 'Paris, France',
      isAvailable: true,
      rawData: { carId: 'car_hertz_001', name: 'Toyota Corolla', category: 'Economy' },
      car: {
        create: {
          name: 'Toyota Corolla',
          category: 'Economy',
          supplier: 'Hertz',
          location: 'Paris, France',
          seats: 5,
          doors: 4,
          transmission: 'Automatic',
          fuelType: 'Gasoline',
          features: { airConditioning: true, gps: true, bluetooth: true, usbPorts: 2 },
          imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2'
        }
      }
    }
  });

  const car2 = await prisma.inventoryItem.create({
    data: {
      providerId: bookingProvider.id,
      providerItemId: 'car_avis_002',
      travelMode: 'CAR',
      priceCents: 8500,
      currency: 'USD',
      searchableLocation: 'New York, USA',
      isAvailable: true,
      rawData: { carId: 'car_avis_002', name: 'BMW X3', category: 'SUV' },
      car: {
        create: {
          name: 'BMW X3',
          category: 'SUV',
          supplier: 'Avis',
          location: 'New York, USA',
          seats: 5,
          doors: 4,
          transmission: 'Automatic',
          fuelType: 'Gasoline',
          features: { airConditioning: true, gps: true, bluetooth: true, leatherSeats: true, sunroof: true },
          imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b'
        }
      }
    }
  });

  const car3 = await prisma.inventoryItem.create({
    data: {
      providerId: bookingProvider.id,
      providerItemId: 'car_enterprise_003',
      travelMode: 'CAR',
      priceCents: 12000,
      currency: 'USD',
      searchableLocation: 'Los Angeles, USA',
      isAvailable: true,
      rawData: { carId: 'car_enterprise_003', name: 'Mercedes-Benz E-Class', category: 'Luxury' },
      car: {
        create: {
          name: 'Mercedes-Benz E-Class',
          category: 'Luxury',
          supplier: 'Enterprise',
          location: 'Los Angeles, USA',
          seats: 5,
          doors: 4,
          transmission: 'Automatic',
          fuelType: 'Hybrid',
          features: { airConditioning: true, gps: true, bluetooth: true, leatherSeats: true, sunroof: true, heatedSeats: true },
          imageUrl: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741'
        }
      }
    }
  });

  const car4 = await prisma.inventoryItem.create({
    data: {
      providerId: bookingProvider.id,
      providerItemId: 'car_budget_004',
      travelMode: 'CAR',
      priceCents: 4500,
      currency: 'USD',
      searchableLocation: 'London, UK',
      isAvailable: true,
      rawData: { carId: 'car_budget_004', name: 'Ford Focus', category: 'Compact' },
      car: {
        create: {
          name: 'Ford Focus',
          category: 'Compact',
          supplier: 'Budget',
          location: 'London, UK',
          seats: 5,
          doors: 4,
          transmission: 'Manual',
          fuelType: 'Diesel',
          features: { airConditioning: true, bluetooth: true },
          imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d'
        }
      }
    }
  });

  console.log('✅ Created 4 cars');

  // ============================================================================
  // TRAINS
  // ============================================================================

  const train1 = await prisma.inventoryItem.create({
    data: {
      providerId: trainProvider.id,
      providerItemId: 'train_eurostar_001',
      travelMode: 'TRAIN',
      priceCents: 15000,
      currency: 'USD',
      searchableLocation: 'London to Paris',
      isAvailable: true,
      rawData: { trainId: 'train_eurostar_001', operator: 'Eurostar', trainNumber: 'ES9012' },
      train: {
        create: {
          operator: 'Eurostar',
          trainNumber: 'ES9012',
          origin: 'London',
          destination: 'Paris',
          departAt: new Date('2024-12-16T09:00:00Z'),
          arriveAt: new Date('2024-12-16T11:30:00Z'),
          duration: 150,
          trainClass: 'Standard Premier',
          amenities: { wifi: true, powerOutlets: true, meals: true, quietCar: false }
        }
      }
    }
  });

  const train2 = await prisma.inventoryItem.create({
    data: {
      providerId: trainProvider.id,
      providerItemId: 'train_tgv_002',
      travelMode: 'TRAIN',
      priceCents: 12000,
      currency: 'USD',
      searchableLocation: 'Paris to Lyon',
      isAvailable: true,
      rawData: { trainId: 'train_tgv_002', operator: 'SNCF TGV', trainNumber: 'TGV6651' },
      train: {
        create: {
          operator: 'SNCF TGV',
          trainNumber: 'TGV6651',
          origin: 'Paris',
          destination: 'Lyon',
          departAt: new Date('2024-12-17T14:00:00Z'),
          arriveAt: new Date('2024-12-17T16:00:00Z'),
          duration: 120,
          trainClass: 'First Class',
          amenities: { wifi: true, powerOutlets: true, meals: true, quietCar: true }
        }
      }
    }
  });

  const train3 = await prisma.inventoryItem.create({
    data: {
      providerId: trainProvider.id,
      providerItemId: 'train_ice_003',
      travelMode: 'TRAIN',
      priceCents: 18000,
      currency: 'USD',
      searchableLocation: 'Berlin to Munich',
      isAvailable: true,
      rawData: { trainId: 'train_ice_003', operator: 'Deutsche Bahn ICE', trainNumber: 'ICE507' },
      train: {
        create: {
          operator: 'Deutsche Bahn ICE',
          trainNumber: 'ICE507',
          origin: 'Berlin',
          destination: 'Munich',
          departAt: new Date('2024-12-18T08:30:00Z'),
          arriveAt: new Date('2024-12-18T12:30:00Z'),
          duration: 240,
          trainClass: 'Business Class',
          amenities: { wifi: true, powerOutlets: true, meals: true, quietCar: true, workspace: true }
        }
      }
    }
  });

  const train4 = await prisma.inventoryItem.create({
    data: {
      providerId: trainProvider.id,
      providerItemId: 'train_shinkansen_004',
      travelMode: 'TRAIN',
      priceCents: 22000,
      currency: 'USD',
      searchableLocation: 'Tokyo to Osaka',
      isAvailable: true,
      rawData: { trainId: 'train_shinkansen_004', operator: 'JR Shinkansen', trainNumber: 'NOZOMI1' },
      train: {
        create: {
          operator: 'JR Shinkansen',
          trainNumber: 'NOZOMI1',
          origin: 'Tokyo',
          destination: 'Osaka',
          departAt: new Date('2024-12-19T10:00:00Z'),
          arriveAt: new Date('2024-12-19T12:30:00Z'),
          duration: 150,
          trainClass: 'Green Car',
          amenities: { wifi: true, powerOutlets: true, meals: false, quietCar: true }
        }
      }
    }
  });

  console.log('✅ Created 4 trains');

  // ============================================================================
  // BUSES
  // ============================================================================

  const bus1 = await prisma.inventoryItem.create({
    data: {
      providerId: busProvider.id,
      providerItemId: 'bus_flixbus_001',
      travelMode: 'BUS',
      priceCents: 3500,
      currency: 'USD',
      searchableLocation: 'New York to Boston',
      isAvailable: true,
      rawData: { busId: 'bus_flixbus_001', operator: 'FlixBus', busNumber: 'FB1234' },
      bus: {
        create: {
          operator: 'FlixBus',
          busNumber: 'FB1234',
          origin: 'New York',
          destination: 'Boston',
          departAt: new Date('2024-12-16T08:00:00Z'),
          arriveAt: new Date('2024-12-16T12:30:00Z'),
          duration: 270,
          busType: 'Standard',
          amenities: { wifi: true, powerOutlets: true, restroom: true, airConditioning: true }
        }
      }
    }
  });

  const bus2 = await prisma.inventoryItem.create({
    data: {
      providerId: busProvider.id,
      providerItemId: 'bus_greyhound_002',
      travelMode: 'BUS',
      priceCents: 4500,
      currency: 'USD',
      searchableLocation: 'Los Angeles to San Francisco',
      isAvailable: true,
      rawData: { busId: 'bus_greyhound_002', operator: 'Greyhound', busNumber: 'GH5678' },
      bus: {
        create: {
          operator: 'Greyhound',
          busNumber: 'GH5678',
          origin: 'Los Angeles',
          destination: 'San Francisco',
          departAt: new Date('2024-12-17T09:00:00Z'),
          arriveAt: new Date('2024-12-17T15:30:00Z'),
          duration: 390,
          busType: 'Express',
          amenities: { wifi: true, powerOutlets: true, restroom: true, airConditioning: true, recliningSeats: true }
        }
      }
    }
  });

  const bus3 = await prisma.inventoryItem.create({
    data: {
      providerId: busProvider.id,
      providerItemId: 'bus_megabus_003',
      travelMode: 'BUS',
      priceCents: 2500,
      currency: 'USD',
      searchableLocation: 'Chicago to Detroit',
      isAvailable: true,
      rawData: { busId: 'bus_megabus_003', operator: 'Megabus', busNumber: 'MB9012' },
      bus: {
        create: {
          operator: 'Megabus',
          busNumber: 'MB9012',
          origin: 'Chicago',
          destination: 'Detroit',
          departAt: new Date('2024-12-18T07:30:00Z'),
          arriveAt: new Date('2024-12-18T13:00:00Z'),
          duration: 330,
          busType: 'Standard',
          amenities: { wifi: true, powerOutlets: true, restroom: true, airConditioning: true }
        }
      }
    }
  });

  const bus4 = await prisma.inventoryItem.create({
    data: {
      providerId: busProvider.id,
      providerItemId: 'bus_national_004',
      travelMode: 'BUS',
      priceCents: 5500,
      currency: 'USD',
      searchableLocation: 'London to Edinburgh',
      isAvailable: true,
      rawData: { busId: 'bus_national_004', operator: 'National Express', busNumber: 'NE3456' },
      bus: {
        create: {
          operator: 'National Express',
          busNumber: 'NE3456',
          origin: 'London',
          destination: 'Edinburgh',
          departAt: new Date('2024-12-19T22:00:00Z'),
          arriveAt: new Date('2024-12-20T07:30:00Z'),
          duration: 570,
          busType: 'Sleeper',
          amenities: { wifi: true, powerOutlets: true, restroom: true, airConditioning: true, recliningSeats: true, blankets: true }
        }
      }
    }
  });

  console.log('✅ Created 4 buses');

  // ============================================================================
  // BOOKINGS & PAYMENTS
  // ============================================================================

  const booking = await prisma.booking.create({
    data: {
      userId: regularUser.id,
      totalAmountCents: 15000,
      currency: 'USD',
      status: 'CONFIRMED',
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerPhone: '+1987654321',
      metadata: { specialRequests: 'Non-smoking room' },
      bookingItems: {
        create: [{
          inventoryItemId: hotel1.id,
          providerItemId: 'hotel_paris_001',
          travelMode: 'HOTEL',
          quantity: 1,
          unitPriceCents: 15000,
          startDate: new Date('2024-12-01T15:00:00Z'),
          endDate: new Date('2024-12-03T11:00:00Z'),
          seatInfo: { roomType: 'Deluxe King' },
          meta: { nights: 2, guests: 2 }
        }]
      }
    }
  });

  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      userId: regularUser.id,
      provider: 'STRIPE',
      stripePaymentId: 'pi_test_1234567890',
      amountCents: 15000,
      currency: 'USD',
      status: 'SUCCEEDED',
      metadata: { paymentMethod: 'card', last4: '4242' }
    }
  });

  await prisma.invoice.create({
    data: {
      bookingId: booking.id,
      invoicePdfUrl: 'https://example.com/invoices/invoice_001.pdf',
      totalCents: 15000,
      currency: 'USD'
    }
  });

  console.log('✅ Created booking, payment, and invoice');

  // ============================================================================
  // REVIEWS & NOTIFICATIONS
  // ============================================================================

  await prisma.review.create({
    data: {
      userId: regularUser.id,
      inventoryItemId: hotel1.id,
      rating: 5,
      title: 'Excellent stay in Paris!',
      body: 'The Grand Hotel Paris exceeded all expectations. Great location, friendly staff, and amazing amenities!'
    }
  });

  await prisma.notification.create({
    data: {
      userId: regularUser.id,
      channel: 'EMAIL',
      email: 'john.doe@example.com',
      message: 'Your booking confirmation for Grand Hotel Paris',
      status: 'DELIVERED'
    }
  });

  console.log('✅ Created review and notification');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log('   👥 Users: 2 (1 admin, 1 regular)');
  console.log('   🏨 Hotels: 3');
  console.log('   ✈️  Flights: 5');
  console.log('   🚗 Cars: 4');
  console.log('   🚂 Trains: 4');
  console.log('   🚌 Buses: 4');
  console.log('   📋 Bookings: 1');
  console.log('   💳 Payments: 1');
  console.log('   📄 Invoices: 1');
  console.log('   ⭐ Reviews: 1');
  console.log('   🔔 Notifications: 1');
  console.log('\n🔐 Test Credentials:');
  console.log('   Admin: admin@velvetroutes.com / admin123');
  console.log('   User:  john.doe@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
