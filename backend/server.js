require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const certificateRoutes = require('./routes/certificate');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', authRoutes);
app.use('/students', studentRoutes);
app.use('/students', certificateRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log('Server running on port', process.env.PORT || 5000);
});
