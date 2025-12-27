const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/:admission_no/certificate', auth, (req, res) => {
  const { admission_no } = req.params;

  const q = `
    SELECT admission_no, student_name, date_of_birth,
           parent_guardian_name, relation_type, class_on_admission
    FROM students
    WHERE admission_no=? AND is_deleted=FALSE
  `;

  db.query(q, [admission_no], (err, r) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (r.length === 0) return res.status(404).json({ message: 'Student not found' });

    const template = path.join(__dirname, '../templates/certificate.jpg');
    if (!fs.existsSync(template)) {
      return res.status(500).json({ message: 'Certificate template missing' });
    }

    const doc = new PDFDocument({ size: 'A4', margin: 0 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');

    doc.pipe(res);
    doc.image(template, 0, 0, { width: 595 });

    doc.text(r[0].student_name, 180, 255);
    doc.text(r[0].admission_no, 180, 295);

    doc.end();
  });
});

module.exports = router;
