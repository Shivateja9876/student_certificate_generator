const express = require('express');
const db = require('../db');

const router = express.Router();

// Add student
router.post('/', (req, res) => {
  const {
    admission_no,
    student_name,
    gender,
    aadhaar_no,
    date_of_birth,
    parent_guardian_name,
    relation_type,
    class_on_admission
  } = req.body;

  if (!admission_no || !student_name || !date_of_birth || !class_on_admission) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  const checkQuery = `SELECT admission_no FROM students WHERE admission_no = ?`;

  db.query(checkQuery, [admission_no], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (results.length > 0) {
      return res.status(409).json({ message: 'Admission number already exists' });
    }

    const insertQuery = `
      INSERT INTO students (
        admission_no, student_name, gender, aadhaar_no,
        date_of_birth, parent_guardian_name, relation_type,
        class_on_admission, is_deleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, FALSE)
    `;

    db.query(
      insertQuery,
      [
        admission_no,
        student_name,
        gender,
        aadhaar_no,
        date_of_birth,
        parent_guardian_name,
        relation_type,
        class_on_admission
      ],
      err => {
        if (err) return res.status(500).json({ message: 'Insert failed' });
        res.status(201).json({ message: 'Student added successfully' });
      }
    );
  });
});

// Search student
router.post('/search', (req, res) => {
  const { admission_no, student_name, date_of_birth, class_on_admission } = req.body;

  if (admission_no) {
    const q = `
      SELECT * FROM students
      WHERE admission_no = ? AND is_deleted = FALSE
    `;
    return db.query(q, [admission_no], (err, r) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (r.length === 0) return res.status(404).json({ message: 'Student not found' });
      res.json(r[0]);
    });
  }

  if (student_name && date_of_birth && class_on_admission) {
    const q = `
      SELECT admission_no, student_name, class_on_admission
      FROM students
      WHERE student_name LIKE ?
        AND date_of_birth = ?
        AND class_on_admission = ?
        AND is_deleted = FALSE
    `;
    return db.query(
      q,
      [`%${student_name}%`, date_of_birth, class_on_admission],
      (err, r) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (r.length === 0) return res.status(404).json({ message: 'No records found' });
        res.json(r);
      }
    );
  }

  res.status(400).json({ message: 'Invalid search input' });
});

// Update student
router.put('/:admission_no', (req, res) => {
  const { admission_no } = req.params;
  const {
    student_name,
    gender,
    aadhaar_no,
    date_of_birth,
    parent_guardian_name,
    relation_type,
    class_on_admission
  } = req.body;

  const q = `
    UPDATE students SET
      student_name=?, gender=?, aadhaar_no=?, date_of_birth=?,
      parent_guardian_name=?, relation_type=?, class_on_admission=?
    WHERE admission_no=? AND is_deleted=FALSE
  `;

  db.query(
    q,
    [
      student_name,
      gender,
      aadhaar_no,
      date_of_birth,
      parent_guardian_name,
      relation_type,
      class_on_admission,
      admission_no
    ],
    (err, r) => {
      if (err) return res.status(500).json({ message: 'Update failed' });
      if (r.affectedRows === 0)
        return res.status(404).json({ message: 'Student not found' });
      res.json({ message: 'Student updated successfully' });
    }
  );
});

// Soft delete
router.delete('/:admission_no', (req, res) => {
  const q = `
    UPDATE students SET is_deleted=TRUE
    WHERE admission_no=? AND is_deleted=FALSE
  `;
  db.query(q, [req.params.admission_no], (err, r) => {
    if (err) return res.status(500).json({ message: 'Delete failed' });
    if (r.affectedRows === 0)
      return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  });
});

module.exports = router;
