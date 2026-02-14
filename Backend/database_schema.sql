"""
Database Schema for Arivon - Anna University Exam Assistant

REQUIRED TABLE: users
"""

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

"""
REQUIRED TABLE: history
(Stores cached answers for exam questions)
"""

CREATE TABLE IF NOT EXISTS history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    question VARCHAR(500) NOT NULL,
    answer LONGTEXT NOT NULL,
    analogy LONGTEXT,
    subject VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_question (user_id, question)
);

"""
Migration Note: If your history table doesn't have 'analogy' and 'subject' columns:

ALTER TABLE history ADD COLUMN analogy LONGTEXT AFTER answer;
ALTER TABLE history ADD COLUMN subject VARCHAR(100) AFTER analogy;
ALTER TABLE history ADD INDEX idx_user_question (user_id, question);
"""
