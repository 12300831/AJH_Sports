-- AJH Sports Database Schema
-- Create this database and run this schema

CREATE DATABASE IF NOT EXISTS ajh_sports;
USE ajh_sports;

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    location VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add any additional tables as needed for your application
-- Examples (uncomment and modify as needed):

-- Events table (if storing events in database)
-- CREATE TABLE IF NOT EXISTS events (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     title VARCHAR(255) NOT NULL,
--     description TEXT,
--     date DATETIME,
--     location VARCHAR(255),
--     price DECIMAL(10, 2),
--     spots_available INT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- Payments table (if storing payment records)
-- CREATE TABLE IF NOT EXISTS payments (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT,
--     stripe_session_id VARCHAR(255),
--     amount DECIMAL(10, 2),
--     currency VARCHAR(10),
--     status VARCHAR(50),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES users(id)
-- );

