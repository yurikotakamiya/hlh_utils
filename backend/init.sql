-- backend/init.sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
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

-- To run this file in the database, use the following command:
-- docker-compose exec db psql -U postgres -d mydatabase
-- \i /docker-entrypoint-initdb.d/init.sql