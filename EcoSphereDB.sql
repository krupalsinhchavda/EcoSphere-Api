-- Create a new database
CREATE DATABASE IF NOT EXISTS EcoSphere;

-- Use the newly created database
USE EcoSphere;

-- Create a users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    bio TEXT,
    age INT,
    gender VARCHAR(255) DEFAULT NULL,
    registration_date DATE,
    last_login DATETIME,
    reset_token VARCHAR(255) DEFAULT NULL,
    reset_token_expiry DATETIME DEFAULT NULL,
    created_on DATETIME,
    modified_on DATETIME ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);


-- Create a store table with image_url column
CREATE TABLE IF NOT EXISTS store (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    image_url VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100),
    contact_number VARCHAR(20),
    opening_hours VARCHAR(100),
    category ENUM('Grocery', 'Clothing', 'Electronics', 'Books', 'Furniture'),
    website VARCHAR(255),
    established_year YEAR,
    created_on DATETIME,
    modified_on DATETIME ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Create an invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(20) NOT NULL,
    store_id INT,
    total_amount DECIMAL(10, 2),
    invoice_date DATE,
    payment_due_date DATE,
    payment_status ENUM('Paid', 'Unpaid', 'Pending'),
    shipping_address VARCHAR(255),
    billing_address VARCHAR(255),
    created_on DATETIME,
    modified_on DATETIME ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (store_id) REFERENCES store(id)
);

-- Create a posts table
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT,
    user_id INT,
    published_date DATE,
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    created_on DATETIME,
    modified_on DATETIME ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create a comments table
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT,
    user_id INT,
    post_id INT,
    comment_date DATE,
    parent_comment_id INT,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    created_on DATETIME,
    modified_on DATETIME ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (parent_comment_id) REFERENCES comments(id)
);

-- Create a products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    store_id INT,
    category ENUM('Electronics', 'Clothing', 'Books', 'Furniture', 'Grocery'),
    image_url VARCHAR(255) NOT NULL,
    created_on DATETIME,
    modified_on DATETIME ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (store_id) REFERENCES store(id)
);

-- Create an orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(20) NOT NULL,
    user_id INT,
    total_amount DECIMAL(10, 2),
    order_date DATE,
    delivery_date DATE,
    status ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'),
    shipping_address VARCHAR(255),
    billing_address VARCHAR(255),
    created_on DATETIME,
    modified_on DATETIME ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ALTER TABLE store
ALTER TABLE store
ADD COLUMN ownerId INT,
ADD CONSTRAINT fk_owner
    FOREIGN KEY (ownerId)
    REFERENCES users(id);

-- Create a products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    store_id INT,
    category ENUM('Electronics', 'Clothing', 'Books', 'Furniture', 'Grocery'),
    image_url VARCHAR(255) NOT NULL,
    created_on DATETIME,
    modified_on DATETIME ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (store_id) REFERENCES store(id)
);

-- Create an orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(20) NOT NULL,
    user_id INT,
    total_amount DECIMAL(10, 2),
    order_date DATE,
    delivery_date DATE,
    status ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'),
    shipping_address VARCHAR(255),
    billing_address VARCHAR(255),
    created_on DATETIME,
    modified_on DATETIME ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
