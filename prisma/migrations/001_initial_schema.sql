-- Velvet Routes - Initial Database Schema Migration
-- PostgreSQL 12+ required for JSONB and UUID support
-- Run with: psql -U postgres -d velvet_routes -f 001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE user_role AS ENUM ('USER', 'ADMIN', 'MANAGER');
CREATE TYPE travel_mode AS ENUM ('HOTEL', 'FLIGHT', 'CAR', 'TRAIN', 'BUS');
CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REFUNDED');
CREATE TYPE payment_status AS ENUM ('INIT', 'SUCCEEDED', 'FAILED', 'REFUNDED');
CREATE TYPE payment_provider AS ENUM ('STRIPE', 'PAYPAL', 'RAZORPAY');
CREATE TYPE notification_channel AS ENUM ('PUSH', 'SMS', 'WHATSAPP', 'EMAIL');
CREATE TYPE notification_status AS ENUM ('SENT', 'FAILED', 'DELIVERED', 'READ');

-- ============================================================================
-- USER MANAGEMENT
-- ============================================================================

-- Users table: Core user authentication and profile
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    is_verified BOOLEAN DEFAULT FALSE,
    role user_role DEFAULT 'USER',
    created_at TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMPTZ(6),
    metadata JSONB -- User preferences, settings, etc.
);

-- Indexes for frequent queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_last_login ON users(last_login);

COMMENT ON TABLE users IS 'Core user authentication and profile information';
COMMENT ON COLUMN users.metadata IS 'Flexible storage for user preferences and settings';

-- Profiles table: Extended user information (one-to-one with users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dob DATE,
    address TEXT,
    passport_number VARCHAR(50), -- Should be encrypted at application level
    preferences JSONB, -- Travel preferences, dietary restrictions, etc.
    created_at TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE profiles IS 'Extended user profile information';
COMMENT ON COLUMN profiles.passport_number IS 'MUST be encrypted using KMS before storage';

-- ============================================================================
-- EXTERNAL PROVIDERS & API KEYS
-- ============================================================================

-- Providers table: External service providers (Booking.com, Sky Scrapper, Twilio)
CREATE TABLE providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    base_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB,
    created_at TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE providers IS 'External API providers (Booking.com, Sky Scrapper, Twilio, etc.)';

-- Provider API Keys: Store references to encrypted keys (NOT raw keys)
CREATE TABLE provider_api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    env_name VARCHAR(100) NOT NULL, -- RAPIDAPI_KEY, TWILIO_SID, etc.
    key_reference VARCHAR(255) NOT NULL, -- KMS key ID or encrypted value reference
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider_id, env_name)
);

COMMENT ON TABLE provider_api_keys IS 'API key references - NEVER store raw secrets here';
COMMENT ON COLUMN provider_api_keys.key_reference IS 'KMS key ID or encrypted reference - NOT the actual key';

-- ============================================================================
-- INVENTORY / PRODUCTS
-- ============================================================================

-- Inventory Items: Generic travel products from all providers
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id),
    provider_item_id VARCHAR(255) NOT NULL, -- External provider's ID
    travel_mode travel_mode NOT NULL,
    raw_data JSONB NOT NULL, -- Full API response for rehydration
    price_cents INTEGER NOT NULL, -- Price in cents to avoid floating point issues
    currency VARCHAR(3) DEFAULT 'USD',
    searchable_location VARCHAR(255),
    available_from TIMESTAMPTZ(6),
    available_to TIMESTAMPTZ(6),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for search performance
CREATE INDEX idx_inventory_travel_mode ON inventory_items(travel_mode);
CREATE INDEX idx_inventory_location ON inventory_items(searchable_location);
CREATE INDEX idx_inventory_available ON inventory_items(is_available);
CREATE INDEX idx_inventory_provider_item ON inventory_items(provider_id, provider_item_id);

COMMENT ON TABLE inventory_items IS 'Generic inventory for all travel products';
COMMENT ON COLUMN inventory_items.raw_data IS 'Full API response stored for rehydration and debugging';
COMMENT ON COLUMN inventory_items.price_cents IS 'Price in cents to avoid floating point precision issues';

-- Specialized tables for normalized queries and better search

-- Hotels
CREATE TABLE hotels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_item_id UUID UNIQUE NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    name VARCHAR(500) NOT NULL,
    location VARCHAR(500) NOT NULL,
    address TEXT,
    rating REAL,
    stars SMALLINT,
    amenities JSONB,
    check_in_time VARCHAR(10),
    check_out_time VARCHAR(10),
    image_url TEXT
);

CREATE INDEX idx_hotels_location ON hotels(location);
CREATE INDEX idx_hotels_rating ON hotels(rating);

-- Flights
CREATE TABLE flights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_item_id UUID UNIQUE NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    airline VARCHAR(255) NOT NULL,
    flight_number VARCHAR(20) NOT NULL,
    origin VARCHAR(255) NOT NULL,
    origin_code VARCHAR(10) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    destination_code VARCHAR(10) NOT NULL,
    depart_at TIMESTAMPTZ(6) NOT NULL,
    arrive_at TIMESTAMPTZ(6) NOT NULL,
    duration INTEGER NOT NULL, -- Minutes
    stops SMALLINT DEFAULT 0,
    aircraft_type VARCHAR(100),
    cabin_class VARCHAR(50)
);

CREATE INDEX idx_flights_route ON flights(origin, destination);
CREATE INDEX idx_flights_depart ON flights(depart_at);

-- Cars
CREATE TABLE cars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_item_id UUID UNIQUE NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    supplier VARCHAR(255) NOT NULL,
    location VARCHAR(500) NOT NULL,
    seats SMALLINT NOT NULL,
    doors SMALLINT NOT NULL,
    transmission VARCHAR(50) NOT NULL,
    fuel_type VARCHAR(50),
    features JSONB,
    image_url TEXT
);

CREATE INDEX idx_cars_location ON cars(location);
CREATE INDEX idx_cars_category ON cars(category);

-- Trains
CREATE TABLE trains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_item_id UUID UNIQUE NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    operator VARCHAR(255) NOT NULL,
    train_number VARCHAR(50) NOT NULL,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    depart_at TIMESTAMPTZ(6) NOT NULL,
    arrive_at TIMESTAMPTZ(6) NOT NULL,
    duration INTEGER NOT NULL,
    train_class VARCHAR(50),
    amenities JSONB
);

CREATE INDEX idx_trains_route ON trains(origin, destination);

-- Buses
CREATE TABLE buses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_item_id UUID UNIQUE NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    operator VARCHAR(255) NOT NULL,
    bus_number VARCHAR(50) NOT NULL,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    depart_at TIMESTAMPTZ(6) NOT NULL,
    arrive_at TIMESTAMPTZ(6) NOT NULL,
    duration INTEGER NOT NULL,
    bus_type VARCHAR(50),
    amenities JSONB
);

CREATE INDEX idx_buses_route ON buses(origin, destination);

-- ============================================================================
-- BOOKINGS
-- ============================================================================

-- Bookings: Main booking records
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT, -- Keep bookings even if user deleted
    total_amount_cents INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status booking_status DEFAULT 'PENDING',
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    metadata JSONB,
    created_at TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created ON bookings(created_at);

COMMENT ON TABLE bookings IS 'Main booking records for all travel types';
COMMENT ON COLUMN bookings.metadata IS 'Additional booking information, special requests, etc.';

-- Booking Items: Individual items within a booking
CREATE TABLE booking_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE, -- Delete items when booking deleted
    inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE SET NULL, -- Keep record even if inventory deleted
    provider_item_id VARCHAR(255) NOT NULL,
    travel_mode travel_mode NOT NULL,
    quantity SMALLINT DEFAULT 1,
    unit_price_cents INTEGER NOT NULL,
    start_date TIMESTAMPTZ(6),
    end_date TIMESTAMPTZ(6),
    seat_info JSONB, -- Seat numbers, preferences, etc.
    meta JSONB, -- Additional item-specific details
    created_at TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_booking_items_booking ON booking_items(booking_id);
CREATE INDEX idx_booking_items_inventory ON booking_items(inventory_item_id);

COMMENT ON TABLE booking_items IS 'Individual items within a booking (can have multiple items per booking)';

-- ============================================================================
-- PAYMENTS & INVOICES
-- ============================================================================

-- Payments: Payment transactions
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    provider payment_provider DEFAULT 'STRIPE',
    stripe_payment_id VARCHAR(255) UNIQUE, -- Stripe PaymentIntent ID
    amount_cents INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status payment_status DEFAULT 'INIT',
    refunded_at TIMESTAMPTZ(6),
    metadata JSONB,
    created_at TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_stripe ON payments(stripe_payment_id);
CREATE INDEX idx_payments_status ON payments(status);

COMMENT ON TABLE payments IS 'Payment transactions - NEVER store card details here';
COMMENT ON COLUMN payments.stripe_payment_id IS 'Stripe PaymentIntent ID for reference';

-- Invoices: PDF invoices for bookings
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    invoice_pdf_url TEXT,
    total_cents INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    generated_at TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoices_booking ON invoices(booking_id);

-- Refunds: Payment refunds
CREATE TABLE refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE RESTRICT,
    amount_cents INTEGER NOT NULL,
    status payment_status DEFAULT 'INIT',
    provider_ref VARCHAR(255),
    reason TEXT,
    created_at TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_refunds_payment ON refunds(payment_id);

-- ============================================================================
-- REVIEWS
-- ============================================================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    body TEXT,
    created_at TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_item ON reviews(inventory_item_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ============================================================================
-- NOTIFICATIONS & LOGS
-- ============================================================================

-- Notifications: SMS, WhatsApp, Push, Email notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    channel notification_channel NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    message TEXT NOT NULL,
    provider_message_id VARCHAR(255), -- Twilio message SID, etc.
    status notification_status DEFAULT 'SENT',
    metadata JSONB,
    created_at TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- Audit Logs: Track all important actions
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    object_type VARCHAR(100) NOT NULL,
    object_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_object ON audit_logs(object_type, object_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

COMMENT ON TABLE audit_logs IS 'Audit trail for compliance and debugging';

-- ============================================================================
-- SEARCH HISTORY & CACHING
-- ============================================================================

-- Searches: Cache search results to reduce API calls
CREATE TABLE searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    query JSONB NOT NULL,
    results_snapshot JSONB,
    result_count INTEGER,
    created_at TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ(6)
);

CREATE INDEX idx_searches_user ON searches(user_id);
CREATE INDEX idx_searches_expires ON searches(expires_at);
CREATE INDEX idx_searches_created ON searches(created_at);

COMMENT ON TABLE searches IS 'Cache search results to throttle provider API calls';

-- ============================================================================
-- SESSIONS & AUTH
-- ============================================================================

-- Sessions: JWT refresh tokens and session management
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMPTZ(6) NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
CREATE INDEX idx_sessions_revoked ON sessions(revoked);

COMMENT ON TABLE sessions IS 'JWT refresh token management';

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert default providers
INSERT INTO providers (name, display_name, base_url, is_active) VALUES
('booking_com', 'Booking.com', 'https://booking-com15.p.rapidapi.com', TRUE),
('sky_scrapper', 'Sky Scrapper', 'https://sky-scrapper.p.rapidapi.com', TRUE),
('twilio', 'Twilio', 'https://api.twilio.com', TRUE),
('stripe', 'Stripe', 'https://api.stripe.com', TRUE);

-- Migration complete
SELECT 'Migration 001_initial_schema completed successfully' AS status;
