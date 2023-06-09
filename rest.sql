-- Пользоватили
CREATE TABLE users (
  id INT(11) NOT NULL AUTO_INCREMENT,
  login VARCHAR(50) NOT NULL,
  password VARCHAR(255),
  role ENUM('admin', 'user') NOT NULL,
  PRIMARY KEY (id)
);
-- Токен
CREATE TABLE tokens (
  id INT NOT NULL AUTO_INCREMENT,
  userID INT NOT NULL,
  refreshToken VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);
-- Продукты
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  images VARCHAR(255) NOT NULL,
  price VARCHAR(255) NOT NULL,
  category ENUM('Еда', 'Напитки', 'Алкоголь') NOT NULL
);
-- Мероприятие
CREATE TABLE event (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  date VARCHAR(255) NOT NULL,
  images VARCHAR(255)
);
-- Бронь столов
CREATE TABLE tableStol (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    dateStart VARCHAR(255) NOT NULL,
    dateEnd VARCHAR(255) NOT NULL,
    table_id VARCHAR(255)
);
-- Контакты
CREATE TABLE contacts (
    id INT NOT NULL AUTO_INCREMENT,
    phone VARCHAR(255),
    email VARCHAR(255),
    telegram VARCHAR(255),
    website VARCHAR(255),
    PRIMARY KEY (id)
);
-- Заказы
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId VARCHAR(255) NOT NULL,
  products VARCHAR(255) NOT NULL,
  date VARCHAR(255) NOT NULL
);

-- Post get
CREATE TABLE tokens (
  id SERIAL PRIMARY KEY,
  userID INT NOT NULL,
  refreshToken VARCHAR(255) NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  login VARCHAR(50) NOT NULL,
  password VARCHAR(255),
  role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'user'))
);

CREATE TABLE event (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  images VARCHAR(255),
  date VARCHAR(255) NOT NULL
);
-- INSERT INTO event (name, images, date) VALUES ('Test1', '1.jpg', '2023-05-15T04:11:08');
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  images VARCHAR(255),
  price VARCHAR(255) NOT NULL,
  price_old VARCHAR(255),
  category VARCHAR(20) CHECK (category IN ('Еда', 'Напитки', 'Алкоголь')) NOT NULL,
  stock BOOLEAN
);

CREATE TABLE tableStol (
  id SERIAL PRIMARY KEY,
  userId VARCHAR(255) NOT NULL,
  date VARCHAR(255) NOT NULL,
  table_id VARCHAR(255) NOT NULL,
  event VARCHAR(255)
);
-- ALTER TABLE tableStol ADD COLUMN table_id VARCHAR(255) NOT NULL;
-- INSERT INTO tableStol (name, images, date) VALUES ('Test1', '1.jpg', '2023-05-15T04:11:08');
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(255),
  email VARCHAR(255),
  telegram VARCHAR(255),
  website VARCHAR(255)
);
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  userId VARCHAR(255) NOT NULL,
  products VARCHAR(255) NOT NULL,
  table_id VARCHAR(255) NOT NULL,
  date VARCHAR(255) NOT NULL
);