-- Extended Database Schema for AJH Sports
-- Run this after the base schema.sql to add events, coaches, and bookings tables

USE ajh_sports;

-- Add role column to users table if it doesn't exist
-- Note: IF NOT EXISTS is not supported in all MySQL versions, so we check first
SET @dbname = DATABASE();
SET @tablename = 'users';
SET @columnname = 'role';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' VARCHAR(20) DEFAULT ''user'' AFTER location')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Update existing users to have 'user' role
UPDATE users SET role = 'user' WHERE role IS NULL;

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    max_players INT NOT NULL DEFAULT 20,
    price DECIMAL(10, 2) DEFAULT 0.00,
    location VARCHAR(255),
    image_url VARCHAR(1024) NULL,
    hero_image_url VARCHAR(1024) NULL,
    status ENUM('active', 'inactive', 'cancelled', 'completed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date),
    INDEX idx_status (status)
);

-- Event bookings table
CREATE TABLE IF NOT EXISTS event_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    stripe_session_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_event (event_id, user_id),
    INDEX idx_user_id (user_id),
    INDEX idx_event_id (event_id),
    INDEX idx_status (status)
);

-- Coaches table
CREATE TABLE IF NOT EXISTS coaches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    availability TEXT,
    hourly_rate DECIMAL(10, 2) DEFAULT 0.00,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status)
);

-- Coach bookings table
CREATE TABLE IF NOT EXISTS coach_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    coach_id INT NOT NULL,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    duration INT DEFAULT 60 COMMENT 'Duration in minutes',
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    stripe_session_id VARCHAR(255),
    google_calendar_event_id VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (coach_id) REFERENCES coaches(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_coach_id (coach_id),
    INDEX idx_date (date),
    INDEX idx_status (status)
);

-- Insert sample data (optional - for testing)
-- INSERT INTO events (name, description, date, time, max_players, price, location) VALUES
-- ('Tennis Open 2025', 'Annual tennis championship', '2025-08-10', '09:00:00', 24, 30.00, 'AJH Sportscentre'),
-- ('Table Tennis Tournament', 'Fast-paced table tennis action', '2025-01-22', '10:00:00', 32, 35.00, 'AJH Sportscentre');

-- INSERT INTO coaches (name, specialty, email, phone, hourly_rate) VALUES
-- ('Michael', 'Tennis', 'michael@ajhsports.com', '+61 0412345678', 60.00),
-- ('Kristin', 'Table Tennis', 'kristin@ajhsports.com', '+61 0412345679', 55.00);

