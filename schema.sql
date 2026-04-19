-- phpMyAdmin SQL Dump
-- Campus Book Exchange Mini Project
-- coderabbit full review trigger

CREATE DATABASE IF NOT EXISTS campus_book_exchange;
USE campus_book_exchange;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    student_id VARCHAR(20),
    campus VARCHAR(50) NOT NULL,
    phone VARCHAR(15),
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Books Table (Listings)
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seller_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    condition_status ENUM('New', 'Like New', 'Good', 'Fair', 'Poor') NOT NULL,
    purchase_date DATE NOT NULL,
    description TEXT,
    status ENUM('Available', 'Sold') DEFAULT 'Available',
    image_url VARCHAR(255) DEFAULT 'https://picsum.photos/seed/book/400/600',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Requests Table (Interactions/Chats)
CREATE TABLE IF NOT EXISTS requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    buyer_id INT NOT NULL,
    status ENUM('Pending', 'Accepted', 'Rejected') DEFAULT 'Pending',
    message TEXT,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Activity Logs Table (Advanced Logging)
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed Initial Data for Demo
INSERT INTO users (first_name, last_name, email, password, campus, role) 
VALUES ('Admin', 'Master', 'admin@campusbook.com', 'admin123', 'SJCE', 'admin');

INSERT INTO users (first_name, last_name, email, password, campus, role) 
VALUES ('Rehan', 'Busters', 'rehan@gmail.com', 'user123', 'SJCE', 'user');
