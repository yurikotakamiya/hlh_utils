-- backend/init.sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE, -- Ensure username is unique
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS logs (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  level VARCHAR(50), -- e.g., INFO, ERROR
  message TEXT NOT NULL, -- Error message or status update
  url TEXT -- URL or post ID that caused the log
);

CREATE TABLE IF NOT EXISTS post_lengths (
  id SERIAL PRIMARY KEY,
  post_id TEXT NOT NULL, -- Store the post ID or URL
  length INTEGER NOT NULL, -- Store the length of the post content
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Track when this entry was created
);

-- Table for storing scores
CREATE TABLE IF NOT EXISTS scores (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL, -- Foreign key to users table if applicable
  col_1 INT,
  col_2 INT,
  col_3 INT,
  col_4 INT,
  col_5 INT,
  col_6 INT,
  col_7 INT,
  col_8 INT,
  col_9 INT,
  col_10 INT,
  date DATE NOT NULL, -- Date of the scores
  comment TEXT, -- Optional comment for the score entry
  UNIQUE (user_id, date) -- Ensure a unique combination of user_id and date
);

-- Table for mapping column names to user-friendly names
CREATE TABLE IF NOT EXISTS score_column_names (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL, -- Foreign key to users table if applicable
  col_name VARCHAR(20) NOT NULL, -- Column name (e.g., col_1, col_2)
  friendly_name VARCHAR(255) NOT NULL, -- User-friendly name for the column
  UNIQUE (user_id, col_name) -- Ensure a unique combination of user_id and col_name
);

-- To run this file in the database, use the following command:
-- docker-compose exec db psql -U postgres -d mydatabase
-- \i /docker-entrypoint-initdb.d/init.sql