const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

// Clerk login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  const query = `
    SELECT * FROM clerks
    WHERE username = ? AND is_active = TRUE
  `;

  db.query(query, [username], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const clerk = results[0];
    const match = bcrypt.compareSync(password, clerk.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { clerkId: clerk.id, username: clerk.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token
    });
  });
});

/*
  Clerk registration — creates a new clerk with hashed password
  POST /register
  Body: { username, password, full_name }
*/
router.post('/register', (req, res) => {
  const { username, password, full_name } = req.body;

  if (!username || !password || !full_name) {
    return res.status(400).json({ message: 'Username, password and full name are required' });
  }

  const checkQuery = `SELECT id FROM clerks WHERE username = ?`;

  db.query(checkQuery, [username], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (results.length > 0) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.status(500).json({ message: 'Password hashing failed' });
      const insertQuery = `
        INSERT INTO clerks (username, password_hash, full_name, is_active)
        VALUES (?, ?, ?, TRUE)
      `;
      db.query(insertQuery, [username, hash, full_name], (err, r) => {
        if (err) return res.status(500).json({ message: 'Insert failed' });
        res.status(201).json({ message: 'Clerk registered successfully' });
      });
    });
  });
});

module.exports = router;
