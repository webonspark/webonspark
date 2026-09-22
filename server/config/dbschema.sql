-- WebOnspark database schema
-- Run this once against a fresh MySQL database to set up all tables the app needs:
--   mysql -u <user> -p <database> < server/config/dbschema.sql
-- (Create the database and app user first — see README.md.)

-- Admin panel login (bcrypt-hashed passwords). Managed via server/scripts/seedAdmin.js.
CREATE TABLE IF NOT EXISTS admins (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Reserved for future customer accounts (not wired into the app yet).
CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- All website form submissions (Login, Enquiry, Contact, Career, Question).
-- form_type says which form it came from; payload holds that form's fields as JSON.
CREATE TABLE IF NOT EXISTS form_submissions (
  id INT NOT NULL AUTO_INCREMENT,
  form_type VARCHAR(50) NOT NULL,
  page VARCHAR(255) DEFAULT NULL,
  payload JSON NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Manually tracked / CSV-imported leads shown on the admin Leads page.
CREATE TABLE IF NOT EXISTS leads (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  email VARCHAR(150) DEFAULT NULL,
  website_type VARCHAR(150) DEFAULT NULL,
  lead_owner VARCHAR(150) DEFAULT NULL,
  project VARCHAR(150) DEFAULT NULL,
  status ENUM('On Hold','Accepted','Rejected','Completed') NOT NULL DEFAULT 'On Hold',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
