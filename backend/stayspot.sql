-- 🏡 StaySpot Database Schema
-- Author: Sukhpreet
-- Description: Tables for users, admins, listings, and reviews

CREATE DATABASE IF NOT EXISTS stayspot;
USE stayspot;

-- 🔐 Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 👑 Admin Users table
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('superadmin', 'moderator', 'support') DEFAULT 'moderator',
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🏘 Listings table
CREATE TABLE IF NOT EXISTS listings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  address VARCHAR(255) NOT NULL,
  property_type ENUM('Flat','PG','Room','Villa','House') DEFAULT 'Flat',
  furnished ENUM('Yes','No','Semi') DEFAULT 'No',
  contact VARCHAR(15),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 💬 Reviews table (for future features)
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  listing_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ⚙️ Insert sample data
INSERT INTO users (name, email, password)
VALUES 
('Test User', 'test@example.com', 'hashedpassword123');

INSERT INTO admin_users (username, email, password, role)
VALUES
('admin', 'admin@stayspot.in', 'admin123', 'superadmin'),
('support1', 'support@stayspot.in', 'support123', 'support');

INSERT INTO listings (title, description, price, address, property_type, furnished, contact, image_url, user_id)
VALUES 
('1BHK in Sector 15', 'Spacious flat with balcony', 12000, 'Sector 15, City Center', 'Flat', 'Yes', '9876543210', '/uploads/sample1.jpg', 1),
('PG for Girls', 'Fully furnished, AC, WiFi', 8500, 'Rajiv Chowk, City', 'PG', 'Yes', '9812345678', '/uploads/sample2.jpg', 1);
