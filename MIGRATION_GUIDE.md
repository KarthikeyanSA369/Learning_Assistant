# Database Migration - Production Update

## Overview

This guide documents the database changes required for the production refactoring of the Learning Assistant platform.

## Changes Required

### 1. Add Deep Explanation Column

The new "Explain Deeply" feature requires storing optional deep explanations (though they're primarily shown temporarily).

```sql
ALTER TABLE history ADD COLUMN deep_explanation LONGTEXT DEFAULT NULL;
```

This column is optional and allows future caching of deep explanations if needed.

### 2. Update Database Name (Optional but Recommended)

The system now uses a neutral database name instead of brand-specific naming.

```sql
-- Create new database
CREATE DATABASE aiapp;

-- If migrating from arivon database:
-- 1. Export data from old database
mysqldump -u root -p arivon > backup_arivon.sql

-- 2. Create new database and import
mysql -u root -p aiapp < backup_arivon.sql

-- 3. Add new column
ALTER TABLE aiapp.history ADD COLUMN deep_explanation LONGTEXT DEFAULT NULL;

-- 4. Update .env
MYSQL_DATABASE=learning_assistant
```

### 3. Update Environment Configuration

Update your `.env` file to reflect the new database name:

```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your-secure-password
MYSQL_DATABASE=aiapp  # Changed from 'arivon'
```

## Current Schema

### Users Table

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    token VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### History Table

```sql
CREATE TABLE history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    question LONGTEXT,
    answer LONGTEXT,
    deep_explanation LONGTEXT DEFAULT NULL,  -- NEW COLUMN
    subject VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

Note: The old `analogy` column has been removed in the new response format.

## Migration Steps

### Step 1: Backup Current Database

```bash
mysqldump -u root -p arivon > backup_arivon_$(date +%Y%m%d).sql
```

### Step 2: Create New Database

```sql
CREATE DATABASE IF NOT EXISTS aiapp;
USE aiapp;

-- Create users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    token VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create history table with new column
CREATE TABLE history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    question LONGTEXT NOT NULL,
    answer LONGTEXT NOT NULL,
    deep_explanation LONGTEXT DEFAULT NULL,
    subject VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, DATE(created_at))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Step 3: Import Existing Data (If Migrating)

```bash
# Check structure of old database
DESCRIBE arivon.history;

# If you want to keep existing data, you can do selective import
# Otherwise, start fresh
```

### Step 4: Update Environment Variables

Update `Backend/.env`:
```env
MYSQL_DATABASE=learning_assistant
```

### Step 5: Test Connection

Run the test script:
```bash
python test_connection.py
```

Expected output:
```
✅ MySQL: Connected to 'aiapp' database
```

## Verification

After migration, verify the setup:

```sql
-- Check that database exists and is accessible
USE learning_assistant;

-- Verify tables
SHOW TABLES;

-- Check history table structure
DESCRIBE history;

-- Count existing records
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM history;
```

## Rollback Plan

If something goes wrong, you have a backup:

```bash
# Restore from backup
mysql -u root -p aiapp < backup_arivon_YYYYMMDD.sql
```

## Notes

- The `deep_explanation` column is nullable (DEFAULT NULL)
- Old `analogy` column data is not carried forward (new system doesn't use it)
- All user and question history data can be migrated
- Indexes on user_id and created_at for optimal query performance
- UTF8MB4 character set for international character support

## Zero-Downtime Migration

If you need zero-downtime migration:

1. Keep old database running while you migrate
2. Set up database replication if needed
3. Switch connection string in .env during off-peak
4. Verify all endpoints work with new database
5. Run database health checks

## FAQ

**Q: Do I lose existing chat history?**
A: No, if you migrate the data using mysqldump, all existing data is preserved.

**Q: What about the analogy column?**
A: The new system doesn't use it. You can drop it if desired:
```sql
ALTER TABLE history DROP COLUMN analogy;
```

**Q: Can I keep the old database name?**
A: Yes, but you'll need to update the .env and all references. Not recommended.

**Q: How long does migration take?**
A: For < 100K records, typically < 1 second.

---

Last Updated: February 9, 2026
Version: 1.0
