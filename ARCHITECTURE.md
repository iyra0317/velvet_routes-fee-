# VelvetRoutes Architecture

## System Overview

VelvetRoutes is a comprehensive travel booking platform that aggregates multiple travel providers (hotels, flights, cars, trains, buses) into a unified booking system with integrated payment processing and multi-channel notifications.

## Architecture Layers

### 1. Database Layer (PostgreSQL + Prisma)

**Core Entities:**

- **Users & Profiles**: Authentication and user preferences
- **Providers**: External API integrations (Booking.com, Sky Scrapper, etc.)
- **Inventory Items**: Unified travel inventory with mode-specific details
- **Bookings**: Reservation management with line items
- **Payments**: Stripe payment processing
- **Invoices**: Generated billing documents
- **Notifications**: Multi-channel communication history
- **Reviews**: User feedback and ratings
- **Audit Logs**: Complete system audit trail
- **Search Cache**: Performance optimization

**Key Design Patterns:**

- **Polymorphic Associations**: InventoryItem has optional relations to Hotel, Flight, Car, Train, Bus
- **Soft Deletes**: All entities include deletedAt for data retention
- **Audit Trail**: Comprehensive logging of all critical operations
- **Metadata Fields**: JSON fields for flexible data storage

### 2. Service Layer

#### BookingService (`server/services/booking.service.ts`)

**Responsibilities:**
- Create and manage bookings
- Inventory search and availability
- Payment processing coordination
- Booking cancellation with inventory release
- Transaction management

**Key Methods:**
- `createBooking()`: Full booking flow with payment
- `getBooking()`: Retrieve booking details
- `cancelBooking()`: Cancel with inventory release
- `searchInventory()`: Search available travel options
- `getUserBookings()`: User booking history

**Transaction Flow:**
```
1. Verify inventory availability
2. Create booking record
3. Reserve inventory
4. Create payment record
5. Process payment (Stripe)
6. Update booking status
7. Generate invoice
8. Create audit log
9. Send notifications
```

#### NotificationService (`server/services/notification.service.ts`)

**Responsibilities:**
- Multi-channel notification delivery
- Template-based messaging
- Provider integration (Twilio, SendGrid)
- Notification history tracking

**Supported Channels:**
- EMAIL (SendGrid, AWS SES)
- SMS (Twilio)
- WHATSAPP (Twilio)
- PUSH (Firebase, OneSignal)

**Key Methods:**
- `sendNotification()`: Generic notification sender
- `sendBookingConfirmation()`: Automated booking confirmation
- `sendBookingReminder()`: Scheduled reminders
- `getUserNotifications()`: Notification history

### 3. API Layer (Express Routes)

#### Booking Routes (`server/routes/booking.routes.ts`)

**Endpoints:**

```
POST   /api/bookings              Create new booking
GET    /api/bookings/:id          Get booking by ID
GET    /api/bookings/user/:userId Get user bookings
POST   /api/bookings/:id/cancel   Cancel booking
POST   /api/bookings/search       Search inventory
```

**Request/Response Flow:**
1. Request validation
2. Service layer invocation
3. Error handling
4. Response formatting
5. Notification triggering

### 4. Integration Layer

#### External Providers

**RapidAPI Integrations:**
- **Booking.com API**: Hotels and car rentals
- **Sky Scrapper API**: Flight search and booking
- **Future**: Train and bus providers

**Payment Processing:**
- **Stripe**: Credit card processing, payment intents
- **Future**: PayPal, Apple Pay, Google Pay

**Communication:**
- **Twilio**: SMS and WhatsApp
- **SendGrid**: Email delivery
- **Future**: Push notifications

## Data Flow

### Booking Creation Flow

```
Client Request
    ↓
API Route (validation)
    ↓
BookingService.createBooking()
    ↓
Database Transaction:
    - Verify inventory
    - Create booking
    - Reserve inventory
    - Create payment
    - Process with Stripe
    - Update statuses
    - Generate invoice
    - Create audit log
    ↓
NotificationService.sendBookingConfirmation()
    ↓
Response to Client
```

### Search Flow

```
Client Search Request
    ↓
API Route
    ↓
BookingService.searchInventory()
    ↓
Check Search Cache
    ↓ (if miss)
Query Database
    ↓
Filter by:
    - Travel mode
    - Location/Route
    - Dates
    - Availability
    ↓
Cache Results
    ↓
Return to Client
```

## Database Schema Highlights

### Inventory Item (Polymorphic Design)

```typescript
InventoryItem {
  id: String
  providerId: String
  travelMode: HOTEL | FLIGHT | CAR | TRAIN | BUS
  priceCents: Int
  isAvailable: Boolean
  
  // Optional relations (polymorphic)
  hotel?: Hotel
  flight?: Flight
  car?: Car
  train?: Train
  bus?: Bus
}
```

### Booking Structure

```typescript
Booking {
  id: String
  userId: String
  totalAmountCents: Int
  status: PENDING | CONFIRMED | CANCELLED | COMPLETED
  
  bookingItems: BookingItem[]
  payments: Payment[]
  invoices: Invoice[]
}

BookingItem {
  inventoryItemId: String
  quantity: Int
  unitPriceCents: Int
  startDate?: DateTime
  endDate?: DateTime
  seatInfo?: Json
}
```

## Security Considerations

1. **Authentication**: JWT-based user authentication
2. **Authorization**: Role-based access control (USER, ADMIN)
3. **Payment Security**: PCI compliance via Stripe
4. **Data Privacy**: GDPR-compliant data handling
5. **Audit Trail**: Complete operation logging
6. **Input Validation**: Request validation at API layer

## Performance Optimizations

1. **Search Caching**: Redis-backed search result caching
2. **Database Indexing**: Optimized queries on frequently searched fields
3. **Connection Pooling**: Prisma connection management
4. **Async Operations**: Non-blocking notification sending
5. **Pagination**: Limit/offset for large result sets

## Scalability Considerations

1. **Horizontal Scaling**: Stateless API servers
2. **Database Replication**: Read replicas for search queries
3. **Queue System**: Background job processing (future)
4. **CDN**: Static asset delivery (future)
5. **Microservices**: Service separation potential

## Error Handling

1. **Transaction Rollback**: Automatic on payment failure
2. **Inventory Release**: Automatic on booking cancellation
3. **Retry Logic**: For external API calls
4. **Graceful Degradation**: Fallback for non-critical services
5. **Comprehensive Logging**: Error tracking and debugging

## Future Enhancements

1. **Real-time Updates**: WebSocket for booking status
2. **Advanced Search**: Filters, sorting, recommendations
3. **Loyalty Program**: Points and rewards system
4. **Multi-currency**: Dynamic currency conversion
5. **Mobile Apps**: Native iOS/Android applications
6. **AI Recommendations**: Personalized travel suggestions
7. **Group Bookings**: Multi-passenger coordination
8. **Travel Insurance**: Integrated insurance options

## Development Workflow

1. **Schema Changes**: Update `prisma/schema.prisma`
2. **Migration**: Run `npm run db:migrate`
3. **Service Logic**: Implement in service layer
4. **API Routes**: Add endpoints in routes
5. **Testing**: Manual testing via API calls
6. **Documentation**: Update README and this file

## Deployment Architecture

```
Load Balancer
    ↓
API Servers (Node.js/Express)
    ↓
PostgreSQL Database (Primary + Replicas)
    ↓
Redis Cache
    ↓
External Services (Stripe, Twilio, RapidAPI)
```

## Monitoring & Observability

1. **Application Logs**: Structured logging
2. **Database Metrics**: Query performance
3. **API Metrics**: Response times, error rates
4. **External API Health**: Provider availability
5. **Payment Success Rate**: Transaction monitoring

## Technology Stack Summary

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 14+
- **ORM**: Prisma
- **Payment**: Stripe
- **Notifications**: Twilio, SendGrid
- **Caching**: Redis (optional)
- **Development**: tsx (hot reload)
